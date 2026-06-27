import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, ChevronDown } from 'lucide-react';

const FAQ_RESPONSES = [
  { keywords: ['hello', 'hi', 'hey', 'assalamualaikum', 'salam'], response: "Wa'alaikumussalam! 👋 Welcome to Brunei Darussalam! I'm your SideQuest AI assistant. How can I help you explore the Abode of Peace today?" },
  { keywords: ['best place', 'must visit', 'recommend', 'where to go', 'top attraction', 'popular'], response: "🏛️ Here are Brunei's must-visit spots:\n\n• **Sultan Omar Ali Saifuddien Mosque** — One of the most beautiful mosques in Asia-Pacific\n• **Kampong Ayer** — The world's largest water village\n• **Ulu Temburong National Park** — Pristine rainforest with canopy walks\n• **Jame' Asr Hassanil Bolkiah Mosque** — The largest mosque in Brunei\n\nUse the Explore tab to find bookable experiences at these locations!" },
  { keywords: ['safe', 'safety', 'crime', 'dangerous'], response: "✅ Brunei is one of the **safest countries in the world**! It has extremely low crime rates. The people are friendly and welcoming. Just follow general travel etiquette — dress modestly when visiting mosques and respect local customs. You'll feel right at home!" },
  { keywords: ['escrow', 'payment protect', 'how payment', 'fund', 'money safe'], response: "🛡️ **SideQuest Escrow Firewall** protects every transaction:\n\n1. When you book, your payment is **locked in escrow**\n2. Funds are only released to the host **after you check in** and the host scans your QR ticket\n3. If there's a dispute, funds remain frozen until resolved\n\nThis means your money is 100% protected until you actually experience the activity!" },
  { keywords: ['halal', 'food', 'eat', 'restaurant', 'cuisine', 'dish'], response: "🍲 Great news — **Brunei is a Muslim-majority country**, so virtually all food establishments are halal!\n\n**Must-try dishes:**\n• **Ambuyat** — Brunei's national dish (sago starch)\n• **Kuih Mor** — Traditional love letter cookies\n• **Nasi Katok** — The affordable staple ($1 BND!)\n• **Kelupis** — Sticky rice in palm leaves\n\nBook a cooking class on SideQuest to learn to make these yourself!" },
  { keywords: ['weather', 'rain', 'temperature', 'climate', 'hot', 'season'], response: "🌤️ Brunei has a **tropical climate** year-round:\n\n• Temperature: 24°C – 32°C (always warm!)\n• Rainy season: Nov – Feb (bring an umbrella)\n• Dry season: Mar – Oct (best for jungle treks)\n• Humidity: High — stay hydrated!\n\nTip: Mornings are the best time for outdoor activities." },
  { keywords: ['currency', 'money', 'exchange', 'bnd', 'dollar', 'pay'], response: "💰 Brunei uses the **Brunei Dollar (BND)**:\n\n• 1 BND ≈ 0.74 USD / 0.69 EUR\n• **Singapore Dollar is accepted** at par (1:1)\n• Most places accept credit cards (Visa/Mastercard)\n• ATMs widely available in BSB and Gadong\n\nOn SideQuest, you can pay directly with your Visa/Mastercard!" },
  { keywords: ['visa', 'passport', 'entry', 'immigration', 'travel document'], response: "🛂 **Visa requirements for Brunei:**\n\n• Many nationalities get **visa-free entry** for 14-90 days\n• ASEAN citizens: visa-free\n• US/UK/EU/Australia: visa on arrival (14-30 days)\n• Passport must be valid for 6+ months\n\nYour SideQuest passport scan during registration validates your travel document automatically!" },
  { keywords: ['transport', 'bus', 'taxi', 'grab', 'car', 'drive', 'uber', 'get around'], response: "🚗 **Getting around Brunei:**\n\n• **Dart** — Brunei's ride-hailing app (like Grab)\n• **Water taxis** — For Kampong Ayer (BND 1-2)\n• **Car rental** — Best for exploring outside BSB\n• **Public buses** — Limited but affordable\n\nTip: Download the Dart app for easy transport! For activities, many hosts include transport in the booking." },
  { keywords: ['dress', 'modesty', 'wear', 'clothing', 'mosque visit', 'etiquette', 'custom'], response: "👔 **Cultural etiquette in Brunei:**\n\n• Dress modestly — cover shoulders and knees\n• **Mosques**: Women must cover hair, no shoes inside\n• Alcohol is **not sold** (but personal consumption by non-Muslims is allowed)\n• Use **right hand** for greetings and eating\n• **Remove shoes** when entering homes\n• **Friday prayer time** (12-2pm): some shops close\n\nBrunei people are very warm and understanding with tourists! 😊" },
  { keywords: ['booking', 'book', 'reserve', 'how to book'], response: "📱 **How to book on SideQuest:**\n\n1. Browse the **Explore** map to find activities\n2. Tap any pin or search for an experience\n3. Select your **date, time slot & number of travelers**\n4. Pay with **Visa/Mastercard** (escrow-protected)\n5. Receive your **QR ticket** in the Bookings tab\n6. Show up & get your ticket **scanned by the host**\n7. Your **Digital Passport** stamp unlocks! 🎉" },
  { keywords: ['passport stamp', 'digital passport', 'stamp', 'badge', 'achievement'], response: "🛂 **Your Digital Tourism Passport:**\n\nEvery time you visit a place and the host scans your QR ticket, you earn a **passport stamp**! Collect stamps from different experiences across Brunei's 4 districts. Each stamp comes with a unique cultural achievement badge. Check your Passport tab to see your collection!" },
  { keywords: ['baking', 'bake', 'kuih', 'cake', 'cookies'], response: "🧁 We have an amazing **Traditional Baking Class** with Siti's Baking Studio!\n\nYou'll learn to make:\n• Kuih Mor (love letters)\n• Kuih Cincin (ring cakes)\n• Traditional Malay desserts\n\nPrice: BND 38/person | Duration: 2 hours\nIncludes a take-home gift box! Search 'Baking' in the Explore tab to book." },
  { keywords: ['canopy', 'jungle', 'rainforest', 'trek', 'hike'], response: "🌿 The **Ulu Temburong Canopy Walk** is Brunei's #1 adventure!\n\n• 60-metre high walkway above the jungle floor\n• Spot hornbills, gibbons & rare orchids\n• Includes longboat river transfer & packed lunch\n• BND 85/person | Full day (6 hours)\n\nSearch 'Canopy' in Explore to book this unforgettable experience!" },
  { keywords: ['firefly', 'night', 'mangrove', 'proboscis', 'monkey'], response: "✨ The **Mangrove Firefly Night Cruise** is magical!\n\n• Glide through mangroves at dusk\n• Watch thousands of synchronous fireflies\n• Spot proboscis monkeys returning to sleep\n• BND 55/person | 2 hours\n\nThis is one of our highest-rated experiences! Search 'Firefly' in Explore." }
];

const QUICK_CHIPS = [
  "Best places to visit?",
  "How does escrow work?",
  "Halal food options?",
  "Is Brunei safe?",
  "Baking classes?",
  "Weather & climate?"
];

const getResponse = (input) => {
  const lower = input.toLowerCase();
  for (const faq of FAQ_RESPONSES) {
    if (faq.keywords.some(kw => lower.includes(kw))) {
      return faq.response;
    }
  }
  return "I couldn't quite understand that. Try asking about bookings, attractions, food, transport, or escrow.";
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Selamat datang! 🇧🇳 I'm **SideQuest AI**, your personal Brunei tourism guide. Ask me anything about places, food, transport, or how the app works!", time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: text.trim(), time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = { id: Date.now() + 1, role: 'bot', text: getResponse(text), time: new Date() };
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleChip = (chip) => sendMessage(chip);

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <p key={i} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              position: 'absolute',
              bottom: '90px',
              right: '20px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
              zIndex: 999
            }}
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '12px',
              right: '12px',
              height: '65vh',
              maxHeight: '500px',
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              boxShadow: '0 -10px 60px rgba(0,0,0,0.2)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Outfit' }}>SideQuest AI</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--emerald)', fontWeight: 700 }}>● Online — Brunei Tourism Guide</div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{
                background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)'
              }}>
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{
              flex: 1, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '12px'
            }} className="no-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px'
                }}>
                  {msg.role === 'bot' && (
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '2px'
                    }}>
                      <Bot size={14} color="white" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))'
                      : 'var(--bg-tertiary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    {formatText(msg.text)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                  <div style={{
                    padding: '12px 20px', borderRadius: '18px 18px 18px 4px',
                    background: 'var(--bg-tertiary)', display: 'flex', gap: '4px', alignItems: 'center'
                  }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick chips (show only when few messages) */}
              {messages.length <= 2 && !isTyping && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {QUICK_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      style={{
                        padding: '8px 14px', borderRadius: '20px',
                        background: 'var(--emerald-soft)',
                        border: '1px solid var(--emerald-glow)',
                        color: 'var(--emerald-dark)',
                        fontSize: '0.75rem', fontWeight: 700,
                        cursor: 'pointer', whiteSpace: 'nowrap'
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex', gap: '10px',
              background: 'var(--bg-secondary)'
            }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask about Brunei..."
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: '50px',
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                  outline: 'none', fontSize: '0.85rem', color: 'var(--text-primary)',
                  fontWeight: 500
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: input.trim()
                    ? 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))'
                    : 'var(--bg-tertiary)',
                  border: 'none', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
