export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Use POST" });

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // 1. Check if the key exists
        if (!API_KEY) {
            console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from Vercel Environment Variables.");
            return res.status(500).json({ error: "API Key not configured on server." });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: message }] }],
                    systemInstruction: { parts: [{ text: "You are Jarvis, a helpful AI portfolio assistant." }] },
                }),
            }
        );

        const data = await response.json();

        // 2. Check if Gemini returned an error (e.g., Invalid Key)
        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Jarvis is having trouble thinking.";
        return res.status(200).json({ reply: reply.replace(/[*'"]/g, '').trim() });

    } catch (error) {
        console.error("Server Crash Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
