"""
JARVIS: Personal AI Desktop Assistant
Main Entry Point and Startup Initializer.
"""

import os
import sys
import argparse
import logging
import platform
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).parent.resolve()
sys.path.insert(0, str(PROJECT_ROOT))

def setup_logging():
    log_dir = PROJECT_ROOT / "logs"
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / "activity.log"

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.FileHandler(str(log_file), encoding="utf-8"),
            logging.StreamHandler(sys.stdout)
        ]
    )

def first_run_initialization():
    """Detects environment, checks microphone and audio subsystems, verifies paths."""
    print("==================================================")
    print("        INITIALIZING JARVIS OS SUBSYSTEMS         ")
    print("==================================================")
    print(f"[SYSTEM] OS: {platform.system()} {platform.release()} ({platform.version()})")
    print(f"[PYTHON] Version: {platform.python_version()}")

    # Ensure required runtime folders exist
    for d in ["config", "logs"]:
        (PROJECT_ROOT / d).mkdir(parents=True, exist_ok=True)

    # Check microphone
    try:
        import speech_recognition as sr
        mics = sr.Microphone.list_microphone_names()
        print(f"[AUDIO] Detected {len(mics)} audio input device(s).")
    except Exception as e:
        print(f"[AUDIO] Microphone detection warning: {e}")

    # Check TTS voice engine
    try:
        import pyttsx3
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        print(f"[VOICE] Detected {len(voices)} TTS voice profile(s).")
    except Exception as e:
        print(f"[VOICE] TTS warning: {e}")

    print("[SECURITY] Permission Guardrails Loaded: Level 1 (Safe), Level 2 (Moderate), Level 3 (Sensitive).")
    print("==================================================\n")

def run_cli_mode(agent):
    print("--- JARVIS INTERACTIVE CONSOLE MODE ---")
    print("Type your commands in Hindi, Hinglish, or English.")
    print("Type 'exit' or 'quit' to terminate.\n")

    while True:
        try:
            cmd = input("YOU > ").strip()
            if not cmd:
                continue
            if cmd.lower() in ("exit", "quit", "q"):
                print("JARVIS > Shutting down.")
                break

            agent.process_command(cmd)
        except (KeyboardInterrupt, EOFError):
            print("\nJARVIS > Terminated.")
            break

def main():
    parser = argparse.ArgumentParser(description="JARVIS Personal AI Desktop Assistant")
    parser.add_argument("--cli", action="store_true", help="Launch in interactive CLI terminal mode without GUI")
    parser.add_argument("--web", action="store_true", help="Launch in high-performance Localhost Web HUD mode")
    parser.add_argument("--port", type=int, default=5000, help="Port for Localhost Web HUD (default: 5000)")
    parser.add_argument("--set-gemini-key", type=str, help="Configure and test Google Gemini API key")
    parser.add_argument("--test-gemini", action="store_true", help="Test live Google Gemini API connectivity")
    args = parser.parse_args()

    setup_logging()
    first_run_initialization()

    if args.set_gemini_key:
        from skills.gemini_skill import GeminiSkill
        print(f"[GEMINI] Configuring Gemini API key...")
        skill = GeminiSkill()
        ok, msg = skill.save_api_key(args.set_gemini_key, test=True)
        print(f"[{'SUCCESS' if ok else 'FAILED'}] {msg}")
        return

    if args.test_gemini:
        from skills.gemini_skill import GeminiSkill
        skill = GeminiSkill()
        print(f"[GEMINI] Testing Gemini API connection...")
        ok, msg = skill.query_gemini("Hello JARVIS, are you operational?")
        print(f"[{'SUCCESS' if ok else 'FAILED'}] {msg}")
        return

    from core.agent import JarvisAgent

    if args.web:
        from web_server import start_server
        print(f"[JARVIS] Launching Localhost Web HUD on port {args.port}...")
        start_server(host="0.0.0.0", port=args.port)
    elif args.cli:
        # CLI fallback
        def on_response(msg, success):
            print(f"JARVIS > {msg}")

        def req_confirm(prompt, on_yes, on_no):
            ans = input(f"[CONFIRMATION REQUIRED] {prompt} (yes/no): ").strip().lower()
            if ans in ("yes", "y", "ha", "haan"):
                on_yes()
            else:
                on_no()

        callbacks = {
            "on_agent_response": on_response,
            "request_confirmation": req_confirm
        }
        agent = JarvisAgent(ui_callbacks=callbacks)
        try:
            run_cli_mode(agent)
        finally:
            agent.shutdown()
    else:
        # GUI Mode
        from ui.desktop_ui import JarvisApp

        app = JarvisApp()
        
        callbacks = {
            "on_state_change": app.update_state,
            "on_user_input": app.update_user_input,
            "on_agent_response": app.update_agent_response,
            "request_confirmation": app.show_confirmation_modal
        }

        agent = JarvisAgent(ui_callbacks=callbacks)
        app.agent = agent
        app.refresh_history()

        print("[JARVIS] Launching desktop HUD interface...")
        try:
            app.mainloop()
        finally:
            agent.shutdown()

if __name__ == "__main__":
    main()
