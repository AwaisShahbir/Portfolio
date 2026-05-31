import React from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import { useCollection } from '../hooks/useFirestore';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import Antigravity from './Antigravity';
import useMobile from '../hooks/useMobile';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } }
};

const Experience = () => {
    const { docs: experiences, loading } = useCollection('experience', 'order');
    const isMobile = useMobile();

    return (
        <section id="experience" className="section-padding relative">
            {/* Background Glows */}
            <div className="bg-glow glow-cyan" style={{ width: 600, height: 600, bottom: -100, left: -200 }} />
            
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
                        My Journey
                    </div>
                    <div className="experience-heading-mobile">
                        <h2 className="section-heading section-heading-lg text-gradient">
                            Work Experience
                        </h2>
                    </div>
                    <div className="experience-heading-desktop">
                        <Antigravity floatSpeed={2.2} moveRange={6}>
                            <h2 className="section-heading section-heading-lg text-gradient">
                                Work Experience
                            </h2>
                        </Antigravity>
                    </div>
                    <p style={{ maxWidth: '620px', margin: '1.25rem auto 0 auto', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65, padding: '0 1rem' }}>
                        Although my corporate industry experience is emerging, I have a deep wealth of practical, hands-on experience designing and building fully featured, high-performance web and mobile applications.
                    </p>
                </div>

                {loading ? (
                    <LoadingSpinner text="" />
                ) : experiences.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p>No experiences added yet. Manage this section in the Admin Dashboard!</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        style={{
                            maxWidth: '750px',
                            margin: '0 auto',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2.5rem'
                        }}
                    >
                        {/* Timeline vertical bar */}
                        <div style={{
                            position: 'absolute',
                            left: isMobile ? '19px' : '24px',
                            top: '8px',
                            bottom: '8px',
                            width: '2px',
                            background: 'linear-gradient(180deg, var(--accent-primary) 0%, rgba(99,102,241,0.1) 100%)',
                            zIndex: 0
                        }} />

                        {experiences.map((exp, idx) => (
                            <motion.div
                                key={exp.id || idx}
                                variants={cardVariants}
                                style={{
                                    display: 'flex',
                                    gap: isMobile ? '1rem' : '2rem',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                {/* Timeline Dot */}
                                <motion.div
                                    whileHover={isMobile ? undefined : { scale: 1.2, backgroundColor: 'var(--accent-secondary)' }}
                                    style={{
                                        width: isMobile ? '40px' : '50px',
                                        height: isMobile ? '40px' : '50px',
                                        borderRadius: '50%',
                                        background: 'rgba(11,15,26,0.95)',
                                        border: '2px solid var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--accent-primary)',
                                        boxShadow: '0 0 15px rgba(129,140,248,0.3)',
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s, border-color 0.3s'
                                    }}
                                >
                                    <Briefcase size={18} />
                                </motion.div>

                                {/* Content Card */}
                                <div className="glass-panel" style={{
                                    flex: 1,
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    transition: 'border-color 0.3s, box-shadow 0.3s',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <div>
                                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                {exp.role}
                                            </h3>
                                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-secondary)' }}>
                                                {exp.company}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mdAlignItems: 'flex-end', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <Calendar size={13} /> {exp.duration}
                                            </span>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <MapPin size={13} /> {exp.location}
                                            </span>
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <p style={{
                                            fontSize: '0.95rem',
                                            lineHeight: 1.7,
                                            color: 'var(--text-muted)',
                                            margin: 0,
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Experience;
