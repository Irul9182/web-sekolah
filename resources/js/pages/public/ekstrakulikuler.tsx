import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { Link, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface EkstrakulikulerItem {
    id: number;
    nama: string;
    deskripsi: string;
    slug: string;
    thumbnail: string | null;
    prestasis_count?: number;
}

interface PaginatedEkstrakulikuler {
    data: EkstrakulikulerItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    ekstrakulikulers: PaginatedEkstrakulikuler;
    filters: { search: string };
}

export default function PublicEkstrakulikulerIndex() {
    const { ekstrakulikulers, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('public.ekstrakulikuler'), { search: val }, { preserveState: true, replace: true });
        }, 400);
    };

    const goToPage = (page: number) => {
        router.get(route('public.ekstrakulikuler'), { search, page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout>
            <section className="mx-auto max-w-7xl px-4 py-16 pt-32">
                <SectionHeader title="Ekstrakulikuler" />

                <div className="mb-8 max-w-sm">
                    <Input placeholder="Cari ekstrakulikuler..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>

                {ekstrakulikulers.data.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada ekstrakulikuler.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {ekstrakulikulers.data.map((e) => (
                            <Link key={e.id} href={route('public.ekstrakulikuler.show', e.slug)}>
                                <Card
                                    className="group overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                                >
                                    <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                                        <img
                                            src={e.thumbnail || '/images/default-img.png'}
                                            alt={e.nama}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <p className="mb-1 line-clamp-1 font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                            {e.nama}
                                        </p>
                                        <p className="line-clamp-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                            {e.deskripsi}
                                        </p>
                                        {typeof e.prestasis_count === 'number' && e.prestasis_count > 0 && (
                                            <p className="mt-2 text-xs font-medium" style={{ color: 'var(--primary)' }}>
                                                {e.prestasis_count} Prestasi
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {ekstrakulikulers.last_page > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {Array.from({ length: ekstrakulikulers.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className="rounded-md px-3 py-1.5 text-sm font-medium"
                                style={{
                                    backgroundColor: page === ekstrakulikulers.current_page ? 'var(--primary)' : 'var(--secondary)',
                                    color: page === ekstrakulikulers.current_page ? 'var(--primary-foreground)' : 'var(--foreground)',
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