const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { AccessToken, AgentDispatchClient } = require("livekit-server-sdk");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const https = require("https");

admin.initializeApp();

/**
 * Helper to send a Discord embed notification using native https
 */
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

/**
 * Cloud Function to generate a secure access token for LiveKit connection.
 * CORS is enabled to allow local and production portfolio clients to call this endpoint.
 */
exports.getLiveKitToken = onRequest({ cors: true }, async (req, res) => {
  try {
    // Read API keys from environment config (populated in Firebase CLI or local .env)
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      logger.error("LIVEKIT_API_KEY or LIVEKIT_API_SECRET is not set in environment.");
      return res.status(500).json({ error: "LiveKit server credentials are not configured on the backend." });
    }

    // Determine room name and participant identity
    const room = req.query.room || `portfolio-${Math.random().toString(36).substring(2, 9)}`;
    const identity = req.query.identity || `visitor-${Math.random().toString(36).substring(2, 7)}`;

    logger.info(`Generating token for room: ${room}, identity: ${identity}`);

    // Create a new access token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity,
      ttl: "1h", // Token valid for 1 hour
    });

    // Grant join, publish, and subscribe permissions
    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,      // Allow user to publish microphone stream
      canSubscribe: true,    // Allow user to listen to AI agent stream
      canPublishData: true,  // Allow data channel (e.g. for transcriptions)
    });

    const token = await at.toJwt();

    // Explicitly trigger the agent to join the room using the AgentDispatchClient
    const serverUrl = process.env.LIVEKIT_URL || "https://awais-portfolio-5vsj5zgs.livekit.cloud";
    const restUrl = serverUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");

    const dispatchClient = new AgentDispatchClient(restUrl, apiKey, apiSecret);
    try {
      await dispatchClient.createDispatch(room, "portfolio-agent");
      logger.info(`Successfully explicitly dispatched portfolio-agent to room: ${room}`);
    } catch (dispatchError) {
      logger.error(`Failed to dispatch agent explicitly: ${dispatchError.message}`);
    }

    return res.status(200).json({
      token,
      room,
      identity,
      serverUrl
    });
  } catch (error) {
    logger.error("Failed to generate LiveKit token:", error);
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Cloud Function to create a contact request message from the AI voice assistant.
 */
exports.notifyContactRequest = onRequest({ cors: true }, async (req, res) => {
  try {
    const { name, email, message } = req.body || req.query || {};

    if (!name || !email || !message) {
      logger.error("Missing fields for notifyContactRequest:", { name, email, message });
      return res.status(400).json({ error: "Missing required fields: name, email, or message" });
    }

    const db = admin.firestore();
    const docRef = await db.collection("messages").add({
      name: name,
      email: email,
      message: `[Voice Agent Call] ${message}`,
      read: false,
      createdAt: FieldValue.serverTimestamp()
    });

    logger.info(`Voice assistant contact message added to Firestore: ${docRef.id}`);

    // Notify via Discord webhook if environment variable is configured
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      try {
        await sendDiscordEmbed(discordWebhookUrl, { name, email, message });
        logger.info("Sent contact request notification to Discord.");
      } catch (discordErr) {
        logger.error("Failed to send Discord notification:", discordErr);
      }
    }

    return res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    logger.error("Failed to save contact message:", error);
    return res.status(500).json({ error: error.message });
  }
});
