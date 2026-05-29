import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import { useCollection } from '../hooks/useFirestore';

const ProjectCard = ({ title, subtitle, description, tech, link }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set((clientX - left) / width - 0.5) * 20;
        y.set(((clientY - top) / height - 0.5) * -20);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ perspective: 1000, rotateX: mouseYSpring, rotateY: mouseXSpring }}
            className="glass-panel project-card"
        >
            <div className="project-inner">
                <div>
                    <div className="project-subtitle text-gradient">{subtitle}</div>
                    <h3 className="project-title">{title}</h3>
                    <p className="project-desc">{description}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="project-tech">
                        {(tech || []).map((t, i) => (
                            <motion.span
                                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                key={i} className="tech-tag"
                            >
                                {t}
                            </motion.span>
                        ))}
                    </div>
                    {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent-secondary)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                        >
                            View Project →
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    const { docs: projects, loading } = useCollection('projects', 'order');

    return (
        <section id="projects" className="section-padding relative">
            <motion.div
                animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                className="bg-glow glow-orange" style={{ width: 600, height: 600, top: '20%', right: -300 }}
            />
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <div className="section-label" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
                        My Projects
                    </div>
                    <h2 className="section-heading section-heading-xl text-gradient-magenta">
                        Featured Work
                    </h2>
                </motion.div>

                {loading ? (
                    <LoadingSpinner text="Loading projects..." />
                ) : projects.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No projects yet. Add some from the admin dashboard.</p>
                ) : (
                    <div className="projects-grid">
                        {projects.map(p => (
                            <ProjectCard key={p.id} {...p} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
