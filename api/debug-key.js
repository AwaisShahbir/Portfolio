export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!raw) {
      return res.status(200).json({ status: 'MISSING', message: 'FIREBASE_SERVICE_ACCOUNT_KEY is not set' });
    }

    // Try to parse it
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(200).json({
        status: 'JSON_PARSE_FAILED',
        rawLength: raw.length,
        rawStart: raw.substring(0, 80),
        error: e.message
      });
    }

    const privateKey = parsed.private_key || '';
    const fixedKey = privateKey.replace(/\\n/g, '\n');

    return res.status(200).json({
      status: 'OK',
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      private_key_length: privateKey.length,
      private_key_fixed_length: fixedKey.length,
      private_key_starts_with: privateKey.substring(0, 40),
      private_key_ends_with: privateKey.substring(privateKey.length - 40),
      has_literal_backslash_n: privateKey.includes('\\n'),
      has_real_newlines: privateKey.includes('\n'),
      fixed_has_real_newlines: fixedKey.includes('\n'),
      fixed_starts_with: fixedKey.substring(0, 40),
    });
  } catch (e) {
    return res.status(500).json({ status: 'ERROR', error: e.message });
  }
}
