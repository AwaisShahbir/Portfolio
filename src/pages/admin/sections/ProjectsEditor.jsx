import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { useCollection, addDocument, updateDocument, deleteDocument } from '../../../hooks/useFirestore';
import LoadingSpinner from '../../../components/LoadingSpinner';

const EMPTY_PROJECT = { title: '', subtitle: '', description: '', tech: '', link: '', order: 99 };

const Modal = ({ project, onClose, onSave }) => {
    const [form, setForm] = useState({
        title: project?.title || '', subtitle: project?.subtitle || '',
        description: project?.description || '',
        tech: Array.isArray(project?.tech) ? project.tech.join(', ') : (project?.tech || ''),
        link: project?.link || '', order: project?.order ?? 99
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await onSave({ ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean), order: Number(form.order) });
        setSaving(false);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', maxWidth: '560px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}
            >
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem' }}>{project?.id ? 'Edit Project' : 'Add Project'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={20} /></button>
                </div>
                <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    {[
                        { label: 'Project Title', key: 'title', placeholder: 'e.g. AirDash' },
                        { label: 'Subtitle / Category', key: 'subtitle', placeholder: 'e.g. Cross-Platform File Sharing' },
                        { label: 'Project Link (optional)', key: 'link', placeholder: 'https://...' },
                        { label: 'Order (for sorting)', key: 'order', placeholder: '1', type: 'number' },
                    ].map(({ label, key, placeholder, type }) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</label>
                            <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="form-input" style={{ fontSize: '0.9rem' }} />
                        </div>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Description</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="form-input" style={{ resize: 'vertical', fontSize: '0.9rem' }} placeholder="Project description..." />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Tech Stack <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(comma separated)</span></label>
                        <input type="text" value={form.tech} onChange={e => setForm(f => ({ ...f, tech: e.target.value }))} placeholder="React, Node.js, MongoDB" className="form-input" style={{ fontSize: '0.9rem' }} />
                    </div>
                </div>
                <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="admin-save-btn" disabled={saving}>
                        {saving ? 'Saving…' : 'Save Project'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

const ProjectsEditor = () => {
    const { docs: projects, loading } = useCollection('projects', 'order');
    const [modal, setModal] = useState(null); // null | 'new' | project object
    const [deleting, setDeleting] = useState(null);
    const [error, setError] = useState('');

    const handleSave = async (data) => {
        setError('');
        try {
            if (modal?.id) { await updateDocument('projects', modal.id, data); }
            else { await addDocument('projects', data); }
            setModal(null);
        } catch (err) {
            console.error('Projects save error:', err);
            setError(`Save failed: ${err.message}. Verify Firestore permissions in Console.`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        setError('');
        setDeleting(id);
        try {
            await deleteDocument('projects', id);
        } catch (err) {
            console.error('Projects delete error:', err);
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
                    <h2>💼 Projects</h2>
                    <p>Add, edit, or remove portfolio projects. Changes appear on the public site instantly.</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setModal(EMPTY_PROJECT)} className="admin-save-btn" style={{ flexShrink: 0 }}>
                    <Plus size={16} /> Add Project
                </motion.button>
            </div>

            <div className="admin-editor-body">
                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        ⚠️ {error}
                    </motion.div>
                )}
                {projects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
                        <p style={{ marginBottom: '1rem' }}>No projects yet.</p>
                        <button onClick={() => setModal(EMPTY_PROJECT)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>+ Add your first project</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <AnimatePresence>
                            {projects.map(p => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'rgba(129,140,248,0.04)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}
                                >
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>#{p.order}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{p.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.subtitle}</div>
                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                                            {(p.tech || []).slice(0, 4).map((t, i) => (
                                                <span key={i} style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '50px', background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)', fontWeight: 600 }}>{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                        <button onClick={() => setModal(p)} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                                            <Pencil size={13} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                                            <Trash2 size={13} /> {deleting === p.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {modal && <Modal project={modal} onClose={() => setModal(null)} onSave={handleSave} />}
        </div>
    );
};

export default ProjectsEditor;
