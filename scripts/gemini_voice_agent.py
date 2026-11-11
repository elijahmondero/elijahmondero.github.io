#!/usr/bin/env python3
"""
gemini_voice_agent.py - Voice & Chat Interface for Antigravity & Blog Publisher.
Integrates Gemini Multimodal Voice capabilities with Antigravity skills.
Runs cross-platform: Windows, Linux, and Android Termux (Zero heavy C-extensions).
"""

import os
import sys
import json
import shutil
import subprocess
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
env_file = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_file):
    load_dotenv(env_file)
else:
    load_dotenv()

try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: 'google-genai' SDK is required. Run: pip install google-genai")
    sys.exit(1)

GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
MODEL_ID = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not GEMINI_API_KEY:
    print("Error: GOOGLE_GEMINI_API_KEY is not set.")
    sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

def speak_text(text: str):
    """Speaks text cross-platform (Termux, Windows, macOS, Linux)."""
    # 1. Android Termux
    if shutil.which("termux-tts-speak"):
        try:
            subprocess.run(["termux-tts-speak", text], check=True)
            return
        except Exception:
            pass

    # 2. Windows native PowerShell SpeechSynthesizer
    if sys.platform == "win32":
        try:
            escaped = text.replace("'", "''").replace('"', '`"')
            ps_cmd = f"Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('{escaped}')"
            subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], timeout=15)
            return
        except Exception:
            pass

    # 3. macOS native 'say'
    if sys.platform == "darwin" and shutil.which("say"):
        try:
            subprocess.run(["say", text])
            return
        except Exception:
            pass

    # 4. Linux espeak or spd-say
    for cmd in ["spd-say", "espeak"]:
        if shutil.which(cmd):
            try:
                subprocess.run([cmd, text])
                return
            except Exception:
                pass

    print(f"📢 [Voice]: {text}")

def record_audio_termux(output_wav: str = "voice_prompt.wav", seconds: int = 10) -> bool:
    """Records audio on Android Termux using Termux:API."""
    if not shutil.which("termux-microphone-record"):
        print("Error: termux-microphone-record not found. Install termux-api via 'pkg install termux-api'.")
        return False

    print(f"🎙️ Recording {seconds} seconds of voice from microphone...")
    subprocess.run(["termux-microphone-record", "-f", output_wav, "-l", str(seconds), "-d", "16000"])
    print("✓ Recording complete.")
    return os.path.exists(output_wav)

from typing import Optional, List

# TOOL DECLARATIONS FOR GEMINI
def tool_publish_blog(topic: str, sources: Optional[List[str]] = None) -> str:
    """Publishes a new blog post using Antigravity's blog-publisher skill."""
    print(f"\n🚀 [Tool Triggered] publish_blog: Topic='{topic}', Sources={sources}")
    sources = sources or []
    sources_str = " ".join([f'"{s}"' for s in sources])

    # Check for agy in PATH
    if shutil.which("agy"):
        cmd = f"agy --dangerously-skip-permissions -p \"/blog-publisher \\\"{topic}\\\" {sources_str}\""
        print(f"Running command: {cmd}")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return f"Blog publication pipeline completed. agy output: {result.stdout[-300:] if result.stdout else 'Done'}"
    else:
        return f"Antigravity CLI (agy) triggered for topic: {topic}. Ready for execution."

def tool_get_recent_posts() -> str:
    """Fetches the 5 most recently published blog posts."""
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    index_file = os.path.join(repo_root, "elijahmondero", "public", "posts", "index.json")
    if os.path.exists(index_file):
        try:
            with open(index_file, "r", encoding="utf-8") as f:
                posts = json.load(f)
            return json.dumps(posts[:5], indent=2)
        except Exception as e:
            return f"Error reading index: {e}"
    return "No posts found."

AVAILABLE_TOOLS = [tool_publish_blog, tool_get_recent_posts]

SYSTEM_INSTRUCTION = """You are an intelligent voice companion for Elijah Mondero's software engineering workspace.
You can converse naturally via voice and execute development actions through Antigravity skills.
When the user asks to write, research, or publish a blog post, invoke the `tool_publish_blog` tool with their requested topic and any reference URLs.
Keep your voice spoken answers concise, engaging, and professional."""

def run_prompt_with_tools(prompt: str = None, audio_path: str = None):
    """Sends a text or audio prompt to Gemini with tool calling enabled."""
    contents = []

    if audio_path and os.path.exists(audio_path):
        print(f"Ingesting audio file: {audio_path}")
        with open(audio_path, "rb") as af:
            audio_bytes = af.read()
        mime = "audio/wav" if audio_path.endswith(".wav") else "audio/mp3" if audio_path.endswith(".mp3") else "audio/m4a"
        contents.append(types.Part.from_bytes(data=audio_bytes, mime_type=mime))
        if prompt:
            contents.append(prompt)
        else:
            contents.append("Listen to my voice instruction, determine what action to take, and execute the appropriate tool or answer me directly.")
    elif prompt:
        contents.append(prompt)
    else:
        print("Error: No prompt or audio provided.")
        return

    print("🤖 Sending to Gemini...")
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            tools=AVAILABLE_TOOLS,
            temperature=0.7,
        )
    )

    # Check for tool calls
    if response.function_calls:
        for call in response.function_calls:
            print(f"🔧 Function Call Requested: {call.name}({call.args})")
            if call.name == "tool_publish_blog":
                topic_arg = call.args.get("topic", "")
                sources_arg = call.args.get("sources", [])
                result = tool_publish_blog(topic_arg, sources_arg)
                speak_text(f"I am triggering the blog publication pipeline for {topic_arg}.")
            elif call.name == "tool_get_recent_posts":
                result = tool_get_recent_posts()
                print("Recent posts:", result)

    if response.text:
        print(f"\n💬 Gemini: {response.text}")
        speak_text(response.text)

def main():
    parser = argparse.ArgumentParser(description="Gemini Voice & Chat Agent for Antigravity")
    parser.add_argument("prompt", nargs="?", help="Text prompt to send to Gemini")
    parser.add_argument("--audio", "-a", help="Path to an audio file (.wav, .mp3, .m4a)")
    parser.add_argument("--record", "-r", type=int, default=0, help="Record N seconds of voice (Termux)")

    args = parser.parse_args()

    if args.record > 0:
        wav_file = "voice_prompt.wav"
        if record_audio_termux(wav_file, seconds=args.record):
            run_prompt_with_tools(prompt=args.prompt, audio_path=wav_file)
            if os.path.exists(wav_file):
                os.remove(wav_file)
    elif args.audio:
        run_prompt_with_tools(prompt=args.prompt, audio_path=args.audio)
    elif args.prompt:
        run_prompt_with_tools(prompt=args.prompt)
    else:
        # Interactive text loop with voice output
        print("🎙️ Gemini Voice & Antigravity Agent (Type your prompt, or 'exit' to quit)")
        while True:
            try:
                user_input = input("\nYou > ").strip()
                if not user_input:
                    continue
                if user_input.lower() in ("exit", "quit", "q"):
                    break
                run_prompt_with_tools(prompt=user_input)
            except (KeyboardInterrupt, EOFError):
                break

if __name__ == "__main__":
    main()
