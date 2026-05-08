import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, X, User } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Messages = () => {
  const { chatSessions, sendMessage, fetchMessages } = usePayment();
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(async () => {
        const msgs = await fetchMessages(activeSession.id);
        setMessages(msgs);
      }, 2000);
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
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {activeSession && (
          <button
            onClick={() => setActiveSession(null)}
            style={{
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        )}
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)',
          flex: 1
        }}>
          {activeSession ? activeSession.participant : 'Messages'}
        </h1>
      </div>

      {!activeSession ? (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {chatSessions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              opacity: 0.5
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--bg-secondary)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquare size={40} color="var(--text-muted)" />
              </div>
              <p style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--text-primary)'
              }}>
                No messages yet
              </p>
              <p style={{
                fontSize: '0.85rem',
                marginTop: '8px',
                color: 'var(--text-secondary)'
              }}>
                Chat with posters or seekers after accepting a quest.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {chatSessions.map(session => (
                <motion.div
                  key={session.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSession(session)}
                  style={{
                    display: 'flex',
                    gap: '15px',
                    padding: '1.2rem',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={28} color="var(--text-secondary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <strong style={{
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)'
                      }}>
                        {session.participant}
                      </strong>
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)',
                        fontWeight: 600
                      }}>
                        {new Date(session.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '200px'
                    }}>
                      {session.lastMessage}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              background: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'Me' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'Me' ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
                  background: msg.sender === 'Me' ? 'var(--emerald)' : 'var(--bg-primary)',
                  color: msg.sender === 'Me' ? 'white' : 'var(--text-primary)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  fontWeight: 500,
                  border: msg.sender !== 'Me' ? '1px solid var(--border-color)' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: '4px',
                  display: 'block',
                  textAlign: msg.sender === 'Me' ? 'right' : 'left'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--bg-primary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '24px',
                border: 'none',
                background: inputText.trim() ? 'var(--emerald)' : 'var(--bg-tertiary)',
                color: 'white',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default Messages;