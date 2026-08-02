import AppInput from '@/components/app-input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

interface StrukturOrganisasiProps {
    ketua_yayasan: string;
    kepala_sekolah: string;
    komite_sekolah: string;
    wakasek_kurikulum: string;
    wakasek_kesiswaan: string;
    kaprodi_akuntansi: string;
    kaprodi_manajemen_perkantoran: string;
    kaprodi_tjkt: string;
    kaprodi_dkv: string;
    badan_konseling: string;
    operator_sekolah: string;
}

interface PageProps {
    struktur: StrukturOrganisasiProps;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Struktur Organisasi',
        href: '/struktur-organisasi',
    },
];

// Label jabatan fixed (bukan dari DB) karena susunan/relasi bagan di halaman publik sudah tetap.
// Admin cuma bisa ubah isi nama, bukan jabatannya.
const FIELD_GROUPS: { title: string; fields: { key: keyof StrukturOrganisasiProps; label: string }[] }[] = [
    { title: 'Pimpinan', fields: [{ key: 'ketua_yayasan', label: 'Ketua Yayasan' }] },
    {
        title: 'Kepala Sekolah & Komite',
        fields: [
            { key: 'kepala_sekolah', label: 'Kepala Sekolah' },
            { key: 'komite_sekolah', label: 'Komite Sekolah (mitra)' },
        ],
    },
    {
        title: 'Wakil Kepala Sekolah',
        fields: [
            { key: 'wakasek_kurikulum', label: 'Wakasek Bidang Kurikulum' },
            { key: 'wakasek_kesiswaan', label: 'Wakasek Bidang Kesiswaan (pisahkan 2 nama dengan " / ")' },
        ],
    },
    {
        title: 'Kepala Program Studi',
        fields: [
            { key: 'kaprodi_akuntansi', label: 'Kaprodi Akuntansi' },
            { key: 'kaprodi_manajemen_perkantoran', label: 'Kaprodi Manajemen Perkantoran' },
            { key: 'kaprodi_tjkt', label: 'Kaprodi Teknik Jaringan Komputer dan Telekomunikasi' },
            { key: 'kaprodi_dkv', label: 'Kaprodi Desain Komunikasi Visual' },
        ],
    },
    {
        title: 'Konseling & Operator',
        fields: [
            { key: 'badan_konseling', label: 'Badan Konseling' },
            { key: 'operator_sekolah', label: 'Operator Sekolah' },
        ],
    },
];

export default function StrukturOrganisasiIndex({ struktur }: PageProps) {
    const { data, setData, put, processing, errors } = useForm<StrukturOrganisasiProps>({
        ketua_yayasan: struktur.ketua_yayasan ?? '',
        kepala_sekolah: struktur.kepala_sekolah ?? '',
        komite_sekolah: struktur.komite_sekolah ?? '',
        wakasek_kurikulum: struktur.wakasek_kurikulum ?? '',
        wakasek_kesiswaan: struktur.wakasek_kesiswaan ?? '',
        kaprodi_akuntansi: struktur.kaprodi_akuntansi ?? '',
        kaprodi_manajemen_perkantoran: struktur.kaprodi_manajemen_perkantoran ?? '',
        kaprodi_tjkt: struktur.kaprodi_tjkt ?? '',
        kaprodi_dkv: struktur.kaprodi_dkv ?? '',
        badan_konseling: struktur.badan_konseling ?? '',
        operator_sekolah: struktur.operator_sekolah ?? '',
    });

    const handleSubmit = () => {
        put(route('struktur-organisasi.update'), {
            onSuccess: () => {
                toast.success('Struktur organisasi berhasil diperbarui.');
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
                    Struktur Organisasi
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Ubah nama pejabat di tiap posisi. Jabatan dan susunan bagan sudah tetap, hanya nama yang bisa diedit di sini.
                </p>

                <div className="mt-6 space-y-6">
                    {FIELD_GROUPS.map((group) => (
                        <div key={group.title} className="bg-background/50 rounded-lg border p-5">
                            <h2 className="mb-4 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                                {group.title}
                            </h2>
                            <div className="space-y-4">
                                {group.fields.map((field) => (
                                    <div key={field.key}>
                                        <AppInput
                                            className="bg-background/50"
                                            label={field.label}
                                            value={data[field.key]}
                                            onChange={(e) => setData(field.key, e.target.value)}
                                        />
                                        {errors[field.key] && <p className="mt-1 text-sm text-red-500">{errors[field.key]}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Button
                        disabled={processing}
                        style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                        onClick={handleSubmit}
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}