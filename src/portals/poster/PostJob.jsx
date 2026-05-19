import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, DollarSign, Tag, FileText, Send, Check } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { postTask } = usePayment();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Delivery',
    subcategory: 'Food Delivery',
    price: '',
    description: '',
    location: 'Brunei Muara'
  });

  const categories = ['Delivery', 'Cleaning', 'Gardening', 'Moving', 'Repair', 'Creative'];

  const subcategoriesData = {
    'Delivery': ['Food Delivery', 'Document Drop-off', 'Parcel Delivery', 'Groceries Pickup'],
    'Cleaning': ['House Cleaning', 'Car Washing', 'Office Cleaning', 'Deep Cleaning'],
    'Gardening': ['Grass Cutting', 'Weeding', 'Plant Watering', 'Garden Cleanup'],
    'Moving': ['Furniture Transport', 'House Moving', 'Lifting & Loading'],
    'Repair': ['Plumbing', 'Electrical Repair', 'Appliance Repair', 'AC Servicing'],
    'Creative': ['Logo Design', 'Photography', 'Video Editing', 'Social Media Posts']
  };

  // Set default subcategory when category changes
  useEffect(() => {
    if (subcategoriesData[formData.category]) {
      setFormData(prev => ({
        ...prev,
        subcategory: subcategoriesData[formData.category][0]
      }));
    }
  }, [formData.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build the final category string including subcategory
      const finalCategory = `${formData.category} - ${formData.subcategory}`;
      const res = await postTask({
        title: formData.title,
        category: finalCategory,
        budget: formData.price,
        description: formData.description,
        location: formData.location
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/poster'), 2500);
      } else {
        alert(res.error || 'Failed to post task');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: '#f8f9fa', color: '#1a1a1a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-ghost" 
          style={{ 
            padding: '10px', 
            background: 'white', 
            borderRadius: '50%', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} color="#1a1a1a" />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: '#1a1a1a', margin: 0 }}>Post a Task</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ padding: '0 24px 120px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Service Title */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
              Service Title
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Zap size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="text" 
                required
                placeholder="e.g. Grass cutting for back garden"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 48px', 
                  borderRadius: '16px', 
                  background: 'white', 
                  border: '1.5px solid #e5e7eb', 
                  color: '#1a1a1a', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              />
            </div>
          </div>

          {/* Main Category */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
              Category
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Tag size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px' }} />
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 48px', 
                  borderRadius: '16px', 
                  background: 'white', 
                  border: '1.5px solid #e5e7eb', 
                  color: '#1a1a1a', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  outline: 'none',
                  appearance: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div style={{ position: 'absolute', right: '16px', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #9ca3af' }} />
            </div>
          </div>

          {/* Sub Category */}
          {subcategoriesData[formData.category] && (
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
                Sub-category
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Tag size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px' }} />
                <select 
                  value={formData.subcategory}
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '16px 16px 16px 48px', 
                    borderRadius: '16px', 
                    background: 'white', 
                    border: '1.5px solid #e5e7eb', 
                    color: '#1a1a1a', 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    outline: 'none',
                    appearance: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  {subcategoriesData[formData.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
                <div style={{ position: 'absolute', right: '16px', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #9ca3af' }} />
              </div>
            </div>
          )}

          {/* Price (BND) */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
              Price (BND)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <DollarSign size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="number" 
                required
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '16px 16px 16px 48px', 
                  borderRadius: '16px', 
                  background: 'white', 
                  border: '1.5px solid #e5e7eb', 
                  color: '#1a1a1a', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a' }}>
              Description
            </label>
            <div style={{ position: 'relative', display: 'flex' }}>
              <FileText size={18} color="#9ca3af" style={{ position: 'absolute', left: '16px', top: '18px' }} />
              <textarea 
                required
                placeholder="Describe what you offer..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ 
                  width: '100%', 
                  height: '140px', 
                  padding: '16px 16px 16px 48px', 
                  borderRadius: '16px', 
                  background: 'white', 
                  border: '1.5px solid #e5e7eb', 
                  color: '#1a1a1a', 
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              height: '56px', 
              marginTop: '12px',
              background: '#18181b',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            {loading ? (
              <div className="spinner-small" style={{ borderTopColor: 'white' }} />
            ) : (
              <>
                <Send size={18} /> Publish Service
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Check size={60} strokeWidth={3} />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', color: '#1a1a1a' }}>Task Posted!</h2>
              <p style={{ color: '#6b7280', fontWeight: 700 }}>Hustlers are being notified. 🚀</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostJob;