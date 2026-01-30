export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    
    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: "SERVER_ERROR: GEMINI_API_KEY is missing from Vercel settings." });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: message }] }],
                    systemInstruction: { parts: [{ text: "You are Jarvis..." }] },
                }),
            }
        );

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: `API_ERROR: ${data.error.message}` });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
        return res.status(200).json({ reply: reply.trim() });

    } catch (error) {
        console.error("Runtime Crash:", error.message);
        return res.status(500).json({ error: "RUNTIME_CRASH", details: error.message });
    }
}
