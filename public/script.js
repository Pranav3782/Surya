/* === UI NAVIGATION LOGIC === */
document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    // Function to show a page and hide others
    window.showPage = function(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick')?.includes(pageId)) {
                link.classList.add('active');
            }
        });
        window.scrollTo(0, 0);
    };

    // Mobile menu toggle
    window.toggleMenu = function() {
        mobileMenu.classList.toggle('-translate-x-full');
        document.body.classList.toggle('overflow-hidden');
        if (mobileMenu.classList.contains('-translate-x-full')) {
            mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
        } else {
            mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        }
    };

    window.closeMenu = function() {
        mobileMenu.classList.add('-translate-x-full');
        document.body.classList.remove('overflow-hidden');
        mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    showPage('home');
});


/* === JARVIS AI CHAT LOGIC === */

// UI Helper: Adds chat bubbles to the window
function addMessage(text, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const wrapper = document.createElement('div');
    wrapper.className = isUser ? 'flex justify-end w-full mb-3' : 'flex justify-start w-full mb-3';
    
    const bubble = document.createElement('div');
    bubble.className = isUser 
        ? 'chat-bubble p-3 text-sm border-2 border-black bg-purple-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-sm' 
        : 'chat-bubble p-3 text-sm border-2 border-black bg-white text-black rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm';
    
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Backend Helper: Talks to your Vercel Function
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // Vercel sometimes passes body as a string, sometimes as an object
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const userMessage = body?.message;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) return res.status(500).json({ error: "Missing API Key" });
        if (!userMessage) return res.status(400).json({ error: "No message sent" });

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: userMessage }] }]
                })
            }
        );

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Jarvis is offline.";
        return res.status(200).json({ reply });

    } catch (err) {
        console.error("SERVER CRASH:", err.message);
        return res.status(500).json({ error: err.message });
    }
}

// Chat Form Listener
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            chatInput.value = '';
            addMessage(text, true); 
            
            const response = await fetchAIResponse(text);
            addMessage(response); 
        });
    }
});

// Quick Action Handler
window.handleQuickAction = async function(action) {
    const queries = {
        'View Projects': 'What are your projects?',
        'Tech Stack': 'What skills do you have?',
        'Contact Surya': 'How can I contact you?',
        'About Surya': 'Who is Surya Pranav?'
    };
    const query = queries[action] || action;
    addMessage(query, true);
    const response = await fetchAIResponse(query);
    addMessage(response);
};


