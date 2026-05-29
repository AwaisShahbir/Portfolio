import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useDocument, setDocument } from '../../../hooks/useFirestore';
import { ICON_OPTIONS, getIcon } from '../../../utils/iconMap.jsx';
import LoadingSpinner from '../../../components/LoadingSpinner';

const COLOR_OPTIONS = [
    { label: 'Indigo', value: 'var(--accent-primary)' },
    { label: 'Violet', value: 'var(--accent-secondary)' },
    { label: 'Gold', value: 'var(--accent-gold)' },
    { label: 'White', value: 'var(--text-main)' },
];

const AboutEditor = () => {
    const { data, loading } = useDocument('about', 'main');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (data) { setBio(data.bio || ''); setSkills(data.skills || []); }
    }, [data]);

    const addSkill = () => setSkills(s => [...s, { name: 'New Skill', icon: 'Code2', color: 'var(--accent-primary)' }]);
    const removeSkill = (i) => setSkills(s => s.filter((_, idx) => idx !== i));
    const updateSkill = (i, key, val) => setSkills(s => s.map((sk, idx) => idx === i ? { ...sk, [key]: val } : sk));

    const handleSave = async () => {
        setSaving(true);
        await setDocument('about', 'main', { bio, skills });
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-editor">
            <div className="admin-editor-header">
                <h2>👤 About Section</h2>
                <p>Edit your bio and manage your skill cards.</p>
            </div>

            <div className="admin-editor-body">
                {/* Bio */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bio / Description</label>
                    <textarea
                        value={bio} onChange={e => { setBio(e.target.value); setSaved(false); }}
                        rows={5} className="form-input" style={{ resize: 'vertical', fontSize: '0.95rem' }}
                    />
                </div>

                {/* Skills */}
                <div className="admin-section-divider">Skills ({skills.length})</div>
                <AnimatePresence>
                    {skills.map((skill, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end', padding: '1rem', background: 'rgba(129,140,248,0.04)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKILL NAME</label>
                                <input type="text" value={skill.name} onChange={e => updateSkill(i, 'name', e.target.value)} className="form-input" style={{ fontSize: '0.875rem' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>ICON</label>
                                <select value={skill.icon} onChange={e => updateSkill(i, 'icon', e.target.value)} className="form-input admin-select" style={{ fontSize: '0.875rem' }}>
                                    {ICON_OPTIONS.map(ico => <option key={ico} value={ico}>{ico}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>COLOR</label>
                                <select value={skill.color} onChange={e => updateSkill(i, 'color', e.target.value)} className="form-input admin-select" style={{ fontSize: '0.875rem' }}>
                                    {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ color: skill.color }}>{getIcon(skill.icon, 22)}</div>
                                <button onClick={() => removeSkill(i)} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#f87171', display: 'flex' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button onClick={addSkill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px dashed rgba(129,140,248,0.4)', background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            <div className="admin-editor-footer">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="admin-save-btn" disabled={saving}>
                    {saving ? 'Saving…' : saved ? '✅ Saved!' : 'Save Changes'}
                </motion.button>
            </div>
        </div>
    );
};

export default AboutEditor;
