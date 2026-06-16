import { AccessToken, AgentDispatchClient } from 'livekit-server-sdk';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL || "https://awais-portfolio-5vsj5zgs.livekit.cloud";

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "LiveKit server credentials are not configured on the backend." });
    }

    const room = req.query.room || `portfolio-${Math.random().toString(36).substring(2, 9)}`;
    const identity = req.query.identity || `visitor-${Math.random().toString(36).substring(2, 7)}`;

    // Generate Access Token
    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity,
      ttl: "1h",
    });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    // Trigger Python Agent Dispatch using LiveKit Client SDK
    const restUrl = serverUrl.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");
    const dispatchClient = new AgentDispatchClient(restUrl, apiKey, apiSecret);
    try {
      await dispatchClient.createDispatch(room, "portfolio-agent");
    } catch (dispatchError) {
      console.error(`Failed to dispatch agent: ${dispatchError.message}`);
    }

    return res.status(200).json({
      token,
      room,
      identity,
      serverUrl
    });
  } catch (error) {
    console.error("Failed to generate LiveKit token:", error);
    return res.status(500).json({ error: error.message });
  }
}
