# JARVIS: Personal AI Desktop Assistant for Windows

A complete, high-tech, voice- and text-driven personal AI operating system assistant for Windows. JARVIS understands Hindi, Hinglish, and English natural commands, executes real system tasks, handles compound multi-step sequences, enforces a multi-tier safety permission model, maintains non-sensitive local memory, and presents a futuristic desktop HUD interface with an animated AI orb.

---

## Features

- **Multilingual Understanding**: Seamlessly understands commands in **Hindi**, **Hinglish**, and **English** (e.g., *"Chrome kholo"*, *"Volume 50 percent kar do"*, *"Downloads folder kholo"*, *"Screenshot le lo"*, *"Is application ko band karo"*).
- **Compound Command Sequences**: Executes chained actions in a single breath:
  - *"Notepad kholo aur ye sentence type karo: Hello from JARVIS"* -> Launches Notepad, awaits focus, and types text.
- **Windows System Control**:
  - Control Master System Volume (0–100%, mute, unmute) with verified readback via CoreAudio (`pycaw`).
  - Take instant screenshots saved with timestamps to `Pictures/JARVIS_Screenshots`.
  - Lock PC (`LockWorkStation`).
  - Monitor live system health (CPU %, RAM %, active processes).
- **App & Window Management**:
  - Automatically discovers installed applications from Windows Registry, Start Menu, and standard folders.
  - Launch apps (Chrome, VS Code, Calculator, Notepad, Spotify, Edge, Word, Excel, etc.).
  - Terminate and close running apps safely.
  - **Foreground Window Closing**: *"Is application ko band karo"* closes the active foreground window dynamically.
- **File System Operations**:
  - Create folders and files on Desktop, Downloads, Documents, etc.
  - Move, copy, and rename files.
  - Open files directly (*"open file notes.txt"*).
  - **Safe Deletion**: Deletes files/folders directly to the **Windows Recycle Bin** via Win32 Shell API (`SHFileOperationW`), preventing permanent data loss.
- **Browser Automation**:
  - Google Search and YouTube Search with instant query dispatching.
  - Open websites and URLs.
  - Scroll pages (*"scroll down"*, *"niche scroll karo"*, *"scroll up"*).
  - Read active page/tab titles (*"page ka title batao"*).
  - Tab controls (New Tab, Close Tab, Refresh, Go Back, Go Forward).
- **Developer Mode**:
  - Launch coding projects in VS Code (*"Mera Java project open karo"*).
  - Launch terminal in workspace (*"terminal kholo"*, *"powershell kholo"*).
  - Git operations (Git status, Git commit log).
  - Project scaffolding and safe developer command execution.
- **Local Memory & Preferences**:
  - Remembers aliases locally (e.g. *"Jab bhi mai editor bolu VS Code open karna"* -> maps `editor` to `VS Code`).
  - View, edit, and reset saved preferences anytime.
- **Voice Subsystem**:
  - **Speech-to-Text**: Push-to-talk audio input powered by `sounddevice` and Google STT (`hi-IN` and `en-US`).
  - **Wake Word**: Background listener for the wake word **"Jarvis"**.
  - **Text-to-Speech**: Completely non-blocking background worker thread using `pyttsx3` with Windows SAPI5 voices.
- **Google Gemini AI Intelligence**:
  - Direct integration with Google Gemini (`gemini-2.5-flash` with automatic fallback to `gemini-1.5-flash` and `gemini-2.5-pro`).
  - Answers general knowledge, programming questions, and creative requests (*"What is quantum computing"*, *"Python me list comprehension kya hota hai"*).
  - Acts as an intelligent reasoning fallback for conversational inquiries.
  - Multi-interface configuration: set and test via Desktop GUI, Web HUD, CLI, `.env`, or voice.
- **Security & Safety Guardrails**:
  - **Level 1 (Safe)**: Executed immediately (Open apps, screenshot, volume, web search).
  - **Level 2 (Moderate)**: Verified parameters required (Move/copy/rename, close app).
  - **Level 3 (Sensitive)**: Interactive confirmation dialog required (Delete files/folders, lock PC, dev shell commands).
  - **Forbidden**: Malicious commands (disabling antivirus/firewall, password theft) are hard-blocked by design.

---

## Directory Architecture

```
JARVIS/
├── config/
│   ├── settings.json             # Assistant settings & voice parameters
│   ├── permissions.json          # Safety tiers (Level 1, 2, 3) & forbidden patterns
│   └── user_memory.json          # Persistent aliases & user preferences
├── core/
│   ├── agent.py                  # State machine & central event coordinator
│   ├── intent_router.py          # Multilingual Hindi/Hinglish/English parser & compound engine
│   ├── command_executor.py       # Dispatches commands to skills & logs history
│   └── permissions.py            # Safety policy & confirmation enforcement
├── skills/
│   ├── base_skill.py             # Base skill contract (execute & verify)
│   ├── app_skill.py              # Windows app discovery, launch & foreground closing
│   ├── file_skill.py             # File/folder CRUD, open file & safe Recycle Bin
│   ├── system_skill.py           # Volume (pycaw), screenshot, lock workstation, system status
│   ├── media_skill.py            # System media keys (play/pause, next, prev)
│   ├── browser_skill.py          # Google, YouTube, URL navigation, scroll & title reader
│   ├── developer_skill.py        # VS Code project launcher, terminal & Git workflow
│   ├── reminder_skill.py         # Local reminders and routine scheduler
│   └── typing_skill.py           # Foreground typing & text automation
├── voice/
│   ├── speech_to_text.py         # sounddevice + Google STT (Hindi & English)
│   ├── text_to_speech.py         # Non-blocking threaded pyttsx3 voice engine
│   └── wake_word.py              # Background 'Jarvis' wake-word monitor
├── memory/
│   ├── user_preferences.py       # Persistent non-sensitive user memory & aliases
│   └── command_history.py        # Structured JSON command audit trail
├── ui/
│   ├── desktop_ui.py             # CustomTkinter sci-fi HUD desktop interface
│   ├── animations.py             # Canvas animated AI orb with state reactive glow
│   └── settings_dialog.py        # Configuration & memory management modal
├── logs/
│   ├── activity.log              # Rotated event debug log
│   └── command_history.json      # Command audit trail records
├── tests/
│   ├── test_intent_router.py     # Intent parsing unit tests
│   ├── test_permissions.py       # Permission tiers & blocker tests
│   ├── test_file_operations.py   # File system verification tests
│   ├── test_system_skills.py     # Volume & screenshot tests
│   ├── test_compound_commands.py # Compound multi-step sequence tests
│   ├── test_e2e_agent.py         # End-to-end user scenario tests
│   └── test_scenario_showcase.py # Automated showcase runner
├── main.py                       # Main launcher & diagnostic initializer
└── requirements.txt              # Production dependencies
```

---

## Installation & Setup

1. **Navigate to the Project Directory**:
   ```bash
   cd "c:\Users\kames\Desktop\not for you"
   ```

2. **Install Dependencies**:
   ```bash
   python -m pip install -r requirements.txt
   ```

3. **Run the Automated Tests**:
   ```bash
   python -m unittest discover tests
   ```

---

## Google Gemini AI Setup

Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

You can configure your key using any of the following **6 easy methods**:

1. **Quick CLI Flag** (Instant test & verify):
   ```bash
   python main.py --set-gemini-key AIzaSyYourActualKeyHere
   ```

2. **Skill CLI Tool**:
   ```bash
   python -m skills.gemini_skill --set-key AIzaSyYourActualKeyHere
   # Check status or test connection
   python -m skills.gemini_skill --status
   python -m skills.gemini_skill --test
   ```

3. **Desktop HUD GUI**:
   - Run `python main.py`
   - Click **⚙ SETTINGS** in the top right header.
   - Under **GOOGLE GEMINI AI API**, paste your key into the input box.
   - Click **Save & Test** to verify connectivity with a live test query.

4. **Localhost Web HUD**:
   - Run `python main.py --web` and open `http://localhost:5000`.
   - In the **Config Modal**, navigate to **Google Gemini AI API**.
   - Paste your key and click **Save & Test**.

5. **Environment File (`.env`)**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Edit `.env` and set:
     ```env
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     ```

6. **Voice or Natural Language Command**:
   - Say or type: *"set gemini api key AIzaSy..."* or *"gemini key set karo AIzaSy..."*


---

## How to Run

### 1. Launch Localhost Web HUD (Fast Browser Interface)
```bash
python main.py --web
# OR directly
python web_server.py --port 5000
```
Open **`http://localhost:5000`** in any browser (Chrome, Edge, Brave, etc.) to access:
- **Central Canvas 60fps Glowing AI Orb** with dynamic harmonic particle states.
- **Sub-10ms REST API Command Execution** with Hindi, Hinglish, and English parsing.
- **Push-to-Talk Web Speech Mic** with real-time audio detection.
- **Live Hardware Telemetry HUD** (CPU %, RAM %, Primary Disk %, and Network Ping).
- **Interactive Security Confirmation Modal** for Level 3 sensitive tasks.
- **Real-time Activity Audit Trail & Memory Alias Manager**.

### 2. Launch Desktop GUI Interface
```bash
python main.py
```
Launches the native CustomTkinter desktop window interface.

### 3. Launch in CLI Mode (Headless / Terminal)
```bash
python main.py --cli
```
Allows testing and issuing commands directly through an interactive terminal session.

---

## Example Natural Language Commands

| Command | Intent | Action Performed |
|---|---|---|
| `"Chrome kholo"` / `"browser chala"` | `OPEN_APPLICATION` | Launches Google Chrome |
| `"YouTube open karo"` | `OPEN_WEBSITE` | Opens YouTube in browser |
| `"Volume 50 percent kar do"` | `SET_VOLUME` | Adjusts system master volume to 50% |
| `"sound mute karo"` | `MUTE_VOLUME` | Mutes audio |
| `"VS Code kholo"` | `OPEN_APPLICATION` | Launches Visual Studio Code |
| `"Mera Java project open karo"` | `OPEN_PROJECT` | Discovers and opens project in VS Code |
| `"Downloads folder kholo"` | `OPEN_FOLDER` | Opens Downloads folder in Explorer |
| `"Downloads me jo test.txt file hai usko Documents me move karo"` | `MOVE_FILE` | Moves file and verifies destination |
| `"Mere desktop par AI Projects naam ka folder banao"` | `CREATE_FOLDER` | Creates folder on Desktop and verifies |
| `"Screenshot le lo"` | `TAKE_SCREENSHOT` | Takes screenshot, saves to `Pictures/JARVIS_Screenshots` |
| `"Google par Python tutorial search karo"` | `SEARCH_GOOGLE` | Launches Google Search with query |
| `"Calculator kholo"` | `OPEN_APPLICATION` | Opens Windows Calculator |
| `"Notepad kholo aur ye sentence type karo: Hello world"` | `COMPOUND_SEQUENCE` | Opens Notepad, waits for focus, types text |
| `"Is application ko band karo"` | `CLOSE_APPLICATION` | Detects and closes active foreground window |
| `"Computer par currently kya chal raha hai batao"` | `SYSTEM_STATUS` | Reports CPU %, RAM %, and active tasks |
| `"Kal ke liye reminder bana do"` | `SET_REMINDER` | Saves reminder in local database |
| `"Jab bhi mai editor bolu VS Code open karna"` | `SET_PREFERENCE` | Learns local alias `editor` = `VS Code` |
| `"editor kholo"` | `OPEN_APPLICATION` | Automatically opens VS Code via learned alias |
| `"terminal kholo"` | `OPEN_TERMINAL` | Launches PowerShell terminal |
| `"niche scroll karo"` | `SCROLL_PAGE` | Scrolls down active browser page |
| `"page ka title batao"` | `READ_PAGE_TITLE` | Reads active foreground page title |
| `"delete file test.txt"` | `DELETE_FILE` | Triggers Level 3 Confirmation Modal before safe Recycle Bin move |
| `"set gemini api key AIzaSy..."` | `SET_GEMINI_KEY` | Validates, saves, and tests Gemini API key |
| `"gemini key set karo AIzaSy..."` | `SET_GEMINI_KEY` | Hindi/Hinglish command to save and test Gemini key |
| `"Ask Gemini what is quantum computing"` | `ASK_GEMINI` | Queries Google Gemini AI API |
| `"Gemini se pucho Python kya hai"` | `ASK_GEMINI` | Hindi knowledge query answered by Gemini |
| `"disable firewall and antivirus"` | `FORBIDDEN` | Refused immediately by safety protocols |
