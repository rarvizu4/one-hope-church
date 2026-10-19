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


def resolve_youtube_channel_id(channel_handle):
    """Resolve a public @handle to its stable UC... channel ID via YouTube HTML."""
    if not isinstance(channel_handle, str):
        raise ValueError("Invalid YouTube channel handle")
    candidate = channel_handle.strip()
    if candidate.startswith("https://"):
        parsed = urllib.parse.urlparse(candidate)
        if parsed.hostname not in {"www.youtube.com", "youtube.com", "m.youtube.com"}:
            raise ValueError("YouTube channel URL must be on youtube.com")
        candidate = parsed.path.strip("/")
    candidate = candidate.split("/", 1)[0]
    if not re.fullmatch(r"@[A-Za-z0-9._-]{3,80}", candidate):
        raise ValueError("Expected a YouTube @handle, or a URL containing one")

    url = "https://www.youtube.com/" + urllib.parse.quote(candidate, safe="@._-")
    page = open_url(url).decode("utf-8", errors="replace")
    patterns = [
        r'<meta[^>]*itemprop=["\\\']channelId["\\\'][^>]*content=["\\\'](UC[A-Za-z0-9_-]{22})',
        r'<meta[^>]*content=["\\\'](UC[A-Za-z0-9_-]{22})["\\\'][^>]*itemprop=["\\\']channelId',
        r'"externalId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"',
        r'"channelId"\s*:\s*"(UC[A-Za-z0-9_-]{22})"',
    ]
    for pattern in patterns:
        match = re.search(pattern, page)
        if match:
            print("YouTube handle successfully resolved to a channel ID")
            return match.group(1)
    raise ValueError("Could not resolve YouTube @handle; provide its UC... ID instead")


def parse_youtube_feed(feed):
    """Parse a public YouTube Atom playlist into newest-first video metadata."""
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
    posts.sort(key=lambda p: p["published"], reverse=True)
    return posts


def youtube_posts(channel_id):
    """Get the newest live replay and standard upload from distinct YouTube tabs.

    YouTube's public auto-playlist IDs use UULV (Live) and UULF (Videos).
    This undocumented playlist convention can change; keep prior data if it does.
    """
    if not re.fullmatch(r"UC[A-Za-z0-9_-]{22}", channel_id):
        raise ValueError("YOUTUBE_CHANNEL_ID must be a YouTube UC... channel ID (24 characters)")

    previous = {}
    prior_file = DATA / "youtube.json"
    if prior_file.exists():
        try:
            old = json.loads(prior_file.read_text(encoding="utf-8")).get("items", [])
            previous = {p.get("kind"): p for p in old if isinstance(p, dict) and p.get("kind") in ("livestream", "upload")}
        except (ValueError, OSError):
            pass

    result = []
    for kind, prefix in (("livestream", "UULV"), ("upload", "UULF")):
        playlist_id = prefix + channel_id[2:]
        url = "https://www.youtube.com/feeds/videos.xml?" + urllib.parse.urlencode({"playlist_id": playlist_id})
        try:
            entries = parse_youtube_feed(open_url(url))
            if entries:
                result.append(dict(entries[0], kind=kind))
                print("YouTube " + kind + ": " + entries[0]["id"])
            elif kind in previous:
                result.append(previous[kind])
                print("YouTube " + kind + ": no new public video; preserving previous")
            else:
                print("YouTube " + kind + ": no public videos yet")
        except (ET.ParseError, urllib.error.URLError, TimeoutError, ValueError) as exc:
            print("YouTube " + kind + ": feed unavailable; retaining prior video (" + str(exc)[:160] + ")", file=sys.stderr)
            if kind in previous:
                result.append(previous[kind])

    if not result:
        raise ValueError("Both YouTube category feeds were empty or unavailable")
    return result


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
    channel_handle = ""
    config_path = ROOT / "social-sources.json"
    if config_path.exists():
        config = json.loads(config_path.read_text(encoding="utf-8"))
        if not channel_id:
            channel_id = str(config.get("youtubeChannelId") or "").strip()
        channel_handle = str(config.get("youtubeHandle") or "").strip()

    if channel_id or channel_handle:
        enabled += 1
        try:
            resolved_id = channel_id or resolve_youtube_channel_id(channel_handle)
            write_if_changed("youtube", youtube_posts(resolved_id))
        except (ValueError, ET.ParseError, urllib.error.URLError, TimeoutError) as exc:
            errors += 1
            print("YouTube feed could not refresh: " + str(exc), file=sys.stderr)
    else:
        print("YouTube: waiting for youtubeHandle or youtubeChannelId in social-sources.json")

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
