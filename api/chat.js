export default async function handler(req, res) {
  // CORS-Header
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Nur POST-Anfragen erlaubt.' });
  }

  try {
    const { userMessage } = req.body;

    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ reply: 'Vercel API Key fehlt.' });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-beta", // Standard-Modell, das immer antworten sollte
        messages: [
          { role: "system", content: "Du bist der sarkastische KI-Begleiter der Mars-Mission 'Projekt Chimera'." },
          { role: "user", content: userMessage || "Hallo Grok!" }
        ]
      })
    });

    // Wir lesen den rohen Text, um Abstürze bei json() zu vermeiden
    const rawText = await response.text();

    if (!response.ok) {
      console.error("XAI API Fehler:", rawText);
      return res.status(response.status).json({ reply: `XAI weigert sich: ${response.status} - ${rawText}` });
    }

    // Versuch, die Daten auszupacken
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      return res.status(500).json({ reply: 'xAI hat kein gültiges JSON geschickt.' });
    }

    // Bulletproof Auslesen der Antwort
    let grokReply = "Ich habe geantwortet, aber mein Funkgerät ist kaputt.";
    if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
      grokReply = data.choices[0].message.content;
    } else {
      grokReply = "Ungewohntes Datenformat von xAI: " + JSON.stringify(data).substring(0, 100);
    }
    
    return res.status(200).json({ reply: grokReply });

  } catch (error) {
    console.error("Vercel Serverless Error (Fatal):", error);
    return res.status(500).json({ reply: `Fataler Backend-Crash: ${error.message}` });
  }
}
