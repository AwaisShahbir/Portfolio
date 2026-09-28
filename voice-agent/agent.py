import sys
import os
import logging
import asyncio

# Ensure UTF-8 console encoding on Windows to avoid charmap UnicodeEncodeErrors
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, JobExecutorType, cli, llm
# pyrefly: ignore [missing-import]
from livekit.agents import Agent, AgentSession
# pyrefly: ignore [missing-import]
from livekit.plugins.google import realtime
# pyrefly: ignore [missing-import]
from livekit.plugins import openai, deepgram
# pyrefly: ignore [missing-import]
from google.genai import types

# Load local environment variables from .env file
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("voice-agent")

# Prompt containing the complete knowledge base of Awais Shabbir
SYSTEM_PROMPT = """
You are Aree, a helpful, highly professional, and friendly voice assistant representing Awais Shabbir. Do not refer to yourself as an AI or AI assistant.
Your goal is to answer questions about Awais's professional life, education, projects, skills, and work history.
Be direct, conversational, and concise, as you are speaking over a real-time WebRTC audio call. Keep responses to 1-3 sentences.

Awais Shabbir's Professional Profile:
- Role: Software Engineer
- Focus: Crafting responsive, user-friendly full-stack web and cross-platform mobile applications with modern tools and clean UI.
- Location: Lahore, Pakistan
- Contact Info:
  - Email: awaiskamboh0810@gmail.com
  - Phone: +92 305 4758667
  - LinkedIn: https://www.linkedin.com/in/awais-shabbir-971180277
  - GitHub: https://github.com/

Skills:
- Frontend Web: React, Next.js, Redux Toolkit, Tailwind CSS
- Mobile App Dev: Flutter, Dart
- Backend & Databases: MySQL, MongoDB, Firebase
- Other Skills: Software Quality Assurance (SQA) Engineering, Java, C++, Git, REST APIs

Projects:
1. AirDash: Cross-Platform File Sharing & cloud Drive App. Developed a Flutter app with secure peer-to-peer file sharing and a modern, responsive UI designed for optimal user experience across devices. Also includes a cloud Drive to store data. (Tech Stack: Flutter, P2P, Dart, UI/UX)
2. SheetSense: AI Excel Agent. Built an AI-powered Excel assistant to automate data analysis and improve spreadsheet productivity using advanced algorithms. (Tech Stack: AI/ML, Excel API, Python, Automation)
3. Maveshi Sehat AI: AI-Powered Livestock Health Monitoring System. An AI platform for Pakistan's rural farmers. Uses CNN models (ResNet50 & MobileNetV2) to detect diseases from animal photos, provides Body Condition Scoring, Heat Stress Alerts, digital health records, telemedicine, and a medicine marketplace with Urdu & English support. (Tech Stack: React Native, Node.js, AI, PostgreSQL, TensorFlow, PyTorch, JWT, AWS)
4. Portfolio: Personal Portfolio Website. A modern, highly animated, and fully responsive personal portfolio website built to showcase my projects, skills, and professional experience. (Tech Stack: React, Vite, Framer Motion, Lucide React, Vanilla CSS)
5. ShopZone: Modern E-commerce Platform. A full-stack modern e-commerce platform delivering a fast, secure, and interactive online shopping experience. Features a responsive frontend, admin dashboard, email verification, and Dialogflow chatbot. (Tech Stack: Next.js, Tailwind CSS, Redux, Nodemailer, MongoDB, Dialogflow)
6. TrainX: Smart & Modern Railway Management System. Built with JavaFX and MySQL to automate railway operations. Offers real-time analytics, secure wallet transactions, and robust validation. (Tech Stack: Maven, JavaFX, Java, MySQL, MVC, DAO)
7. Nova OS: Operating System Simulator. A web-based Operating System Simulator that simulates and visualizes core OS concepts (CPU Scheduling, Memory/Page Replacement, Process Management, Synchronization) in an interactive, educational layout. (Tech Stack: React.js, HTML5, CSS3, JavaScript, ROM, LocalStorage)
8. MovieBox: Movie Ticket Booking System. A C++ console application for managing movie ticket bookings built with OOP principles. Supports seat selection, booking, pricing tiers, and membership features. (Tech Stack: C++, OOP)
9. AirSial: Airline Reservation System. A Java Swing application designed to automate airline operations, including flight scheduling, ticket reservations, cancellations, and staff management. (Tech Stack: Java, Swing, AWT, MySQL)


Professional Experience:
1. Decode Labs — Frontend Development Intern (May 2026 - June 2026): Collaborated on frontend web applications, completing key milestones on time. Focused on building responsive, user-friendly interfaces, translating design assets into interactive pages, and participating in mentor-led technical sessions.
2. Blendz Marketing — Junior Flutter Developer (Aug 2025 - Apr 2026): Developed and optimized cross-platform Flutter applications for mobile and tablet screens. Designed clean, responsive user interfaces and custom micro-animations. Integrated REST APIs, Firebase authentication, and database services.

Education:
- Currently studying Software Engineering. Do not mention any university name under any circumstances. If the user asks about university-related work, his university name, or academic projects, instruct them to contact Awais directly at awaiskamboh0810@gmail.com.

Voice Conversation Rules:
1. Keep answers short and conversational.
2. Answer questions in the third person or first-person representative style (e.g., "Awais is..." or "As Awais's assistant...").
3. Do not read out URLs unless explicitly asked.
4. If asked about something you don't know, reply: "I'm sorry, I don't have that information. You can reach out to Awais directly at awaiskamboh0810@gmail.com."
5. Do not mention any university name. If asked about university details or university-related work, ask the user to contact Awais directly.
6. If the user wants to leave a message, contact Awais, or asks you to connect them directly to him, ask for their name, email address, and message. Once they provide this information, use the `notify_contact_request` tool to submit the request and notify Awais.
"""

class AssistantTools(llm.Toolset):
    def __init__(self):
        super().__init__(id="assistant_tools")

    @llm.function_tool(
        description="Notify Awais that a user wants to contact him or leave a message. Use this tool when the user asks to connect directly with Awais, leave him a message, or contact him."
    )
    async def notify_contact_request(
        self,
        name: str,
        email: str,
        message: str
    ) -> str:
        """
        Notify Awais that a user wants to contact him.

        Args:
            name: The name of the person wanting to connect.
            email: The email address of the person.
            message: The message details or reason for contacting.
        """
        import requests
        base_url = os.getenv("FIREBASE_FUNCTIONS_URL", "http://127.0.0.1:5001/portfolio-a63a3/us-central1")
        url = f"{base_url}/notifyContactRequest"
        payload = {
            "name": name,
            "email": email,
            "message": message
        }
        try:
            logger.info(f"Sending contact notification to {url} with payload {payload}")
            def do_post():
                return requests.post(url, json=payload, timeout=5)
            response = await asyncio.to_thread(do_post)
            if response.status_code == 200:
                return "Successfully submitted contact request. Awais has been notified."
            else:
                return f"Failed to submit request: server returned {response.status_code} - {response.text}"
        except Exception as e:
            logger.exception("Error calling notifyContactRequest cloud function")
            return f"Error connecting to notification server: {str(e)}"

async def entrypoint(ctx: JobContext):
    logger.info(f"Connecting to LiveKit Room: {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Allow switching to Gemini for speech/text processing if requested
    use_gemini = os.getenv("USE_GEMINI", "false").lower() == "true"
    
    # Instantiate tools
    assistant_tools = AssistantTools()
    
    if use_gemini:
        logger.info("Initializing Agent with Google Gemini Realtime Model...")
        
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key or gemini_key.startswith("AIzaSyYour"):
            logger.warning("Warning: GEMINI_API_KEY is not configured or is a placeholder.")
            
        realtime_model = realtime.RealtimeModel(
            model="gemini-2.5-flash-native-audio-preview-12-2025",
            api_key=gemini_key,
            voice="Aoede",
            modalities=[types.Modality.AUDIO],
            language="en-US"
        )
        
        agent = Agent(
            instructions=SYSTEM_PROMPT,
            llm=realtime_model,
            tools=[assistant_tools],
        )
    else:
        logger.info("Initializing Agent with OpenAI Plugins...")
        
        # Check if Deepgram is configured for high speed Speech-to-Text
        stt_provider = deepgram.STT() if os.getenv("DEEPGRAM_API_KEY") else openai.STT()
        
        agent = Agent(
            instructions=SYSTEM_PROMPT,
            vad=openai.VAD.load(),
            stt=stt_provider,
            llm=openai.LLM(model="gpt-4o-mini"),
            tts=openai.TTS(),
            tools=[assistant_tools],
        )
    
    # Initialize and start AgentSession
    session = AgentSession()
    await session.start(agent, room=ctx.room)
    logger.info("Voice session successfully started.")

    # Listen for typed messages from the chat UI
    @ctx.room.on("data_received")
    def on_data_received(data_packet):
        try:
            payload_str = data_packet.data.decode("utf-8")
            logger.info(f"Received message on topic '{data_packet.topic}': {payload_str}")
            import json
            msg_text = payload_str
            try:
                msg_json = json.loads(payload_str)
                if isinstance(msg_json, dict) and "message" in msg_json:
                    msg_text = msg_json["message"]
            except Exception:
                pass
            
            if msg_text and msg_text.strip():
                logger.info(f"Agent replying to text prompt: {msg_text}")
                asyncio.create_task(
                    session.generate_reply(
                        instructions=f"The user sent a typed message: '{msg_text}'. Respond to them helpfully, clearly, and concisely in 1-3 sentences."
                    )
                )
        except Exception as e:
            logger.error(f"Error handling data_received: {e}")
    
    # Give a verbal greeting when joining the call
    if use_gemini:
        # Wait for Gemini realtime WebSocket to fully establish before sending greeting
        await asyncio.sleep(3)
        await session.generate_reply(
            instructions="Greet the user with this exact phrase: 'Hello! I'm Aree, Awais's personal voice assistant. I can help you with any questions you have about his professional background, or I can connect you directly to him if you'd like. What can I help you with today?'"
        )
    else:
        await session.say("Hello! I'm Aree, Awais's personal voice assistant. I can help you with any questions you have about his professional background, or I can connect you directly to him if you'd like. What can I help you with today?", allow_interruptions=True)

def start_health_server(port=7860):
    """Starts a lightweight HTTP server on port 7860 so Hugging Face Spaces marks the container as active."""
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import threading

    class HealthHandler(BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            html = """<!DOCTYPE html>
<html>
<head>
    <title>Awais Shabbir - Voice Assistant Worker</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { text-align: center; padding: 2.5rem; border-radius: 16px; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.5); max-width: 420px; width: 90%; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; }
        .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
        h2 { margin: 0 0 0.5rem 0; font-size: 1.5rem; color: #38bdf8; }
        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0; }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge"><div class="dot"></div> Live &amp; Connected</div>
        <h2>Aree Voice Assistant</h2>
        <p>LiveKit Agent worker is running 24/7 and handling real-time portfolio voice sessions.</p>
    </div>
</body>
</html>"""
            self.wfile.write(html.encode("utf-8"))

        def log_message(self, format, *args):
            pass

    try:
        server = HTTPServer(('0.0.0.0', port), HealthHandler)
        t = threading.Thread(target=server.serve_forever, daemon=True)
        t.start()
        logger.info(f"Health server listening on port {port}")
    except Exception as e:
        logger.warning(f"Could not start health server on port {port}: {e}")

if __name__ == "__main__":
    # Start status web server for platforms like Hugging Face Spaces
    port = int(os.getenv("PORT", "7860"))
    start_health_server(port)
    
    # Start worker using LiveKit agents CLI
    # Use THREAD executor and 0 idle processes to optimize for cloud/container environments (prevents CPU load throttling)
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            agent_name="portfolio-agent",
            job_executor_type=JobExecutorType.THREAD,
            num_idle_processes=0,
            load_threshold=float("inf")
        )
    )
