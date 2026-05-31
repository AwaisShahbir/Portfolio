import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FileDown, Upload, Eye } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDocument, setDocument } from '../../../hooks/useFirestore';
import { ICON_OPTIONS, getIcon } from '../../../utils/iconMap.jsx';
import { storage } from '../../../firebaseAdmin';
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
    const [cvUrl, setCvUrl] = useState('');
    const [uploadingCv, setUploadingCv] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) { 
            setBio(data.bio || ''); 
            setSkills(data.skills || []); 
            setCvUrl(data.cvUrl || '');
        }
    }, [data]);

    const handleCvUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setUploadError('Only PDF files are supported.');
            return;
        }

        setUploadingCv(true);
        setUploadError('');
        try {
            const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
            const storageRef = ref(storage, `resumes/${fileName}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            setCvUrl(downloadUrl);
            setSaved(false);
        } catch (err) {
            console.error('CV upload error:', err);
            setUploadError(`Upload failed: ${err.message}. (Make sure Firebase Storage is enabled in Console and rules allow writes).`);
        } finally {
            setUploadingCv(false);
        }
    };

    const addSkill = () => setSkills(s => [...s, { name: 'New Skill', icon: 'Code2', color: 'var(--accent-primary)' }]);
    const removeSkill = (i) => setSkills(s => setSaved(false) || s.filter((_, idx) => idx !== i));
    const updateSkill = (i, key, val) => setSkills(s => setSaved(false) || s.map((sk, idx) => idx === i ? { ...sk, [key]: val } : sk));

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await setDocument('about', 'main', { bio, skills, cvUrl });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('About section save error:', err);
            setError(`Save failed: ${err.message}. Please verify Firestore is created and Security Rules permit writes.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-editor">
            <div className="admin-editor-header">
                <h2>👤 About Section</h2>
                <p>Edit your bio, manage your skill cards, and upload your CV / Resume.</p>
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

                {/* CV / Resume Option */}
                <div className="admin-section-divider">📄 CV / Resume Document</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(129,140,248,0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>CV / Resume File Link</label>
                        <input
                            type="text" value={cvUrl} onChange={e => { setCvUrl(e.target.value); setSaved(false); }}
                            className="form-input" placeholder="https://... or upload a local PDF below"
                            style={{ fontSize: '0.875rem' }}
                        />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.2rem' }}>
                            💡 <strong>Firebase Free (Spark) Plan Tip:</strong> Since Firebase Storage requires a billing account, you can simply upload your CV PDF to <strong>Google Drive</strong>, <strong>GitHub</strong>, or <strong>Dropbox</strong>, make the link shareable (accessible to anyone), and paste the URL in the box above!
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Upload Local PDF</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input
                                type="file" accept=".pdf" onChange={handleCvUpload}
                                style={{ display: 'none' }} id="cv-upload-input" disabled={uploadingCv}
                            />
                            <label
                                htmlFor="cv-upload-input"
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.65rem 1.25rem', borderRadius: '10px',
                                    border: '1px solid rgba(129,140,248,0.3)', background: 'rgba(129,140,248,0.06)',
                                    color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600,
                                    cursor: 'pointer', opacity: uploadingCv ? 0.6 : 1, transition: 'all 0.2s'
                                }}
                            >
                                <Upload size={14} />
                                {uploadingCv ? 'Uploading PDF...' : 'Choose PDF File'}
                            </label>
                            {cvUrl && (
                                <a
                                    href={cvUrl} target="_blank" rel="noreferrer"
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600, textDecoration: 'none' }}
                                >
                                    <Eye size={13} /> View File ↗
                                </a>
                            )}
                        </div>
                        {uploadError && <span style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.2rem' }}>{uploadError}</span>}
                    </div>
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

            <div className="admin-editor-footer" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ width: '100%', padding: '0.75rem 1.25rem', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', fontSize: '0.875rem' }}>
                        ⚠️ {error}
                    </motion.div>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="admin-save-btn" disabled={saving}>
                    {saving ? 'Saving…' : saved ? '✅ Saved!' : 'Save Changes'}
                </motion.button>
            </div>
        </div>
    );
};

export default AboutEditor;
