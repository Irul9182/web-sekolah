import PublicLayout, { SectionHeader } from '@/layouts/public-layout';

// Ganti array ini dengan poin-poin misi resmi sekolah
const misiItems: string[] = [
    '[Placeholder] Poin misi pertama.',
    '[Placeholder] Poin misi kedua.',
    '[Placeholder] Poin misi ketiga.',
];

export default function VisiMisi() {
    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
                <SectionHeader title="Visi" />
                <div className="mb-10 rounded-lg border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                    <p className="leading-relaxed" style={{ color: 'var(--card-foreground)' }}>
                        [Placeholder] Tulis visi sekolah di sini. Ganti teks ini dengan visi resmi SMK Islam Baidhaul Ahkam.
                    </p>
                </div>

                <SectionHeader title="Misi" />
                <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                    <ol className="list-decimal space-y-3 pl-5">
                        {misiItems.map((item, idx) => (
                            <li key={idx} className="leading-relaxed" style={{ color: 'var(--card-foreground)' }}>
                                {item}
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </PublicLayout>
    );
}
