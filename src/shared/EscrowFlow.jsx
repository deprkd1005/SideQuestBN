import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, User, ArrowRight, CheckCircle } from 'lucide-react';

const EscrowFlow = ({ stage = 'idle', amount = '0.00', onComplete }) => {
  // stages: 'wallet-to-escrow', 'escrow-held', 'escrow-to-worker', 'completed'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ padding: '32px 24px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        
        {/* Wallet (User) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
          <motion.div 
            animate={stage === 'wallet-to-escrow' ? { scale: [1, 1.1, 1], transition: { repeat: Infinity } } : {}}
            style={{ 
              width: '64px', height: '64px', borderRadius: '20px', background: stage === 'wallet-to-escrow' ? 'var(--orange-soft)' : 'var(--bg-tertiary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: stage === 'wallet-to-escrow' ? 'var(--orange)' : 'var(--text-muted)',
              border: '2px solid', borderColor: stage === 'wallet-to-escrow' ? 'var(--orange)' : 'transparent'
            }}
          >
            <Wallet size={32} />
          </motion.div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>WALLET</span>
        </div>

        {/* Path 1 */}
        <div style={{ flex: 1, height: '4px', background: 'var(--bg-tertiary)', margin: '0 8px', borderRadius: '2px', position: 'relative', overflow: 'hidden', marginTop: '-20px' }}>
          {stage === 'wallet-to-escrow' && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ width: '40%', height: '100%', background: 'var(--orange)', borderRadius: '2px' }}
            />
          )}
          {stage !== 'wallet-to-escrow' && stage !== 'idle' && (
            <div style={{ width: '100%', height: '100%', background: 'var(--orange)', opacity: 0.3 }} />
          )}
        </div>

        {/* Escrow (Shield) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
          <motion.div 
            animate={stage === 'escrow-held' ? { scale: [1, 1.1, 1], transition: { repeat: Infinity } } : {}}
            style={{ 
              width: '64px', height: '64px', borderRadius: '20px', background: stage === 'escrow-held' ? 'var(--blue-soft)' : 'var(--bg-tertiary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: stage === 'escrow-held' ? 'var(--blue)' : 'var(--text-muted)',
              border: '2px solid', borderColor: stage === 'escrow-held' ? 'var(--blue)' : (stage === 'completed' || stage === 'escrow-to-worker' ? 'var(--emerald)' : 'transparent')
            }}
          >
            <Shield size={32} />
          </motion.div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>ESCROW</span>
        </div>

        {/* Path 2 */}
        <div style={{ flex: 1, height: '4px', background: 'var(--bg-tertiary)', margin: '0 8px', borderRadius: '2px', position: 'relative', overflow: 'hidden', marginTop: '-20px' }}>
          {stage === 'escrow-to-worker' && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ width: '40%', height: '100%', background: 'var(--emerald)', borderRadius: '2px' }}
            />
          )}
          {stage === 'completed' && (
            <div style={{ width: '100%', height: '100%', background: 'var(--emerald)', opacity: 0.3 }} />
          )}
        </div>

        {/* Worker */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '80px' }}>
          <motion.div 
            animate={stage === 'escrow-to-worker' ? { scale: [1, 1.1, 1], transition: { repeat: Infinity } } : {}}
            style={{ 
              width: '64px', height: '64px', borderRadius: '20px', background: (stage === 'escrow-to-worker' || stage === 'completed') ? 'var(--emerald-soft)' : 'var(--bg-tertiary)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: (stage === 'escrow-to-worker' || stage === 'completed') ? 'var(--emerald)' : 'var(--text-muted)',
              border: '2px solid', borderColor: (stage === 'escrow-to-worker' || stage === 'completed') ? 'var(--emerald)' : 'transparent'
            }}
          >
            <User size={32} />
          </motion.div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-secondary)' }}>WORKER</span>
        </div>

      </div>

      {/* Floating Money Animation */}
      <AnimatePresence>
        {stage === 'wallet-to-escrow' && (
          <motion.div
            initial={{ x: 60, y: 32, opacity: 0 }}
            animate={{ x: 190, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ position: 'absolute', zIndex: 10, color: 'var(--orange)', fontWeight: 900, fontSize: '0.9rem' }}
          >
            BND {amount}
          </motion.div>
        )}
        {stage === 'escrow-to-worker' && (
          <motion.div
            initial={{ x: 190, y: 32, opacity: 0 }}
            animate={{ x: 320, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ position: 'absolute', zIndex: 10, color: 'var(--emerald)', fontWeight: 900, fontSize: '0.9rem' }}
          >
            BND {amount}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {stage === 'wallet-to-escrow' && 'Securing Funds in Escrow...'}
          {stage === 'escrow-held' && 'Funds Secured by SideQuest'}
          {stage === 'escrow-to-worker' && 'Releasing Funds to Worker...'}
          {stage === 'completed' && 'Transaction Complete'}
        </h4>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {stage === 'wallet-to-escrow' && 'Moving your budget to the secure platform vault.'}
          {stage === 'escrow-held' && 'BND ' + amount + ' is locked until task completion.'}
          {stage === 'escrow-to-worker' && 'Sending BND ' + amount + ' to the worker\'s digital wallet.'}
          {stage === 'completed' && 'Funds have been successfully transferred.'}
        </p>
      </div>
    </div>
  );
};

export default EscrowFlow;
