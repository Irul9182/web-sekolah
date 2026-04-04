'use client';
import { useFadeUpOnScroll } from '@/hooks/use-fade-up';
import React from 'react';

type FadeUpWrapperProps = {
    delay: number;
    children: React.ReactNode;
    className?: string;
    repeat?: boolean;
};

function FadeUpWrapper({ delay, children, className, repeat = false }: FadeUpWrapperProps) {
    const ref = useFadeUpOnScroll<HTMLDivElement>(delay, repeat);

    return (
        <div ref={ref} className={`fade-up ${className}`}>
            {children}
        </div>
    );
}

export default FadeUpWrapper;
