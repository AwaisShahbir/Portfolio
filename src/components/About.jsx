import React from 'react';
import { motion } from 'framer-motion';
import Antigravity from './Antigravity';
import { Code2, Database, Smartphone, Layout, Server, Cpu, Github } from 'lucide-react';

const skills = [
    { name: "React / Next.js", icon: <Layout size={32} />, color: "var(--accent-cyan)" },
    { name: "Flutter", icon: <Smartphone size={32} />, color: "var(--accent-cyan)" },
    { name: "MongoDB", icon: <Database size={32} />, color: "var(--accent-magenta)" },
    { name: "Java / C++", icon: <Cpu size={32} />, color: "var(--accent-magenta)" },
    { name: "Tailwind CSS", icon: <Code2 size={32} />, color: "#ff5e00" },
    { name: "Full-Stack Dev", icon: <Server size={32} />, color: "var(--text-main)" },
    { name: "GitHub", icon: <Github size={32} />, color: "var(--text-main)" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const About = () => {
    return (
        <section id="about" className="section-padding relative">
            <div className="container" style={{ position: 'relative', zIndex: 10 }}>

                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="about-header"
                >
                    <Antigravity floatSpeed={2} moveRange={5}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '2rem', fontWeight: 800 }} className="text-gradient">
                            About Me
                        </h2>
                    </Antigravity>
                    <p className="about-desc">
                        Software Engineering student at Riphah International University skilled in full-stack and Flutter development, with experience in Java and C++. Proficient in React, Next.js, Redux Toolkit, and MongoDB. Passionate about building responsive, user-friendly applications.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="skills-grid"
                >
                    {skills.map((skill, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Antigravity delay={index * 0.2} floatSpeed={Math.random() * 0.5 + 0.8} moveRange={20}>
                                <motion.div
                                    className="glass-panel skill-card group"
                                    whileHover={{ scale: 1.1, rotateZ: (index % 2 === 0 ? 5 : -5) }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div style={{ color: skill.color, transition: 'transform 0.3s' }}>
                                        {skill.icon}
                                    </div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{skill.name}</span>
                                </motion.div>
                            </Antigravity>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default About;
