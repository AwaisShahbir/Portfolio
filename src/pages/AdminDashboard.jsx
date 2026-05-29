import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNav from './admin/components/AdminNav';
import HeroEditor from './admin/sections/HeroEditor';
import AboutEditor from './admin/sections/AboutEditor';
import ProjectsEditor from './admin/sections/ProjectsEditor';
import ContactEditor from './admin/sections/ContactEditor';
import MessagesInbox from './admin/sections/MessagesInbox';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCollection } from '../hooks/useFirestore';
import { seedFirestore } from '../utils/seedData';
import { Database, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('hero');
    const { docs: messages } = useCollection('messages');
    const [seeding, setSeeding] = useState(false);
    const [seedResult, setSeedResult] = useState(null);

    const unreadMessagesCount = messages ? messages.filter(m => !m.read).length : 0;

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/admin/login');
        }
    }, [currentUser, loading, navigate]);

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
        </div>
    );
};

export default AdminDashboard;
