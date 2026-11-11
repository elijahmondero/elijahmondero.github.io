---
name: gemini-voice
description: Voice and multimodal assistant skill for Antigravity. Listens to speech input, connects to Gemini Multimodal Live, and triggers repo skills (like blog-publisher) hands-free.
---

# Gemini Voice Skill

This skill turns Antigravity into a voice-driven development companion on Android Termux, Linux, and Windows.

## Capabilities

1. **Push-to-Talk Voice Input**:
   - In Android Termux: records from phone microphone via `termux-microphone-record`.
   - Audio files: processes `.wav`, `.m4a`, or `.mp3` voice memos.
2. **Autonomous Tool Calling**:
   - Triggers `/blog-publisher` with topic and source links.
   - Inspects recent blog posts from `index.json`.
3. **Voice Response**:
   - Speaks answers back using `termux-tts-speak` (Android) or native OS speech synthesis (Windows/macOS/Linux).
4. **Android App Bridge**:
   - Interacts with the Gemini Android app (`com.google.android.apps.bard`) via Android intents (`am start`).

---

## How to Run

### Inside `agy` (Interactive)
```text
/gemini-voice
```

### From Command Line / Termux Terminal

1. **Record Voice Prompt (10-15s) in Termux**:
   ```bash
   python3 scripts/gemini_voice_agent.py --record 10
   ```

2. **Process a Voice Memo Audio File**:
   ```bash
   python3 scripts/gemini_voice_agent.py --audio /sdcard/Recordings/idea.m4a
   ```

3. **Launch Gemini Android App with PR Link / Query**:
   ```bash
   am start -a android.intent.action.SEND \
     -t "text/plain" \
     --es android.intent.extra.TEXT "Review my new blog PR: https://github.com/elijahmondero/elijahmondero.github.io/pull/117" \
     -p com.google.android.apps.bard
   ```

4. **Run Background Webhook Listener**:
   ```bash
   python3 scripts/termux_webhook.py --port 8080
   ```
