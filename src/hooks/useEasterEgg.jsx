import { useEffect, useState } from 'react';

const useEasterEgg = () => {
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl + L
            if (e.ctrlKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                setTriggered((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return triggered;
};

export default useEasterEgg;
