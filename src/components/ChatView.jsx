import React, { useState, useEffect, useRef } from 'react';
import { X, User, ChevronRight, Navigation, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatView = ({ onClose, sendMessage, fetchMessages, sessions, initialSession, isFullView }) => {
  const [activeSession, setActiveSession] = useState(initialSession || null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (activeSession) {
      const load = async () => { const msgs = await fetchMessages(activeSession.id); setMessages(msgs); };
      load();
      const interval = setInterval(load, 2000);
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeSession) return;
    await sendMessage(activeSession.id, inputText);
    setInputText('');
  };

  const containerStyle = isFullView
    ? { height: '100%', display: 'flex', flexDirection: 'column' }
    : { position: 'absolute', inset: 0, zIndex: 2000, background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' };

  return (
    <motion.div initial={isFullView ? {} : { y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={containerStyle}>
      {/* Header */}
      {!isFullView && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)' }}>
          <button className="btn-ghost" onClick={() => activeSession ? setActiveSession(null) : onClose()}>
            <X size={20} />
          </button>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{activeSession ? activeSession.participant : 'Messages'}</h3>
        </div>
      )}

      {!activeSession ? (
        /* Session List */
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {isFullView && (
            <div className="section-header" style={{ padding: '0 0 16px' }}>
              <h2 className="section-title">Messages</h2>
              <p className="section-subtitle">Chat with posters and hustlers</p>
            </div>
          )}
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '72px', height: '72px', background: 'var(--bg-glass)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={32} color="var(--text-muted)" />
              </div>
              <p style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '1rem' }}>No messages yet</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Chat starts after accepting a job</p>
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} onClick={() => setActiveSession(session)} className="card" style={{ display: 'flex', gap: '14px', padding: '16px', marginBottom: '10px', cursor: 'pointer' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg-glass-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={22} color="var(--text-secondary)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex-between" style={{ marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', fontWeight: 700 }}>{session.participant}</strong>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.lastMessage}</p>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ alignSelf: 'center', flexShrink: 0 }} />
              </div>
            ))
          )}
        </div>
      ) : (
        /* Chat Messages */
        <>
          {isFullView && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="btn-ghost" onClick={() => setActiveSession(null)}>
                <X size={18} />
              </button>
              <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--bg-glass-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="var(--text-secondary)" />
              </div>
              <strong style={{ fontSize: '0.95rem' }}>{activeSession.participant}</strong>
            </div>
          )}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'Me' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'Me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.sender === 'Me' ? 'var(--emerald)' : 'var(--bg-glass-strong)',
                  color: msg.sender === 'Me' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.9rem', lineHeight: '1.45', fontWeight: 500,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: msg.sender === 'Me' ? 'right' : 'left', fontWeight: 600 }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--bg-secondary)' }}>
            <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: '24px', padding: '4px 16px', border: '1px solid var(--border-color)' }}>
              <input
                value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                style={{ width: '100%', padding: '10px 0', background: 'transparent', border: 'none', outline: 'none', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>
            <button onClick={handleSend} style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--emerald)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, boxShadow: 'var(--shadow-glow-emerald)' }}>
              <Navigation size={18} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ChatView;
