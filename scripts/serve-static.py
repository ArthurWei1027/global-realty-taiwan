#!/usr/bin/env python3
"""Static server with clean URL support for local preview."""

from __future__ import annotations

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]

ROUTE_MAP = {
    "/": "index.html",
    "/index": "index.html",
    "/properties": "properties.html",
    "/property": "property.html",
    "/leasing": "leasing.html",
    "/events": "events.html",
    "/event": "event.html",
    "/classroom": "classroom.html",
    "/about": "about.html",
    "/group": "group.html",
    "/privacy": "privacy.html",
    "/search": "search.html",
    "/sitemap": "sitemap.html",
    "/contact": "contact.html",
    "/news": "news.html",
    "/insights": "insights.html",
}


class CleanURLHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str | None = None, **kwargs):
        super().__init__(*args, directory=directory or str(ROOT), **kwargs)

    def translate_path(self, path: str) -> str:
        parsed = urlparse(unquote(path))
        route = parsed.path.rstrip("/") or "/"
        mapped = ROUTE_MAP.get(route)
        if mapped:
            return str(ROOT / mapped)
        return super().translate_path(parsed.path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve Global Realty Taiwan site locally.")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--host", default="127.0.0.1")
    args = parser.parse_args()

    handler = partial(CleanURLHandler, directory=str(ROOT))
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Serving {ROOT} at http://{args.host}:{args.port}/")
    print("Clean URLs enabled: /index, /about, /properties, ...")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
