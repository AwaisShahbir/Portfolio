# Awais Shabbir — Portfolio

> A modern, highly animated, and fully responsive personal portfolio website with a real-time AI voice assistant, serverless backend, and admin dashboard.

🌐 **Live:** [awaisshabbir.dev](https://awaisshabbir.dev)

---

## ✨ Features

- **🎤 AI Voice Assistant (Aree)** — Real-time WebRTC voice assistant powered by Google Gemini, allowing visitors to ask questions about Awais or leave a contact message directly via voice.
- **🔔 Real-time Admin Notifications** — The admin dashboard plays a chime, shows a toast, and triggers a desktop notification when a new message arrives from the voice assistant or contact form.
- **📩 Contact via Voice** — Visitors can ask Aree to connect them with Awais. The agent collects their name, email and message and saves it to Firestore automatically.
- **🧑‍💼 Admin Dashboard** — A protected `/admin` route for editing all portfolio content (hero, about, experience, projects, contact) and reading messages.
- **Modern UI/UX** — Dark, futuristic aesthetic with glassmorphism effects, smooth Framer Motion animations, and fully responsive layouts.
- **Fully Responsive** — Optimized for mobile, tablet, and desktop — including the voice assistant modal.

---

## 🛠️ Technology Stack

### Frontend
| Tech | Purpose |
|------|---------|
| [React 18](https://react.dev/) | Core UI framework |
| [Vite](https://vitejs.dev/) | Build tooling & dev server |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [LiveKit Components React](https://docs.livekit.io/) | WebRTC voice room UI |
| [Lucide React](https://lucide.dev/) | Icon library |
| Vanilla CSS | Custom styling & responsive design |

### Backend & Infrastructure
| Service | Purpose |
|---------|---------|
| [Vercel Serverless](https://vercel.com/) | API functions (`/api/token`, `/api/notifyContactRequest`) |
| [Firebase Firestore](https://firebase.google.com/) | Database for messages & portfolio content |
| [Firebase Hosting](https://firebase.google.com/) | Static site hosting |
| [LiveKit Cloud](https://livekit.io/) | WebRTC voice infrastructure |
| [Railway](https://railway.app/) | 24/7 Python AI agent hosting |

### AI Voice Agent
| Tech | Purpose |
|------|---------|
| [LiveKit Agents](https://docs.livekit.io/agents/) | Agent framework |
| [Google Gemini 2.5 Flash](https://ai.google.dev/) | Realtime audio model |
| Python | Agent runtime |

---

## 📁 Project Structure

```
portfolio/
├── api/                          # Vercel Serverless Functions
│   ├── token.js                  # LiveKit token generator + agent dispatch
│   └── notifyContactRequest.js   # Save voice messages to Firestore + Discord
├── src/
│   ├── components/
│   │   ├── VoiceAssistant.jsx    # Voice assistant UI & LiveKit room
│   │   └── ...
│   ├── pages/
│   │   ├── AdminDashboard.jsx    # Admin panel with real-time notifications
│   │   └── admin/                # Admin sections (Hero, About, Projects...)
│   └── index.css                 # Global styles & responsive layouts
├── voice-agent/
│   ├── agent.py                  # Python AI agent (Aree)
│   ├── requirements.txt          # Python dependencies
│   ├── railway.json              # Railway deployment config
│   └── .env.example              # Environment variable template
├── functions/                    # Firebase Cloud Functions (legacy/backup)
├── vercel.json                   # Vercel SPA routing + caching config
└── vite.config.js                # Vite build + dev proxy config
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A [LiveKit Cloud](https://livekit.io/) account
- A [Firebase](https://firebase.google.com/) project
- A [Vercel](https://vercel.com/) account

### 1. Clone & Install Frontend

```bash
git clone https://github.com/AwaisShahbir/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open `http://localhost:5173`.

### 2. Set Up Vercel Backend

Deploy the project to Vercel and add these environment variables in your **Vercel Dashboard → Settings → Environment Variables**:

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | Your LiveKit server URL (e.g. `wss://...livekit.cloud`) |
| `LIVEKIT_API_KEY` | LiveKit API Key |
| `LIVEKIT_API_SECRET` | LiveKit API Secret |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Full Firebase service account JSON (as a string) |
| `DISCORD_WEBHOOK_URL` | *(Optional)* Discord webhook for contact alerts |

### 3. Set Up the Voice Agent

```bash
cd voice-agent
cp .env.example .env
# Fill in your credentials in .env
pip install -r requirements.txt

# Run locally for development
python agent.py dev

# Or deploy to Railway for 24/7 uptime (see below)
```

#### Voice Agent `.env` Variables

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | LiveKit server URL |
| `LIVEKIT_API_KEY` | LiveKit API Key |
| `LIVEKIT_API_SECRET` | LiveKit API Secret |
| `USE_GEMINI` | Set to `true` to use Google Gemini (recommended) |
| `GEMINI_API_KEY` | Google Gemini API Key |
| `FIREBASE_FUNCTIONS_URL` | Your Vercel deployment URL + `/api` |

### 4. Deploy Agent for 24/7 Free Hosting (Render.com)

Render provides a **100% free Python Web Service** (no credit card required).

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New +** → **Web Service** → select your `Portfolio` repository.
3. Configure the settings:
   - **Name:** `portfolio-voice-agent`
   - **Root Directory:** `voice-agent`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python agent.py start`
   - **Instance Type:** `Free`
4. Add Environment Variables:
   - `LIVEKIT_URL`: `wss://awais-portfolio-5vsj5zgs.livekit.cloud`
   - `LIVEKIT_API_KEY`: *(your LiveKit API key)*
   - `LIVEKIT_API_SECRET`: *(your LiveKit API secret)*
   - `USE_GEMINI`: `true`
   - `GEMINI_API_KEY`: *(your Gemini API key)*
   - `FIREBASE_FUNCTIONS_URL`: `https://portfolio-omega-beige-xyibxkfqlk.vercel.app/api`
   - `PYTHON_VERSION`: `3.11.9`
5. Click **Deploy Web Service**.
6. *(Optional)* Add your Render URL to [cron-job.org](https://cron-job.org) or [uptimerobot.com](https://uptimerobot.com) to ping it every 10 minutes to prevent the free tier from sleeping.

---

## 📦 Build for Production

```bash
npm run build
```

The optimized bundle will be in the `dist/` folder, ready for Firebase Hosting or Vercel.

---

## 🔐 Admin Dashboard

Navigate to `/admin/login` on the live site to access the admin panel. Features:
- Edit Hero, About, Experience, Projects, and Contact sections
- View messages from the contact form and voice assistant
- Real-time new message alerts (audio chime + toast + desktop notification)

---

## 🤝 Contact

**Awais Shabbir** — Software Engineer  
📧 awaiskamboh0810@gmail.com  
🔗 [linkedin.com/in/awais-shabbir-971180277](https://www.linkedin.com/in/awais-shabbir-971180277)  
🌐 [awaisshabbir.dev](https://awaisshabbir.dev)
