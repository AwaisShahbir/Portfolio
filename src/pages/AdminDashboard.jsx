import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNav from './admin/components/AdminNav';
import HeroEditor from './admin/sections/HeroEditor';
import AboutEditor from './admin/sections/AboutEditor';
import ExperienceEditor from './admin/sections/ExperienceEditor';
import ProjectsEditor from './admin/sections/ProjectsEditor';
import ContactEditor from './admin/sections/ContactEditor';
import MessagesInbox from './admin/sections/MessagesInbox';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCollection } from '../hooks/useFirestore';
import { seedFirestore } from '../utils/seedData';
import { Database, AlertTriangle, BellRing, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hero');
    const { docs: messages, loading: messagesLoading } = useCollection('messages');
    const [seeding, setSeeding] = useState(false);
    const [seedResult, setSeedResult] = useState(null);
    const [toasts, setToasts] = useState([]);

    const unreadMessagesCount = messages ? messages.filter(m => !m.read).length : 0;

    const isInitialLoadRef = useRef(true);
    const prevMessagesRef = useRef([]);

    // Request desktop notifications permissions on mount
    useEffect(() => {
        if (!loading && currentUser) {
            if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission();
            }
        }
    }, [currentUser, loading]);

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/admin/login');
        }
    }, [currentUser, loading, navigate]);

    // Helper to add visual toast to dashboard
    const addToast = (title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, title, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5500);
    };

    // Play high-tech C-maj7 arpeggio chime using browser Web Audio API
    const playChime = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const now = ctx.currentTime;

            const playNote = (freq, time, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);

                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.25, time + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

                osc.start(time);
                osc.stop(time + duration);
            };

            playNote(523.25, now, 0.4);         // C5
            playNote(659.25, now + 0.08, 0.45);  // E5
            playNote(783.99, now + 0.16, 0.5);   // G5
            playNote(987.77, now + 0.24, 0.6);   // B5
        } catch (e) {
            console.error("Failed to play notification chime:", e);
        }
    };

    // Send native desktop browser notification
    const showDesktopNotification = (title, body) => {
        if (!("Notification" in window)) return;
        if (Notification.permission === "granted") {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
    };

    // Listen for new messages in real-time to trigger alerts
    useEffect(() => {
        if (messagesLoading || !messages) return;

        if (isInitialLoadRef.current) {
            prevMessagesRef.current = messages;
            isInitialLoadRef.current = false;
            return;
        }

        if (messages.length > prevMessagesRef.current.length) {
            const newMessages = messages.filter(
                msg => !prevMessagesRef.current.some(prevMsg => prevMsg.id === msg.id)
            );

            newMessages.forEach(msg => {
                const isVoice = msg.message?.startsWith('[Voice Agent Call]');
                const typeLabel = isVoice ? 'Voice Assistant' : 'Contact Form';
                const cleanMessage = isVoice ? msg.message.replace('[Voice Agent Call]', '').trim() : msg.message;

                playChime();

                showDesktopNotification(
                    `New message from ${msg.name}`,
                    `[${typeLabel}] ${cleanMessage}`
                );

                addToast(
                    `New Message from ${msg.name}`,
                    `[${typeLabel}] ${cleanMessage?.substring(0, 80)}${cleanMessage?.length > 80 ? '...' : ''}`
                );
            });
        }

        prevMessagesRef.current = messages;
    }, [messages, messagesLoading]);

    const handleSeedData = async () => {
        if (!window.confirm("Are you sure you want to seed initial data? This will overwrite your existing hero, about, and contact info, and re-create initial projects!")) return;
        setSeeding(true);
        setSeedResult(null);
        const res = await seedFirestore();
        setSeeding(false);
        if (res.success) {
            setSeedResult({ success: true, message: "Initial database successfully seeded!" });
        } else {
            setSeedResult({ success: false, message: `Seeding failed: ${res.error}` });
        }
        setTimeout(() => setSeedResult(null), 5000);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
            <LoadingSpinner text="Checking authentication status..." />
        </div>
    );

    if (!currentUser) return null; // Avoid flicker before redirecting

    const renderEditor = () => {
        switch (activeTab) {
            case 'hero':
                return <HeroEditor />;
            case 'about':
                return <AboutEditor />;
            case 'experience':
                return <ExperienceEditor />;
            case 'projects':
                return <ProjectsEditor />;
            case 'contact':
                return <ContactEditor />;
            case 'messages':
                return <MessagesInbox />;
            default:
                return <HeroEditor />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar Navigation */}
            <AdminNav
                active={activeTab}
                onSelect={setActiveTab}
                unreadCount={unreadMessagesCount}
            />

            {/* Main Content Pane */}
            <main style={{ flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header bar */}
                <header style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1.25rem 2.5rem', background: 'rgba(11,15,26,0.5)',
                    borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)',
                    zIndex: 20
                }}>
                    <div>
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 800 }}>
                            Dashboard
                        </h1>
                    </div>

                    {/* DB Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {seedResult && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontSize: '0.8rem', fontWeight: 600, padding: '0.4rem 1rem', borderRadius: '8px',
                                    background: seedResult.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                    color: seedResult.success ? '#34d399' : '#f87171',
                                    border: `1px solid ${seedResult.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                }}
                            >
                                {seedResult.message}
                            </motion.span>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={handleSeedData}
                            disabled={seeding}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem', borderRadius: '10px',
                                border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.06)',
                                color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            <Database size={14} />
                            {seeding ? 'Seeding...' : 'Seed Initial Data'}
                        </motion.button>
                    </div>
                </header>

                {/* Editor Content */}
                <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
                        {renderEditor()}
                    </div>
                </div>
            </main>

            {/* Premium Toast Notifications Overlay */}
            <div style={{
                position: 'fixed', bottom: '2rem', right: '2rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                zIndex: 9999, pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                            style={{
                                pointerEvents: 'auto',
                                minWidth: '320px',
                                maxWidth: '400px',
                                background: 'rgba(15, 23, 42, 0.92)',
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                                backdropFilter: 'blur(16px)',
                                padding: '1.2rem 1.4rem',
                                borderRadius: '16px',
                                color: 'var(--text-main)',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <div style={{ color: 'var(--accent-secondary)', marginTop: '2px' }}>
                                    <BellRing size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>
                                        {t.title}
                                    </h4>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                        {t.message}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {/* Toast Timer Progress Bar */}
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 5.5, ease: 'linear' }}
                                style={{
                                    position: 'absolute', bottom: 0, left: 0, height: '3px',
                                    background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                                }}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
