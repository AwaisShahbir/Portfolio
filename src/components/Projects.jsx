import React from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

const ProjectCard = ({ title, subtitle, description, tech, gradient }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPos = clientX - left;
        const yPos = clientY - top;

        // For 3D Tilt: center is 0, edges are -1 to 1
        x.set((xPos / width - 0.5) * 20); // max 10 deg rotation
        y.set((yPos / height - 0.5) * -20);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, type: "spring" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000, rotateX: mouseYSpring, rotateY: mouseXSpring }}
            className="glass-panel project-card group"
        >
            {/* Spotlight is done via radial gradients using motion logic if needed, but 3d tilt is better */}
            <div className="project-inner">
                <div>
                    <div className="project-subtitle text-gradient">{subtitle}</div>
                    <h3 className="project-title">{title}</h3>
                    <p className="project-desc">{description}</p>
                </div>
                <div className="project-tech">
                    {tech.map((t, i) => (
                        <motion.span
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            key={i} className="tech-tag block"
                        >
                            {t}
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="section-padding relative">
            <motion.div
                animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="bg-glow glow-orange" style={{ width: 600, height: 600, top: '20%', right: -300 }}
            />

            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '4rem', fontWeight: 800 }}
                    className="text-gradient-magenta"
                >
                    Featured Work
                </motion.h2>

                <div className="projects-grid">
                    <ProjectCard
                        title="AirDash" subtitle="Cross-Platform File Sharing App"
                        description="Developed a Flutter app with secure peer-to-peer file sharing and a modern, responsive UI designed for optimal user experience across devices."
                        tech={["Flutter", "P2P", "Dart", "UI/UX"]} gradient="rgba(0, 240, 255, 0.4)"
                    />
                    <ProjectCard
                        title="SheetSense" subtitle="AI Excel Agent"
                        description="Built an AI-powered Excel assistant to automate data analysis and improve spreadsheet productivity using advanced algorithms."
                        tech={["AI/ML", "Excel API", "Python", "Automation"]} gradient="rgba(255, 0, 60, 0.4)"
                    />
                </div>
            </div>
        </section>
    );
};

export default Projects;
