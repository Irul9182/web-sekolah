import PublicLayout, { SectionHeader } from '@/layouts/public-layout';

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

export default function StrukturOrganisasi() {
    return (
        <PublicLayout>
            <section className="mx-auto max-w-4xl px-4 py-16 pt-32">
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
            </section>
        </PublicLayout>
    );
}
