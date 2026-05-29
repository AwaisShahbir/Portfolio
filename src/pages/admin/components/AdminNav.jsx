import React from 'react';
import { motion } from 'framer-motion';
import { Home, User, Briefcase, Mail, MessageSquare, LogOut, ExternalLink, Award } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const NAV_ITEMS = [
    { id: 'hero',       label: 'Hero',        icon: Home },
    { id: 'about',      label: 'About',       icon: User },
    { id: 'experience', label: 'Experience',  icon: Award },
    { id: 'projects',   label: 'Projects',    icon: Briefcase },
    { id: 'contact',    label: 'Contact',     icon: Mail },
    { id: 'messages',   label: 'Messages',    icon: MessageSquare },
];

const AdminNav = ({ active, onSelect, unreadCount = 0 }) => {
    const { currentUser, logout } = useAuth();

    return (
        <aside style={{
            width: '240px', minHeight: '100vh', background: 'rgba(11,15,26,0.95)',
            borderRight: '1px solid var(--glass-border)', display: 'flex',
            flexDirection: 'column', padding: '1.5rem 1rem', position: 'sticky', top: 0,
            backdropFilter: 'blur(20px)'
        }}>
            {/* Logo */}
            <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Portfolio CMS</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser?.email}
                </div>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = active === id;
                    return (
                        <motion.button
                            key={id}
                            onClick={() => onSelect(id)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                                transition: 'background 0.2s, color 0.2s', textAlign: 'left', width: '100%',
                                borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                            }}
                        >
                            <Icon size={16} />
                            {label}
                            {id === 'messages' && unreadCount > 0 && (
                                <span style={{ marginLeft: 'auto', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '50px' }}>
                                    {unreadCount}
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </nav>

            {/* Footer links */}
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <a href="/" target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <ExternalLink size={14} /> View Site
                </a>
                <motion.button
                    onClick={logout} whileTap={{ scale: 0.96 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'transparent', fontSize: '0.8rem', color: '#f87171', fontFamily: 'inherit', transition: 'background 0.2s', width: '100%', textAlign: 'left' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                    <LogOut size={14} /> Sign Out
                </motion.button>
            </div>
        </aside>
    );
};

export default AdminNav;
