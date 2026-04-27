export default async function handler(req, res) {
  // 1. Nur POST-Requests erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Den Input vom Frontend auslesen (z.B. die Chat-Nachricht des Spielers)
    const { userMessage } = req.body;

    // 3. Anfrage an die XAI API senden (im korrekten Chat-Completions Format)
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Hier greifen wir sicher auf die Vercel Environment Variable zu!
        'Authorization': `Bearer ${process.env.XAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "grok-4.20-reasoning",
        messages: [
          { role: "system", content: "Du bist der XAI Chatbot der Mars-Mission. Antworte kurz und passend zum Thema Weltraum." },
          { role: "user", content: userMessage || "What is the meaning of life, the universe, and everything?" }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("XAI API Error:", errorData);
      return res.status(response.status).json({ error: 'Fehler von der XAI API' });
    }

    const data = await response.json();
    
    // 4. Antwort an dein Frontend zurücksenden
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("Serverless Function Error:", error);
    res.status(500).json({ error: 'Interner Serverfehler im Vercel Backend' });
  }
}
