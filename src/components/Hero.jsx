import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Antigravity from './Antigravity';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
};

const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
        opacity: 1, y: 0, rotateX: 0,
        transition: { type: "spring", stiffness: 150, damping: 10 }
    }
};

const AnimatedText = ({ text, className }) => {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className={`hero-title-stagger ${className}`}>
            {text.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants} className="hero-letter">
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    );
};

const Hero = () => {
    const { scrollY } = useScroll();
    const yParallax = useTransform(scrollY, [0, 800], [0, 300]);
    const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <section id="hero" className="hero-section" style={{ minHeight: '110vh' }}>
            <div className="bg-glow glow-cyan" style={{ width: 800, height: 800, top: -200, left: -300 }} />
            <div className="bg-glow glow-magenta" style={{ width: 600, height: 600, bottom: -100, right: -100 }} />

            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                {[...Array(25)].map((_, i) => (
                    <Antigravity
                        key={i} delay={i * 0.1} floatSpeed={Math.random() * 0.4 + 0.3} moveRange={80}
                        style={{ position: 'absolute', borderRadius: '50%', width: Math.random() * 12 + 4 + 'px', height: Math.random() * 12 + 4 + 'px', backgroundColor: i % 3 === 0 ? 'var(--accent-orange)' : i % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-magenta)', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', opacity: Math.random() * 0.4 + 0.1 }}
                    />
                ))}
            </div>

            <motion.div className="container hero-grid" style={{ y: yParallax, opacity: opacityFade }}>

                {/* Left Content Column */}
                <div style={{ zIndex: 10 }}>
                    <div style={{ display: 'inline-block', position: 'relative' }}>
                        <AnimatedText text="AWAIS" />
                        <div className="text-gradient">
                            <AnimatedText text="SHABBIR" />
                        </div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
                        className="hero-subtitle" style={{ marginTop: '1rem' }}
                    >
                        Software Engineer
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}
                        className="hero-desc" style={{ maxWidth: '500px' }}
                    >
                        Crafting responsive, user-friendly full-stack and mobile applications with modern tools, premium aesthetics, and deep attention to detail.
                    </motion.p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <motion.a
                            href="#projects" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8, duration: 0.5 }}
                            className="btn-primary" style={{ display: 'inline-block' }}
                        >
                            Explore Projects
                        </motion.a>
                        
                        <motion.a
                            href="https://linktr.ee/awaisShabbir" target="_blank" rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.0, duration: 0.5 }}
                            className="btn-secondary" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'var(--text-main)', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s ease' }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'var(--accent-cyan)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.2)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            Social Links
                        </motion.a>
                    </div>
                </div>

                {/* Right Photo Column - Highly Aesthetic Rotating Rings & Circular Crop */}
                <motion.div
                    style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1.2, type: "spring" }}
                >
                    <Antigravity moveRange={20} floatSpeed={1.5}>
                        <div style={{ position: 'relative', width: '380px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                            {/* Spinning Neon Ring Outer */}
                            <motion.div
                                animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px dashed rgba(0, 240, 255, 0.4)', padding: '20px' }}
                            />

                            {/* Spinning Neon Ring Inner (opposite direction) */}
                            <motion.div
                                animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', inset: '15px', borderRadius: '50%', border: '1px solid rgba(255, 0, 60, 0.5)', borderTopColor: 'transparent', padding: '20px' }}
                            />

                            {/* The Picture perfectly masked as a circle */}
                            <div style={{
                                position: 'relative',
                                width: '320px',
                                height: '320px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '4px solid rgba(255,255,255,0.05)',
                                boxShadow: '0 0 50px rgba(0, 240, 255, 0.3)'
                            }} className="glass-panel group">

                                {/* Glow that follows hover inside the circle */}
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'linear-gradient(45deg, var(--accent-cyan), var(--accent-magenta))', opacity: 0.2, transition: 'opacity 0.4s', zIndex: 1
                                }} className="group-hover:opacity-60 mix-blend-overlay" />

                                <img
                                    src="/profile.png"
                                    alt="Awais Shabbir"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.5s' }}
                                    className="group-hover:scale-110"
                                />
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                style={{ position: 'absolute', bottom: '10%', right: '-5%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}
                            >
                                REACT / NODE
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                style={{ position: 'absolute', top: '15%', left: '-10%', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-magenta)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}
                            >
                                FLUTTER
                            </motion.div>
                        </div>
                    </Antigravity>
                </motion.div>

            </motion.div>
        </section>
    );
};

export default Hero;
