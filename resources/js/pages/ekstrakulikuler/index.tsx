import AppInput from '@/components/app-input';
import AppTextArea from '@/components/app-textare';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';


interface EkstrakulikulerItem {
    slug: string;
    nama: string;
    deskripsi: string; // dari server, read-only
    prestasi: string | null;
    galeri_slug: string | null;
}

interface GaleriOption {
    id: number;
    judul: string;
    slug: string;
}

interface PageProps {
    ekstrakulikulers: EkstrakulikulerItem[];
    galeris: GaleriOption[];
}

interface FormData {
    ekstrakulikulers: EkstrakulikulerItem[];
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ekstrakulikuler',
        href: '/ekstrakulikuler',
    },
];

export default function EkstrakulikulerIndex({ ekstrakulikulers, galeris }: PageProps) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        ekstrakulikulers: ekstrakulikulers.map((e) => ({
            slug: e.slug,
            nama: e.nama,
            deskripsi: e.deskripsi,
            prestasi: e.prestasi ?? '',
            galeri_slug: e.galeri_slug ?? '',
        })),
    });

    const updateField = (index: number, field: keyof EkstrakulikulerItem, value: string) => {
        const updated = [...data.ekstrakulikulers];
        updated[index] = { ...updated[index], [field]: value };
        setData('ekstrakulikulers', updated);
    };

        const handleSubmit = () => {
            put(route('ekstrakulikuler.update'), {
                onSuccess: () => {
                    toast.success('Ekstrakulikuler berhasil diperbarui.');
                },
                onError: () => {
                    toast.error('Gagal menyimpan perubahan, coba lagi nanti.');
                },
            });
        };

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="px-4 pt-4 pb-8">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        Kelola Ekstrakulikuler
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Isi deskripsi, prestasi, dan album galeri terkait untuk tiap ekstrakulikuler. Daftar ekstrakulikuler sudah tetap, hanya
                        isinya yang bisa diubah di sini.
                    </p>

                    <div className="mt-6 space-y-6">
                        {data.ekstrakulikulers.map((item, index) => (
                            <div key={item.slug} className="bg-background/50 rounded-lg border p-5">
                                <h2 className="mb-1 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                    {item.nama}
                                </h2>
                                <p className="text-muted-foreground mb-4 text-xs">{item.deskripsi}</p>

                                <div className="space-y-4">
                                    <div>
                                        <AppTextArea
                                            label="Prestasi"
                                            value={item.prestasi ?? ''}
                                            onChange={(e) => updateField(index, 'prestasi', e.target.value)}
                                            placeholder={'Tulis daftar prestasi, bebas format. Contoh:\nJuara 1 Lomba Futsal Kecamatan 2025\nJuara 2 Turnamen Antar SMK 2024'}
                                            className="bg-background/50! h-32 w-full resize-y rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                        {errors[`ekstrakulikulers.${index}.prestasi`] && (
                                            <p className="mt-1 text-sm text-red-500">{errors[`ekstrakulikulers.${index}.prestasi`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm" style={{ color: 'var(--muted-foreground)' }}>
                                            Album Galeri Terkait (opsional)
                                        </label>
                                        <select
                                            value={item.galeri_slug ?? ''}
                                            onChange={(e) => updateField(index, 'galeri_slug', e.target.value)}
                                            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            style={{
                                                backgroundColor: 'var(--background)',
                                                color: 'var(--foreground)',
                                                borderColor: 'var(--border)',
                                            }}
                                        >
                                            <option value="">— Tidak ada —</option>
                                            {galeris.map((galeri) => (
                                                <option key={galeri.id} value={galeri.slug}>
                                                    {galeri.judul}
                                                </option>
                                            ))}
                                        </select>
                                        {errors[`ekstrakulikulers.${index}.galeri_slug`] && (
                                            <p className="mt-1 text-sm text-red-500">{errors[`ekstrakulikulers.${index}.galeri_slug`]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                    <Button
                        disabled={processing}
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        onClick={handleSubmit}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}