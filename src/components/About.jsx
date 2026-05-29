import React from 'react';
import { motion } from 'framer-motion';
import Antigravity from './Antigravity';
import LoadingSpinner from './LoadingSpinner';
import { useDocument } from '../hooks/useFirestore';
import { getIcon } from '../utils/iconMap.jsx';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const About = () => {
    const { data, loading } = useDocument('about', 'main');
    const skills = data?.skills || [];

    return (
        <section id="about" className="section-padding relative">
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                    className="about-header"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}
                    >
                        Who I Am
                    </motion.div>
                    <Antigravity floatSpeed={2} moveRange={5}>
                        <h2 className="section-heading section-heading-lg text-gradient" style={{ marginBottom: '1.5rem' }}>
                            About Me
                        </h2>
                    </Antigravity>
                    {loading ? <LoadingSpinner text="" /> : (
                        <p className="about-desc">{data?.bio || ''}</p>
                    )}
                </motion.div>

                {!loading && skills.length > 0 && (
                    <motion.div
                        variants={containerVariants} initial="hidden"
                        whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                        className="skills-grid"
                    >
                        {skills.map((skill, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <Antigravity delay={index * 0.2} floatSpeed={Math.random() * 0.5 + 0.8} moveRange={20}>
                                    <motion.div
                                        className="glass-panel skill-card"
                                        whileHover={{ scale: 1.1, rotateZ: (index % 2 === 0 ? 5 : -5) }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <div style={{ color: skill.color, transition: 'transform 0.3s' }}>
                                            {getIcon(skill.icon, 28)}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>
                                            {skill.name}
                                        </span>
                                    </motion.div>
                                </Antigravity>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default About;
