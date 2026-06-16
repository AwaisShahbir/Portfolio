import admin from 'firebase-admin';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const parsed = JSON.parse(raw);

    // Fix newlines just in case
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }

    // Try to init a separate app for testing
    let app;
    try {
      app = admin.app('debug-test');
    } catch {
      app = admin.initializeApp({
        credential: admin.credential.cert(parsed)
      }, 'debug-test');
    }

    // Try a simple Firestore read to confirm credentials work
    const db = app.firestore();
    const snap = await db.collection('messages').limit(1).get();

    return res.status(200).json({
      status: 'FIREBASE_OK',
      message: 'Firebase Admin initialized and Firestore connected successfully!',
      messagesCount: snap.size
    });

  } catch (e) {
    return res.status(200).json({
      status: 'FIREBASE_ERROR',
      error: e.message,
      stack: e.stack?.split('\n').slice(0, 5)
    });
  }
}
