export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // 1. Safe Body Parsing
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message } = body || {};
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) throw new Error("GEMINI_API_KEY is missing in Vercel settings.");
        if (!message) throw new Error("No message received from frontend.");

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: message }] }],
                }),
            }
        );

        const data = await response.json();
        if (data.error) throw new Error(`Gemini API: ${data.error.message}`);

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm speechless.";
        return res.status(200).json({ reply: reply.trim() });

    } catch (error) {
        console.error("JARVIS CRASH:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
