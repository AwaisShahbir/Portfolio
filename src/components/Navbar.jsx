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
                background: 'linear-gradient(90deg, rgba(8, 12, 20, 0.85) 0%, rgba(20, 15, 30, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderBottom: '1px solid rgba(255, 0, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 240, 255, 0.1) inset',
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
                    className="group relative cursor-pointer"
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    <div style={{ position: 'relative', width: '45px', height: '45px' }}>
                        <img 
                            src="/professional_logo.png" 
                            alt="Logo" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))',
                                position: 'relative',
                                zIndex: 2
                            }} 
                        />
                        {/* Hover Glow */}
                        <div style={{
                            position: 'absolute', inset: -5, background: 'var(--accent-cyan)', filter: 'blur(15px)', opacity: 0,
                            transition: 'opacity 0.3s', zIndex: 0, borderRadius: '50%'
                        }} className="group-hover:opacity-40" />
                    </div>
                </motion.div>

                <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#about" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-cyan)'; e.target.style.textShadow = '0 0 8px var(--accent-cyan)'; }} onMouseOut={e => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.textShadow = 'none'; }}>ABOUT</a>
                    <a href="#projects" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-magenta)'; e.target.style.textShadow = '0 0 8px var(--accent-magenta)'; }} onMouseOut={e => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.textShadow = 'none'; }}>WORK</a>
                    <a href="#contact" style={{ transition: 'all 0.3s', fontWeight: 600, fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }} onMouseOver={e => { e.target.style.color = 'var(--accent-cyan)'; e.target.style.textShadow = '0 0 8px var(--accent-cyan)'; }} onMouseOut={e => { e.target.style.color = 'rgba(255,255,255,0.8)'; e.target.style.textShadow = 'none'; }}>CONTACT</a>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
