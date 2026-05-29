import { setDoc, addDoc, collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const INITIAL_HERO = {
    name: 'AWAIS',
    lastName: 'SHABBIR',
    subtitle: 'Software Engineer',
    bio: 'Crafting responsive, user-friendly full-stack and mobile applications with modern tools, premium aesthetics, and deep attention to detail.',
    btn1Label: 'Explore Projects',
    btn1Link: '#projects',
    btn2Label: 'Social Links',
    btn2Link: 'https://linktr.ee/awaisShabbir',
};

const INITIAL_ABOUT = {
    bio: 'Software Engineering student at Riphah International University skilled in full-stack and Flutter development, with experience in Java and C++. Proficient in React, Next.js, Redux Toolkit, and MongoDB. Passionate about building responsive, user-friendly applications.',
    skills: [
        { name: 'React / Next.js', icon: 'Layout', color: 'var(--accent-primary)' },
        { name: 'Flutter', icon: 'Smartphone', color: 'var(--accent-primary)' },
        { name: 'MongoDB', icon: 'Database', color: 'var(--accent-secondary)' },
        { name: 'Java / C++', icon: 'Cpu', color: 'var(--accent-secondary)' },
        { name: 'Tailwind CSS', icon: 'Code2', color: 'var(--accent-gold)' },
        { name: 'Full-Stack Dev', icon: 'Server', color: 'var(--text-main)' },
        { name: 'GitHub', icon: 'Github', color: 'var(--text-main)' },
    ],
};

const INITIAL_PROJECTS = [
    {
        title: 'AirDash',
        subtitle: 'Cross-Platform File Sharing App',
        description: 'Developed a Flutter app with secure peer-to-peer file sharing and a modern, responsive UI designed for optimal user experience across devices.',
        tech: ['Flutter', 'P2P', 'Dart', 'UI/UX'],
        link: '',
        order: 1,
    },
    {
        title: 'SheetSense',
        subtitle: 'AI Excel Agent',
        description: 'Built an AI-powered Excel assistant to automate data analysis and improve spreadsheet productivity using advanced algorithms.',
        tech: ['AI/ML', 'Excel API', 'Python', 'Automation'],
        link: '',
        order: 2,
    },
];

const INITIAL_CONTACT = {
    email: 'awaiskamboh0810@gmail.com',
    phone: '+92 305 4758667',
    location: 'Pak Arab Society, Lahore',
    linkedin: 'https://www.linkedin.com/in/awais',
    github: 'https://github.com/',
    sectionTitle: "Let's Connect",
    sectionSubtitle: "Got a project in mind or an opportunity? Let's talk.",
    name: 'Awais Shabbir',
};

export const seedFirestore = async () => {
    try {
        // Hero
        await setDoc(doc(db, 'hero', 'main'), INITIAL_HERO);

        // About
        await setDoc(doc(db, 'about', 'main'), INITIAL_ABOUT);

        // Projects — clear existing then add
        const existingProjects = await getDocs(collection(db, 'projects'));
        await Promise.all(existingProjects.docs.map(d => deleteDoc(d.ref)));
        await Promise.all(INITIAL_PROJECTS.map(p => addDoc(collection(db, 'projects'), p)));

        // Contact info
        await setDoc(doc(db, 'contact_info', 'main'), INITIAL_CONTACT);

        return { success: true };
    } catch (err) {
        console.error('Seed error:', err);
        return { success: false, error: err.message };
    }
};
