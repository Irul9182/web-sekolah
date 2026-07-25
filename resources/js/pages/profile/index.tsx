import PublicLayout, { SectionHeader } from '@/layouts/public-layout';

// Ganti array ini dengan poin-poin misi resmi sekolah
const misiItems: string[] = ['[Placeholder] Poin misi pertama.', '[Placeholder] Poin misi kedua.', '[Placeholder] Poin misi ketiga.'];

// Ganti dengan data struktur organisasi resmi
interface StrukturItem {
    jabatan: string;
    nama: string;
}

const strukturItems: StrukturItem[] = [
    { jabatan: 'Kepala Sekolah', nama: '[Placeholder Nama]' },
    { jabatan: 'Wakil Kepala Sekolah', nama: '[Placeholder Nama]' },
    { jabatan: 'Kepala Tata Usaha', nama: '[Placeholder Nama]' },
    { jabatan: 'Ketua Jurusan TKJ', nama: '[Placeholder Nama]' },
    { jabatan: 'Ketua Jurusan AP', nama: '[Placeholder Nama]' },
    { jabatan: 'Ketua Jurusan AK', nama: '[Placeholder Nama]' },
    { jabatan: 'Ketua Jurusan MAVIB', nama: '[Placeholder Nama]' },
];

export default function ProfileSekolah() {
    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl space-y-16 px-4 py-16 pt-32">
                {/* ==== Visi & Misi ==== */}
                <div id="visi-misi">
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
                </div>

                {/* ==== Sejarah ==== */}
                <div id="sejarah">
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
                </div>

                {/* ==== Struktur Organisasi ==== */}
                <div id="struktur-organisasi">
                    <SectionHeader title="Struktur Organisasi" />
                    <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                        <table className="w-full text-left text-sm">
                            <thead style={{ backgroundColor: 'var(--secondary)' }}>
                                <tr>
                                    <th className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>
                                        Jabatan
                                    </th>
                                    <th className="px-4 py-3 font-semibold" style={{ color: 'var(--foreground)' }}>
                                        Nama
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {strukturItems.map((item, idx) => (
                                    <tr key={idx} className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                                        <td className="px-4 py-3" style={{ color: 'var(--card-foreground)' }}>
                                            {item.jabatan}
                                        </td>
                                        <td className="px-4 py-3" style={{ color: 'var(--card-foreground)' }}>
                                            {item.nama}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}