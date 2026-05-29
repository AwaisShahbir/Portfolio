import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, text = "Loading..." }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '1rem', padding: '3rem'
    }}>
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
                width: size, height: size, borderRadius: '50%',
                border: '3px solid rgba(129,140,248,0.15)',
                borderTopColor: 'var(--accent-primary)',
            }}
        />
        {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{text}</p>}
    </div>
);

export default LoadingSpinner;
