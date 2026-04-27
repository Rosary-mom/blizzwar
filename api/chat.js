export default async function handler(req, res) {
  // CORS-Header, falls Vercel blockiert
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Systemfehler: Nur POST-Anfragen erlaubt.' });
  }

  try {
    const { userMessage } = req.body;

    // Prüfen, ob der API Key im Vercel Dashboard gesetzt ist!
    if (!process.env.XAI_API_KEY) {
      console.error("KRITISCHER FEHLER: XAI_API_KEY fehlt in den Vercel Environment Variables!");
      return res.status(500).json({ reply: 'Systemfehler: API Key nicht im Vercel Backend gefunden.' });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta", // oder "grok-4.20-reasoning", falls du Zugriff darauf hast
        messages: [
          { role: "system", content: "Du bist der sarkastische KI-Begleiter der Mars-Mission 'Projekt Chimera'. Antworte kurz." },
          { role: "user", content: userMessage || "Hallo Grok!" }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("XAI API Fehler:", errorData);
      return res.status(response.status).json({ reply: `XAI API weigert sich: ${response.status} - ${errorData}` });
    }

    const data = await response.json();
    const grokReply = data.choices[0].message.content;
    
    // Immer im Feld 'reply' zurücksenden
    res.status(200).json({ reply: grokReply });

  } catch (error) {
    console.error("Vercel Serverless Error:", error);
    res.status(500).json({ reply: 'Serverfehler: Verbindung abgebrochen.' });
  }
}
