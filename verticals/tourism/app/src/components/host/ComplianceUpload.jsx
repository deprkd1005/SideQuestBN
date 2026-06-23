import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle, FileText, RefreshCw, Clock, HelpCircle } from 'lucide-react';

const ComplianceUpload = () => {
  const [documents, setDocuments] = useState({
    business_license: {
      name: "Brunei Roc Registration (16-08345)",
      status: "Verified",
      updatedAt: "2026-06-20",
      ocrData: { company: "Kempas Heritage Tours & Crafts", registryId: "16-08345" }
    },
    halal_cert: {
      name: "MUIB Halal Food Permit (10-38827)",
      status: "Verified",
      updatedAt: "2026-06-21",
      ocrData: { issuedTo: "Kempas Catering & Heritage Tours", halalNo: "10-38827" }
    },
    tourism_permit: {
      name: null,
      status: "Not Uploaded",
      updatedAt: null,
      ocrData: null
    }
  });

  const [scanningDocKey, setScanningDocKey] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);

  const simulateOCRScan = (docKey) => {
    setScanningDocKey(docKey);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setDocuments(prev => {
            const current = { ...prev };
            if (docKey === 'tourism_permit') {
              current[docKey] = {
                name: "MTIC Tourism Operator Permit (MT-99374)",
                status: "Verified",
                updatedAt: new Date().toISOString().split('T')[0],
                ocrData: { company: "Kempas Heritage Tours & Crafts", permitNumber: "MT-99374", expires: "2028-12-31" }
              };
            }
            return current;
          });
          setScanningDocKey(null);
        }, 600);
      }
    }, 200);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#4ade80',
            background: 'rgba(74, 222, 128, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(74, 222, 128, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle2 size={12} /> VERIFIED
          </span>
        );
      case 'Pending':
        return (
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#facc15',
            background: 'rgba(234, 179, 8, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(234, 179, 8, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} /> PENDING OCR
          </span>
        );
      default:
        return (
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#f87171',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <AlertCircle size={12} /> REQUIRED
          </span>
        );
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '24px',
      border: '1px solid var(--border-glass)',
      padding: '20px',
      color: 'var(--text-primary)',
      fontFamily: 'Outfit'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FileText size={20} style={{ color: 'var(--gold)' }} />
        Compliance & Certificates
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.4 }}>
        Brunei regulatory registry requires active permits to enable automatic smart-escrow payouts to host bank accounts.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Business License */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Registry of Companies (ROC)</span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '2px 0 0 0' }}>Business Registration Certificate</h4>
            </div>
            {getStatusBadge(documents.business_license.status)}
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.02)' }}>
            <span style={{ color: 'var(--text-muted)' }}>OCR Matched Name: </span>
            <span style={{ fontWeight: 700 }}>{documents.business_license.ocrData.company}</span>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Reg ID: </span>
            <span style={{ fontWeight: 700 }}>{documents.business_license.ocrData.registryId}</span>
          </div>
        </div>

        {/* Halal Certificate */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Majlis Ugama Islam Brunei (MUIB)</span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '2px 0 0 0' }}>MUIB Halal Permit</h4>
            </div>
            {getStatusBadge(documents.halal_cert.status)}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.02)' }}>
            <span style={{ color: 'var(--text-muted)' }}>OCR Issued To: </span>
            <span style={{ fontWeight: 700 }}>{documents.halal_cert.ocrData.issuedTo}</span>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>MUIB No: </span>
            <span style={{ fontWeight: 700 }}>{documents.halal_cert.ocrData.halalNo}</span>
          </div>
        </div>

        {/* Tourism Permit */}
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ministry of Primary Resources & Tourism</span>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: '2px 0 0 0' }}>Tourism Authority Operator License</h4>
            </div>
            {getStatusBadge(scanningDocKey === 'tourism_permit' ? 'Pending' : documents.tourism_permit.status)}
          </div>

          {scanningDocKey === 'tourism_permit' ? (
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <RefreshCw size={24} className="spin-animation" style={{ color: 'var(--gold)', marginBottom: '8px' }} />
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.2s' }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Running OCR Document Verification ({scanProgress}%)</span>
            </div>
          ) : documents.tourism_permit.name ? (
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: '10px', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.02)' }}>
              <span style={{ color: 'var(--text-muted)' }}>OCR License: </span>
              <span style={{ fontWeight: 700 }}>{documents.tourism_permit.ocrData.company}</span>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>Permit No: </span>
              <span style={{ fontWeight: 700 }}>{documents.tourism_permit.ocrData.permitNumber}</span>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>Expires: </span>
              <span style={{ fontWeight: 700 }}>{documents.tourism_permit.ocrData.expires}</span>
            </div>
          ) : (
            <button
              onClick={() => simulateOCRScan('tourism_permit')}
              style={{
                width: '100%',
                padding: '24px',
                borderRadius: '12px',
                border: '1.5px dashed var(--border-glass)',
                background: 'rgba(255,255,255,0.01)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              <Upload size={24} style={{ color: 'var(--text-muted)' }} />
              <span>Simulate Upload & OCR Validation</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>Supports PDF, JPG, PNG up to 10MB</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceUpload;
