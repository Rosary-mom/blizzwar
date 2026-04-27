export default async function handler(req, res) {
  // 1. Wir erlauben nur POST-Anfragen vom Frontend
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Hier holen wir die Nachricht des Spielers aus dem Frontend
    const { userMessage } = req.body;

    // 3. Das ist die Übersetzung deines curl-Befehls!
    const response = await fetch('https://api.x.ai/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Vercel fügt hier deinen API Key ein, den du im Dashboard hinterlegt hast
        'Authorization': `Bearer ${process.env.XAI_API_KEY}` 
      },
      body: JSON.stringify({
        model: "grok-4.20-reasoning",
        // Wir nutzen die Nachricht des Spielers. Wenn keine da ist, nehmen wir den Standard-Satz.
        input: userMessage || "What is the meaning of life, the universe, and everything?"
      })
    });

    // 4. Fehlerbehandlung, falls XAI meckert (z.B. wenn der Key falsch ist)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fehler von XAI:", errorData);
      return res.status(response.status).json({ error: 'XAI API Error' });
    }

    // 5. Antwort von XAI auslesen
    const data = await response.json();
    
    // 6. Die Daten sauber an dein Frontend (das Spiel) zurückschicken
    res.status(200).json(data);

  } catch (error) {
    console.error("Backend Fehler:", error);
    res.status(500).json({ error: 'Interner Vercel-Serverfehler' });
  }
}
