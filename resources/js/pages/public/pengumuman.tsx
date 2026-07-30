import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/helpers/format';
import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface PengumumanItem {
    id: number;
    judul: string;
    deskripsi: string;
    created_at: string;
}

interface PaginatedPengumuman {
    data: PengumumanItem[];
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    pengumumans: PaginatedPengumuman;
    filters: { search: string };
}

export default function PublicPengumumanIndex() {
    const { pengumumans, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters?.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(route('public.pengumuman'), { search: val }, { preserveState: true, replace: true });
        }, 400);
    };

    const goToPage = (page: number) => {
        router.get(route('public.pengumuman'), { search, page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <PublicLayout>
            <section className="mx-auto max-w-5xl px-4 py-16 pt-32">
                <SectionHeader title="Pengumuman Sekolah" />

                <div className="mb-8 max-w-sm">
                    <Input placeholder="Cari pengumuman..." value={search} onChange={(e) => handleSearch(e.target.value)} />
                </div>

                {pengumumans.data.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada pengumuman.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {pengumumans.data.map((p) => (
                            <Card
                                key={p.id}
                                className="border-l-4"
                                style={{ borderLeftColor: 'var(--primary)', borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                            >
                                <CardContent className="p-5">
                                    <Badge
                                        className="mb-2 border-0"
                                        style={{
                                            backgroundColor: 'color-mix(in srgb, var(--color-info) 15%, transparent)',
                                            color: 'var(--color-info)',
                                        }}
                                    >
                                        Pengumuman
                                    </Badge>
                                    <p className="mb-1 font-bold" style={{ color: 'var(--card-foreground)' }}>
                                        {p.judul}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                        {p.deskripsi}
                                    </p>
                                    <p className="mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                        {formatDate(p.created_at)}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {pengumumans.last_page > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                        {Array.from({ length: pengumumans.last_page }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className="rounded-md px-3 py-1.5 text-sm font-medium"
                                style={{
                                    backgroundColor: page === pengumumans.current_page ? 'var(--primary)' : 'var(--secondary)',
                                    color: page === pengumumans.current_page ? 'var(--primary-foreground)' : 'var(--foreground)',
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
