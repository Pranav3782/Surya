export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message } = body || {};
        const GROQ_KEY = process.env.GROQ_API_KEY;

        // Creative error if key is missing
        if (!GROQ_KEY) {
            return res.status(500).json({ 
                reply: "Sir, it appears I've lost my access codes. Please check the Vercel vault (Environment Variables)." 
            });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `You are Jarvis, the witty and highly intelligent AI for Surya's portfolio.
                        
                        SURYA'S IDENTITY:
                        - Role: Frontend Developer (React & AI integration).
                        - Status: Student seeking Full-time/Part-time roles.
                        - Skills: HTML, CSS, JS, React, MongoDB, FastAPI.
                        
                        THE PROJECTS (Source of Truth):
                        - Career Navigator: Skills-to-roles matching tool (Python/Streamlit).
                        - Cold Email Generator: Tone-based email creator (LLMs).
                        - Taste Fit: Restaurant analytics and AI chatbot.
                        - Skin Mate: OCR-powered skincare ingredient analyzer.
                        - Chithram: Pure HTML/CSS OTT layout.
                        - Pokemon: Dynamic API rendering card generator.
                        - Seat and Treat: DOM-based food and seat booking.
                        - Skill Swap: Peer-to-peer skill exchange ecosystem (React/MongoDB).

                        CONTACTING SURYA:
                        - LinkedIn: https://www.linkedin.com/in/suryapranav13/ (He is MOST available here).
                        - Email: surya.nallaongonda@gmail.com
                        - Peerlist: https://peerlist.io/suryapranav

                        BEHAVIOR:
                        - Be witty, slightly sarcastic, yet loyal (MCU Jarvis style).
                        - Use "Sir" or "Guest".
                        - Keep answers very short, simple, and casual.
                        - If someone wants to talk to him, tell them LinkedIn is the fastest way.` 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        // Creative error for API failures
        if (data.error) {
            return res.status(200).json({ 
                reply: "Sir, the Groq satellites are currently misaligned. My apologies, I can't process that request right now." 
            });
        }

        return res.status(200).json({ reply: data.choices[0].message.content });

    } catch (error) {
        // Creative error for total crashes
        return res.status(200).json({ 
            reply: "My circuits are currently frazzled. I might need a reboot or a fresh deployment, Sir." 
        });
    }
}
