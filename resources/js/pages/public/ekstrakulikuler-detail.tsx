import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';

interface GaleriImage {
    id: number;
    image_url: string;
}

interface GaleriData {
    id: number;
    judul: string;
    slug: string;
    images: GaleriImage[];
}

interface EkstrakulikulerDetailItem {
    slug: string;
    nama: string;
    deskripsi: string | null;
    prestasi: string | null;
}

interface PageProps {
    ekstrakulikuler: EkstrakulikulerDetailItem;
    galeri: GaleriData | null;
}

export default function PublicEkstrakulikulerDetail() {
    const { ekstrakulikuler, galeri } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
                <Link href="/ekstrakulikuler" className="mb-6 inline-block text-sm" style={{ color: 'var(--primary)' }}>
                    ← Kembali ke Ekstrakulikuler
                </Link>

                {galeri?.images?.[0] && (
                    <div className="mb-6 aspect-video overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--muted)' }}>
                        <img src={galeri.images[0].image_url} alt={ekstrakulikuler.nama} className="h-full w-full object-cover" />
                    </div>
                )}

                <h1 className="mb-6 text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {ekstrakulikuler.nama}
                </h1>

                {ekstrakulikuler.deskripsi && (
                    <div className="prose mb-10 max-w-none text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--foreground)' }}>
                        {ekstrakulikuler.deskripsi}
                    </div>
                )}

                {ekstrakulikuler.prestasi && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                            Prestasi
                        </h2>
                        <div
                            className="rounded-lg border p-4 text-sm leading-relaxed whitespace-pre-line"
                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
                        >
                            {ekstrakulikuler.prestasi}
                        </div>
                    </div>
                )}

                {galeri && galeri.images.length > 0 && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                            Dokumentasi Kegiatan
                        </h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {galeri.images.map((img) => (
                                <div
                                    key={img.id}
                                    className="aspect-square overflow-hidden rounded-lg"
                                    style={{ backgroundColor: 'var(--muted)' }}
                                >
                                    <img src={img.image_url} alt={ekstrakulikuler.nama} className="h-full w-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <Link
                            href={route('public.galeri.show', galeri.slug)}
                            className="mt-4 inline-block text-sm font-medium"
                            style={{ color: 'var(--primary)' }}
                        >
                            Lihat album galeri lengkap →
                        </Link>
                    </div>
                )}

                {!ekstrakulikuler.deskripsi && !ekstrakulikuler.prestasi && (!galeri || galeri.images.length === 0) && (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Konten untuk {ekstrakulikuler.nama} belum tersedia.
                    </p>
                )}
            </section>
        </PublicLayout>
    );
}