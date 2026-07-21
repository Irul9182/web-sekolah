import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface GaleriImage {
    id: number;
    image_url: string;
}

interface GaleriDetailItem {
    id: number;
    judul: string;
    slug: string;
    images: GaleriImage[];
}

interface PageProps {
    galeri: GaleriDetailItem;
}

export default function PublicGaleriDetail() {
    const { galeri } = usePage<PageProps>().props;
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const showPrev = () => {
        if (activeIndex === null) return;
        setActiveIndex((activeIndex - 1 + galeri.images.length) % galeri.images.length);
    };

    const showNext = () => {
        if (activeIndex === null) return;
        setActiveIndex((activeIndex + 1) % galeri.images.length);
    };

    return (
        <PublicLayout>
            <section className="mx-auto max-w-6xl px-4 py-16 pt-32">
                <Link href="/galeri" className="mb-6 inline-block text-sm" style={{ color: 'var(--primary)' }}>
                    ← Kembali ke Galeri
                </Link>

                <h1 className="mb-8 text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {galeri.judul}
                </h1>

                {galeri.images.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada foto di album ini.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {galeri.images.map((img, i) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveIndex(i)}
                                className="group aspect-square overflow-hidden rounded-xl"
                            >
                                <img
                                    src={img.image_url}
                                    alt={galeri.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {activeIndex !== null && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 px-4"
                    onClick={() => setActiveIndex(null)}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}
                        className="absolute top-6 right-6 text-3xl text-white"
                    >
                        ×
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); showPrev(); }}
                        className="absolute left-4 text-4xl text-white"
                    >
                        ‹
                    </button>

                    <img
                        src={galeri.images[activeIndex].image_url}
                        alt={galeri.judul}
                        className="max-h-[85vh] max-w-full rounded-lg object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => { e.stopPropagation(); showNext(); }}
                        className="absolute right-4 text-4xl text-white"
                    >
                        ›
                    </button>
                </div>
            )}
        </PublicLayout>
    );
}