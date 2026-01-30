export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message } = body || {};
        const GROQ_KEY = process.env.GROQ_API_KEY;

        if (!GROQ_KEY) return res.status(500).json({ error: "Missing GROQ_API_KEY in Vercel." });

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Or your preferred Groq model
                messages: [
                    { role: "system", content: "You are Jarvis, a helpful AI assistant for Surya's portfolio." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        const reply = data.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("GROQ CRASH:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
