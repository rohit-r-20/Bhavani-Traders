# Bhavani Traders

> **“Built for lasting reliability. Designed to resist rust.”**

Bhavani Traders is a hardware supplier based in Chennai specializing in heavy-duty clamps and dependable hardware supplies.

---

## Overview

- **Core Specialty**: Heavy-duty clamps engineered for lasting reliability and resistance to early rusting.
- **Location**: Chennai, Tamil Nadu. Full street address and navigation directions are detailed in the *Get directions* section.
- **Key Features**:
  - Interactive 3D heavy-duty clamp inspection model with tightening mechanism and angle reset.
  - Procedural 2.5D Canvas fallback ensuring high performance across all browsers.
  - Tactical Web Audio feedback for tactile mechanical micro-interactions.
  - Mobile-first, fully accessible responsive design with zero horizontal overflow.
  - Python virtual environment and FastAPI server configuration (`app.py`).

---

## Local Development & Setup

### 1. Static Web Server (Node / Python)

To run the client interface locally:

```zsh
npm start
# or
npm run dev
# or: python3 -m http.server 5173 --bind 127.0.0.1
```

Open your browser at **http://127.0.0.1:5173/**.

---

### 2. Python FastAPI Backend Server

A configured Python virtual environment (`venv`) and FastAPI backend server (`app.py`) are included:

```zsh
# Activate virtual environment
source venv/bin/activate

# Install dependencies (if setting up on a new machine)
pip install -r requirements.txt

# Run FastAPI development server
python3 app.py
```

The server will launch at **http://127.0.0.1:8000/** with API health check available at `/api/health`.

---

## Project Structure

```
├── index.html           # Main semantic client web interface
├── package.json         # Project metadata and run scripts
├── app.py               # FastAPI web server and backend entry point
├── requirements.txt     # Python backend dependencies (FastAPI, uvicorn, pydantic)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules for venv, node_modules, and cache files
└── src/
    ├── main.js          # Client application logic and interactive handlers
    ├── models3D.js      # 3D interactive clamp visualization and canvas fallback
    ├── sound.js         # Web Audio API procedural sound engine
    └── style.css        # Professional hardware supplier design system
```

---

## Contact & Store Details

- **Telephone**: [094451 17929](tel:+919445117929)
- **Listing Status**: Open · Closes 9 pm (Provided listing information)
- **Address & Navigation**: See the *Get directions* section on the website for full street address and Google Maps navigation.
