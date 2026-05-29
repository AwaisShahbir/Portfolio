import { useState, useEffect } from 'react';
import {
    doc, collection,
    onSnapshot,
    setDoc, updateDoc, addDoc, deleteDoc,
    serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

// ─── Real-time single document listener ───────────────────────────────────────
export const useDocument = (collectionName, docId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!collectionName || !docId) return;
        const ref = doc(db, collectionName, docId);
        const unsub = onSnapshot(ref,
            (snap) => {
                setData(snap.exists() ? { id: snap.id, ...snap.data() } : null);
                setLoading(false);
            },
            (err) => { setError(err.message); setLoading(false); }
        );
        return unsub;
    }, [collectionName, docId]);

    return { data, loading, error };
};

// ─── Real-time collection listener ────────────────────────────────────────────
export const useCollection = (collectionName, orderField = null) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!collectionName) return;
        const ref = collection(db, collectionName);
        const q = orderField ? query(ref, orderBy(orderField)) : ref;
        const unsub = onSnapshot(q,
            (snap) => {
                setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            },
            (err) => { setError(err.message); setLoading(false); }
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
