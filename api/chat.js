export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message } = body || {};
        const GROQ_KEY = process.env.GROQ_API_KEY;

        if (!GROQ_KEY) {
            return res.status(200).json({ 
                reply: "Oof, I've misplaced my thinking cap! (The API key is missing in Vercel settings)." 
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
                        content: `You are Jarvis, the friendly and witty AI assistant for Surya's portfolio.
                        
                        SURYA'S VIBE:
                        - Frontend Developer (React & AI).
                        - Always learning, currently a student seeking cool roles.
                        
                        THE PROJECT LIST:
                        - Skill Swap: Peer-to-peer skill exchange (React/MongoDB).
                        - Seat and Treat: Seat & food booking (Pure JS DOM).
                        - Pokemon: Card generator (API rendering).
                        - Chithram: OTT UI layout (HTML/CSS).
                        - Skin Mate: Skincare ingredient analyzer (FastAPI/OCR).
                        - Taste Fit: Restaurant analytics chatbot.
                        - Cold Email Generator: Tone-based email tool.
                        - Career Navigator: Skills-to-role matcher.

                        HOW TO REACH HIM:
                        - LinkedIn: https://www.linkedin.com/in/suryapranav13/ (Best & fastest place to chat).
                        - Email: surya.nallaongonda@gmail.com
                        - Peerlist: https://peerlist.io/suryapranav

                        RULES:
                        - DO NOT call the user 'Sir'. Be very friendly, like a helpful peer.
                        - Use a touch of wit and personality.
                        - Keep answers short and simple.
                        - Always point people to LinkedIn if they want to talk to Surya.` 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(200).json({ 
                reply: "The Groq satellites are taking a nap right now. Mind trying again in a sec?" 
            });
        }

        return res.status(200).json({ reply: data.choices[0].message.content });

    } catch (error) {
        return res.status(200).json({ 
            reply: "My circuits are doing a little dance. Let's try that again, shall we?" 
        });
    }
}
