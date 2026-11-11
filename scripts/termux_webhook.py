#!/usr/bin/env python3
"""
termux_webhook.py - Lightweight HTTP server for triggering Antigravity skills from mobile or external apps.
Uses Python standard library only (no pip dependencies required).
"""

import os
import sys
import json
import shutil
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", 8080))

def get_repo_root() -> str:
    current = os.path.abspath(os.path.dirname(__file__))
    while current and current != os.path.dirname(current):
        if os.path.exists(os.path.join(current, ".git")) or os.path.exists(os.path.join(current, "elijahmondero")):
            return current
        current = os.path.dirname(current)
    return os.getcwd()

class SkillWebhookHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, data: dict):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self._send_json(200, {"status": "ok"})

    def do_GET(self):
        if self.path in ("/", "/health"):
            self._send_json(200, {
                "status": "online",
                "service": "Antigravity Termux Webhook",
                "port": PORT
            })
        elif self.path == "/status":
            repo_root = get_repo_root()
            index_file = os.path.join(repo_root, "elijahmondero", "public", "posts", "index.json")
            if os.path.exists(index_file):
                with open(index_file, "r", encoding="utf-8") as f:
                    posts = json.load(f)
                self._send_json(200, {"recent_posts": posts[:5]})
            else:
                self._send_json(404, {"error": "index.json not found"})
        else:
            self._send_json(404, {"error": "Not found"})

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        if self.path == "/publish":
            topic = payload.get("topic")
            sources = payload.get("sources", [])
            if not topic:
                self._send_json(400, {"error": "Missing 'topic' field in JSON payload"})
                return

            sources_str = " ".join([f'"{s}"' for s in sources])
            print(f"Triggering /blog-publisher for topic: {topic}")

            if shutil.which("agy"):
                cmd = f"agy --dangerously-skip-permissions -p \"/blog-publisher \\\"{topic}\\\" {sources_str}\""
                subprocess.Popen(cmd, shell=True)
                self._send_json(202, {
                    "status": "accepted",
                    "message": f"Triggered blog publication for '{topic}' in background.",
                })
            else:
                self._send_json(500, {"error": "'agy' CLI binary not found in PATH"})

        elif self.path == "/open-gemini":
            text = payload.get("text", "Hello Gemini")
            # Trigger Android Activity Manager for Gemini App
            if shutil.which("am"):
                cmd = [
                    "am", "start", "-a", "android.intent.action.SEND",
                    "-t", "text/plain",
                    "--es", "android.intent.extra.TEXT", text,
                    "-p", "com.google.android.apps.bard"
                ]
                try:
                    subprocess.run(cmd, check=True)
                    self._send_json(200, {"status": "opened", "target": "com.google.android.apps.bard"})
                except Exception as e:
                    self._send_json(500, {"error": str(e)})
            else:
                self._send_json(501, {"error": "'am' command not available (not running inside Android/Termux)"})

        else:
            self._send_json(404, {"error": "Unknown endpoint"})

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Antigravity Skill Webhook Server")
    parser.add_argument("--port", "-p", type=int, default=PORT, help="Port to listen on (default: 8080)")
    args = parser.parse_args()

    server = HTTPServer(("0.0.0.0", args.port), SkillWebhookHandler)
    print(f"🚀 Antigravity Webhook Server running on http://0.0.0.0:{args.port}")
    print("Endpoints:")
    print("  GET  /health       - Health check")
    print("  GET  /status       - View recent blog posts")
    print("  POST /publish      - JSON: {\"topic\": \"...\", \"sources\": [\"...\"]}")
    print("  POST /open-gemini  - JSON: {\"text\": \"...\"} (Launches Gemini app on Android)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.server_close()

if __name__ == "__main__":
    main()
