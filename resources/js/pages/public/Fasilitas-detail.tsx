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

interface FasilitasDetailItem {
    slug: string;
    nama: string;
    deskripsi: string;
    images: string[];
}

interface PageProps {
    fasilitas: FasilitasDetailItem;
}

export default function PublicFasilitasDetail() {
    const { fasilitas, galeri } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <section className="mx-auto max-w-5xl px-4 py-16 pt-32">
                <Link href="/profile#fasilitas" className="mb-6 inline-block text-sm" style={{ color: 'var(--primary)' }}>
                    ← Kembali ke Profile
                </Link>

                <h1 className="mb-3 text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                    {fasilitas.nama}
                </h1>
                <p className="mb-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {fasilitas.deskripsi}
                </p>

                {fasilitas.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {fasilitas.images.map((src, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                                <img src={src} alt={fasilitas.nama} className="h-full w-full object-cover" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Belum ada foto untuk {fasilitas.nama}.
                    </p>
                )}
            </section>
        </PublicLayout>
    );
}