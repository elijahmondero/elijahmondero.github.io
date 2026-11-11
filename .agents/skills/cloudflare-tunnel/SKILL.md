---
name: cloudflare-tunnel
description: Exposes local webhook servers (e.g. Termux webhook, dev servers) to the internet via Cloudflare Quick Tunnels (trycloudflare.com) without open ports or domain setup.
---

# Cloudflare Tunnel Skill

This skill provisions and manages Cloudflare Quick Tunnels on demand directly from Antigravity (`agy`) or Android Termux. It creates an instant, secure HTTPS endpoint (`https://*.trycloudflare.com`) routing external webhook traffic (like Gemini chat custom actions, GitHub Webhooks, or mobile notifications) to a local server running on `127.0.0.1:<port>`.

Zero configuration, zero Cloudflare login required.

---

## Capabilities

1. **Instant Public HTTPS URL**:
   - Generates a transient `https://<unique-id>.trycloudflare.com` URL in 2–4 seconds.
   - Automatically writes tunnel state (PID, URL, port) to `.agents/scratch/tunnel_info.json`.
2. **Standard-Library Only**:
   - Python helper script `manage_tunnel.py` uses only standard library (`subprocess`, `re`, `json`, `os`, `sys`).
   - Works seamlessly in Android Termux, Linux, macOS, and Windows.
3. **Bridge for Gemini Chat & External Services**:
   - Allows external services to invoke the local Termux webhook (`/publish`, `/status`, `/open-gemini`).

---

## Prerequisites

Ensure the `cloudflared` binary is installed:

- **Android Termux**:
  ```bash
  pkg install cloudflared
  ```
- **Windows** (PowerShell):
  ```powershell
  winget install --id Cloudflare.cloudflared
  ```
- **macOS**:
  ```bash
  brew install cloudflared
  ```
- **Linux (Debian/Ubuntu)**:
  ```bash
  sudo apt-get install cloudflared
  ```

---

## Usage

### 1. Start Tunnel
Start a tunnel pointing to the local webhook server (default port `8080`):
```bash
python3 .agents/skills/cloudflare-tunnel/scripts/manage_tunnel.py start --port 8080
```

### 2. Inspect Active Tunnel Status
Get current public HTTPS URL and PID:
```bash
python3 .agents/skills/cloudflare-tunnel/scripts/manage_tunnel.py status
```

### 3. Stop Tunnel
Terminate background `cloudflared` process cleanly:
```bash
python3 .agents/skills/cloudflare-tunnel/scripts/manage_tunnel.py stop
```

---

## End-to-End Workflow with Termux & Gemini Chat

1. **Start the local Termux webhook server**:
   ```bash
   python3 scripts/termux_webhook.py --port 8080
   ```
2. **Launch the Cloudflare Tunnel**:
   ```bash
   python3 .agents/skills/cloudflare-tunnel/scripts/manage_tunnel.py start --port 8080
   ```
3. **Use the generated HTTPS URL**:
   - In Gemini Chat / Custom Action / Webhook:
     `POST https://<id>.trycloudflare.com/publish` with payload `{"topic": "..."}`
   - Health check:
     `GET https://<id>.trycloudflare.com/health`
