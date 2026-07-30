import PublicLayout, { SectionHeader } from '@/layouts/public-layout';

export default function Sejarah() {
    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
                <SectionHeader title="Sejarah Sekolah" />
                <div className="space-y-4 rounded-lg border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                    <p className="leading-relaxed" style={{ color: 'var(--card-foreground)' }}>
                        [Placeholder] Tulis sejarah berdirinya SMK Islam Baidhaul Ahkam di sini. Ganti paragraf ini dengan cerita sejarah resmi
                        sekolah — tahun berdiri, tokoh pendiri, dan perkembangan hingga saat ini.
                    </p>
                    <p className="leading-relaxed" style={{ color: 'var(--card-foreground)' }}>
                        [Placeholder] Paragraf kedua bisa berisi pencapaian atau momen penting dalam perjalanan sekolah.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
