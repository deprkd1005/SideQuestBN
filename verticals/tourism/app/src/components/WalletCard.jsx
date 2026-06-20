import { ShieldCheck } from 'lucide-react';

const WalletCard = ({ balance, user, isHost }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '24px',
      padding: '1.5rem',
      color: 'white',
      margin: '1rem 1.2rem',
      aspectRatio: '1.6 / 1',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontFamily: 'Outfit' }}>
        <ShieldCheck size={20} color={isHost ? 'var(--gold)' : 'var(--emerald)'} /> 
        SideQuest Virtual
      </div>
      
      <div style={{
        width: '45px', height: '35px', 
        background: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
        borderRadius: '8px', margin: '1rem 0'
      }}></div>

      <div style={{ 
        fontFamily: 'monospace', fontSize: '1.25rem', letterSpacing: '2px', marginBottom: '1rem' 
      }}>
        4532 8812 0943 2210
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.8, fontFamily: 'Outfit' }}>
        <span>{user.toUpperCase()}</span>
        <span>EXP 12/28</span>
      </div>
    </div>
  );
};

export default WalletCard;
