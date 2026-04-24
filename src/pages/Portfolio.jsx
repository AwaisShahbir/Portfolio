import React from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import useEasterEgg from '../hooks/useEasterEgg';

const Portfolio = () => {
    const isEasterEggActive = useEasterEgg();

    return (
        <div className={`app-container relative ${isEasterEggActive ? 'hue-rotate-180 invert transition-all duration-1000' : 'transition-all duration-1000'}`}>
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <Contact />
        </div>
    );
};

export default Portfolio;
