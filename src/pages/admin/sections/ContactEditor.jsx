import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDocument, setDocument } from '../../../hooks/useFirestore';
import LoadingSpinner from '../../../components/LoadingSpinner';

const Field = ({ label, name, value, onChange, hint, type = 'text' }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className="form-input" style={{ fontSize: '0.95rem' }} />
        {hint && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
);

const ContactEditor = () => {
    const { data, loading } = useDocument('contact_info', 'main');
    const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', linkedin: '', github: '', sectionTitle: '', sectionSubtitle: '' });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (data) setForm({
            name: data.name || '', email: data.email || '', phone: data.phone || '',
            location: data.location || '', linkedin: data.linkedin || '', github: data.github || '',
            sectionTitle: data.sectionTitle || '', sectionSubtitle: data.sectionSubtitle || ''
        });
    }, [data]);

    const handleChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setSaved(false); };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await setDocument('contact_info', 'main', form);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error('Contact info save error:', err);
            setError(`Save failed: ${err.message}. Verify Firestore database is created and Security Rules allow writes.`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-editor">
            <div className="admin-editor-header">
                <h2>📬 Contact Info</h2>
                <p>Update your contact details and social links displayed on the portfolio.</p>
            </div>

            <div className="admin-editor-body">
                <div className="admin-section-divider">Display Name & Section Text</div>
                <Field label="Your Name (for footer)" name="name" value={form.name} onChange={handleChange} hint='Shown in: © 2025 [Your Name]' />
                <div className="admin-grid-2">
                    <Field label="Section Title" name="sectionTitle" value={form.sectionTitle} onChange={handleChange} hint="e.g. Let's Connect" />
                    <Field label="Section Subtitle" name="sectionSubtitle" value={form.sectionSubtitle} onChange={handleChange} hint="Short tagline under heading" />
                </div>

                <div className="admin-section-divider">Contact Details</div>
                <div className="admin-grid-2">
                    <Field label="Email" name="email" value={form.email} onChange={handleChange} type="email" />
                    <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} hint="e.g. +92 305 1234567" />
                </div>
                <Field label="Location" name="location" value={form.location} onChange={handleChange} hint="e.g. Lahore, Pakistan" />

                <div className="admin-section-divider">Social Links</div>
                <div className="admin-grid-2">
                    <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} hint="Full URL: https://linkedin.com/in/..." />
                    <Field label="GitHub URL" name="github" value={form.github} onChange={handleChange} hint="Full URL: https://github.com/..." />
                </div>
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

export default ContactEditor;
