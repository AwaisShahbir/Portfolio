import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDocument, setDocument } from '../../../hooks/useFirestore';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Field = ({ label, name, value, onChange, type = 'text', hint }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</label>
        <input
            type={type} name={name} value={value} onChange={onChange}
            className="form-input" style={{ fontSize: '0.95rem' }}
        />
        {hint && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
);

const HeroEditor = () => {
    const { data, loading } = useDocument('hero', 'main');
    const [form, setForm] = useState({ name: '', lastName: '', subtitle: '', bio: '', btn1Label: '', btn1Link: '', btn2Label: '', btn2Link: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => { if (data) setForm({ name: data.name || '', lastName: data.lastName || '', subtitle: data.subtitle || '', bio: data.bio || '', btn1Label: data.btn1Label || '', btn1Link: data.btn1Link || '', btn2Label: data.btn2Label || '', btn2Link: data.btn2Link || '' }); }, [data]);

    const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setSaved(false); };

    const handleSave = async () => {
        setSaving(true);
        await setDocument('hero', 'main', form);
        setSaving(false); setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-editor">
            <div className="admin-editor-header">
                <h2>🏠 Hero Section</h2>
                <p>Edit the main headline, subtitle, bio text, and CTA buttons.</p>
            </div>

            <div className="admin-editor-body">
                <div className="admin-grid-2">
                    <Field label="First Name" name="name" value={form.name} onChange={handleChange} hint='E.g. "AWAIS"' />
                    <Field label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} hint='E.g. "SHABBIR"' />
                </div>
                <Field label="Role / Subtitle" name="subtitle" value={form.subtitle} onChange={handleChange} hint='E.g. "Software Engineer"' />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Bio / Description</label>
                    <textarea
                        name="bio" value={form.bio} onChange={handleChange} rows={4}
                        className="form-input" style={{ resize: 'vertical', fontSize: '0.95rem' }}
                    />
                </div>

                <div className="admin-section-divider">Button 1 (Primary)</div>
                <div className="admin-grid-2">
                    <Field label="Button Label" name="btn1Label" value={form.btn1Label} onChange={handleChange} />
                    <Field label="Button Link" name="btn1Link" value={form.btn1Link} onChange={handleChange} hint='E.g. "#projects" or full URL' />
                </div>

                <div className="admin-section-divider">Button 2 (Secondary)</div>
                <div className="admin-grid-2">
                    <Field label="Button Label" name="btn2Label" value={form.btn2Label} onChange={handleChange} />
                    <Field label="Button Link" name="btn2Link" value={form.btn2Link} onChange={handleChange} hint='E.g. "https://linktr.ee/..."' />
                </div>
            </div>

            <div className="admin-editor-footer">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSave} className="admin-save-btn" disabled={saving}>
                    {saving ? 'Saving…' : saved ? '✅ Saved!' : 'Save Changes'}
                </motion.button>
            </div>
        </div>
    );
};

export default HeroEditor;
