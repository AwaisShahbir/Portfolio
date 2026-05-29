import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            {/* Background glows */}
            <div className="bg-glow glow-cyan" style={{ width: 600, height: 600, top: -200, left: -200 }} />
            <div className="bg-glow glow-magenta" style={{ width: 500, height: 500, bottom: -200, right: -200 }} />

            <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}
            >
                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '28px' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <motion.div
                            animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'conic-gradient(from 0deg, #6366f1, #a78bfa, #fbbf24, #6366f1)', margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px' }}
                        >
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                                🔐
                            </div>
                        </motion.div>
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>Admin Access</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to manage your portfolio</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Email</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className="form-input" placeholder="admin@example.com" required
                                style={{ fontSize: '0.95rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Password</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)}
                                className="form-input" placeholder="••••••••" required
                                style={{ fontSize: '0.95rem' }}
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#fca5a5' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            type="submit" className="form-submit"
                            disabled={loading}
                            style={{ marginTop: '0.5rem', fontSize: '1rem' }}
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </motion.button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <a href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>← Back to Portfolio</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
