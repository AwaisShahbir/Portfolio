import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

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
                {/* Professional Image Logo */}
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
                    <div style={{ position: 'relative', width: '45px', height: '45px' }}>
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
                </motion.div>

                <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#about" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-primary)'; e.target.style.textShadow = '0 0 10px rgba(129,140,248,0.6)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>ABOUT</a>
                    <a href="#projects" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-secondary)'; e.target.style.textShadow = '0 0 10px rgba(167,139,250,0.6)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>WORK</a>
                    <a href="#contact" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(238,242,255,0.75)', letterSpacing: '1px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-gold)'; e.target.style.textShadow = '0 0 10px rgba(251,191,36,0.5)'; }} onMouseOut={e => { e.target.style.color = 'rgba(238,242,255,0.75)'; e.target.style.textShadow = 'none'; }}>CONTACT</a>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
