import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile screens (< 768px) using window.matchMedia.
 * Supports legacy addListener/removeListener fallbacks for older iOS Safari compatibility.
 * @returns {boolean} isMobile — true when viewport width is under 768px
 */
const useMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(max-width: 767px)').matches;
    });

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 767px)');
        const handler = (e) => setIsMobile(e.matches);

        // Set initial value
        setIsMobile(mql.matches);

        // Listen for changes with legacy fallback for Safari < 14 / iOS
        if (mql.addEventListener) {
            mql.addEventListener('change', handler);
        } else {
            mql.addListener(handler);
        }

        // Cleanup
        return () => {
            if (mql.removeEventListener) {
                mql.removeEventListener('change', handler);
            } else {
                mql.removeListener(handler);
            }
        };
    }, []);

    return isMobile;
};

export default useMobile;
