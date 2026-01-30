export default async function handler(req, res) {
    // 1. Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Use POST" });

    try {
        const { message } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        // DIAGNOSTIC CHECK: Is the API Key missing?
        if (!API_KEY) {
            console.error("Missing GEMINI_API_KEY");
            return res.status(500).json({ error: "Server Error: API Key is missing in Vercel settings." });
        }

        // DIAGNOSTIC CHECK: Is the message missing?
        if (!message) {
            return res.status(400).json({ error: "Client Error: No message provided." });
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

        // Check if Google returned an error (e.g., Invalid API Key)
        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return res.status(500).json({ error: `Gemini Error: ${data.error.message}` });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Jarvis is speechless.";
        return res.status(200).json({ reply: reply.replace(/[*'"]/g, '').trim() });

    } catch (error) {
        console.error("Vercel Runtime Error:", error.message);
        return res.status(500).json({ error: `Runtime Error: ${error.message}` });
    }
}
