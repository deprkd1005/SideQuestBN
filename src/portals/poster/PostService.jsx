import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, DollarSign, Tag, FileText } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PostService = () => {
  const navigate = useNavigate();
  const { postService, refresh } = usePayment();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Delivery'
  });

  const categories = ['Delivery', 'Cleaning', 'Digital', 'Handyman', 'Education', 'Events'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await postService(formData);
    if (res.success) {
      refresh();
      navigate('/hustler');
    } else {
      alert(res.error || 'Failed to post service');
      setLoading(false);
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>Post a Service</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <Zap size={16} className="text-emerald" /> Service Title
            </label>
            <input 
              type="text" 
              required
              placeholder="e.g. Professional Graphic Design"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="card-glass"
              style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', fontWeight: 600 }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <Tag size={16} className="text-emerald" /> Category
            </label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="card-glass"
              style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', fontWeight: 600, appearance: 'none' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <DollarSign size={16} className="text-emerald" /> Price (BND)
            </label>
            <input 
              type="number" 
              required
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="card-glass"
              style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', fontWeight: 600 }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <FileText size={16} className="text-emerald" /> Description
            </label>
            <textarea 
              required
              placeholder="Describe what you offer..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="card-glass"
              style={{ width: '100%', height: '120px', padding: '16px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', fontWeight: 600, resize: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', height: '56px', marginTop: '12px' }}
          >
            {loading ? <div className="spinner-small" style={{ borderTopColor: 'white' }} /> : 'Publish Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostService;
