import React, { Suspense } from 'react';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import About from '../components/About';
import LoadingSpinner from '../components/LoadingSpinner';
import useEasterEgg from '../hooks/useEasterEgg';
import VoiceAssistant from '../components/VoiceAssistant';

// Code splitting: lazy-load below-the-fold sections
const Experience = React.lazy(() => import('../components/Experience'));
const Projects = React.lazy(() => import('../components/Projects'));
const Contact = React.lazy(() => import('../components/Contact'));

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
            <Suspense fallback={<LoadingSpinner text="Loading..." />}>
                <Experience />
                <Projects />
                <Contact />
            </Suspense>
            <VoiceAssistant />
        </div>
    );
};

export default Portfolio;
