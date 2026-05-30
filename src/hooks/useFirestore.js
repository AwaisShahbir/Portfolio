import { useState, useEffect } from 'react';
import {
    doc, collection,
    onSnapshot,
    setDoc, updateDoc, addDoc, deleteDoc,
    serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

// Hardcoded fallback seed data for 0ms initial load when cache is empty
const FALLBACK_DATA = {
    'hero_main': {
        name: 'AWAIS',
        lastName: 'SHABBIR',
        subtitle: 'Software Engineer',
        bio: 'Crafting responsive, user-friendly full-stack and mobile applications with modern tools, premium aesthetics, and deep attention to detail.',
        btn1Label: 'Explore Projects',
        btn1Link: '#projects',
        btn2Label: 'Social Links',
        btn2Link: 'https://linktr.ee/awaisShabbir',
    },
    'about_main': {
        bio: 'Software Engineering student at Riphah International University skilled in full-stack and Flutter development, with experience in Java and C++. Proficient in React, Next.js, Redux Toolkit, and MongoDB. Passionate about building responsive, user-friendly applications.',
        cvUrl: 'https://drive.google.com/drive/folders/1ho5zJMlKb-Vo-X1wmiO7BGtkDl1dR6Lc?usp=drive_link',
        skills: [
            { name: 'React / Next.js', icon: 'Layout', color: 'var(--accent-primary)' },
            { name: 'Flutter', icon: 'Smartphone', color: 'var(--accent-primary)' },
            { name: 'Firebase', icon: 'Zap', color: 'var(--accent-gold)' },
            { name: 'SQA Engineer', icon: 'ShieldCheck', color: 'var(--accent-secondary)' },
            { name: 'MySQL', icon: 'Database', color: 'var(--accent-primary)' },
            { name: 'MongoDB', icon: 'Database', color: 'var(--accent-secondary)' },
            { name: 'Java / C++', icon: 'Cpu', color: 'var(--accent-secondary)' },
            { name: 'Tailwind CSS', icon: 'Code2', color: 'var(--accent-gold)' },
            { name: 'Full-Stack Dev', icon: 'Server', color: 'var(--text-main)' },
            { name: 'GitHub', icon: 'Github', color: 'var(--text-main)' },
        ],
    },
    'contact_info_main': {
        email: 'awaiskamboh0810@gmail.com',
        phone: '+92 305 4758667',
        location: 'Lahore, Pakistan',
        linkedin: 'https://www.linkedin.com/in/awais-shabbir-971180277',
        github: 'https://github.com/',
        sectionTitle: "Let's Connect",
        sectionSubtitle: "Got a project in mind or an opportunity? Let's talk.",
        name: 'Awais Shabbir',
    },
    'projects': [
        {
            id: 'p1',
            title: 'AirDash',
            subtitle: 'Cross-Platform File Sharing App',
            description: 'Developed a Flutter app with secure peer-to-peer file sharing and a modern, responsive UI designed for optimal user experience across devices.',
            tech: ['Flutter', 'P2P', 'Dart', 'UI/UX'],
            link: '',
            order: 1,
        },
        {
            id: 'p2',
            title: 'SheetSense',
            subtitle: 'AI Excel Agent',
            description: 'Built an AI-powered Excel assistant to automate data analysis and improve spreadsheet productivity using advanced algorithms.',
            tech: ['AI/ML', 'Excel API', 'Python', 'Automation'],
            link: '',
            order: 2,
        },
    ],
    'experience': [
        {
            id: 'e1',
            role: 'Junior Flutter Developer',
            company: 'Blendz Marketing',
            duration: 'Aug 2025 – Apr 2026',
            location: 'Remote, Lahore, Pakistan',
            description: 'Developed and optimized cross-platform Flutter applications for mobile and tablet screens. Designed clean, responsive user interfaces and custom micro-animations. Integrated REST APIs, Firebase authentication, and database services.',
            order: 1,
        }
    ]
};

// ─── Real-time single document listener ───────────────────────────────────────
export const useDocument = (collectionName, docId) => {
    const cacheKey = `doc_${collectionName}_${docId}`;
    const fallbackKey = `${collectionName}_${docId}`;

    const getInitialValue = () => {
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (e) {
            console.error('Error reading localStorage', e);
        }
        return FALLBACK_DATA[fallbackKey] || null;
    };

    const initialVal = getInitialValue();
    const [data, setData] = useState(initialVal);
    const [loading, setLoading] = useState(initialVal === null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!collectionName || !docId) return;
        const ref = doc(db, collectionName, docId);
        const unsub = onSnapshot(ref,
            (snap) => {
                if (snap.exists()) {
                    const snapData = { id: snap.id, ...snap.data() };
                    setData(snapData);
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify(snapData));
                    } catch (e) {
                        console.error('Error writing to localStorage', e);
                    }
                } else {
                    setData(null);
                }
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsub;
    }, [collectionName, docId]);

    return { data, loading, error };
};

// ─── Real-time collection listener ────────────────────────────────────────────
export const useCollection = (collectionName, orderField = null) => {
    const cacheKey = `coll_${collectionName}`;

    const getInitialValue = () => {
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (e) {
            console.error('Error reading localStorage', e);
        }
        return FALLBACK_DATA[collectionName] || [];
    };

    const initialVal = getInitialValue();
    const [docs, setDocs] = useState(initialVal);
    const [loading, setLoading] = useState(initialVal.length === 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!collectionName) return;
        const ref = collection(db, collectionName);
        const q = orderField ? query(ref, orderBy(orderField)) : ref;
        const unsub = onSnapshot(q,
            (snap) => {
                const snapDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setDocs(snapDocs);
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(snapDocs));
                } catch (e) {
                    console.error('Error writing to localStorage', e);
                }
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
        return unsub;
    }, [collectionName, orderField]);

    return { docs, loading, error };
};

// ─── Write helpers ─────────────────────────────────────────────────────────────
export const setDocument = (collectionName, docId, data) =>
    setDoc(doc(db, collectionName, docId), { ...data, updatedAt: serverTimestamp() }, { merge: true });

export const updateDocument = (collectionName, docId, data) =>
    updateDoc(doc(db, collectionName, docId), { ...data, updatedAt: serverTimestamp() });

export const addDocument = (collectionName, data) =>
    addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });

export const deleteDocument = (collectionName, docId) =>
    deleteDoc(doc(db, collectionName, docId));
