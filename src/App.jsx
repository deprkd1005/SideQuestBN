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
  Radius,
  FileText,
  BarChart,
  Briefcase,
  FileSearch,
  LayoutDashboard,
  Users,
  ChevronLeft
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

const MapView = ({ jobs, onAccept, mapInstanceRef, searchRadius, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.L || !mapRef.current) return;
    
    const center = userLocation || [4.8903, 114.9401];
    const map = L.map(mapRef.current, { zoomControl: false }).setView(center, 13);
    mapInstanceRef.current = map;
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

    // Add User Location Marker (Accurate)
    L.circleMarker(center, { color: '#007AFF', fillColor: '#007AFF', fillOpacity: 0.8, radius: 8 }).addTo(map);
    
    // Add Radius Circle
    L.circle(center, {
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
      const marker = L.marker(job.coords).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Outfit', sans-serif; padding:8px; min-width:150px;">
          <strong style="color:${color}; font-size:1rem; display:block; margin-bottom:4px;">${job.title}</strong>
          <div style="font-weight:900; font-size:1.1rem; margin-bottom:4px;">BND ${job.reward}</div>
          <p style="font-size:0.75rem; color:#8E8E93; margin-bottom:2px;"><i class="lucide-briefcase" style="font-size:10px;"></i> ${job.category}</p>
          <p style="font-size:0.75rem; color:#8E8E93; margin-bottom:8px;"><i class="lucide-map-pin" style="font-size:10px;"></i> ${job.mukim}, ${job.district}</p>
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
  }, [jobs, searchRadius, userLocation]);

  return <div ref={mapRef} id="map-container"></div>;
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
  const [successTx, setSuccessTx] = useState(null);

  const banks = [
    { name: 'BIBD', label: 'BIBD QuickPay', color: '#821a1a', icon: '🏦' },
    { name: 'Baiduri', label: 'Baiduri Digital', color: '#1e3a8a', icon: '🏛️' },
    { name: 'BruPay', label: 'BruPay Wallet', color: '#00A550', icon: '⚡' }
  ];

  const handleConfirm = async () => {
    if (!amount) return;
    setLoading(true);
    const res = await onTopUp(parseFloat(amount), bank);
    setLoading(false);
    if (res.success) {
      setSuccessTx(res.txHash);
      setTimeout(() => onClose(), 2500);
    } else {
      alert("Payment Failed");
    }
  };

  if (successTx) return (
    <div className="modal-overlay">
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <CheckCircle2 size={60} color="#00A550" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00A550' }}>Top-up Successful</h3>
        <p style={{ color: '#8E8E93', marginTop: '10px' }}>Funds added instantly via {bank}</p>
        <p style={{ fontSize: '0.7rem', color: '#C7C7CC', marginTop: '1rem', fontFamily: 'monospace' }}>TxHash: {successTx.substring(0, 24)}...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Top Up Wallet</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Select Method</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {banks.map(b => (
              <div 
                key={b.name} 
                onClick={() => setBank(b.name)}
                style={{ 
                  padding: '1rem', borderRadius: '18px', border: '2px solid', 
                  borderColor: bank === b.name ? b.color : '#F2F2F7',
                  background: bank === b.name ? `${b.color}08` : 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{b.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: bank === b.name ? b.color : '#1C1C1E' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Amount (BND)</label>
          <input 
            type="number" placeholder="0.00" value={amount} 
            onChange={e => setAmount(e.target.value)} 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #F2F2F7', fontSize: '1.2rem', fontWeight: 700, outline: 'none' }} 
          />
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '22px' }} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing...' : `Confirm Payment`}
        </button>
      </motion.div>
    </div>
  );
};

const WithdrawModal = ({ onClose, onWithdraw, balance }) => {
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('BIBD');
  const [account, setAccount] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [successTx, setSuccessTx] = useState(null);

  const handleConfirm = async () => {
    if (!amount || !account || !twoFactorCode) return;
    if (parseFloat(amount) > balance) {
      alert('Insufficient balance');
      return;
    }
    setLoading(true);
    const res = await onWithdraw({ amount: parseFloat(amount), bank, account, twoFactorCode });
    setLoading(false);
    
    if (res.success) {
      setSuccessTx(res.txHash);
      setTimeout(() => {
        onClose();
      }, 2500);
    } else {
      alert(res.error || "Withdrawal failed");
    }
  };

  if (successTx) return (
    <div className="modal-overlay">
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <CheckCircle2 size={60} color="#00A550" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00A550' }}>BruPay Payout Successful</h3>
        <p style={{ color: '#8E8E93', marginTop: '10px' }}>Instant Payout directly to your Bank Account</p>
        <p style={{ fontSize: '0.7rem', color: '#C7C7CC', marginTop: '1rem', fontFamily: 'monospace' }}>TxHash: {successTx.substring(0, 24)}...</p>
      </motion.div>
    </div>
  );

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

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00A550', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}><ShieldCheck size={14} style={{display:'inline', verticalAlign:'middle'}}/> BDCB 2FA Verification</label>
          <input 
            type="password" 
            placeholder="Enter 6-Digit SMS Code" 
            value={twoFactorCode} 
            onChange={e => setTwoFactorCode(e.target.value)} 
            maxLength={6}
            style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', border: '2px solid #00A550', fontSize: '1.2rem', outline: 'none', letterSpacing: '4px', textAlign: 'center' }} 
          />
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '22px', background: 'linear-gradient(135deg, #1C1C1E 0%, #000 100%)' }} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing Withdrawal...' : 'Confirm Withdrawal'}
        </button>
      </motion.div>
    </div>
  );
};

const PostQuestModal = ({ onClose, onPost, userLocation }) => {
  const [formData, setFormData] = useState({ title: '', category: 'General', district: 'Brunei-Muara', mukim: 'Gadong A', reward: '', duration: '', unit: 'Hours' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.reward || !formData.duration) return;
    setLoading(true);
    await onPost({
      ...formData,
      reward: parseFloat(formData.reward),
      duration: `${formData.duration} ${formData.unit}`,
      coords: userLocation || [4.8903, 114.9401]
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" style={{ maxHeight: '90vh', overflowY: 'auto' }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Post a Quest</h3>
          <X onClick={onClose} style={{ cursor: 'pointer' }} />
        </div>
        
        <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#F2F2F7', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <MapPin size={18} color="#00A550" />
           <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#8E8E93' }}>LOCATION ACCURACY</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Using your current precise location</p>
           </div>
           <CheckCircle size={18} color="#00A550" />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8E8E93', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Quest Title</label>
          <input 
            type="text" placeholder="e.g. Grass Cutting, Legal Consult" value={formData.title} 
            onChange={e => setFormData({ ...formData, title: e.target.value })} 
            style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '2px solid #F2F2F7', fontSize: '1rem', outline: 'none' }} 
          />
        </div>
...
        <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem', borderRadius: '18px' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Confirm & Post Quest'}
        </button>
      </motion.div>
    </div>
  );
};

// --- EXPANDABLE MAP FAB ---

const MAP_ACTIONS = [
  { id: 'post',   label: 'Post',   icon: PlusCircle,    color: '#00A550', bg: 'rgba(0,165,80,0.12)',   offset: { x: -70, y: -10 } },
  { id: 'chat',   label: 'Chat',   icon: MessageSquare, color: '#007AFF', bg: 'rgba(0,122,255,0.12)', offset: { x: -55, y: -65 } },
  { id: 'tasks',  label: 'Tasks',  icon: ClipboardCheck,color: '#AF52DE', bg: 'rgba(175,82,222,0.12)',offset: { x: -10, y: -90 } },
  { id: 'wallet', label: 'Wallet', icon: CreditCard,     color: '#FF9500', bg: 'rgba(255,149,0,0.12)', offset: { x: 45,  y: -65 } },
];

const MapFab = ({ onPost, onChat, onTasks, onWallet, portal }) => {
  const [open, setOpen] = useState(false);
  const handlers = { post: onPost, chat: onChat, tasks: onTasks, wallet: onWallet };

  const mainColor = portal === 'poster' ? '#FF9500' : '#00A550';
  const mainShadow = portal === 'poster' ? 'rgba(255,149,0,0.4)' : 'rgba(0,165,80,0.4)';

  return (
    <div style={{ position: 'absolute', bottom: '95px', right: '1rem', zIndex: 700 }}>
      {/* Sub-action buttons */}
      <AnimatePresence>
        {open && MAP_ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{ opacity: 1, x: action.offset.x, y: action.offset.y, scale: 1 }}
              exit={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25, delay: i * 0.04 }}
              style={{ position: 'absolute', bottom: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              onClick={() => { handlers[action.id](); setOpen(false); }}
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                style={{ width: '50px', height: '50px', background: 'white', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.14)', border: `2px solid ${action.bg.replace('0.12', '0.3')}` }}
              >
                <Icon size={22} color={action.color} />
              </motion.div>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'white', background: 'rgba(0,0,0,0.55)', padding: '2px 7px', borderRadius: '8px', backdropFilter: 'blur(6px)', whiteSpace: 'nowrap' }}>{action.label}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Tap-away backdrop */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1 }} onClick={() => setOpen(false)} />
      )}

      {/* Main FAB */}
      <motion.div
        onClick={() => setOpen(o => !o)}
        animate={{ rotate: open ? 45 : 0, background: open ? '#1C1C1E' : mainColor }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        whileTap={{ scale: 0.9 }}
        style={{ width: '58px', height: '58px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 12px 28px ${open ? 'rgba(0,0,0,0.3)' : mainShadow}` }}
      >
        <Plus size={28} color="white" strokeWidth={2.5} />
      </motion.div>
    </div>
  );
};

// --- POSTER DASHBOARD ---
const PosterDashboard = ({ jobs, balance, onPost, onLocate, onViewActivity, user }) => {
  const postedJobs = jobs.filter(j => j.payer === user?.name || j.payer === 'Me');
  
  return (
    <div style={{ padding: '0.5rem' }}>
       {/* Header Stats */}
       <div style={{ background: 'linear-gradient(135deg, #FF9F0A 0%, #FF5E00 100%)', padding: '2.5rem', borderRadius: '32px', color: 'white', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(255,159,10,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '180px', height: '180px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <p style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px' }}>Account Liquidity</p>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginTop: '5px', letterSpacing: '-1.5px' }}>BND {balance.toFixed(2)}</h2>
          <div style={{ display: 'flex', gap: '12px', marginTop: '2rem' }}>
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onPost} className="btn-primary" style={{ background: 'white', color: '#FF9F0A', boxShadow: 'none' }}>
                <Plus size={20}/> New Deployment
             </motion.button>
             <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', boxShadow: 'none' }}>Analytics</button>
          </div>
       </div>

       {/* Grid Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '2.5rem' }}>
          {[
            { label: 'Active Quests', val: postedJobs.filter(j => j.status !== 'finished').length, icon: <Zap size={18} color="#FF9F0A"/> },
            { label: 'Capital Deployed', val: `BND ${postedJobs.reduce((acc, curr) => acc + curr.reward, 0)}`, icon: <CreditCard size={18} color="#FF9F0A"/> },
            { label: 'Completion Rate', val: '94%', icon: <CheckCircle size={18} color="#FF9F0A"/> }
          ].map((m, i) => (
            <div key={i} className="premium-card" style={{ padding: '1.5rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  {m.icon}
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{m.label}</span>
               </div>
               <h4 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{m.val}</h4>
            </div>
          ))}
       </div>

       {/* Management Console Section */}
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Management Console</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Track and optimize your active deployments</p>
          </div>
          <button onClick={onViewActivity} style={{ background: 'none', border: 'none', color: '#FF9F0A', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Global View</button>
       </div>

       <div style={{ display: 'grid', gap: '15px' }}>
          {postedJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: '32px', border: '2px dashed #E2E8F0' }}>
               <ClipboardList size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
               <p style={{ fontWeight: 700, color: '#64748B' }}>System Ready for Deployment</p>
            </div>
          ) : (
            postedJobs.map(job => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={job.id} className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                 <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(255,159,10,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Briefcase color="#FF9F0A" size={24} />
                 </div>
                 <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <strong style={{ fontSize: '1rem', fontWeight: 800 }}>{job.title}</strong>
                       <span style={{ fontSize: '0.6rem', padding: '3px 8px', background: '#F1F5F9', borderRadius: '6px', fontWeight: 800, color: '#64748B' }}>{job.status.toUpperCase()}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>ID: {job.id.toUpperCase()} · Distributed in {job.mukim}</span>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <strong style={{ display: 'block', fontSize: '1.1rem', fontWeight: 900, color: '#FF9F0A' }}>BND {job.reward}</strong>
                    <button onClick={() => onLocate(job)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', marginTop: '4px' }}><Maximize2 size={18}/></button>
                 </div>
              </motion.div>
            ))
          )}
       </div>
    </div>
  );
};

// --- ADMIN PORTAL ---
const AdminPortal = ({ getAdminUsers, getSystemHealth, verifyUser }) => {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const u = await getAdminUsers();
      const h = await getSystemHealth();
      setUsers(u);
      setHealth(h);
      setLoading(false);
    };
    init();
  }, []);

  const handleVerify = async (id) => {
    const res = await verifyUser(id);
    if (res.success) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, bruVerified: true } : u));
    }
  };

  if (loading) return <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap className="animate-pulse-soft" color="#334155" size={40}/></div>;

  return (
    <div style={{ padding: '0.5rem' }}>
       <div style={{ background: '#1E293B', padding: '2.5rem', borderRadius: '32px', color: 'white', marginBottom: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Command Center</h2>
               <p style={{ opacity: 0.6, fontWeight: 500, fontSize: '0.9rem' }}>Platform Integrity & System Health</p>
            </div>
            <div style={{ background: 'rgba(0,168,107,0.2)', color: '#10B981', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 900 }}>SYSTEM NOMINAL</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '2.5rem' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase' }}>Escrow Liquidity</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '5px' }}>BND {health.escrowTotal}</h4>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase' }}>Uptime</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '5px' }}>{health.uptime}</h4>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase' }}>Active Nodes</p>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '5px' }}>{health.activeUsers}</h4>
             </div>
          </div>
       </div>

       <div style={{ background: 'white', borderRadius: '32px', padding: '2rem', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Identity Verification Queue</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
             {users.map(u => (
               <div key={u.id} style={{ padding: '1.2rem', borderRadius: '20px', background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}><User color="#64748B" size={20}/></div>
                  <div style={{ flex: 1 }}>
                     <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800 }}>{u.name}</strong>
                     <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>{u.role} · IC: {u.icColor} #{u.id.toUpperCase()}</span>
                  </div>
                  {!u.bruVerified ? (
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.75rem' }} onClick={() => handleVerify(u.id)}>Approve Identity</motion.button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00A86B', fontWeight: 800, fontSize: '0.8rem' }}><CheckCircle size={18}/> VERIFIED</div>
                  )}
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const App = () => {
  const { 
    user, balance, walletInfo, jobs, transactions, escrow, loading, chatSessions, impactStats, userLocation, setUserLocation,
    topUp, postJob, acceptJob, completeJob, releaseFunds, withdraw, sendMessage, fetchMessages, signup, login, fetchImpactStats, 
    setRole, getAdminUsers, getSystemHealth, verifyUser
  } = usePayment();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  const [authData, setAuthData] = useState({ name: '', phone: '', pin: '', kycType: 'GeneralWorker', icColor: 'Yellow', icNumber: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [portal, setPortal] = useState('seeker'); 
  const [view, setView] = useState('home'); 
  const [showPostModal, setShowPostModal] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [initialChatSession, setInitialChatSession] = useState(null);
  const [searchRadius, setSearchRadius] = useState(20);

  const mapInstanceRef = useRef(null);

  // Accurate Geolocation Initialization
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, [setUserLocation]);
  
  const handleLocate = (job) => {
    setView('home');
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo(job.coords || [4.8903, 114.9401], 17, { duration: 1.5 });
        mapInstanceRef.current.eachLayer(layer => {
          if (layer instanceof L.Marker && layer.getLatLng().lat === job.coords[0]) layer.openPopup();
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

  if (!isLoggedIn) {
    const portals = [
      { id: 'SEEKER', title: 'Hustler', desc: 'Find quests and earn BND.', icon: <MapPin size={24}/>, color: '#00A550' },
      { id: 'POSTER', title: 'Client', desc: 'Post quests and get help.', icon: <PlusCircle size={24}/>, color: '#FF9500' },
      { id: 'ADMIN', title: 'Admin', desc: 'System monitoring & KYC.', icon: <ShieldCheck size={24}/>, color: '#1C1C1E' }
    ];

    return (
      <div className="login-view">
        {/* Left: Brand Section */}
        <div className="login-brand" style={{ background: 'linear-gradient(135deg, #00A86B 0%, #008F5B 100%)' }}>
           <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                 <Zap size={50} color="white" />
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>SideQuest.BN</h1>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, opacity: 0.9, marginTop: '10px' }}>The Premier Gig Economy of Brunei</p>
              <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.15)', padding: '8px 20px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 800 }}>PROTOTYPE DEMO V2.0</div>
           </motion.div>
        </div>

        {/* Right: Auth Section */}
        <div className="login-form-container">
          <AnimatePresence mode="wait">
            {!isSigningUp ? (
              <motion.div key="login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="auth-card">
                 <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Onboarding</h2>
                 <p style={{ color: '#64748B', fontWeight: 500, marginBottom: '2rem' }}>Choose your demo role to begin.</p>

                 {/* Premium Quick Access Grid */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '2.5rem' }}>
                    {portals.map(btn => (
                      <motion.div
                        key={btn.id}
                        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          setAuthLoading(true);
                          const phone = btn.id === 'ADMIN' ? '999' : (btn.id === 'POSTER' ? '+673819498' : '+673819498');
                          setAuthData(prev => ({ ...prev, role: btn.id, phone: phone }));
                          const res = await login({ phone: phone, pin: '12345678', role: btn.id });
                          if (res.success) setIsLoggedIn(true);
                          setAuthLoading(false);
                        }}
                        style={{ background: 'white', border: '1.5px solid #E2E8F0', padding: '20px 10px', borderRadius: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.3s' }}
                      >
                         <div style={{ width: '40px', height: '40px', background: `${btn.color}10`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: btn.color }}>
                            {btn.icon}
                         </div>
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0F172A' }}>{btn.title}</span>
                      </motion.div>
                    ))}
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                    <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94A3B8' }}>MANUAL ENTRY</span>
                    <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }}></div>
                 </div>

                 <div className="input-group">
                    <label>Access Code / Phone</label>
                    <input type="text" placeholder="+673 •••• ••••" value={authData.phone} onChange={e => setAuthData({...authData, phone: e.target.value})} />
                 </div>
                 
                 <button className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '20px', background: '#0F172A', marginTop: '10px' }} onClick={() => setIsLoggedIn(true)}>
                    System Access <ChevronRight size={18} />
                 </button>

                 <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748B' }}>
                    New operative? <span onClick={() => setIsSigningUp(true)} style={{ color: '#00A86B', cursor: 'pointer', fontWeight: 800 }}>Register System Identity</span>
                 </p>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="auth-card" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <button onClick={() => setIsSigningUp(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><ChevronLeft size={24}/></button>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Create Identity</h2>
                 </div>
                 
                 <div className="input-group" style={{ marginBottom: '1rem' }}>
                    <label>Full Name (AS PER IC)</label>
                    <input type="text" placeholder="ALI ABU" value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} />
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' }}>
                    <div className="input-group">
                       <label>Identity Type</label>
                       <select value={authData.kycType} onChange={e => setAuthData({...authData, kycType: e.target.value})}>
                          <option value="GeneralWorker">General Resident</option>
                          <option value="Student">Student (HND/Degree)</option>
                       </select>
                    </div>
                    <div className="input-group">
                       <label>Designated Role</label>
                       <select value={authData.role} onChange={e => setAuthData({...authData, role: e.target.value})}>
                          <option value="SEEKER">Hustler</option>
                          <option value="POSTER">Client</option>
                       </select>
                    </div>
                 </div>

                 <div className="input-group" style={{ marginBottom: '1.2rem' }}>
                    <label>Contact Number (BRUPAY/PHONE)</label>
                    <input type="text" placeholder="+673 •••• ••••" value={authData.phone} onChange={e => setAuthData({...authData, phone: e.target.value})} />
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px', marginBottom: '1.2rem' }}>
                    <div className="input-group">
                       <label>IC Color</label>
                       <select value={authData.icColor} onChange={e => setAuthData({...authData, icColor: e.target.value})} disabled={authData.kycType === 'Student'}>
                          <option value="Yellow">Yellow (Citizen)</option>
                          <option value="Purple">Purple (PR)</option>
                          <option value="Green">Green (Foreigner)</option>
                       </select>
                    </div>
                    <div className="input-group">
                       <label>{authData.kycType === 'Student' ? 'Student ID Number' : 'IC Number'}</label>
                       <input type="text" placeholder={authData.kycType === 'Student' ? 'ID-XXXXXX' : '01-XXXXXX'} value={authData.icNumber} onChange={e => setAuthData({...authData, icNumber: e.target.value})} />
                    </div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '1rem 0' }}>
                    <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8' }}>LOCALIZATION</span>
                    <div style={{ flex: 1, height: '1.5px', background: '#E2E8F0' }}></div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
                    <div className="input-group">
                       <label>Home District</label>
                       <select value={authData.district || 'Brunei-Muara'} onChange={e => setAuthData({...authData, district: e.target.value})}>
                          <option value="Brunei-Muara">Brunei-Muara</option>
                          <option value="Tutong">Tutong</option>
                          <option value="Belait">Belait</option>
                          <option value="Temburong">Temburong</option>
                       </select>
                    </div>
                    <div className="input-group">
                       <label>Mukim</label>
                       <input type="text" placeholder="e.g. Gadong B" value={authData.mukim || ''} onChange={e => setAuthData({...authData, mukim: e.target.value})} />
                    </div>
                 </div>

                 <button className="btn-primary" style={{ width: '100%', padding: '18px', borderRadius: '22px' }} onClick={async () => {
                    setAuthLoading(true);
                    const res = await signup(authData);
                    if (res.success) setIsLoggedIn(true);
                    setAuthLoading(false);
                 }}>
                    Initialize Profile <ChevronRight size={18} />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container theme-${(user?.role || 'SEEKER').toLowerCase()}`}>
      <nav className="bottom-nav">
        {/* Seeker Nav */}
        {user.role === 'SEEKER' && (
          <>
            <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}><MapIcon size={24}/><span>Map</span></div>
            <div className={`nav-item ${view === 'activity' ? 'active' : ''}`} onClick={() => setView('activity')}><ClipboardCheck size={24}/><span>Tasks</span></div>
            <div className={`nav-item ${view === 'impact' ? 'active' : ''}`} onClick={() => setView('impact')}><BarChart size={24}/><span>Impact</span></div>
          </>
        )}

        {/* Poster Nav */}
        {user.role === 'POSTER' && (
          <>
            <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}><LayoutDashboard size={24}/><span>Dashboard</span></div>
            <div className={`nav-item ${view === 'activity' ? 'active' : ''}`} onClick={() => setView('activity')}><ClipboardCheck size={24}/><span>Management</span></div>
            <div className={`nav-item ${view === 'wallet' ? 'active' : ''}`} onClick={() => setShowWallet(true)}><CreditCard size={24}/><span>Wallet</span></div>
          </>
        )}

        {/* Admin Nav */}
        {user.role === 'ADMIN' && (
          <>
            <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}><ShieldCheck size={24}/><span>Command</span></div>
            <div className={`nav-item ${view === 'activity' ? 'active' : ''}`} onClick={() => setView('activity')}><Users size={24}/><span>Users</span></div>
          </>
        )}

        {user.isAdmin && user.role !== 'ADMIN' && (
           <div className={`nav-item ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}><ShieldCheck size={24}/><span>Admin</span></div>
        )}
        <div className={`nav-item ${view === 'account' ? 'active' : ''}`} onClick={() => setView('account')}><User size={24}/><span>Account</span></div>
        
        {/* Desktop Footer (Sidebar only) */}
        <div className="desktop-nav-footer" style={{ marginTop: 'auto', padding: '1rem', background: '#F2F2F7', borderRadius: '16px', display: 'none' }}>
           <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8E8E93' }}>SideQuest Prototype</p>
        </div>
      </nav>

      <div className="app-content" style={{ overflow: view === 'home' ? 'hidden' : 'auto', paddingBottom: (view === 'home' || view === 'admin') ? '0' : '120px' }}>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%', position: 'relative' }}>
              {user.role === 'SEEKER' && (
                <>
                  <MapView jobs={jobs} onAccept={acceptJob} mapInstanceRef={mapInstanceRef} searchRadius={searchRadius} />
                  
                  {/* Glass Top Controls */}
                  <div style={{ position: 'absolute', top: '20px', left: '1rem', right: '1rem', zIndex: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div className="glass-modal" style={{ padding: '10px 18px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Radius size={18} color="#00A86B" />
                        <select value={searchRadius} onChange={e => setSearchRadius(parseInt(e.target.value))} style={{ border: 'none', fontSize: '0.9rem', fontWeight: 900, color: '#0F172A', outline: 'none', background: 'transparent' }}>
                           <option value={2}>2km Radius</option>
                           <option value={5}>5km Radius</option>
                           <option value={10}>10km Radius</option>
                        </select>
                     </div>
                     <div className="glass-modal" style={{ width: '45px', height: '45px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Search size={22} color="#64748B" />
                     </div>
                  </div>

                  {/* Live Feed Component - Elevated to avoid Bottom Nav */}
                  <div style={{ position: 'absolute', bottom: '130px', left: '1rem', right: '1rem', zIndex: 600 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#FF3B30', borderRadius: '50%', animation: 'pulse-soft 1.5s infinite' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'white', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>LIVE OPPORTUNITIES</span>
                     </div>
                     <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '15px' }} className="no-scrollbar">
                        {jobs.filter(j => j.status === 'open').slice(0, 5).map(job => (
                          <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} key={job.id} onClick={() => handleLocate(job)} className="glass-modal" style={{ flexShrink: 0, width: '280px', padding: '1.2rem', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.5)' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <strong style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.5px' }}>{job.title}</strong>
                                <span style={{ color: '#00A86B', fontWeight: 900, fontSize: '0.9rem' }}>BND {job.reward}</span>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.7 }}>
                                <MapPin size={12}/>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{job.mukim}</span>
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  <MapFab onPost={() => setShowPostModal(true)} onChat={() => setShowChat(true)} onTasks={() => setView('activity')} onWallet={() => setShowWallet(true)} portal="seeker" />
                </>
              )}

              {user.role === 'POSTER' && (
                <div style={{ padding: '1rem', height: '100%', overflowY: 'auto', paddingBottom: '120px' }}>
                   <PosterDashboard jobs={jobs} balance={balance} onPost={() => setShowPostModal(true)} onLocate={handleLocate} onViewActivity={() => setView('activity')} user={user} />
                </div>
              )}

              {user.role === 'ADMIN' && (
                <div style={{ padding: '1rem', height: '100%', overflowY: 'auto', paddingBottom: '120px' }}>
                   <AdminPortal getAdminUsers={getAdminUsers} getSystemHealth={getSystemHealth} verifyUser={verifyUser} />
                </div>
              )}
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
                        {job.status === 'finished' && (
                          <button className="btn-outline" style={{ width: '100%', marginTop: '10px', borderRadius: '14px', borderColor: '#F2F2F7', color: '#1C1C1E', fontSize: '0.8rem' }} onClick={async () => {
                             const res = await fetch(`/api/jobs/${job.id}/invoice`);
                             const data = await res.json();
                             if (data.success) {
                               alert(`Invoice generated: ${data.invoice.invoiceNo}\nTotal: BND ${data.invoice.total}\nBilled To: ${data.invoice.billedTo}`);
                             }
                          }}>
                            <FileText size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Download Tax Invoice
                          </button>
                        )}
                      </div>
                    ))
                  )}
               </div>
            </motion.div>
          )}

          {view === 'impact' && (
            <motion.div key="impact" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ padding: '1.5rem' }}>
               <div style={{ textAlign: 'center', padding: '2rem 0', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '24px', color: 'white', marginBottom: '1.5rem' }}>
                 <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFD700', letterSpacing: '-1px' }}>WAWASAN 2035</h2>
                 <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 600, marginTop: '5px' }}>Job Creation & Gig Economy Impact</p>
               </div>

               {impactStats ? (
                 <div style={{ display: 'grid', gap: '15px' }}>
                   <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F2F2F7' }}>
                     <p style={{ fontSize: '0.8rem', color: '#8E8E93', fontWeight: 800, textTransform: 'uppercase' }}>Total Jobs Created</p>
                     <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#00A550' }}>{impactStats.totalJobsCreated.toLocaleString()}</h3>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                     <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F2F2F7' }}>
                       <p style={{ fontSize: '0.8rem', color: '#8E8E93', fontWeight: 800, textTransform: 'uppercase' }}>Active Workers</p>
                       <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{impactStats.activeGigWorkers.toLocaleString()}</h3>
                     </div>
                     <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F2F2F7' }}>
                       <p style={{ fontSize: '0.8rem', color: '#8E8E93', fontWeight: 800, textTransform: 'uppercase' }}>Economic Impact</p>
                       <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>${(impactStats.economicImpactBND / 1000).toFixed(1)}K</h3>
                     </div>
                   </div>

                   <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #F2F2F7', marginTop: '10px' }}>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Sectors Breakdown</h4>
                     {impactStats.sectors.map(sector => (
                       <div key={sector.name} style={{ marginBottom: '12px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                           <span>{sector.name}</span>
                           <span>{sector.percentage}%</span>
                         </div>
                         <div style={{ width: '100%', height: '8px', background: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                           <div style={{ width: `${sector.percentage}%`, height: '100%', background: '#FFD700', borderRadius: '4px' }}></div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading Wawasan Impact Data...</p>
               )}
            </motion.div>
          )}

          {view === 'account' && (
            <motion.div key="account" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }}>
               <div className="account-header" style={{ padding: '3rem 1.5rem 5rem' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '35px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                      {walletInfo.bruVerified ? <ShieldCheck size={50} color="#00A550" /> : <User size={50} color="#8E8E93" />}
                    </div>
                  </motion.div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{walletInfo.holder}</h2>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>{user.role}</div>
                    {walletInfo.bruVerified && <div style={{ background: 'rgba(0,165,80,0.1)', color: '#00A550', padding: '4px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>VERIFIED</div>}
                  </div>
               </div>
               
               <div className="wallet-card" style={{ margin: '-3.5rem 1.5rem 1.5rem', padding: '2rem', borderRadius: '28px', background: 'white', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#8E8E93', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Balance</p>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-1px' }}>BND {balance.toFixed(2)}</h2>
                  </div>
                  <button className="btn-primary" style={{ width: '60px', height: '60px', borderRadius: '20px' }} onClick={() => setShowWallet(true)}><CreditCard size={24}/></button>
               </div>

               <div style={{ padding: '0 1.5rem' }}>
                 {user.role !== 'ADMIN' && (
                   <div style={{ background: '#F2F2F7', padding: '6px', borderRadius: '18px', display: 'flex', gap: '5px', marginBottom: '1.5rem' }}>
                      <button onClick={() => setRole('SEEKER')} style={{ flex: 1, padding: '12px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, transition: '0.3s', background: user.role === 'SEEKER' ? 'white' : 'transparent', color: user.role === 'SEEKER' ? 'var(--primary)' : '#8E8E93', boxShadow: user.role === 'SEEKER' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>Seeker Portal</button>
                      <button onClick={() => setRole('POSTER')} style={{ flex: 1, padding: '12px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: 800, transition: '0.3s', background: user.role === 'POSTER' ? 'white' : 'transparent', color: user.role === 'POSTER' ? 'var(--orange)' : '#8E8E93', boxShadow: user.role === 'POSTER' ? '0 4px 10px rgba(0,0,0,0.05)' : 'none' }}>Poster Portal</button>
                   </div>
                 )}

                 <div className="menu-item" style={{ background: 'white', padding: '1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #F2F2F7', cursor: 'pointer', marginBottom: '1rem' }} onClick={() => setShowTopUp(true)}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,165,80,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowUpCircle color="var(--primary)" /></div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>Add Funds</strong>
                      <span style={{ fontSize: '0.75rem', color: '#8E8E93' }}>BIBD / Baiduri / BruPay</span>
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

          {view === 'admin' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
               <AdminPortal getAdminUsers={getAdminUsers} getSystemHealth={getSystemHealth} verifyUser={verifyUser} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
          <PostQuestModal onClose={() => setShowPostModal(false)} onPost={postJob} userLocation={userLocation} />
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

              <div style={{ marginTop: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><History size={18} /> Recent Transactions</h4>
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }} className="tx-list">
                  {transactions.length === 0 ? (
                    <p style={{ color: '#8E8E93', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No transactions yet.</p>
                  ) : (
                    transactions.map(tx => (
                      <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #F2F2F7' }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tx.type}</p>
                          <p style={{ fontSize: '0.75rem', color: '#8E8E93', marginTop: '4px' }}>
                            {new Date(tx.date).toLocaleDateString()} • 
                            <span style={{ 
                              color: tx.status === 'VERIFIED' ? '#00A550' : tx.status === 'PENDING' ? '#FF9500' : '#8E8E93', 
                              fontWeight: 800, 
                              marginLeft: '4px' 
                            }}>
                              {tx.status}
                            </span>
                          </p>
                          {tx.hash && <p style={{ fontSize: '0.6rem', color: '#C7C7CC', marginTop: '2px', fontFamily: 'monospace' }}>SHA-256: {tx.hash.substring(0, 16)}...</p>}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: tx.amount > 0 ? '#00A550' : '#1C1C1E' }}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
