import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useDocument } from '../hooks/useFirestore';
import { Linkedin, Github } from 'lucide-react';

const Navbar = () => {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 50) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const { data: aboutData } = useDocument('about', 'main');
    const { data: contactData } = useDocument('contact_info', 'main');

    return (
        <motion.nav
            variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="navbar"
        >
            <div className="nav-inner" style={{
                background: 'linear-gradient(90deg, rgba(11, 15, 26, 0.88) 0%, rgba(17, 12, 35, 0.88) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(129, 140, 248, 0.18)',
                borderBottom: '1px solid rgba(167, 139, 250, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 18px rgba(99, 102, 241, 0.08) inset',
                borderRadius: '50px',
                padding: '0.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Professional Image Logo & Brand Name */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                    onMouseEnter={e => {
                        const glow = e.currentTarget.querySelector('.logo-glow');
                        if (glow) glow.style.opacity = '0.4';
                    }}
                    onMouseLeave={e => {
                        const glow = e.currentTarget.querySelector('.logo-glow');
                        if (glow) glow.style.opacity = '0';
                    }}
                >
                    <div style={{ position: 'relative', width: '42px', height: '42px', display: 'flex', alignItems: 'center' }}>
                        <img 
                            src="/professional_logo.png" 
                            alt="Logo" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.55))',
                                position: 'relative',
                                zIndex: 2
                            }} 
                        />
                        {/* Hover Glow */}
                        <div className="logo-glow" style={{
                            position: 'absolute', inset: -5, background: 'var(--accent-primary)', filter: 'blur(15px)', opacity: 0,
                            transition: 'opacity 0.3s', zIndex: 0, borderRadius: '50%'
                        }} />
                    </div>
                    <span className="brand-text" style={{
                        marginLeft: '0.85rem',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        letterSpacing: '2.5px',
                        background: 'linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(129, 140, 248, 0.15)',
                        whiteSpace: 'nowrap'
                    }}>
                        AWAIS SHABBIR
                    </span>
                </motion.div>

                {/* Center Section Navigation Links */}
                <div className="nav-links-center" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', margin: '0 auto' }}>
                    <a href="#about" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1.5px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-primary)'; e.target.style.textShadow = '0 0 10px rgba(129,140,248,0.6)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>ABOUT</a>
                    <a href="#experience" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1.5px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-secondary)'; e.target.style.textShadow = '0 0 10px rgba(167,139,250,0.6)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>EXPERIENCE</a>
                    <a href="#projects" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1.5px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-gold)'; e.target.style.textShadow = '0 0 10px rgba(251,191,36,0.5)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>WORK</a>
                    <a href="#contact" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.85rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1.5px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-primary)'; e.target.style.textShadow = '0 0 10px rgba(129,140,248,0.6)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>CONTACT</a>
                </div>

                {/* Right Call-To-Action & Social Links Container */}
                <div className="nav-right" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {/* Social Icon Buttons */}
                    {(contactData?.linkedin || contactData?.github) && (
                        <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
                            {contactData?.linkedin && (
                                <motion.a 
                                    href={contactData.linkedin.startsWith('http') ? contactData.linkedin : `https://${contactData.linkedin}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    style={{ color: 'rgba(238,242,255,0.75)', display: 'flex', transition: 'color 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                                    onMouseOut={e => e.currentTarget.style.color = 'rgba(238,242,255,0.75)'}
                                >
                                    <Linkedin size={17} />
                                </motion.a>
                            )}
                            {contactData?.github && (
                                <motion.a 
                                    href={contactData.github.startsWith('http') ? contactData.github : `https://${contactData.github}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    style={{ color: 'rgba(238,242,255,0.75)', display: 'flex', transition: 'color 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-secondary)'}
                                    onMouseOut={e => e.currentTarget.style.color = 'rgba(238,242,255,0.75)'}
                                >
                                    <Github size={17} />
                                </motion.a>
                            )}
                        </div>
                    )}

                    {aboutData?.cvUrl && (
                        <a 
                            href={aboutData.cvUrl.startsWith('http') ? aboutData.cvUrl : `https://${aboutData.cvUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                                transition: 'all 0.3s', 
                                fontWeight: 700, 
                                fontSize: '0.8rem', 
                                color: '#fff', 
                                letterSpacing: '1.5px',
                                background: 'rgba(129, 140, 248, 0.1)',
                                border: '1px solid rgba(129, 140, 248, 0.3)',
                                padding: '0.35rem 0.85rem',
                                borderRadius: '50px'
                            }} 
                            onMouseOver={e => { 
                                e.target.style.background = 'rgba(129, 140, 248, 0.2)'; 
                                e.target.style.borderColor = 'var(--accent-primary)'; 
                                e.target.style.boxShadow = '0 0 10px rgba(129,140,248,0.3)'; 
                            }} 
                            onMouseOut={e => { 
                                e.target.style.background = 'rgba(129, 140, 248, 0.1)'; 
                                e.target.style.borderColor = 'rgba(129, 140, 248, 0.3)'; 
                                e.target.style.boxShadow = 'none'; 
                            }}
                        >
                            RESUME
                        </a>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
