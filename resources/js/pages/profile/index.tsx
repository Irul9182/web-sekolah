import PublicLayout, { SectionHeader } from '@/layouts/public-layout';

// Ganti array ini dengan poin-poin misi resmi sekolah
const misiItems: string[] = ['[Placeholder] Poin misi pertama.', '[Placeholder] Poin misi kedua.', '[Placeholder] Poin misi ketiga.'];

// Ganti dengan data struktur organisasi resmi.
// Susunan bertingkat (parent -> children) supaya bisa dirender jadi bagan.
interface StrukturNode {
    jabatan: string;
    nama: string;
    children?: StrukturNode[];
}

const strukturTree: StrukturNode = {
    jabatan: 'Ketua Yayasan',
    nama: 'Dr. H. A. Baidowi, S.Ag., M.Pd',
    children: [
        {
            jabatan: 'Kepala Sekolah',
            nama: 'Ahmad Jajuli, SE., M.Pd',
            children: [
                {
                    jabatan: 'Wakasek Bidang Kurikulum',
                    nama: 'Mulyadi, M.Pd',
                    children: [
                        { jabatan: 'Kaprodi Akuntansi', nama: 'Indras Susilowati, SE., M.Pd' },
                        { jabatan: 'Kaprodi Manajemen Perkantoran', nama: 'Siti Rofiah, SE' },
                        { jabatan: 'Kaprodi TJKT', nama: 'Rajikh Burhanuddin Fath A.J., S.Kom' },
                        { jabatan: 'Kaprodi DKV', nama: 'Arief Fadilah Siregar, S.I.Kom' },
                    ],
                },
                {
                    jabatan: 'Wakasek Bidang Kesiswaan',
                    nama: 'Marisa Maulidya, S.Pd / Madhensia Putri Pratiwi, S.Pd',
                },
                { jabatan: 'Badan Konseling', nama: 'Azra Rara Tazkia, S.Psi' },
                { jabatan: 'Operator Sekolah', nama: 'Saepulloh, S.Pd' },
            ],
        },
    ],
};

// Komite Sekolah bukan bawahan Kepala Sekolah, tapi mitra sejajar —
// dirender terpisah di samping dengan garis putus-putus, bukan garis turun biasa.
const komiteSekolah: StrukturNode = { jabatan: 'Komite Sekolah', nama: 'Karsita, S.Pd' };

function StrukturCard({ jabatan, nama }: { jabatan: string; nama: string }) {
    return (
        <div
            className="w-28 shrink-0 rounded-lg border px-2 py-2 text-center shadow-sm sm:w-36 sm:px-3 sm:py-2.5"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
            <p className="text-[11px] font-semibold sm:text-sm" style={{ color: 'var(--primary)' }}>
                {jabatan}
            </p>
            {nama && (
                <p className="mt-0.5 text-[10px] sm:text-xs" style={{ color: 'var(--card-foreground)' }}>
                    {nama}
                </p>
            )}
        </div>
    );
}

// Merender satu node beserta children-nya secara rekursif.
// Garis penghubung dibuat dari border-top pada wrapper children,
// plus border-top kecil di atas tiap child sebagai "cabang" vertikal.
function StrukturNodeView({ node }: { node: StrukturNode }) {
    return (
        <div className="flex flex-col items-center">
            <StrukturCard jabatan={node.jabatan} nama={node.nama} />

            {node.children && node.children.length > 0 && (
                <>
                    {/* garis vertikal turun dari card parent */}
                    <div className="h-6 w-px" style={{ backgroundColor: 'var(--border)' }} />

                    <div className="flex">
                        {node.children.map((child, idx) => (
                            <div key={idx} className="flex flex-col items-center px-1.5 sm:px-2">
                                {/* garis horizontal penghubung antar-saudara, disambung garis vertikal turun ke card */}
                                <div className="relative h-6 w-full">
                                    <div
                                        className="absolute top-0 right-1/2 left-1/2 h-px"
                                        style={{
                                            backgroundColor: 'var(--border)',
                                            left: idx === 0 ? '50%' : 0,
                                            right: idx === node.children!.length - 1 ? '50%' : 0,
                                        }}
                                    />
                                    <div
                                        className="absolute top-0 left-1/2 h-6 w-px -translate-x-1/2"
                                        style={{ backgroundColor: 'var(--border)' }}
                                    />
                                </div>
                                <StrukturNodeView node={child} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

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
            </section>

            {/* ==== Struktur Organisasi (Bagan) ====
                 Dipisah dari section di atas & pakai max-w-6xl (bukan max-w-4xl)
                 supaya bagan yang melebar (banyak kartu sejajar) tidak sempit. */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div id="struktur-organisasi">
                    <SectionHeader title="Struktur Organisasi" />
                    <div className="overflow-x-auto rounded-lg border p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--secondary)' }}>
                        <div className="flex min-w-max justify-center">
                            <div className="flex flex-col items-center">
                                <StrukturCard jabatan={strukturTree.jabatan} nama={strukturTree.nama} />

                                <div className="h-6 w-px" style={{ backgroundColor: 'var(--border)' }} />

                                <div className="flex items-start">
                                    <div className="flex flex-col items-center px-1.5 sm:px-2">
                                        <div className="relative h-6 w-full">
                                            <div className="absolute top-0 left-1/2 h-px w-1/2" style={{ backgroundColor: 'var(--border)' }} />
                                            <div
                                                className="absolute top-0 left-1/2 h-6 w-px -translate-x-1/2"
                                                style={{ backgroundColor: 'var(--border)' }}
                                            />
                                        </div>
                                        <StrukturNodeView node={strukturTree.children![0]} />
                                    </div>

                                    {/* Komite Sekolah: mitra, bukan bawahan — garis putus-putus horizontal */}
                                    <div className="ml-4 flex items-center gap-2 self-start pt-14 sm:pt-16">
                                        <div className="h-px w-6" style={{ borderTop: '1px dashed var(--border)' }} />
                                        <div className="flex flex-col items-center">
                                            <p className="mb-1 text-[10px] italic sm:text-xs" style={{ color: 'var(--muted-foreground)' }}>
                                                mitra
                                            </p>
                                            <StrukturCard jabatan={komiteSekolah.jabatan} nama={komiteSekolah.nama} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}