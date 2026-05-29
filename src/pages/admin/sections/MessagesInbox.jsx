import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { useCollection, deleteDocument, updateDocument } from '../../../hooks/useFirestore';
import LoadingSpinner from '../../../components/LoadingSpinner';

const MessagesInbox = () => {
    const { docs: messages, loading } = useCollection('messages', 'createdAt');
    const [expanded, setExpanded] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const handleExpand = async (msg) => {
        if (expanded?.id === msg.id) { setExpanded(null); return; }
        setExpanded(msg);
        if (!msg.read) await updateDocument('messages', msg.id, { read: true });
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        await deleteDocument('messages', id);
        if (expanded?.id === id) setExpanded(null);
        setDeleting(null);
    };

    const formatDate = (ts) => {
        if (!ts?.toDate) return '—';
        return ts.toDate().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const unread = messages.filter(m => !m.read).length;

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-editor">
            <div className="admin-editor-header">
                <h2>📩 Messages Inbox {unread > 0 && <span style={{ marginLeft: '0.5rem', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.7rem', padding: '2px 9px', borderRadius: '50px', verticalAlign: 'middle' }}>{unread} new</span>}</h2>
                <p>Contact form submissions from your portfolio. Click a message to expand it.</p>
            </div>

            <div className="admin-editor-body">
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
                        <MailOpen size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                        <p>No messages yet. They'll appear here when visitors use the contact form.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <AnimatePresence>
                            {[...messages].reverse().map(msg => (
                                <motion.div key={msg.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    style={{ borderRadius: '14px', border: `1px solid ${!msg.read ? 'rgba(129,140,248,0.35)' : 'var(--glass-border)'}`, overflow: 'hidden', background: !msg.read ? 'rgba(99,102,241,0.04)' : 'transparent' }}
                                >
                                    {/* Header Row */}
                                    <div
                                        onClick={() => handleExpand(msg)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(129,140,248,0.05)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ color: !msg.read ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0 }}>
                                            {!msg.read ? <Mail size={18} /> : <MailOpen size={18} />}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                                                <span style={{ fontWeight: msg.read ? 500 : 700, fontSize: '0.9rem' }}>{msg.name}</span>
                                                {!msg.read && <span style={{ fontSize: '0.6rem', background: 'var(--accent-primary)', color: '#fff', padding: '1px 7px', borderRadius: '50px', fontWeight: 700 }}>NEW</span>}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {msg.email} — {msg.message?.substring(0, 60)}{msg.message?.length > 60 ? '…' : ''}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0, textAlign: 'right' }}>
                                            {formatDate(msg.createdAt)}
                                        </div>
                                        <button onClick={e => { e.stopPropagation(); handleDelete(msg.id); }} disabled={deleting === msg.id}
                                            style={{ padding: '6px 8px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#f87171', display: 'flex', flexShrink: 0 }}>
                                            <Trash2 size={13} />
                                        </button>
                                    </div>

                                    {/* Expanded message */}
                                    <AnimatePresence>
                                        {expanded?.id === msg.id && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', borderTop: '1px solid var(--glass-border)' }}
                                            >
                                                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                                        <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>From</span><br /><span style={{ fontWeight: 600 }}>{msg.name}</span></div>
                                                        <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Email</span><br /><a href={`mailto:${msg.email}`} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>{msg.email}</a></div>
                                                        <div><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Received</span><br /><span style={{ fontWeight: 500 }}>{formatDate(msg.createdAt)}</span></div>
                                                    </div>
                                                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '1rem', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                                                    <a href={`mailto:${msg.email}?subject=Re: Your Message`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                                                        <Mail size={14} /> Reply via Email
                                                    </a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesInbox;
