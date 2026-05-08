import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Clock, Send } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterMessages = () => {
  const { chatSessions, fetchMessages, sendMessage } = usePayment();
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!activeSession) return;
    const fetchThread = async () => {
      const msgs = await fetchMessages(activeSession.id);
      setMessages(msgs);
    };
    fetchThread();
    const interval = setInterval(fetchThread, 3000);
    return () => clearInterval(interval);
  }, [activeSession, fetchMessages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeSession) return;
    await sendMessage(activeSession.id, draft.trim());
    setDraft('');
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)'
        }}>
          Poster Messages
        </h1>
      </div>

      {!activeSession ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {chatSessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'var(--bg-secondary)',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageSquare size={40} color='var(--text-muted)' />
              </div>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>No chats yet</p>
              <p style={{ color: 'var(--text-secondary)' }}>Messages will appear here when you connect with a hustler.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {chatSessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    padding: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <User size={24} color='var(--text-secondary)' />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{session.participant}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>{session.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
            <button
              onClick={() => setActiveSession(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--orange)',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
              ← Back to chats
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'grid', gap: '12px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingTop: '4rem' }}>
                <p>No messages yet.</p>
              </div>
            ) : messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'Me' ? 'end' : 'start',
                background: msg.sender === 'Me' ? 'var(--emerald)' : 'var(--bg-card)',
                color: msg.sender === 'Me' ? 'white' : 'var(--text-primary)',
                borderRadius: '18px',
                padding: '12px 16px',
                maxWidth: '80%'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.text}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder='Write a message...'
              style={{
                flex: 1,
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                padding: '12px 16px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: 'none',
                background: draft.trim() ? 'var(--orange)' : 'var(--bg-secondary)',
                color: 'white',
                cursor: draft.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterMessages;
