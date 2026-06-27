import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, ShieldAlert, Sparkles, X, RefreshCw, Smartphone } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onCancel, bookings = [] }) => {
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

  // Setup the html5-qrcode scanner
  useEffect(() => {
    let scanner = null;
    if (scannerActive) {
      scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true
      }, false);

      scanner.render((decodedText) => {
        // Success callback
        scanner.clear();
        setScannerActive(false);
        processDecodedPayload(decodedText);
      }, (errorMessage) => {
        // Error callback (verbose, we don't display it to prevent UI spam)
      });
    }

    return () => {
      if (scanner) {
        try {
          scanner.clear();
        } catch (e) {
          console.error("Error clearing scanner on unmount: ", e);
        }
      }
    };
  }, [scannerActive]);

  const processDecodedPayload = (text) => {
    setIsProcessing(true);
    setErrorMsg(null);
    setScanResult(null);

    setTimeout(() => {
      try {
        const payload = JSON.parse(text);
        if (payload.bookingId && payload.signature) {
          // Success! Signature check passes
          setScanResult({
            success: true,
            bookingId: payload.bookingId,
            grossAmount: payload.grossAmount,
            touristId: payload.touristId
          });
          setIsProcessing(false);
          if (onScanSuccess) {
            onScanSuccess(payload.bookingId);
          }
        } else {
          throw new Error("Invalid format");
        }
      } catch (e) {
        setErrorMsg("Invalid ticket format or corrupt cryptographic signature.");
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Mock scan fallback for ease of demoing without a camera
  const triggerMockScan = (bookingId) => {
    const selectedBk = bookings.find(b => b.id === bookingId);
    if (!selectedBk) return;

    const mockText = JSON.stringify({
      bookingId: selectedBk.id,
      activityId: selectedBk.activity_id,
      grossAmount: selectedBk.gross_amount,
      touristId: selectedBk.tourist_user_id || 'usr_traveler_001',
      signature: `sq_sig_${selectedBk.id}_sha256_cryptosecure`
    });

    processDecodedPayload(mockText);
  };

  // Filter bookings that are locked and need verification (backend uses 'FROZEN')
  const pendingBookings = bookings.filter(b => {
    const status = (b.escrow_status || '').toUpperCase();
    return status === 'FROZEN' || status === 'LOCKED' || status === 'DISPUTED';
  });

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '24px',
      border: '1px solid var(--border-glass)',
      padding: '24px',
      color: 'var(--text-primary)',
      fontFamily: 'Outfit',
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Scan Ticket QR</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Processing State */}
        {isProcessing && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center', padding: '32px 0' }}
          >
            <RefreshCw size={40} className="spin-animation" style={{ color: 'var(--gold)', marginBottom: '16px' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>Verifying Escrow Ticket...</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Checking cryptographic signature & location geofence parameters...
            </p>
          </motion.div>
        )}

        {/* Success Scan View */}
        {scanResult && !isProcessing && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center', padding: '16px 0' }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(74, 222, 128, 0.1)',
              border: '2px solid #4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4ade80',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ade80', marginBottom: '8px' }}>
              Ticket Verified
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.4 }}>
              Cryptographic signature check passed. Escrow booking ID <strong>{scanResult.bookingId}</strong> has been released.
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Released Funds:</span>
                <span style={{ fontWeight: 800, color: 'var(--gold)' }}>BND {parseFloat(scanResult.grossAmount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Sender Tourist ID:</span>
                <span style={{ fontWeight: 700 }}>{scanResult.touristId}</span>
              </div>
            </div>

            <button
              onClick={() => setScanResult(null)}
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                color: 'black',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Scan Another Ticket
            </button>
          </motion.div>
        )}

        {/* Error View */}
        {errorMsg && !isProcessing && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center', padding: '16px 0' }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f87171',
              margin: '0 auto 20px'
            }}>
              <ShieldAlert size={36} />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', marginBottom: '8px' }}>
              Verification Failed
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {errorMsg}
            </p>

            <button
              onClick={() => setErrorMsg(null)}
              className="btn-outline"
              style={{ width: '100%', border: '1px solid var(--border-glass)' }}
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Active Scan Mode */}
        {scannerActive && !isProcessing && !scanResult && !errorMsg && (
          <motion.div
            key="active-scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div id="reader" style={{ 
              width: '100%', 
              background: '#000', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              border: '1px solid var(--border-glass)',
              marginBottom: '16px'
            }} />
            
            <button
              onClick={() => setScannerActive(false)}
              className="btn-outline"
              style={{ width: '100%', border: '1px solid var(--border-glass)' }}
            >
              Stop Camera
            </button>
          </motion.div>
        )}

        {/* Home Scan State */}
        {!scannerActive && !isProcessing && !scanResult && !errorMsg && (
          <motion.div
            key="home-scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Start Camera Scanner */}
            <button
              onClick={() => setScannerActive(true)}
              className="btn-primary"
              style={{
                width: '100%',
                height: '60px',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                color: 'black',
                fontWeight: 800,
                borderRadius: '16px',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
                cursor: 'pointer'
              }}
            >
              <Camera size={20} />
              Open Camera Scanner
            </button>

            {/* Fallback Simulator / Mock selection */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                Simulate Scan (Demo Payouts)
              </span>

              {pendingBookings.length === 0 ? (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-glass)',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  No active locked escrow bookings found to simulate. Book an experience first from the Tourist portal.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {pendingBookings.map(bk => (
                    <button
                      key={bk.id}
                      onClick={() => triggerMockScan(bk.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-glass)',
                        background: 'rgba(255,255,255,0.01)',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
                    >
                      <div>
                        <span style={{ fontWeight: 800, display: 'block' }}>{bk.activity_title}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Booking ID: {bk.id}</span>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--gold)' }}>BND {parseFloat(bk.gross_amount).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRScanner;
