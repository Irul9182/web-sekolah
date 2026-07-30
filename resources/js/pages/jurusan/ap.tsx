import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';

interface PageProps {
    galeri_slug: string | null;
}

export default function Ap() {
    const { galeri_slug } = usePage<PageProps>().props;

    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
                <SectionHeader title="Administrasi Perkantoran (AP)" />
                <div className="mb-6 aspect-video overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                    <img
                        src="/images/perkantoran.jpg"
                        alt="AP"
                        className="h-full w-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            e.currentTarget.src = '/images/default-img.png';
                        }}
                    />
                </div>
                <div className="space-y-4 rounded-lg border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                    <p className="leading-relaxed" style={{ color: 'var(--card-foreground)' }}>
                        [Placeholder] Jurusan AP mempelajari administrasi bisnis, korespondensi, dan manajemen arsip perkantoran. Lulusan siap
                        bekerja sebagai staf administrasi profesional. Ganti teks ini dengan deskripsi resmi jurusan.
                    </p>
                    <div>
                        <h3 className="mb-2 font-semibold" style={{ color: 'var(--card-foreground)' }}>
                            Kompetensi yang dipelajari:
                        </h3>
                        <ul className="list-disc space-y-1 pl-5" style={{ color: 'var(--card-foreground)' }}>
                            <li>[Placeholder] Korespondensi dan kearsipan</li>
                            <li>[Placeholder] Pengelolaan dokumen kantor</li>
                            <li>[Placeholder] Kesekretariatan</li>
                        </ul>
                    </div>
                </div>

                {galeri_slug && (
                    <Link
                        href={route('public.galeri.show', galeri_slug)}
                        className="bg-background/50 hover:bg-muted mt-6 flex max-w-70 items-center gap-2 rounded-md border p-3 text-sm transition"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        <ImageIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span className="truncate">Lihat Galeri Jurusan Administrasi Perkantoran</span>
                    </Link>
                )}
            </section>
        </PublicLayout>
    );
}