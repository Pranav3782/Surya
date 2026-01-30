export default async function handler(req, res) {
    // 1. Add CORS headers so the browser allows the request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Handle the "Preflight" OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 3. Only allow POST for the actual AI logic
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

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
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't think of a response.";
        return res.status(200).json({ reply: reply.replace(/[*'"]/g, '').trim() });

    } catch (error) {
        return res.status(500).json({ error: "Server failed" });
    }
}
