import { useState, useEffect } from 'react';
import { Compass, Wallet, User, Briefcase, MapPin, CheckCircle, Clock } from 'lucide-react';
import TouristPortal from './components/TouristPortal';
import ProviderPortal from './components/ProviderPortal';
import './index.css';

const App = () => {
  const [activePortal, setActivePortal] = useState('tourist'); // 'tourist' or 'provider'
  
  useEffect(() => {
    // Inject the theme class based on portal
    document.body.className = activePortal === 'tourist' ? 'theme-customer' : 'theme-provider';
  }, [activePortal]);

  return (
    <div className="app-container">
      {/* Dynamic Content */}
      <div className="app-content no-scrollbar">
        {activePortal === 'tourist' ? <TouristPortal /> : <ProviderPortal />}
      </div>

      {/* Pitch Navigation - Only for demo purposes to switch portals */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '20px',
        padding: '4px',
        display: 'flex',
        gap: '4px'
      }}>
        <button 
          onClick={() => setActivePortal('tourist')}
          style={{
            background: activePortal === 'tourist' ? 'var(--emerald)' : 'transparent',
            color: 'white', border: 'none', borderRadius: '16px', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          TOURIST
        </button>
        <button 
          onClick={() => setActivePortal('provider')}
          style={{
            background: activePortal === 'provider' ? 'var(--gold)' : 'transparent',
            color: 'white', border: 'none', borderRadius: '16px', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          HOST
        </button>
      </div>
    </div>
  );
};

export default App;
