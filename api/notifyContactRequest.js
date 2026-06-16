import admin from 'firebase-admin';
import https from 'https';

// Helper to send a Discord embed notification using native https
function sendDiscordEmbed(webhookUrl, { name, email, message }) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(webhookUrl);
      const data = JSON.stringify({
        embeds: [{
          title: "🔔 New Voice Agent Contact Request",
          color: 6514385, // Indigo #6366F1
          fields: [
            { name: "Name", value: name, inline: true },
            { name: "Email", value: email, inline: true },
            { name: "Message", value: message }
          ],
          timestamp: new Date().toISOString()
        }]
      });

      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => body += chunk);
        res.on("end", () => resolve(body));
      });

      req.on("error", (e) => reject(e));
      req.write(data);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { name, email, message } = req.body || req.query || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields: name, email, or message" });
    }

    // Initialize Firebase Admin with Service Account JSON Key stored in environment variables
    if (!admin.apps.length) {
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (!serviceAccountKey) {
        return res.status(500).json({ error: "FIREBASE_SERVICE_ACCOUNT_KEY is not configured on Vercel backend." });
      }
      
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    const db = admin.firestore();
    const docRef = await db.collection("messages").add({
      name: name,
      email: email,
      message: `[Voice Agent Call] ${message}`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Voice assistant contact message added: ${docRef.id}`);

    // Optionally notify via Discord webhook if environment variable is configured
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      try {
        await sendDiscordEmbed(discordWebhookUrl, { name, email, message });
      } catch (discordErr) {
        console.error("Failed to send Discord notification:", discordErr);
      }
    }

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return res.status(500).json({ error: error.message });
  }
}
