import PublicLayout, { SectionHeader } from '@/layouts/public-layout';

export default function Ap() {
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
            </section>
        </PublicLayout>
    );
}
