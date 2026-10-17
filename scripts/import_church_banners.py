#!/usr/bin/env python3
"""One-time import of church-owned original collage photos from Canva's signed image service.
This script does NOT expose Canva authorization when the final image files are committed.
Remove this script after first successful import; links expire.
"""
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from PIL import Image

SOURCE = {
  "en": "https://media.canva.com/v2/image-resize/format:JPG/height:112/quality:75/uri:ifs%3A%2F%2FM%2F2db5b837-aee3-4c8b-8bed-4fa382a9474f/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAPPoVy6148ZXttWG-sUZfkUlQNevS110bnDGoezCTHNB&exp=1792294884&osig=AAAAAAAAAAAAAAAAAAAAACoH3tD-OpI-7EOx4yBR-_VJw_2q8rGchk3sLxrZIe-t&signer=media-rpc&token=AAIAAU0AJDJkYjViODM3LWFlZTMtNGM4Yi04YmVkLTRmYTM4MmE5NDc0ZgAAAAABoU0ZkqCJOyiUJNbRVwvnTrwYtUDru0OUJKVsRmtAwPxsdBFDKw&x-canva-quality=thumbnail",
  "es": "https://media.canva.com/v2/image-resize/format:JPG/height:112/quality:75/uri:ifs%3A%2F%2FM%2Fa51b6c96-799f-4f2c-b1f1-0ca3b2728e75/watermark:F/width:200?csig=AAAAAAAAAAAAAAAAAAAAAIsVbP39vB4H83hGHVPQREcaZdbMGtHB1uB7en1SzXC9&exp=1792297448&osig=AAAAAAAAAAAAAAAAAAAAAInmaRcfAWcJipERtMpWt24U0USLj2PAyGutU2Ej8G_G&signer=media-rpc&token=AAIAAU0AJGE1MWI2Yzk2LTc5OWYtNGYyYy1iMWYxLTBjYTNiMjcyOGU3NQAAAAABoU1AskDGB4GfShu-EuxVUhP3t4fYUZQliaShGZ-frEX3fQpRWA&x-canva-quality=thumbnail"
}
OUT = Path(__file__).resolve().parents[1] / "images"
OUT.mkdir(exist_ok=True)
DEST = {"en": "one-hope-thankful-banner.jpg", "es": "one-hope-thankful-banner-es.jpg"}

def variants(url):
    for width in (2048,1600,1200,960):
        height = round(width * 9 / 16)
        v = url.replace("/width:200", "/width:" + str(width))
        v = v.replace("/height:112/", "/height:" + str(height) + "/")
        yield width, v
        yield width, v.replace("quality:75", "quality:90")
        yield width, v.replace("&x-canva-quality=thumbnail", "")
        from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
        parts = urlsplit(v)
        full = dict(parse_qsl(parts.query))
        for allowed in (("token", "signer"), ("token",), ("token", "signer", "osig"), ("csig", "exp", "token", "signer")):
            trial = {k: value for k, value in full.items() if k in allowed}
            yield width, urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(trial), ""))
    yield 200, url

def fetch(name, url):
    for wanted_width, source_url in variants(url):
        try:
            request = urllib.request.Request(source_url,headers={"User-Agent":"Mozilla/5.0", "Accept":"image/jpeg,image/*;q=0.8"})
            with urllib.request.urlopen(request,timeout=18) as response:
                raw = response.read(6_000_000)
            im = Image.open(io.BytesIO(raw))
            im.load()
            print(name,"received image", im.size, "at requested width", wanted_width,flush=True)
            if im.width < 760:
                continue
            if im.width > 2048:
                im.thumbnail((2048,1152))
            out=OUT/DEST[name]
            im.convert("RGB").save(out,"JPEG",quality=88,optimize=True,progressive=True)
            print(name,"saved to",out.name,"size",out.stat().st_size,flush=True)
            return
        except (urllib.error.URLError, ValueError, OSError) as exc:
            print(name,"variant",wanted_width,"failed:",type(exc).__name__,getattr(exc,"code",""),flush=True)
    raise RuntimeError(name+" could not retrieve a sufficiently large original photo")

for language in ("en", "es"):
    fetch(language, SOURCE[language])
