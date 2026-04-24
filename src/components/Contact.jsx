import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import Antigravity from './Antigravity';

const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.4 } }
};

const Contact = () => {
    return (
        <section id="contact" className="section-padding relative">
            <div className="bg-glow glow-cyan" style={{ width: 600, height: 600, bottom: -200, left: -200 }} />

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }} transition={{ type: "spring", bounce: 0.5 }}
                >
                    <h2 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 800 }}>Let's Connect</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                        Got a project in mind or an opportunity? Let's talk.
                    </p>
                </motion.div>

                <div className="contact-layout">
                    <motion.div
                        variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        className="contact-info"
                    >
                        <motion.div variants={itemVariants}>
                            <Antigravity floatSpeed={0.8} moveRange={8}>
                                <a href="mailto:awaiskamboh0810@gmail.com" className="glass-panel contact-item">
                                    <div className="contact-icon" style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)' }}><Mail size={24} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>awaiskamboh0810@gmail.com</div>
                                    </div>
                                </a>
                            </Antigravity>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Antigravity floatSpeed={1} moveRange={10} delay={0.2}>
                                <a href="tel:+923054758667" className="glass-panel contact-item">
                                    <div className="contact-icon" style={{ background: 'rgba(255,0,60,0.1)', color: 'var(--accent-magenta)' }}><Phone size={24} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>+92 305 4758667</div>
                                    </div>
                                </a>
                            </Antigravity>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Antigravity floatSpeed={0.9} moveRange={12} delay={0.4}>
                                <div className="glass-panel contact-item" style={{ cursor: 'default' }}>
                                    <div className="contact-icon" style={{ background: 'rgba(255,94,0,0.1)', color: 'var(--accent-orange)' }}><MapPin size={24} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Location</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>Pak Arab Society, Lahore</div>
                                    </div>
                                </div>
                            </Antigravity>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: 30 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        className="glass-panel contact-form" style={{ perspective: 1000 }}
                    >
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input type="text" className="form-input" placeholder="Name" />
                            </motion.div>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input type="email" className="form-input" placeholder="Email" />
                            </motion.div>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <textarea rows="4" className="form-input" style={{ resize: 'none' }} placeholder="Message"></textarea>
                            </motion.div>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="form-submit">
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                <div className="footer">
                    <div>© {new Date().getFullYear()} Awais Shabbir. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <motion.a whileHover={{ y: -2, color: 'var(--accent-cyan)' }} href="https://www.linkedin.com/in/awais" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>LinkedIn <ExternalLink size={14} /></motion.a>
                        <motion.a whileHover={{ y: -2, color: 'var(--accent-cyan)' }} href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>GitHub <ExternalLink size={14} /></motion.a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
