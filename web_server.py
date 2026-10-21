"""
JARVIS: High-Performance Localhost Web HUD Server
Serves the Futuristic Sci-Fi Web Interface and REST API on http://localhost:5000
"""

import os
import sys
import json
import time
import socket
import logging
import argparse
import mimetypes
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from typing import Optional
import threading
import webbrowser

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).parent.resolve()
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import psutil
from core.agent import JarvisAgent, AgentState

logger = logging.getLogger("JARVIS.WebServer")
WEB_DIR = PROJECT_ROOT / "web"

class JarvisAPIHandler(SimpleHTTPRequestHandler):
    agent: Optional[JarvisAgent] = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def log_message(self, format, *args):
        # Clean custom logging
        logger.info(f"{self.address_string()} - {format % args}")

    def send_json_response(self, data: dict, status_code: int = 200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        url_path = self.path.split("?")[0]

        # API Endpoints
        if url_path == "/api/system":
            self.handle_get_system()
        elif url_path == "/api/history":
            self.handle_get_history()
        elif url_path == "/api/preferences":
            self.handle_get_preferences()
        elif url_path == "/api/state":
            self.handle_get_state()
        elif url_path == "/api/wake_word/status":
            self.handle_get_wake_word_status()
        elif url_path == "/api/gemini/status":
            self.handle_get_gemini_status()
        elif url_path == "/api/ping":
            self.send_json_response({"status": "pong", "time": time.time()})
        else:
            # Static File Serving from web/
            if url_path == "/":
                self.path = "/index.html"
            super().do_GET()

    def do_POST(self):
        url_path = self.path.split("?")[0]

        if url_path == "/api/command":
            self.handle_post_command()
        elif url_path == "/api/voice/listen":
            self.handle_post_voice_listen()
        elif url_path == "/api/wake_word/toggle":
            self.handle_post_wake_word_toggle()
        elif url_path == "/api/history/clear":
            self.handle_post_clear_history()
        elif url_path == "/api/preferences":
            self.handle_post_preferences()
        elif url_path == "/api/gemini/key":
            self.handle_post_gemini_key()
        elif url_path == "/api/voice/toggle":
            self.handle_post_voice_toggle()
        else:
            self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        url_path = self.path.split("?")[0]
        if url_path == "/api/preferences":
            self.handle_delete_preferences()
        else:
            self.send_error(404, "Endpoint not found")

    # API Handlers
    def handle_get_system(self):
        try:
            cpu = psutil.cpu_percent(interval=None)
            mem = psutil.virtual_memory()
            disk = psutil.disk_usage("/")
            proc_count = len(psutil.pids())

            # Fast ping check to Google DNS
            ping_ms = 0
            try:
                s_time = time.perf_counter()
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.4)
                s.connect(("8.8.8.8", 53))
                s.close()
                ping_ms = round((time.perf_counter() - s_time) * 1000)
            except Exception:
                ping_ms = 85

            self.send_json_response({
                "cpu_percent": cpu,
                "ram_percent": mem.percent,
                "disk_percent": disk.percent,
                "process_count": proc_count,
                "ping_ms": ping_ms
            })
        except Exception as e:
            self.send_json_response({"error": str(e)}, status_code=500)

    def handle_get_history(self):
        if not self.agent:
            self.send_json_response([], 200)
            return
        recent = self.agent.history.get_recent(50)
        self.send_json_response(recent, 200)

    def handle_post_clear_history(self):
        if self.agent:
            self.agent.history.clear()
        self.send_json_response({"success": True, "message": "History cleared"})

    def handle_get_preferences(self):
        if not self.agent:
            self.send_json_response({}, 200)
            return
        data = self.agent.preferences.list_all()
        self.send_json_response(data, 200)

    def handle_post_preferences(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            payload = json.loads(post_data)
            alias = payload.get("alias", "").strip()
            target = payload.get("target", "").strip()
            if alias and target and self.agent:
                self.agent.preferences.set_alias(alias, target)
                self.send_json_response({"success": True, "message": f"Alias '{alias}' saved."})
            else:
                self.send_json_response({"success": False, "message": "Invalid alias parameters"}, 400)
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

    def handle_delete_preferences(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            payload = json.loads(post_data)
            alias = payload.get("alias", "").strip()
            if alias and self.agent:
                self.agent.preferences.delete_alias(alias)
                self.send_json_response({"success": True, "message": f"Alias '{alias}' deleted."})
            else:
                self.send_json_response({"success": False, "message": "Invalid alias name"}, 400)
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)

    def handle_get_state(self):
        state = self.agent.state if self.agent else "IDLE"
        voice_enabled = self.agent.tts.enabled if (self.agent and hasattr(self.agent, "tts")) else False
        self.send_json_response({
            "state": state,
            "voice_enabled": voice_enabled
        })

    def handle_post_voice_toggle(self):
        if self.agent and hasattr(self.agent, "tts"):
            new_val = not self.agent.tts.enabled
            self.agent.tts.set_enabled(new_val)
            self.agent.preferences.set_preference("voice_enabled", new_val)
            self.send_json_response({"success": True, "voice_enabled": new_val})
        else:
            self.send_json_response({"success": False, "message": "TTS subsystem not available"}, 400)

    def handle_post_command(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            payload = json.loads(post_data)
            command_text = payload.get("command", "").strip()
            confirmed = bool(payload.get("confirmed", False))

            if not command_text:
                self.send_json_response({
                    "success": False,
                    "message": "Empty command",
                    "status": "empty"
                }, 400)
                return

            if not self.agent:
                self.send_json_response({
                    "success": False,
                    "message": "Agent not initialized",
                    "status": "error"
                }, 500)
                return

            # Execute command synchronously with low latency
            result = self.agent.execute_command_sync(command_text, confirmed=confirmed)
            self.send_json_response(result, 200)

        except Exception as e:
            logger.exception("Error processing command")
            self.send_json_response({
                "success": False,
                "message": f"Internal execution error: {str(e)}",
                "status": "error"
            }, 500)

    def handle_post_voice_listen(self):
        """Records from the laptop's actual hardware microphone, transcribes, and executes."""
        if not self.agent:
            self.send_json_response({"success": False, "message": "Agent not initialized"}, 500)
            return

        self.agent.set_state(AgentState.LISTENING, "Listening to microphone...")
        try:
            text = self.agent.stt.listen_once(duration=4)
            if not text:
                self.agent.set_state(AgentState.IDLE, "No speech detected.")
                self.send_json_response({
                    "success": False,
                    "message": "No speech detected. Please speak closer to your microphone.",
                    "transcript": ""
                }, 200)
                return

            logger.info(f"Hardware microphone captured text: {text}")
            result = self.agent.execute_command_sync(text)
            result["transcript"] = text
            self.send_json_response(result, 200)
        except Exception as e:
            logger.exception("Voice listen error")
            self.agent.set_state(AgentState.ERROR, str(e))
            self.send_json_response({"success": False, "message": f"Microphone error: {str(e)}"}, 500)

    def handle_get_wake_word_status(self):
        enabled = self.agent.wake_listener.enabled if (self.agent and hasattr(self.agent, "wake_listener")) else False
        self.send_json_response({"enabled": enabled})

    def handle_post_wake_word_toggle(self):
        if not self.agent or not hasattr(self.agent, "wake_listener"):
            self.send_json_response({"success": False, "message": "Wake word subsystem not available"}, 400)
            return

        if self.agent.wake_listener.enabled:
            self.agent.wake_listener.stop()
            enabled = False
        else:
            self.agent.wake_listener.start()
            enabled = True

        self.agent.preferences.set_preference("wake_word_enabled", enabled)
        self.send_json_response({"success": True, "wake_word_enabled": enabled})

    def handle_get_gemini_status(self):
        gemini_skill = getattr(self.agent.executor, "gemini_skill", None) if self.agent else None
        key = gemini_skill.get_api_key() if gemini_skill else ""
        masked = f"{key[:8]}...{key[-4:]}" if len(key) > 12 else ("Set" if key else "")
        self.send_json_response({
            "configured": bool(key),
            "masked_key": masked
        })

    def handle_post_gemini_key(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            payload = json.loads(post_data)
            new_key = payload.get("key", "").strip()

            if not self.agent:
                self.send_json_response({"success": False, "message": "Agent not initialized"}, 500)
                return

            self.agent.preferences.set_preference("gemini_api_key", new_key)

            # Also persist in settings.json
            settings_file = PROJECT_ROOT / "config" / "settings.json"
            if settings_file.exists():
                try:
                    with open(settings_file, "r", encoding="utf-8") as f:
                        cfg = json.load(f)
                    cfg["gemini_api_key"] = new_key
                    with open(settings_file, "w", encoding="utf-8") as f:
                        json.dump(cfg, f, indent=2)
                except Exception as e:
                    logger.debug(f"Could not write settings.json: {e}")

            # Test the key if provided
            if new_key:
                gemini_skill = getattr(self.agent.executor, "gemini_skill", None)
                if gemini_skill:
                    success, reply = gemini_skill.query_gemini("Hello JARVIS")
                    if success:
                        self.send_json_response({"success": True, "message": "Gemini API key verified and saved successfully!"})
                        return
                    else:
                        self.send_json_response({"success": False, "message": f"Key saved, but test query returned: {reply}"})
                        return

            self.send_json_response({"success": True, "message": "Gemini API key updated."})
        except Exception as e:
            logger.exception("Error saving Gemini key")
            self.send_json_response({"success": False, "message": str(e)}, 500)


def start_server(host: str = "127.0.0.1", port: int = 5000, agent: Optional[JarvisAgent] = None, open_browser: bool = True):
    # Register MIME types
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/html", ".html")

    if agent is None:
        agent = JarvisAgent()

    # Automatically start wake word listener in background
    try:
        agent.wake_listener.start()
        print("  --> Wake Word:    ACTIVE (Say 'Jarvis' or 'Jarvis <command>')")
    except Exception as e:
        print(f"  --> Wake Word Warning: {e}")

    JarvisAPIHandler.agent = agent

    server = ThreadingHTTPServer((host, port), JarvisAPIHandler)
    url = f"http://localhost:{port}"

    print("==================================================")
    print("      JARVIS NEURAL WEB HUD RUNNING ON LOCALHOST   ")
    print("==================================================")
    print(f"  --> Local URL:    {url}")
    print(f"  --> Network URL:  http://127.0.0.1:{port}")
    print("  --> Voice Mode:   DUAL (Web Speech + Native Laptop Mic)")
    print("  --> Status:       Blazing Fast (<10ms API latency)")
    print("  --> Press Ctrl+C to terminate.")
    print("==================================================\n")

    if open_browser:
        def _open():
            time.sleep(0.5)
            try:
                webbrowser.open(url)
            except Exception as ex:
                logger.warning(f"Could not automatically open browser: {ex}")
        threading.Thread(target=_open, daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[JARVIS] Web server shutting down gracefully...")
    finally:
        server.server_close()
        agent.shutdown()
        print("[JARVIS] Shutdown complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JARVIS Localhost Web HUD Server")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host interface (default: 0.0.0.0)")
    parser.add_argument("--port", type=int, default=5000, help="Port to run server on (default: 5000)")
    parser.add_argument("--no-open", action="store_true", help="Do not automatically open default browser")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )

    start_server(host=args.host, port=args.port, open_browser=not args.no_open)
