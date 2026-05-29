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
        <div
            className="app-container"
            style={{
                filter: isEasterEggActive ? 'hue-rotate(180deg) invert(1)' : 'none',
                transition: 'filter 1s ease'
            }}
        >
            <Navbar />
            <Hero />
            <About />
            <Projects />
            <Contact />
        </div>
    );
};

export default Portfolio;
