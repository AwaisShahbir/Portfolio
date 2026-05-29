import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import Antigravity from './Antigravity';
import LoadingSpinner from './LoadingSpinner';
import { useDocument, addDocument } from '../hooks/useFirestore';
import { serverTimestamp } from 'firebase/firestore';

const listVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const itemVariants = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', bounce: 0.4 } } };

const Contact = () => {
    const { data, loading } = useDocument('contact_info', 'main');
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;
        setStatus('sending');
        try {
            await addDocument('messages', { ...form, read: false, createdAt: serverTimestamp() });
            setStatus('success');
            setForm({ name: '', email: '', message: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="section-padding relative">
            <div className="bg-glow glow-cyan" style={{ width: 600, height: 600, bottom: -200, left: -200 }} />

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                >
                    <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem', color: 'var(--accent-gold)' }}>
                        Get In Touch
                    </div>
                    <h2 className="section-heading section-heading-xl" style={{ marginBottom: '1rem' }}>
                        {data?.sectionTitle || "Let's Connect"}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                        {data?.sectionSubtitle || "Got a project in mind or an opportunity? Let's talk."}
                    </p>
                </motion.div>

                <div className="contact-layout">
                    {/* Contact Info */}
                    <motion.div variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="contact-info">
                        {loading ? <LoadingSpinner text="" /> : (
                            <>
                                <motion.div variants={itemVariants}>
                                    <Antigravity floatSpeed={0.8} moveRange={8}>
                                        <a href={`mailto:${data?.email}`} className="glass-panel contact-item">
                                            <div className="contact-icon" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent-primary)' }}><Mail size={24} /></div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{data?.email}</div>
                                            </div>
                                        </a>
                                    </Antigravity>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Antigravity floatSpeed={1} moveRange={10} delay={0.2}>
                                        <a href={`tel:${data?.phone}`} className="glass-panel contact-item">
                                            <div className="contact-icon" style={{ background: 'rgba(167,139,250,0.12)', color: 'var(--accent-secondary)' }}><Phone size={24} /></div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{data?.phone}</div>
                                            </div>
                                        </a>
                                    </Antigravity>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <Antigravity floatSpeed={0.9} moveRange={12} delay={0.4}>
                                        <div className="glass-panel contact-item" style={{ cursor: 'default' }}>
                                            <div className="contact-icon" style={{ background: 'rgba(251,191,36,0.1)', color: 'var(--accent-gold)' }}><MapPin size={24} /></div>
                                            <div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Location</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{data?.location}</div>
                                            </div>
                                        </div>
                                    </Antigravity>
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                        className="glass-panel contact-form"
                    >
                        {status === 'success' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem' }}>✅</div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem' }}>Message Sent!</h3>
                                <p style={{ color: 'var(--text-muted)' }}>I'll get back to you as soon as possible.</p>
                                <button onClick={() => setStatus('idle')} className="btn-primary" style={{ marginTop: '1rem', border: 'none' }}>Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <input
                                    type="text" className="form-input" placeholder="Name"
                                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    required
                                />
                                <input
                                    type="email" className="form-input" placeholder="Email"
                                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    required
                                />
                                <textarea
                                    rows="4" className="form-input" placeholder="Message"
                                    style={{ resize: 'none' }} value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    required
                                />
                                {status === 'error' && (
                                    <p style={{ color: '#f87171', fontSize: '0.875rem' }}>Failed to send. Please try again.</p>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    type="submit" className="form-submit"
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="footer">
                    <div>© {new Date().getFullYear()} {data?.name || 'Awais Shabbir'}. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {data?.linkedin && (
                            <motion.a whileHover={{ y: -2, color: 'var(--accent-primary)' }} href={data.linkedin} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>LinkedIn <ExternalLink size={14} /></motion.a>
                        )}
                        {data?.github && (
                            <motion.a whileHover={{ y: -2, color: 'var(--accent-primary)' }} href={data.github} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>GitHub <ExternalLink size={14} /></motion.a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
