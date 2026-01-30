export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) return res.status(500).json({ error: "API key missing on server" });

    const systemPrompt = `You are Jarvis, a friendly assistant for Surya Pranav. 
    Profile: IT Degree at MVSR (2021-2025). Skills: HTML, CSS, JS, React. 
    Rules: Max 2 lines. Bullet points only if needed. Ask a follow-up question.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
          // REMOVED 'role: system' - it is not supported here
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      }
    );

    const data = await response.json();

    // Check for API-level errors
    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      return res.status(500).json({ reply: "Jarvis is having trouble thinking. Try again?" });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm stumped! Email Surya?";
    
    // The Strainer: Clean the response
    const cleanReply = reply.replace(/[*'"]/g, '').trim();

    return res.status(200).json({ reply: cleanReply });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server failed" });
  }
}