import React, { useState, useEffect, useRef } from 'react';
import { usePayment } from './context/PaymentContext';
import { generateReceipt } from './utils/pdfGenerator';
import { 
  Map as MapIcon, 
  ClipboardCheck, 
  User, 
  Search, 
  Sliders, 
  PlusCircle, 
  Navigation, 
  ClipboardList, 
  LayoutGrid,
  Zap,
  Lock,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Download,
  CreditCard,
  History,
  ShieldCheck,
  X,
  Plus,
  MapPin,
  ChevronRight,
  Maximize2,
  Navigation2,
  Trash2,
  Calendar,
  MessageSquare,
  LogOut,
  Settings,
  Bell,
  CheckCircle2,
  Smartphone,
  LocateFixed,
  Radius
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AutoReleaseTimer = ({ jobId, proofTime, releaseFunds }) => {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  useEffect(() => {
    const elapsed = Math.floor((new Date() - new Date(proofTime)) / 1000);
    const remaining = Math.max(0, 1200 - elapsed);
    setTimeLeft(remaining);
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [proofTime]);
  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  return (
    <div style={{background:'#FFF9F0', border:'1px solid #FFE8CC', padding:'1rem', borderRadius:'16px', marginTop:'12px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <p style={{fontSize:'0.75rem', fontWeight:800, color:'#862E00'}}><Clock size={14} style={{verticalAlign:'middle'}}/> AUTO-RELEASE</p>
        <span style={{fontFamily:'monospace', fontWeight:900, color:'#EF4444', fontSize:'1.2rem'}}>{formatTime(timeLeft)}</span>
      </div>
      <button className="btn-outline" style={{marginTop:'10px', fontSize:'0.75rem', padding:'8px', width:'100%', borderColor:'#FFD8A8', borderRadius:'12px', background:'white'}} onClick={() => releaseFunds(jobId)}>Release Funds Now</button>
    </div>
  );
};

const MapView = ({ jobs, onAccept, mapInstanceRef, searchRadius }) => {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  useEffect(() => {
    if (!window.L || !mapRef.current) return;
    
    // Always create a new map instance for the new container
    const map = L.map(mapRef.current, { zoomControl: false }).setView([4.8903, 114.9401], 13);
    mapInstanceRef.current = map;
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

    // Add User Location Marker
    L.circleMarker([4.8903, 114.9401], { color: '#007AFF', fillColor: '#007AFF', fillOpacity: 0.8, radius: 8 }).addTo(map);
    
    // Add Radius Circle
    L.circle([4.8903, 114.9401], {
       radius: searchRadius * 1000, 
       color: '#00A550', 
       weight: 1, 
       fillColor: '#00A550', 
       fillOpacity: 0.1
    }).addTo(map);

    // Add Quest Markers
    jobs.forEach(job => {
      const isOwned = job.payer === 'Me';
      const color = isOwned ? '#FF9500' : '#00A550';
      const marker = L.marker(job.coords || [4.8903 + Math.random()*0.02, 114.9401 + Math.random()*0.02]).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Outfit', sans-serif; padding:8px; min-width:150px;">
          <strong style="color:${color}; font-size:1rem; display:block; margin-bottom:4px;">${job.title}</strong>
          <div style="font-weight:900; font-size:1.1rem; margin-bottom:4px;">BND ${job.reward}</div>
          <p style="font-size:0.75rem; color:#8E8E93; margin-bottom:8px;">${isOwned ? 'Your Posted Quest' : 'Available Quest'}</p>
          ${!isOwned && job.status === 'open' ? `<button onclick="window.dispatchEvent(new CustomEvent('accept-job', {detail: '${job.id}'}))" style="background:#00A550; color:white; border:none; padding:10px; border-radius:12px; cursor:pointer; width:100%; font-weight:800; font-size:0.8rem;">Accept Quest</button>` : ''}
        </div>
      `);
    });

    const handleAccept = (e) => onAccept(e.detail);
    window.addEventListener('accept-job', handleAccept);
    
    return () => {
      window.removeEventListener('accept-job', handleAccept);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [jobs, searchRadius]);

  return (
    <div style={{height:'100%', position:'relative'}}>
      <div ref={mapRef} id="map-container"></div>
      
      {/* Floating Header */}
      <div className="floating-header" style={{ top: '1rem', left: '1rem', right: '1rem', position: 'absolute', zIndex: 500 }}>
         <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px'}}>
            <div className="search-bar" style={{flex:1, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)'}}>
              <Search size={18} color="#8E8E93" />
              <input type="text" placeholder="Find hustles nearby..." style={{border:'none', background:'transparent', outline:'none', fontSize:'0.9rem', width:'100%'}} />
            </div>
            <div style={{background:'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', width:'50px', height:'50px', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', border:'1px solid rgba(0,0,0,0.05)', cursor:'pointer'}}>
               <Bell size={22} color="#1C1C1E" />
            </div>
         </div>
      </div>

      {/* Map Tools */}
      <div style={{position:'absolute', right:'1rem', top:'130px', display:'flex', flexDirection:'column', gap:'12px', zIndex:500}}>
         <div onClick={() => mapInstanceRef.current.setView([4.8903, 114.9401], 15)} style={{background:'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', width:'46px', height:'46px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 24px rgba(0,0,0,0.1)', border:'1px solid rgba(0,0,0,0.05)', cursor:'pointer'}}>
            <LocateFixed size={22} color="#007AFF" />
         </div>
      </div>
    </div>
  );
};

const ChatInterface = ({ onClose, sendMessage, fetchMessages, sessions, balance, initialSession }) => {
  const [activeSession, setActiveSession] = useState(initialSession || null);
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
  }, [activeSession]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeSession) return;
    await sendMessage(activeSession.id, inputText);
    setInputText('');
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="modal-overlay" style={{ background: 'white' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #E5E5EA', display: 'flex', alignItems: 'center', gap: '15px', background: 'white' }}>
          <button onClick={() => activeSession ? setActiveSession(null) : onClose()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}>
            <X size={24} color="#1C1C1E" />
          </button>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{activeSession ? activeSession.participant : 'Hustle Chat'}</h3>
        </div>

        {!activeSession ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', opacity: 0.5 }}>
                <div style={{ width: '80px', height: '80px', background: '#F2F2F7', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <MessageSquare size={40} color="#8E8E93" />
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1C1C1E' }}>No messages yet</p>
                <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Chat with posters or seekers after accepting a quest.</p>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} onClick={() => setActiveSession(session)} style={{ display: 'flex', gap: '15px', padding: '1.2rem', background: 'white', borderRadius: '24px', marginBottom: '12px', border: '1px solid #F2F2F7', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '18px', background: 'linear-gradient(135deg, #E5E5EA 0%, #D1D1D6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={28} color="white" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.95rem', fontWeight: 800 }}>{session.participant}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#8E8E93', fontWeight: 600 }}>{new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#8E8E93', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{session.lastMessage}</p>
                  </div>
                  <ChevronRight size={18} color="#C7C7CC" style={{ alignSelf: 'center' }} />
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#F9F9FB', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ alignSelf: msg.sender === 'Me' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ 
                    padding: '14px 18px', 
                    borderRadius: msg.sender === 'Me' ? '22px 22px 4px 22px' : '22px 22px 22px 4px', 
                    background: msg.sender === 'Me' ? '#00A550' : 'white', 
                    color: msg.sender === 'Me' ? 'white' : '#1C1C1E',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '0.95rem',
                    lineHeight: '1.4',
                    fontWeight: 500
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#8E8E93', marginTop: '6px', textAlign: msg.sender === 'Me' ? 'right' : 'left', fontWeight: 700, textTransform: 'uppercase' }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1.2rem', borderTop: '1px solid #E5E5EA', background: 'white', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, background: '#F2F2F7', borderRadius: '28px', padding: '4px 15px', display: 'flex', alignItems: 'center' }}>
                <input 
                  value={inputText} 
                  onChange={e => setInputText(e.target.value)} 
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Send a message..." 
                  style={{ flex: 1, padding: '0.8rem 0', background: 'transparent', border: 'none', outline: 'none', fontSize: '1rem' }} 
                />
              </div>
              <button onClick={handleSend} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#00A550', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,165,80,0.3)', cursor: 'pointer' }}>
                <Navigation size={20} style={{ transform: 'rotate(90deg)' }} />
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const TopUpModal = ({ onClose, onTopUp }) => {
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('BIBD');
  const [loading, setLoading] = useState(false);

  const banks = [
    { name: 'BIBD', color: '#821a1a', icon: '🏦' },
    { name: 'Baiduri', color: '#1e3a8a', icon: '🏛️' },
    { name: 'Standard Chartered', color: '#059669', icon: '🌍' },
    { name: 'Tarus Pay', color: '#00A550', icon: '⚡' }
  ];

  const handleConfirm = async () => {
    if (!amount) return;
    setLoading(true);
    await onTopUp(parseFloat(amount), '8123456');
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Top Up Wallet</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Select Bank Source</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {banks.map(b => (
              <div 
                key={b.name} 
                onClick={() => setBank(b.name)}
                style={{ 
                  padding: '1.2rem', 
                  borderRadius: '20px', 
                  border: '2px solid', 
                  borderColor: bank === b.name ? b.color : '#F2F2F7',
                  background: bank === b.name ? `${b.color}08` : 'white',
                  cursor: 'pointer',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{b.icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: bank === b.name ? b.color : '#1C1C1E' }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Amount (BND)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, fontSize: '1.2rem', color: '#1C1C1E' }}>$</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 2.5rem', borderRadius: '20px', border: '2px solid #F2F2F7', fontSize: '1.2rem', fontWeight: 700, outline: 'none' }} 
            />
          </div>
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '22px' }} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing...' : `Top Up via ${bank}`}
        </button>
      </motion.div>
    </div>
  );
};

const WithdrawModal = ({ onClose, onWithdraw, balance }) => {
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('BIBD');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!amount || !account) return;
    if (parseFloat(amount) > balance) {
      alert('Insufficient balance');
      return;
    }
    setLoading(true);
    await onWithdraw({ amount: parseFloat(amount), bank, account });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Withdraw Funds</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Select Destination Bank</label>
          <select 
            value={bank} 
            onChange={e => setBank(e.target.value)} 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', background: 'white', fontWeight: 600, outline: 'none' }}
          >
            <option>BIBD</option>
            <option>Baiduri</option>
            <option>Standard Chartered</option>
            <option>Perbadanan TAIB</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Account Number</label>
          <input 
            type="text" 
            placeholder="e.g. 00-001-01-1234567" 
            value={account} 
            onChange={e => setAccount(e.target.value)} 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} 
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Withdrawal Amount</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900 }}>BND</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '20px', border: '2px solid #F2F2F7', fontSize: '1.2rem', fontWeight: 700, outline: 'none' }} 
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '8px', fontWeight: 600 }}>Available: BND {balance.toFixed(2)}</p>
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '22px', background: 'linear-gradient(135deg, #1C1C1E 0%, #000 100%)' }} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing Withdrawal...' : 'Confirm Withdrawal'}
        </button>
      </motion.div>
    </div>
  );
};

const PostQuestModal = ({ onClose, onPost }) => {
  const [formData, setFormData] = useState({ title: '', reward: '', duration: '', unit: 'Hours' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.reward || !formData.duration) return;
    setLoading(true);
    await onPost({
      title: formData.title,
      reward: formData.reward,
      duration: `${formData.duration} ${formData.unit}`,
      coords: [4.8903 + Math.random()*0.02, 114.9401 + Math.random()*0.02]
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Post a Quest</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Quest Title</label>
          <input 
            type="text" 
            placeholder="e.g. Grass Cutting, Package Delivery" 
            value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })} 
            style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none', transition: '0.2s' }} 
            onFocus={e => e.target.style.borderColor = '#00A550'}
            onBlur={e => e.target.style.borderColor = '#F2F2F7'}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Reward (BND)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700 }}>$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={formData.reward} 
                onChange={e => setFormData({ ...formData, reward: e.target.value })} 
                style={{ width: '100%', padding: '1rem 1rem 1rem 2rem', borderRadius: '16px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} 
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Duration</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="1" 
                value={formData.duration} 
                onChange={e => setFormData({ ...formData, duration: e.target.value })} 
                style={{ flex: 1, padding: '1rem', borderRadius: '16px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} 
              />
              <select 
                value={formData.unit} 
                onChange={e => setFormData({ ...formData, unit: e.target.value })} 
                style={{ borderRadius: '16px', border: '2px solid #F2F2F7', padding: '0 10px', background: 'white' }}
              >
                <option>Mins</option>
                <option>Hours</option>
                <option>Days</option>
              </select>
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', borderRadius: '18px' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Confirm & Post Quest'}
        </button>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const { 
    balance, walletInfo, jobs, transactions, escrow, loading, chatSessions,
    acceptJob, completeJob, releaseFunds, topUp, postJob, sendMessage, fetchMessages, withdraw, signup, login 
  } = usePayment();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // Auth Form State
  const [authData, setAuthData] = useState({ name: '', phone: '', pin: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [portal, setPortal] = useState('seeker'); 
  const [view, setView] = useState('home'); 
  const [showPostModal, setShowPostModal] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [initialChatSession, setInitialChatSession] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5);

  const mapInstanceRef = useRef(null);
  
  const handleLocate = (job) => {
    setView('home');
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(job.coords || [4.8903, 114.9401], 17, {
          duration: 1.5,
          easeLinearity: 0.25
        });
        // Open the popup automatically
        mapInstanceRef.current.eachLayer(layer => {
          if (layer instanceof L.Marker && layer.getLatLng().lat === (job.coords?.[0] || 4.8903)) {
            layer.openPopup();
          }
        });
      }
    }, 300);
  };
  
  if (loading) return <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F2F2F7' }}>
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
      <Zap size={48} color="#00A550" />
    </motion.div>
    <p style={{ marginTop: '20px', fontWeight: 700, color: '#1C1C1E' }}>Initializing SideQuest...</p>
  </div>;

  if (!isLoggedIn) return (
    <div className="app-container" style={{ background: 'white' }}>
      <div className="login-header" style={{ height: '40vh', background: 'linear-gradient(135deg, #00A550 0%, #008741 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', borderBottomLeftRadius: '40px', borderBottomRightRadius: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Zap size={50} color="white" />
          </div>
        </motion.div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '2rem', letterSpacing: '-1px' }}>SideQuest.BN</h1>
        <p style={{ opacity: 0.9, fontWeight: 500 }}>Secure Hustle. Instant Payouts.</p>
      </div>
      
      <AnimatePresence mode="wait">
        {!isSigningUp ? (
          <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: '#8E8E93', marginBottom: '2rem', fontWeight: 500 }}>Login to your hustle account</p>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Phone Number</label>
              <input type="text" value={authData.phone} onChange={e => setAuthData({...authData, phone: e.target.value})} placeholder="+673 8XXX XXX" style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Security PIN</label>
              <input type="password" value={authData.pin} onChange={e => setAuthData({...authData, pin: e.target.value})} placeholder="••••••" style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} />
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,165,80,0.2)' }} onClick={async () => {
              setAuthLoading(true);
              const res = await login({ phone: authData.phone, pin: authData.pin });
              if (res.success) setIsLoggedIn(true);
              else alert('Login failed. Check your phone number.');
              setAuthLoading(false);
            }} disabled={authLoading}>{authLoading ? 'Verifying...' : 'Log In Securely'}</button>
            <p style={{ textAlign: 'center', marginTop: '2rem', color: '#8E8E93', fontSize: '0.9rem' }}>Don't have an account? <span onClick={() => setIsSigningUp(true)} style={{ color: '#00A550', fontWeight: 800, cursor: 'pointer' }}>Join the Hustle</span></p>
          </motion.div>
        ) : (
          <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Create Account</h2>
            <p style={{ color: '#8E8E93', marginBottom: '2rem', fontWeight: 500 }}>Start your journey with SideQuest</p>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Full Name</label>
              <input type="text" value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} placeholder="e.g. Ali Abu" style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Phone Number</label>
              <input type="text" value={authData.phone} onChange={e => setAuthData({...authData, phone: e.target.value})} placeholder="+673 8XXX XXX" style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Set Security PIN</label>
              <input type="password" value={authData.pin} onChange={e => setAuthData({...authData, pin: e.target.value})} placeholder="••••••" style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} />
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,165,80,0.2)' }} onClick={async () => {
              setAuthLoading(true);
              const res = await signup(authData);
              if (res.success) setIsLoggedIn(true);
              setAuthLoading(false);
            }} disabled={authLoading}>{authLoading ? 'Creating...' : 'Create My Account'}</button>
            <p style={{ textAlign: 'center', marginTop: '2rem', color: '#8E8E93', fontSize: '0.9rem' }}>Already have an account? <span onClick={() => setIsSigningUp(false)} style={{ color: '#00A550', fontWeight: 800, cursor: 'pointer' }}>Sign In</span></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="app-container">
      <div className="app-content">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', position: 'relative' }}>
              <MapView jobs={jobs} onAccept={acceptJob} mapInstanceRef={mapInstanceRef} searchRadius={searchRadius} />

              {/* Radius & Portal Control */}
              <div style={{ position: 'absolute', top: '75px', left: '1rem', right: '1rem', zIndex: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <Radius size={14} color="#00A550" />
                    <select value={searchRadius} onChange={e => setSearchRadius(parseInt(e.target.value))} style={{ border: 'none', fontSize: '0.8rem', fontWeight: 800, color: '#1C1C1E', outline: 'none', background: 'transparent' }}>
                       <option value={2}>2km</option>
                       <option value={5}>5km</option>
                       <option value={10}>10km</option>
                       <option value={20}>20km</option>
                    </select>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '4px', borderRadius: '30px', display: 'flex', gap: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <button onClick={() => setPortal('seeker')} style={{ padding: '8px 16px', borderRadius: '24px', fontSize: '0.7rem', fontWeight: 800, transition: '0.3s', background: portal === 'seeker' ? '#00A550' : 'transparent', color: portal === 'seeker' ? 'white' : '#8E8E93' }}>SEEKER</button>
                    <button onClick={() => setPortal('poster')} style={{ padding: '8px 16px', borderRadius: '24px', fontSize: '0.7rem', fontWeight: 800, transition: '0.3s', background: portal === 'poster' ? '#FF9500' : 'transparent', color: portal === 'poster' ? 'white' : '#8E8E93' }}>POSTER</button>
                 </div>
              </div>

              {/* Map Bottom Panel */}
              <div className="map-bottom-panel" style={{ bottom: '90px', padding: '1.5rem' }}>
                <div className="map-handle"></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: '#8E8E93', fontWeight: 600 }}>Available Funds</p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: portal === 'seeker' ? '#00A550' : '#FF9500', letterSpacing: '-1px' }}>BND {balance.toFixed(2)}</h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: portal === 'seeker' ? 'rgba(0,165,80,0.1)' : 'rgba(255,149,0,0.1)', color: portal === 'seeker' ? '#00A550' : '#FF9500', padding: '6px 12px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {portal} Mode
                    </div>
                  </div>
                </div>

                <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div className="action-card" onClick={() => setShowPostModal(true)}>
                    <div className="action-icon" style={{ background: portal === 'seeker' ? 'rgba(0,165,80,0.1)' : 'rgba(255,149,0,0.1)', color: portal === 'seeker' ? '#00A550' : '#FF9500' }}><PlusCircle size={24}/></div>
                    <span>Post</span>
                  </div>
                  <div className="action-card" onClick={() => setShowChat(true)}>
                    <div className="action-icon" style={{ background: 'rgba(0,122,255,0.1)', color: '#007AFF' }}><MessageSquare size={24}/></div>
                    <span>Chat</span>
                  </div>
                  <div className="action-card" onClick={() => setView('activity')}>
                    <div className="action-icon" style={{ background: 'rgba(175,82,222,0.1)', color: '#AF52DE' }}><ClipboardCheck size={24}/></div>
                    <span>Tasks</span>
                  </div>
                  <div className="action-card" onClick={() => setShowWallet(true)}>
                    <div className="action-icon" style={{ background: 'rgba(255,149,0,0.1)', color: '#FF9500' }}><CreditCard size={24}/></div>
                    <span>Wallet</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'activity' && (
            <motion.div key="activity" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
               <div style={{ padding: '1.5rem', background: 'white', borderBottom: '1px solid #F2F2F7', textAlign: 'center' }}>
                 <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Your Activity</h2>
               </div>
               <div style={{ padding: '1.5rem' }}>
                  {jobs.filter(j => j.status !== 'open' || escrow[j.id]).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.5 }}>
                      <ClipboardList size={48} style={{ marginBottom: '1rem' }} />
                      <p>No active quests found.</p>
                    </div>
                  ) : (
                    jobs.filter(j => j.status !== 'open' || escrow[j.id]).map(job => (
                      <div key={job.id} style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', marginBottom: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #F2F2F7' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                           <div>
                             <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{job.title}</h4>
                             <p style={{ fontSize: '0.8rem', color: '#8E8E93', marginTop: '4px' }}><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {job.duration}</p>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                             <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#00A550' }}>BND {job.reward}</p>
                             <div style={{ fontSize: '0.6rem', fontWeight: 800, background: '#F2F2F7', padding: '4px 8px', borderRadius: '8px', display: 'inline-block', marginTop: '6px' }}>{job.status.toUpperCase()}</div>
                           </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1.2rem' }}>
                           <button className="btn-outline" style={{ fontSize: '0.8rem', borderRadius: '14px', padding: '10px' }} onClick={() => handleLocate(job)}><Maximize2 size={16}/> Locate</button>
                           <button className="btn-outline" style={{ fontSize: '0.8rem', borderRadius: '14px', padding: '10px' }} onClick={() => { setInitialChatSession(chatSessions.find(s => s.id === job.id) || { id: job.id, participant: job.payer === 'Me' ? 'Worker' : job.payer }); setShowChat(true); }}><MessageSquare size={16}/> Chat</button>
                        </div>
                        {job.status === 'assigned' && <button className="btn-primary" style={{ width: '100%', marginTop: '10px', borderRadius: '14px' }} onClick={() => completeJob(job.id)}>Submit Proof of Work</button>}
                        {job.status === 'completed' && escrow[job.id]?.status === 'PROOF_SUBMITTED' && <AutoReleaseTimer jobId={job.id} proofTime={escrow[job.id].proofTime} releaseFunds={releaseFunds} />}
                      </div>
                    ))
                  )}
               </div>
            </motion.div>
          )}

          {view === 'account' && (
            <motion.div key="account" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}>
               <div className="account-header" style={{ padding: '3rem 1.5rem 5rem' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '35px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}><User size={50} color="#00A550" /></div>
                  </motion.div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{walletInfo.holder}</h2>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 600 }}><ShieldCheck size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Verified SideQuest Partner</p>
               </div>
               <div className="wallet-card" style={{ margin: '-3.5rem 1.5rem 1.5rem', padding: '2rem', borderRadius: '28px', background: 'white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Balance</p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#00A550', letterSpacing: '-1px' }}>BND {balance.toFixed(2)}</h2>
                  </div>
                  <button className="btn-primary" style={{ width: '60px', height: '60px', borderRadius: '20px' }} onClick={() => setShowWallet(true)}><CreditCard size={24}/></button>
               </div>
               <div style={{ padding: '0 1.5rem' }}>
                 <div className="menu-item" style={{ background: 'white', padding: '1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #F2F2F7', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setShowTopUp(true)}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,165,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUpCircle color="#00A550" /></div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>Top Up Wallet</strong>
                      <span style={{ fontSize: '0.75rem', color: '#8E8E93' }}>Instant credit from BIBD/Baiduri</span>
                    </div>
                    <ChevronRight size={18} color="#C7C7CC" />
                 </div>
                 <div className="menu-item" style={{ background: 'white', padding: '1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #F2F2F7', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setIsLoggedIn(false)}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,59,48,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogOut color="#FF3B30" /></div>
                    <strong style={{ flex: 1, color: '#FF3B30' }}>Sign Out</strong>
                    <ChevronRight size={18} color="#C7C7CC" />
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="bottom-nav">
        <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}><MapIcon size={24}/><span>Map</span></div>
        <div className={`nav-item ${view === 'activity' ? 'active' : ''}`} onClick={() => setView('activity')}><ClipboardCheck size={24}/><span>Activity</span></div>
        <div className={`nav-item ${view === 'account' ? 'active' : ''}`} onClick={() => setView('account')}><User size={24}/><span>Account</span></div>
      </nav>

      {/* MODALS */}
      <AnimatePresence>
         {showChat && (
          <ChatInterface 
            onClose={() => { setShowChat(false); setInitialChatSession(null); }} 
            sendMessage={sendMessage} 
            fetchMessages={fetchMessages} 
            sessions={chatSessions} 
            balance={balance} 
            initialSession={initialChatSession}
          />
        )}

        {showTopUp && (
          <TopUpModal onClose={() => setShowTopUp(false)} onTopUp={topUp} />
        )}

        {showPostModal && (
          <PostQuestModal onClose={() => setShowPostModal(false)} onPost={postJob} />
        )}

        {showWallet && (
          <div className="modal-overlay" onClick={() => setShowWallet(false)}>
            <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Virtual Card</h3>
                 <X onClick={() => setShowWallet(false)} style={{ cursor: 'pointer' }} />
               </div>
               <motion.div whileHover={{ scale: 1.02 }} style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', padding: '2rem', color: 'white', aspectRatio: '1.58/1', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.2rem' }}><Zap size={24} fill="white"/> SideQuest</div>
                  <div style={{ width: '45px', height: '35px', background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)', borderRadius: '8px' }}></div>
                </div>
                <div style={{ margin: '3rem 0 1rem', fontFamily: 'monospace', fontSize: '1.5rem', letterSpacing: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{walletInfo.cardNumber}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  <div><p style={{ fontSize: '0.6rem', marginBottom: '4px' }}>Card Holder</p><strong>{walletInfo.holder}</strong></div>
                  <div style={{ textAlign: 'right' }}><p style={{ fontSize: '0.6rem', marginBottom: '4px' }}>Expires</p><strong>12/28</strong></div>
                </div>
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
              </motion.div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '15px' }}>
                <button className="btn-primary" style={{ flex: 1, borderRadius: '18px', background: '#007AFF' }} onClick={() => { setShowWallet(false); setShowWithdraw(true); }}><ArrowDownCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Withdraw</button>
                <button className="btn-outline" style={{ flex: 1, borderRadius: '18px' }} onClick={() => alert('Card settings coming soon!')}><Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Settings</button>
              </div>
            </motion.div>
          </div>
        )}

        {showWithdraw && (
          <WithdrawModal onClose={() => setShowWithdraw(false)} onWithdraw={withdraw} balance={balance} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
