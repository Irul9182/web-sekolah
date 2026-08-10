import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Plus, Trash, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface FasilitasImage {
    id: number;
    image_url: string;
}

interface FasilitasItem {
    slug: string;
    nama: string;
    deskripsi: string;
    images: FasilitasImage[];
}

interface PageProps {
    fasilitas: FasilitasItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fasilitas',
        href: '/fasilitas',
    },
];

function FasilitasCard({ item }: { item: FasilitasItem }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append('foto[]', file));

        setUploading(true);
        router.post(route('fasilitas.foto.store', item.slug), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success(`Foto ${item.nama} berhasil ditambahkan.`),
            onError: () => toast.error('Gagal menambahkan foto, coba lagi.'),
            onFinish: () => {
                setUploading(false);
                if (inputRef.current) inputRef.current.value = '';
            },
        });
    };

    const handleDelete = (imageId: number) => {
        router.delete(route('fasilitas.foto.destroy', [item.slug, imageId]), {
            preserveScroll: true,
            onSuccess: () => toast.success('Foto berhasil dihapus.'),
            onError: () => toast.error('Gagal menghapus foto.'),
        });
    };

    return (
        <div className="bg-background/50 rounded-lg border p-5">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                {item.nama}
            </h2>
            <p className="text-muted-foreground mt-1 mb-4 text-xs">{item.deskripsi}</p>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {item.images.map((img) => (
                    <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border-2">
                        <img src={img.image_url} className="h-full w-full object-cover" />
                        <button
                            type="button"
                            onClick={() => handleDelete(img.id)}
                            className="bg-error absolute top-1 right-1 rounded-full p-1 text-white"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                    className="border-muted-foreground/40 text-muted-foreground flex aspect-square items-center justify-center rounded-lg border-2 border-dashed disabled:opacity-50"
                >
                    <Plus />
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files)}
                />
            </div>
        </div>
    );
}

export default function FasilitasIndex({ fasilitas }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="px-4 pt-4 pb-8">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Kelola Fasilitas Sekolah
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Daftar fasilitas sudah tetap. Tambahkan atau hapus foto langsung di tiap fasilitas — setiap perubahan foto tersimpan
                    otomatis.
                </p>

                <div className="mt-6 space-y-6">
                    {fasilitas.map((item) => (
                        <FasilitasCard key={item.slug} item={item} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}