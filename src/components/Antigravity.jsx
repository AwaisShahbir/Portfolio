import React from 'react';
import { motion } from 'framer-motion';

/**
 * Antigravity wrapper that applies slow vertical float + horizontal drift.
 * Randomizes per instance to look organic.
 */
const Antigravity = ({ children, delay = 0, floatSpeed = 1, moveRange = 20, className = "" }) => {
    // We use keyframes to simulate continuous multi-axis fluid movement
    const randomY = Math.random() * moveRange;
    const randomX = Math.random() * (moveRange / 2);
    const duration = (Math.random() * 4 + 6) / floatSpeed; // 6 to 10 seconds

    return (
        <motion.div
            className={className}
            initial={{ y: 0, x: 0 }}
            animate={{
                y: [0, -randomY, 0],
                x: [0, randomX, -randomX, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay,
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        >
            {children}
        </motion.div>
    );
};

export default Antigravity;
