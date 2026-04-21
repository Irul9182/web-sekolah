import { useEffect, useRef, useState } from 'react';

export default function AnimatedCollapse({ show, children }: { show: boolean; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState('0px');

    const updateHeight = () => {
        if (show && ref.current) {
            setMaxHeight(`${ref.current.scrollHeight}px`);
        }
    };

    useEffect(() => {
        if (!ref.current) return;

        if (show) {
            setMaxHeight(`${ref.current.scrollHeight}px`);

            // Observer supaya height update saat item ditambah/hapus
            const observer = new ResizeObserver(() => {
                if (show && ref.current) {
                    setMaxHeight(`${ref.current.scrollHeight}px`);
                }
            });
            observer.observe(ref.current);
            return () => observer.disconnect();
        } else {
            setMaxHeight('0px');
        }
    }, [show]);

    return (
        <div
            ref={ref}
            style={{
                maxHeight,
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
            }}
        >
            {children}
        </div>
    );
}
