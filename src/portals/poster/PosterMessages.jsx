import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, User, ChevronLeft, MoreVertical, Paperclip, Smile, Search } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterMessages = () => {
  const { chatSessions, fetchMessages, sendMessage } = usePayment();
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(async () => {
        const msgs = await fetchMessages(activeSession.id);
        setMessages(msgs);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeSession, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeSession) return;
    await sendMessage(activeSession.id, inputText);
    setInputText('');
  };

  return (
    <div className="app-content no-pad" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AnimatePresence mode="wait">
        {!activeSession ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Header */}
            <div className="flex-between" style={{ padding: '24px 20px 12px' }}>
              <div>
                <h1 className="section-title">Messages</h1>
                <p className="section-subtitle">Chat with your Hustlers</p>
              </div>
              <button className="btn-ghost" style={{ background: 'var(--bg-card)', borderRadius: '12px' }}>
                <Search size={20} />
              </button>
            </div>

            {/* Chat List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
              {chatSessions.length === 0 ? (
                <div className="flex-center" style={{ height: '60%', flexDirection: 'column', gap: '16px', opacity: 0.5 }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={32} />
                  </div>
                  <p>No conversations yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {chatSessions.map(session => (
                    <div 
                      key={session.id}
                      onClick={() => setActiveSession(session)}
                      className="card" 
                      style={{ 
                        padding: '12px', 
                        display: 'flex', 
                        gap: '12px', 
                        alignItems: 'center',
                        background: session.unread ? 'var(--portal-soft)' : 'var(--bg-card)',
                        borderColor: session.unread ? 'var(--portal-color)' : 'var(--border-color)'
                      }}
                    >
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-tertiary)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.participant}`} alt="avatar" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="flex-between" style={{ marginBottom: '4px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{session.participant}</h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {session.lastMessage}
                        </p>
                      </div>
                      {session.unread && <div style={{ width: '8px', height: '8px', background: 'var(--portal-color)', borderRadius: '50%' }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}
          >
            {/* Chat Header */}
            <div className="flex-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="btn-ghost" onClick={() => setActiveSession(null)} style={{ padding: '8px', marginLeft: '-8px' }}>
                  <ChevronLeft size={24} />
                </button>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeSession.participant}`} alt="avatar" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{activeSession.participant}</h4>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ width: '6px', height: '6px', background: 'var(--emerald)', borderRadius: '50%' }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Online</span>
                  </div>
                </div>
              </div>
              <button className="btn-ghost"><MoreVertical size={20} /></button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Today</span>
              </div>
              
              {messages.map((msg, i) => {
                const isMe = msg.sender === 'Me';
                return (
                  <div 
                    key={msg.id}
                    style={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ 
                      padding: '12px 16px',
                      borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      background: isMe ? 'var(--portal-color)' : 'var(--bg-tertiary)',
                      color: isMe ? 'white' : 'var(--text-primary)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      boxShadow: isMe ? 'var(--portal-glow)' : 'none',
                      border: isMe ? 'none' : '1px solid var(--border-color)'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div style={{ padding: '20px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button className="btn-ghost" style={{ padding: '10px', color: 'var(--text-muted)' }}><Paperclip size={20} /></button>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message..."
                    style={{ 
                      width: '100%',
                      padding: '14px 48px 14px 16px',
                      borderRadius: '24px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                  <button style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', padding: '4px' }}>
                    <Smile size={20} />
                  </button>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="btn-primary" 
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '25px', 
                    padding: 0, 
                    background: inputText.trim() ? 'var(--portal-color)' : 'var(--bg-tertiary)',
                    opacity: inputText.trim() ? 1 : 0.5
                  }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PosterMessages;
