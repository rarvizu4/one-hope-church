#!/usr/bin/env python3
"""Refresh church social-feed JSON for the static GitHub Pages website.

YouTube: public channel RSS, no API key required.
Instagram: Meta's official Instagram API with Instagram Login.
Only configured sources are updated; the other source keeps its prior content.
Credentials are read from GitHub Actions secrets, NEVER written to JSON.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
HEADERS = {
    "User-Agent": "OneHopeChurchSite/1.0 (social-feed updater)",
    "Accept": "application/json, application/atom+xml, application/xml, text/xml",
}


def open_url(url, *, token=None):
    headers = dict(HEADERS)
    if token:
        headers["Authorization"] = "Bearer " + token
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=25) as response:
        return response.read()


def secure_https(value):
    return value if isinstance(value, str) and value.startswith("https://") else ""


def youtube_posts(channel_id):
    if not re.fullmatch(r"UC[A-Za-z0-9_-]{22}", channel_id):
        raise ValueError("YOUTUBE_CHANNEL_ID must be a YouTube UC... channel ID (24 characters)")
    feed = open_url("https://www.youtube.com/feeds/videos.xml?channel_id=" + channel_id)
    root = ET.fromstring(feed)
    ns = {"atom": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015"}
    posts = []
    for entry in root.findall("atom:entry", ns):
        ident = entry.findtext("yt:videoId", default="", namespaces=ns)
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", ident):
            continue
        posts.append({
            "id": ident,
            "title": (entry.findtext("atom:title", default="Church video", namespaces=ns) or "Church video")[:200],
            "url": "https://www.youtube.com/watch?v=" + ident,
            "thumbnail": "https://i.ytimg.com/vi/" + ident + "/hqdefault.jpg",
            "published": entry.findtext("atom:published", default="", namespaces=ns),
        })
    return posts[:12]


def instagram_posts(token):
    params = urllib.parse.urlencode({
        "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
        "limit": "24",
    })
    url = "https://graph.instagram.com/v25.0/me/media?" + params
    data = json.loads(open_url(url, token=token))
    if "error" in data:
        raise ValueError("Meta returned an error while fetching the Instagram feed")
    posts = []
    for item in data.get("data", []):
        if not isinstance(item, dict):
            continue
        url = secure_https(item.get("permalink"))
        image = secure_https(item.get("thumbnail_url")) or secure_https(item.get("media_url"))
        if not (url and image):
            continue
        posts.append({
            "id": str(item.get("id", ""))[:120],
            "caption": str(item.get("caption") or "")[:500],
            "url": url,
            "thumbnail": image,
            "published": str(item.get("timestamp", "")),
            "mediaType": str(item.get("media_type", "")),
        })
    posts.sort(key=lambda p: p["published"], reverse=True)
    return posts[:12]


def write_if_changed(name, posts):
    DATA.mkdir(parents=True, exist_ok=True)
    path = DATA / (name + ".json")
    content = json.dumps({"items": posts}, ensure_ascii=False, indent=2) + "\n"
    if path.exists() and path.read_text(encoding="utf-8") == content:
        print(name + ": unchanged")
        return
    path.write_text(content, encoding="utf-8")
    print(name + ": updated (" + str(len(posts)) + " posts)")


def main():
    enabled = 0
    errors = 0
    channel_id = os.environ.get("YOUTUBE_CHANNEL_ID", "").strip()
    if channel_id:
        enabled += 1
        try:
            write_if_changed("youtube", youtube_posts(channel_id))
        except (ValueError, ET.ParseError, urllib.error.URLError, TimeoutError) as exc:
            errors += 1
            print("YouTube feed could not refresh: " + str(exc), file=sys.stderr)
    else:
        print("YouTube: waiting for repository variable YOUTUBE_CHANNEL_ID")

    token = os.environ.get("INSTAGRAM_ACCESS_TOKEN", "").strip()
    if token:
        enabled += 1
        try:
            write_if_changed("instagram", instagram_posts(token))
        except (ValueError, KeyError, json.JSONDecodeError, urllib.error.URLError, TimeoutError) as exc:
            errors += 1
            # Never include the token or unredacted URL in logs.
            print("Instagram feed could not refresh; check Meta authorization and token validity.", file=sys.stderr)
    else:
        print("Instagram: waiting for repository secret INSTAGRAM_ACCESS_TOKEN")

    if enabled and errors == enabled:
        raise SystemExit("All configured feeds failed; retained existing published data")


if __name__ == "__main__":
    main()
