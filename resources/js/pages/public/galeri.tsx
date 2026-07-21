import { Input } from '@/components/ui/input';
import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface GaleriImage {
    id: number;
    image_url: string;
}

interface GaleriItem {
    id: number;
    judul: string;
    slug: string;
    images: GaleriImage[];
}

interface PaginatedGaleri {
    data: GaleriItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    galeris: PaginatedGaleri;
    filters: { search: string };
}

export default function PublicGaleriIndex() {
    const { galeris, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('public.galeri'), { search: val }, { preserveState: true, replace: true });
        }, 400);
    };

    const goToPage = (page: number) => {
        router.get(route('public.galeri'), { search, page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout>
            <section className="mx-auto max-w-7xl px-4 py-16 pt-32">
                <SectionHeader title="Galeri Sekolah" />

                <div className="mb-8 max-w-sm">
                    <Input placeholder="Cari foto..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>

                {galeris.data.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada foto galeri.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {galeris.data.map((g) => (
                            <Link key={g.id} href={route('public.galeri.show', g.slug)} className="group relative aspect-square overflow-hidden rounded-xl">
                                <img
                                    src={g.images?.[0]?.image_url || '/images/default-img.png'}
                                    alt={g.judul}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="text-sm font-medium text-white">{g.judul}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {galeris.last_page > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {Array.from({ length: galeris.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className="rounded-md px-3 py-1.5 text-sm font-medium"
                                style={{
                                    backgroundColor: page === galeris.current_page ? 'var(--primary)' : 'var(--secondary)',
                                    color: page === galeris.current_page ? 'var(--primary-foreground)' : 'var(--foreground)',
                                }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
