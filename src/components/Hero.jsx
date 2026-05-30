import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Antigravity from './Antigravity';
import LoadingSpinner from './LoadingSpinner';
import { useDocument } from '../hooks/useFirestore';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};
const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 150, damping: 10 } }
};

const AnimatedText = ({ text, className }) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={`hero-title-stagger ${className || ''}`}>
        {text.split('').map((char, i) => (
            <motion.span key={i} variants={letterVariants} className="hero-letter">
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
    </motion.div>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const yTransform = useTransform(scrollY, [0, 800], [0, 300]);
    const opacityTransform = useTransform(scrollY, [0, 500], [1, 0]);
    const yParallax = isMobile ? 0 : yTransform;
    const opacityFade = isMobile ? 1 : opacityTransform;
    const { data, loading } = useDocument('hero', 'main');

    return (
        <section id="hero" className="hero-section" style={{ minHeight: isMobile ? 'auto' : '110vh' }}>
            <div className="bg-glow glow-cyan" style={{ width: 800, height: 800, top: -200, left: -300 }} />
            <div className="bg-glow glow-magenta" style={{ width: 600, height: 600, bottom: -100, right: -100 }} />

            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                {[...Array(isMobile ? 8 : 25)].map((_, i) => {
                    const size = Math.random() * 10 + 4;
                    const style = {
                        position: 'absolute',
                        borderRadius: '50%',
                        width: size + 'px',
                        height: size + 'px',
                        backgroundColor: i % 3 === 0 ? 'var(--accent-orange)' : i % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-magenta)',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                        opacity: Math.random() * 0.3 + 0.1
                    };
                    if (isMobile) {
                        return <div key={i} style={style} />;
                    }
                    return (
                        <Antigravity key={i} delay={i * 0.1} floatSpeed={Math.random() * 0.4 + 0.3} moveRange={80} style={style} />
                    );
                })}
            </div>

            <motion.div className="container hero-grid" style={{ y: yParallax, opacity: opacityFade }}>
                {/* Left Content */}
                <div style={{ zIndex: 10 }}>
                    {loading ? (
                        <LoadingSpinner text="Loading..." />
                    ) : (
                        <>
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
                                className="hero-title"
                                style={{
                                    fontFamily: 'Outfit, sans-serif',
                                    fontWeight: 900,
                                    lineHeight: 1.05,
                                    letterSpacing: '-1.5px',
                                    fontSize: isMobile ? 'clamp(2.2rem, 8vw, 3rem)' : 'clamp(2.8rem, 7vw, 5.8rem)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isMobile ? 'center' : 'flex-start',
                                    textAlign: isMobile ? 'center' : 'left'
                                }}
                            >
                                <span>{data?.name || 'AWAIS'}</span>
                                <span className="text-gradient">{data?.lastName || 'SHABBIR'}</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="hero-subtitle" style={{ marginTop: '1rem', color: 'var(--accent-secondary)' }}
                            >
                                {data?.subtitle || 'Software Engineer'}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.5, duration: 0.8 }}
                                className="hero-desc" style={{ maxWidth: '500px' }}
                            >
                                {data?.bio || ''}
                            </motion.p>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'nowrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                                <motion.a
                                    href={data?.btn1Link || '#projects'}
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.8, duration: 0.5 }}
                                    className="btn-primary" style={{ display: 'inline-block', padding: isMobile ? '10px 20px' : '1rem 2.5rem', fontSize: isMobile ? '0.85rem' : '1rem' }}
                                >
                                    {data?.btn1Label || 'Explore Projects'}
                                </motion.a>
                                <motion.a
                                    href={data?.btn2Link || '#'}
                                    target="_blank" rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 2.0, duration: 0.5 }}
                                    style={{ display: 'inline-block', padding: isMobile ? '10px 18px' : '12px 24px', borderRadius: '30px', border: '1px solid rgba(129,140,248,0.3)', backgroundColor: 'rgba(99,102,241,0.08)', backdropFilter: 'blur(10px)', color: 'var(--text-main)', fontWeight: 600, textDecoration: 'none', transition: 'all 0.3s ease', fontSize: isMobile ? '0.85rem' : '1rem' }}
                                    onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(99,102,241,0.25)'; }}
                                    onMouseOut={e => { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(129,140,248,0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    {data?.btn2Label || 'Social Links'}
                                </motion.a>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Photo Column */}
                <motion.div
                    style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center' }}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1.2, type: 'spring' }}
                >
                    <Antigravity moveRange={20} floatSpeed={1.5}>
                        <div style={{ position: 'relative', width: isMobile ? 'clamp(210px, 65vw, 270px)' : 'clamp(280px, 85vw, 400px)', height: isMobile ? 'clamp(210px, 65vw, 270px)' : 'clamp(280px, 85vw, 400px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Outer glow pulse */}
                            <motion.div
                                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(167,139,250,0.12) 50%, transparent 70%)', pointerEvents: 'none' }}
                            />
                            {/* Conic gradient border ring */}
                            <motion.div
                                animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                                style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'conic-gradient(from 0deg, #6366f1, #a78bfa, #fbbf24, #818cf8, #6366f1)', padding: '3px', zIndex: 1 }}
                            >
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-color)' }} />
                            </motion.div>
                            {/* Dashed accent ring */}
                            <motion.div
                                animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                                style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px dashed rgba(129,140,248,0.3)', zIndex: 2 }}
                            />
                            {/* Profile circle */}
                            <div style={{ position: 'relative', width: isMobile ? 'clamp(180px, 55vw, 230px)' : 'clamp(240px, 72vw, 340px)', height: isMobile ? 'clamp(180px, 55vw, 230px)' : 'clamp(240px, 72vw, 340px)', borderRadius: '50%', overflow: 'hidden', zIndex: 3, boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(167,139,250,0.18), inset 0 0 30px rgba(0,0,0,0.3)' }}
                                onMouseEnter={e => { const o = e.currentTarget.querySelector('.photo-overlay'); const img = e.currentTarget.querySelector('img'); if (o) o.style.opacity = '0.45'; if (img) img.style.transform = 'scale(1.08)'; }}
                                onMouseLeave={e => { const o = e.currentTarget.querySelector('.photo-overlay'); const img = e.currentTarget.querySelector('img'); if (o) o.style.opacity = '0.15'; if (img) img.style.transform = 'scale(1)'; }}
                            >
                                <div className="photo-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(99,102,241,0.2) 0%, transparent 50%, rgba(167,139,250,0.15) 100%)', opacity: 0.15, transition: 'opacity 0.5s', zIndex: 2, mixBlendMode: 'overlay' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, rgba(11,15,26,0.5), transparent)', zIndex: 2, pointerEvents: 'none' }} />
                                <img src="/profile.png" alt={data?.name || 'Profile'} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.6s ease', display: 'block' }} />
                            </div>
                            {/* Floating badges */}
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ position: 'absolute', bottom: '8%', right: isMobile ? '0%' : '-8%', background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(16px)', padding: '8px 18px', borderRadius: '30px', border: '1px solid rgba(129,140,248,0.3)', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '1.5px', zIndex: 5, boxShadow: '0 4px 20px rgba(99,102,241,0.2)' }}>
                                ⚛ REACT / NODE
                            </motion.div>
                            <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                style={{ position: 'absolute', top: '12%', left: isMobile ? '0%' : '-10%', background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(16px)', padding: '8px 18px', borderRadius: '30px', border: '1px solid rgba(167,139,250,0.3)', color: 'var(--accent-secondary)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '1.5px', zIndex: 5, boxShadow: '0 4px 20px rgba(167,139,250,0.2)' }}>
                                🎯 FLUTTER
                            </motion.div>
                        </div>
                    </Antigravity>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
