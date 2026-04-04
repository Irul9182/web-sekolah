import { useEffect, useRef } from 'react';

export function useFadeUpOnScroll<T extends HTMLElement>(delay = 0, repeat = false) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) return;

        const el = ref.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('show');
                    if (!repeat) {
                        observer.unobserve(el);
                    }
                } else if (repeat) {
                    el.classList.remove('show');
                }
            },
            { threshold: 0.15 },
        );

        el.style.transitionDelay = `${delay}ms`;
        observer.observe(el);

        return () => observer.disconnect();
    }, [delay, repeat]);

    return ref;
}
