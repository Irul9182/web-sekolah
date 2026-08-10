import PublicLayout, { SectionHeader } from '@/layouts/public-layout';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// Ganti array ini dengan poin-poin misi resmi sekolah
const misiItems: string[] = ['[Placeholder] Poin misi pertama.', '[Placeholder] Poin misi kedua.', '[Placeholder] Poin misi ketiga.'];

interface StrukturNode {
    jabatan: string;
    nama: string;
}

interface FasilitasItem {
    slug: string;
    nama: string;
    deskripsi: string;
    images: string[];
}

interface ProfileProps {
    fasilitas: FasilitasItem[];
}

// Data posisi -- nanti ini yang akan diambil dari database (via admin panel).
// Key di object ini dipakai juga sebagai "id" node untuk penggambaran garis SVG.
const posisi: Record<string, StrukturNode> = {
    ketuaYayasan: { jabatan: 'Ketua Yayasan', nama: 'Dr. H. A. Baidowi, S.Ag., M.Pd' },
    kepalaSekolah: { jabatan: 'Kepala Sekolah', nama: 'Ahmad Jajuli, SE., M.Pd' },
    komiteSekolah: { jabatan: 'Komite Sekolah', nama: 'Karsita, S.Pd' },
    wakasekKurikulum: { jabatan: 'Wakasek Bidang Kurikulum', nama: 'Mulyadi, M.Pd' },
    wakasekKesiswaan: { jabatan: 'Wakasek Bidang Kesiswaan', nama: 'Marisa Maulidya, S.Pd / Madhensia Putri Pratiwi, S.Pd' },
    kaprodiAkuntansi: { jabatan: 'Kaprodi Akuntansi', nama: 'Indras Susilowati, SE., M.Pd' },
    kaprodiManajemenPerkantoran: { jabatan: 'Kaprodi Manajemen Perkantoran', nama: 'Siti Rofiah, SE' },
    kaprodiTjkt: { jabatan: 'Kaprodi Teknik Jaringan Komputer dan Telekomunikasi', nama: 'Rajikh Burhanuddin Fath A.J., S.Kom' },
    kaprodiDkv: { jabatan: 'Kaprodi Desain Komunikasi Visual', nama: 'Arief Fadilah Siregar, S.I.Kom' },
    badanKonseling: { jabatan: 'Badan Konseling', nama: 'Azra Rara Tazkia, S.Psi' },
    operatorSekolah: { jabatan: 'Operator Sekolah', nama: 'Saepulloh, S.Pd' },
};

const kaprodiIds = ['kaprodiAkuntansi', 'kaprodiManajemenPerkantoran', 'kaprodiTjkt', 'kaprodiDkv'];
const konselingIds = ['badanKonseling', 'operatorSekolah'];

// Bentuk "pita" untuk label jabatan: sisi kiri cekung (notch), sisi kanan lancip (arrow tip).
// Ini yang bikin kartu terlihat mirip desain org chart aslinya.
const RIBBON_CLIP = 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%)';

// Kartu jabatan bergaya "pita" -- label jabatan jadi ribbon berwarna, nama di kotak putih di bawahnya.
// registerRef dipakai supaya posisi kotak ini bisa diukur untuk menggambar garis SVG.
function StrukturCard({
    id,
    jabatan,
    nama,
    registerRef,
}: StrukturNode & { id: string; registerRef: (id: string, el: HTMLDivElement | null) => void }) {
    // Beberapa jabatan (mis. Wakasek Kesiswaan) diisi dua nama dipisah " / " -- tampilkan sebagai baris terpisah.
    const namaLines = nama.split(' / ');

    return (
        <div ref={(el) => registerRef(id, el)} className="w-32 shrink-0 sm:w-44">
            {/* Ribbon jabatan */}
            <div
                className="relative z-10 mx-[-8px] flex h-6 items-center justify-center px-3 sm:h-7"
                style={{ backgroundColor: 'var(--primary)', clipPath: RIBBON_CLIP }}
            >
                <p className="truncate text-[8px] font-semibold tracking-wide text-white uppercase sm:text-[9px]">{jabatan}</p>
            </div>

            {/* Body nama */}
            <div
                className="rounded-b-sm border px-2 pt-2.5 pb-2 text-center shadow-sm sm:px-3 sm:pb-2.5"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
            >
                {namaLines.map((line, i) => (
                    <p key={i} className="text-[10px] leading-snug font-bold sm:text-xs" style={{ color: 'var(--card-foreground)' }}>
                        {line}
                    </p>
                ))}
            </div>
        </div>
    );
}

interface Rect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    centerX: number;
}

interface PathDef {
    d: string;
    dashed?: boolean;
}

function StrukturOrganisasiChart() {
    const containerRef = useRef<HTMLDivElement>(null);
    const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [paths, setPaths] = useState<PathDef[]>([]);
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

    const registerRef = (id: string, el: HTMLDivElement | null) => {
        boxRefs.current[id] = el;
    };

    useLayoutEffect(() => {
        function compute() {
            const container = containerRef.current;
            if (!container) return;
            const contRect = container.getBoundingClientRect();

            const rect = (id: string): Rect | null => {
                const el = boxRefs.current[id];
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return {
                    top: r.top - contRect.top,
                    bottom: r.bottom - contRect.top,
                    left: r.left - contRect.left,
                    right: r.right - contRect.left,
                    centerX: r.left - contRect.left + r.width / 2,
                };
            };

            const newPaths: PathDef[] = [];

            // Garis "siku": turun dari satu titik, melebar horizontal, lalu turun lagi ke tiap child
            const elbow = (parentPoint: { x: number; y: number }, childIds: string[]) => {
                const children = childIds.map(rect).filter((r): r is Rect => r !== null);
                if (children.length === 0) return;
                const dropY = parentPoint.y + 14;
                newPaths.push({ d: `M ${parentPoint.x} ${parentPoint.y} L ${parentPoint.x} ${dropY}` });
                const xs = children.map((c) => c.centerX);
                const minX = Math.min(parentPoint.x, ...xs);
                const maxX = Math.max(parentPoint.x, ...xs);
                newPaths.push({ d: `M ${minX} ${dropY} L ${maxX} ${dropY}` });
                children.forEach((c) => {
                    newPaths.push({ d: `M ${c.centerX} ${dropY} L ${c.centerX} ${c.top}` });
                });
            };

            const ky = rect('ketuaYayasan');
            const ks = rect('kepalaSekolah');
            const komite = rect('komiteSekolah');
            const wk = rect('wakasekKurikulum');
            const wsis = rect('wakasekKesiswaan');

            if (ky && ks) {
                const trunkX = ky.centerX;

                // Trunk lurus satu jalur: turun dari Ketua Yayasan langsung ke Kepala Sekolah
                // (Kepala Sekolah sekarang center-aligned dengan Ketua Yayasan, jadi tidak perlu elbow)
                newPaths.push({ d: `M ${trunkX} ${ky.bottom} L ${trunkX} ${ks.top}` });

                // Cabang putus-putus (mitra) ke Komite Sekolah, bercabang dari tengah trunk
                if (komite) {
                    const branchY = (ky.bottom + ks.top) / 2;
                    newPaths.push({
                        d: `M ${trunkX} ${branchY} L ${komite.centerX} ${branchY} L ${komite.centerX} ${komite.top}`,
                        dashed: true,
                    });
                }
            }

            if (ks) {
                elbow({ x: ks.centerX, y: ks.bottom }, ['wakasekKurikulum', 'wakasekKesiswaan']);
            }

            if (wk && wsis) {
                const midX = (wk.centerX + wsis.centerX) / 2;
                const y = Math.max(wk.bottom, wsis.bottom);
                elbow({ x: midX, y }, kaprodiIds);
            }

            const kaprodiRects = kaprodiIds.map(rect).filter((r): r is Rect => r !== null);
            if (kaprodiRects.length) {
                const xs = kaprodiRects.map((r) => r.centerX);
                const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
                const y = Math.max(...kaprodiRects.map((r) => r.bottom));
                elbow({ x: midX, y }, konselingIds);
            }

            setPaths(newPaths);
            setSvgSize({ width: container.scrollWidth, height: container.scrollHeight });
        }

        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, []);

    return (
        <div ref={containerRef} className="relative inline-block">
            <svg
                className="pointer-events-none absolute top-0 left-0"
                width={svgSize.width}
                height={svgSize.height}
                style={{ overflow: 'visible' }}
            >
                {paths.map((p, i) => (
                    <path
                        key={i}
                        d={p.d}
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth={1}
                        strokeDasharray={p.dashed ? '4 3' : undefined}
                    />
                ))}
            </svg>

            <div className="flex flex-col items-center gap-10">
                <StrukturCard id="ketuaYayasan" {...posisi.ketuaYayasan} registerRef={registerRef} />

                <div className="relative">
                    <StrukturCard id="kepalaSekolah" {...posisi.kepalaSekolah} registerRef={registerRef} />
                    <div className="absolute top-0 left-full ml-10 sm:ml-16">
                        <p className="mb-1 text-center text-[10px] italic sm:text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            mitra
                        </p>
                        <StrukturCard id="komiteSekolah" {...posisi.komiteSekolah} registerRef={registerRef} />
                    </div>
                </div>

                <div className="flex gap-6 sm:gap-10">
                    <StrukturCard id="wakasekKurikulum" {...posisi.wakasekKurikulum} registerRef={registerRef} />
                    <StrukturCard id="wakasekKesiswaan" {...posisi.wakasekKesiswaan} registerRef={registerRef} />
                </div>

                <div className="flex gap-4 sm:gap-6">
                    {kaprodiIds.map((id) => (
                        <StrukturCard key={id} id={id} {...posisi[id]} registerRef={registerRef} />
                    ))}
                </div>

                <div className="flex gap-4 sm:gap-6">
                    {konselingIds.map((id) => (
                        <StrukturCard key={id} id={id} {...posisi[id]} registerRef={registerRef} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ProfileSekolah() {
    const { fasilitas } = usePage<ProfileProps>().props;
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

            {/* ==== Struktur Organisasi (Bagan, garis dihitung otomatis lewat SVG) ==== */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div id="struktur-organisasi">
                    <SectionHeader title="Struktur Organisasi" />
                    <div
                        className="overflow-x-auto rounded-lg border p-8"
                        style={{ borderColor: 'var(--border)', backgroundColor: '#f5f4fb' }}
                    >
                        <div className="flex min-w-max justify-center">
                            <StrukturOrganisasiChart />
                        </div>
                    </div>
                </div>
            </section>
            {/* ==== Fasilitas Sekolah ==== */}
            <section className="mx-auto max-w-6xl px-4 pb-16">
                <div id="fasilitas">
                    <SectionHeader title="Fasilitas Sekolah" />
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {fasilitas.map((f) => (
                            <div
                                key={f.slug}
                                className="overflow-hidden rounded-lg border"
                                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
                            >
                                {f.images.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-0.5">
                                        {f.images.slice(0, 4).map((src, i) => (
                                            <div
                                                key={i}
                                                className={`aspect-square overflow-hidden ${f.images.length === 1 ? 'col-span-2' : ''}`}
                                                style={{ backgroundColor: 'var(--muted)' }}
                                            >
                                                <img src={src} alt={f.nama} className="h-full w-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                                        <img src="/images/default-img.png" alt={f.nama} className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <div className="p-4">
                                    <p className="mb-1 font-semibold" style={{ color: 'var(--card-foreground)' }}>
                                        {f.nama}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                        {f.deskripsi}
                                    </p>
                                    {f.images.length > 0 && (
                                        <Link
                                            href={route('public.fasilitas.show', f.slug)}
                                            className="mt-2 inline-block text-xs font-medium"
                                            style={{ color: 'var(--primary)' }}
                                        >
                                            Lihat semua foto →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
