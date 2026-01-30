export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Use POST" });

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // Ruthless check: Stop early if the key is missing
        if (!API_KEY) throw new Error("GEMINI_API_KEY is not set in Vercel.");

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
        
        // Handle API errors (like Quota Exceeded)
        if (data.error) return res.status(500).json({ reply: `AI Error: ${data.error.message}` });

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm speechless.";
        return res.status(200).json({ reply: reply.replace(/[*'"]/g, '').trim() });

    } catch (error) {
        console.error("Vercel Function Error:", error.message);
        return res.status(500).json({ error: "Jarvis is offline. Check Vercel logs." });
    }
}
