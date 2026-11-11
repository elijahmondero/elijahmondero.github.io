#!/usr/bin/env python3
"""
manage_tunnel.py - Cloudflare Quick Tunnel Manager for Antigravity & Termux.
Uses standard library only (no external pip dependencies).
"""

import os
import sys
import re
import json
import time
import shutil
import subprocess

def get_repo_root() -> str:
    current = os.path.abspath(os.path.dirname(__file__))
    while current and current != os.path.dirname(current):
        if os.path.exists(os.path.join(current, ".git")) or os.path.exists(os.path.join(current, "elijahmondero")):
            return current
        current = os.path.dirname(current)
    return os.getcwd()

def get_info_path() -> str:
    scratch_dir = os.path.join(get_repo_root(), ".agents", "scratch")
    os.makedirs(scratch_dir, exist_ok=True)
    return os.path.join(scratch_dir, "tunnel_info.json")

def check_installation():
    if not shutil.which("cloudflared"):
        print("❌ 'cloudflared' binary was not found in PATH.")
        print("\nInstall instructions:")
        print("  • Android Termux:   pkg install cloudflared")
        print("  • macOS (Homebrew): brew install cloudflared")
        print("  • Debian / Ubuntu:  sudo apt-get install cloudflared")
        print("  • Windows (winget): winget install --id Cloudflare.cloudflared")
        sys.exit(1)

def start_tunnel(port: int = 8080):
    check_installation()
    stop_tunnel(silent=True)

    print(f"🌐 Starting Cloudflare Quick Tunnel for local port {port}...")
    log_file = os.path.join(os.path.dirname(get_info_path()), "cloudflared.log")
    
    with open(log_file, "w", encoding="utf-8") as out:
        # Start cloudflared as a subprocess
        proc = subprocess.Popen(
            ["cloudflared", "tunnel", "--url", f"http://127.0.0.1:{port}"],
            stdout=out,
            stderr=subprocess.STDOUT,
            text=True
        )

    # Poll log for the public URL (usually appears in 2-6 seconds)
    url = None
    url_pattern = re.compile(r"https://[a-zA-Z0-9-]+\.trycloudflare\.com")
    
    for _ in range(30):
        time.sleep(0.5)
        if os.path.exists(log_file):
            try:
                with open(log_file, "r", encoding="utf-8") as lf:
                    content = lf.read()
                    match = url_pattern.search(content)
                    if match:
                        url = match.group(0)
                        break
            except Exception:
                pass

    if url:
        info = {
            "pid": proc.pid,
            "port": port,
            "url": url,
            "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        with open(get_info_path(), "w", encoding="utf-8") as f:
            json.dump(info, f, indent=2)

        print("\n✨ Cloudflare Tunnel is LIVE!")
        print(f"🔗 Public URL:  {url}")
        print(f"🎯 Local Target: http://127.0.0.1:{port}")
        print(f"🆔 Process PID:  {proc.pid}")
        print("\nExample Webhook Endpoints:")
        print(f"  • Health:  {url}/health")
        print(f"  • Status:  {url}/status")
        print(f"  • Publish: {url}/publish (POST JSON: {{\"topic\": \"...\"}})")
        return url
    else:
        print("⚠️ Tunnel started but public URL not detected within 15 seconds.")
        print(f"Check log file at: {log_file}")
        return None

def stop_tunnel(silent: bool = False):
    info_file = get_info_path()
    if not os.path.exists(info_file):
        if not silent:
            print("No active tunnel found.")
        return

    try:
        with open(info_file, "r", encoding="utf-8") as f:
            info = json.load(f)
        pid = info.get("pid")
        if pid:
            if sys.platform == "win32":
                subprocess.run(["taskkill", "/F", "/PID", str(pid)], capture_output=True)
            else:
                os.kill(pid, 15)  # SIGTERM
            if not silent:
                print(f"🛑 Stopped Cloudflare Tunnel (PID {pid}).")
    except Exception as e:
        if not silent:
            print(f"Note stopping tunnel: {e}")
    finally:
        if os.path.exists(info_file):
            os.remove(info_file)

def status_tunnel():
    info_file = get_info_path()
    if not os.path.exists(info_file):
        print("Status: Cloudflare Tunnel is NOT running.")
        return

    with open(info_file, "r", encoding="utf-8") as f:
        info = json.load(f)

    print("Status: Cloudflare Tunnel is ACTIVE")
    print(f"  • URL:        {info.get('url')}")
    print(f"  • Local Port: {info.get('port')}")
    print(f"  • PID:        {info.get('pid')}")
    print(f"  • Started At: {info.get('started_at')}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage_tunnel.py start [port]")
        print("  python manage_tunnel.py status")
        print("  python manage_tunnel.py stop")
        sys.exit(1)

    cmd = sys.argv[1].lower()
    if cmd == "start":
        p = int(sys.argv[2]) if len(sys.argv) > 2 else 8080
        start_tunnel(p)
    elif cmd == "stop":
        stop_tunnel()
    elif cmd == "status":
        status_tunnel()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
