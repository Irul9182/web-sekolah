import { useEffect, useState } from 'react';

/**
 * Hook untuk menganimasi angka dari 0 ke target secara mulus.
 * @param targetValue - Angka tujuan akhir.
 * @param duration - Durasi animasi dalam milidetik.
 * @param trigger - Kondisi kapan animasi dimulai (misal: isMounted).
 */
export const useCountUp = (targetValue: number, duration: number = 1000, trigger: boolean = true): number => {
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (!trigger) {
            setCount(0);
            return;
        }

        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;

            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            setCount(Math.floor(progress * targetValue));

            if (progress < 1) {
                animationFrameId = window.requestAnimationFrame(step);
            }
        };

        animationFrameId = window.requestAnimationFrame(step);

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [targetValue, duration, trigger]);

    return count;
};
