import React, { useState } from 'react';
import { X, LogIn, User, Shield, Award, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
    executeLogin(u, p);
  };

  const executeLogin = async (u, p) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u || username, password: p || password })
      });

      if (!res.ok) {
        throw new Error('Invalid credentials or unauthorized official account');
      }

      const data = await res.json();
      setLoading(false);
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '36px',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            border: '2px solid #FF9933'
          }}>
            <ShieldCheck size={28} color="#000080" />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#FF9933', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            SPORTS AUTHORITY OF INDIA • KHELO INDIA
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
            Official Government Sign-In
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '4px' }}>
            1-Click authentication for Hackathon Evaluators & Jury
          </p>
        </div>

        {/* 1-Click Official Account Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button 
            onClick={() => handleQuickLogin('athlete', 'password123')}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Saikhom Mirabai Chanu
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                Role: Senior National Cadet (Imphal East)
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>1-Click →</span>
          </button>

          <button 
            onClick={() => handleQuickLogin('coach', 'coach123')}
            style={{
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              color: '#3b82f6',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} /> Coach L. Ibomcha Singh
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                Role: Dronacharya Awardee • SAI Imphal Center
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>1-Click →</span>
          </button>

          <button 
            onClick={() => handleQuickLogin('admin', 'admin123')}
            style={{
              background: 'rgba(255, 153, 51, 0.12)',
              border: '1px solid rgba(255, 153, 51, 0.35)',
              color: '#FF9933',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} /> State Sports Directorate
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                Role: Dept of Youth Affairs & Sports, Govt. of Manipur
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>1-Click →</span>
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
