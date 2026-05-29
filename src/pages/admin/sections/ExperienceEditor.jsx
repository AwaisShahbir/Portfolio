import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, X, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useCollection, addDocument, updateDocument, deleteDocument } from '../../../hooks/useFirestore';
import LoadingSpinner from '../../../components/LoadingSpinner';

const EMPTY_EXP = { role: '', company: '', duration: '', location: '', description: '', order: 99 };

const Modal = ({ experience, onClose, onSave }) => {
    const [form, setForm] = useState({
        role: experience?.role || '',
        company: experience?.company || '',
        duration: experience?.duration || '',
        location: experience?.location || '',
        description: experience?.description || '',
        order: experience?.order ?? 99
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave({ ...form, order: Number(form.order) });
        setSaving(false);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', maxWidth: '560px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}
            >
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>{experience?.id ? 'Edit Experience' : 'Add Experience'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    {[
                        { label: 'Role / Job Title', key: 'role', placeholder: 'e.g. Junior Flutter Developer' },
                        { label: 'Company Name', key: 'company', placeholder: 'e.g. Blendz Marketing' },
                        { label: 'Duration / Dates', key: 'duration', placeholder: 'e.g. Aug 2025 – Apr 2026' },
                        { label: 'Location', key: 'location', placeholder: 'e.g. Remote, Lahore, Pakistan' },
                        { label: 'Order (for sorting)', key: 'order', placeholder: '1', type: 'number' },
                    ].map(({ label, key, placeholder, type }) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</label>
                            <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="form-input" style={{ fontSize: '0.9rem' }} />
                        </div>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Responsibilities / Details</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="form-input" style={{ resize: 'vertical', fontSize: '0.9rem' }} placeholder="Summary of achievements and duties..." />
                    </div>
                </div>
                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="admin-save-btn" disabled={saving}>
                        {saving ? 'Saving…' : 'Save Experience'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const ExperienceEditor = () => {
    const { docs: experiences, loading } = useCollection('experience', 'order');
    const [modal, setModal] = useState(null); // null | exp object
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState('');

    const handleSave = async (data) => {
        setError('');
        try {
            if (modal?.id) { await updateDocument('experience', modal.id, data); }
            else { await addDocument('experience', data); }
            setModal(null);
        } catch (err) {
            console.error('Experience save error:', err);
            setError(`Save failed: ${err.message}. Verify Firestore permissions in Console.`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this experience?")) return;
        setError('');
        setDeleting(id);
        try {
            await deleteDocument('experience', id);
        } catch (err) {
            console.error('Experience delete error:', err);
            setError(`Delete failed: ${err.message}. Verify Firestore permissions in Console.`);
        } finally {
            setDeleting(null);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-editor">
            <div className="admin-editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2>💼 Work Experience</h2>
                    <p>Manage your professional job milestones. Updates reflect on the timeline instantly.</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModal(EMPTY_EXP)} className="admin-save-btn" style={{ flexShrink: 0 }}>
                    <Plus size={16} /> Add Experience
                </motion.button>
            </div>

            <div className="admin-editor-body">
                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        ⚠️ {error}
                    </motion.div>
                )}

                {experiences.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
                        <p style={{ marginBottom: '1rem' }}>No work experience added yet.</p>
                        <button onClick={() => setModal(EMPTY_EXP)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>+ Add your first milestone</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <AnimatePresence>
                            {experiences.map(exp => (
                                <motion.div key={exp.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(129,140,248,0.04)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}
                                >
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>#{exp.order}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{exp.role}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{exp.company}</div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={12} /> {exp.duration}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={12} /> {exp.location}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <button onClick={() => setModal(exp)} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(exp.id)} disabled={deleting === exp.id} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                                            <Trash2 size={13} /> {deleting === exp.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {modal && <Modal experience={modal} onClose={() => setModal(null)} onSave={handleSave} />}
        </div>
    );
};

export default ExperienceEditor;
