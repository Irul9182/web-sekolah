import { ConfirmModal } from '@/components/app-confirm-mdal';
import AppDropdownMenu from '@/components/app-dopdown-menu';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Trash } from 'lucide-react';
import { useState } from 'react';

interface GaleriProps {
    id: number;
    judul: string;
    gambar: string | null;
    created_at: string;
}

interface PageProps {
    galeris: BaseResponse<GaleriProps>;
    flash?: {
        success?: string;
    };
}

function DeleteButton({ id, judul }: { id: number; judul: string }) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = (): void => {
        setLoading(true);
        router.delete(`/admin/galeri/${id}`, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Button
                size="sm"
                className="text-xs"
                onClick={() => setOpen(true)}
                style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
                    color: 'var(--color-error)',
                    border: '1px solid color-mix(in srgb, var(--color-error) 30%, transparent)',
                }}
            >
                Hapus
            </Button>

            <ConfirmModal
                open={open}
                onOpenChange={setOpen}
                title="Hapus Foto?"
                description={
                    <>
                        Foto <span className="text-foreground font-semibold">"{judul}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
                    </>
                }
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
                variant="danger"
                loading={loading}
                onConfirm={handleDelete}
            />
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Galeri',
        href: '/galeri',
    },
];

export default function GaleriIndex() {
    const props = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
        gambar: null as File | null,
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('gambar', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/galeri', {
            onSuccess: () => {
                reset();
                setPreview(null);
                setIsOpen(false);
            },
        });
    }

    const columnsGaleri: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => (
                <span className="text-muted-foreground text-sm">{index + 1}</span>
            ),
        },
        {
            key: 'gambar',
            label: 'Foto',
            render: (_: any, record: GaleriProps) =>
                record.gambar ? (
                    <img
                        src={`/storage/${record.gambar}`}
                        alt={record.judul}
                        className="h-16 w-24 rounded-lg object-cover"
                    />
                ) : (
                    <span className="text-muted-foreground text-sm">Tidak ada foto</span>
                ),
        },
        {
            key: 'judul',
            label: 'Judul',
        },
        {
            key: 'created_at',
            label: 'Tanggal Ditambahkan',
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: (_: any, record: GaleriProps) => {
                return (
                    <AppDropdownMenu
                        openDisplay={<EllipsisVertical />}
                        menuItem={
                            <div className="flex flex-col gap-2 p-2">
                                {/* Ubah */}
                                <DropdownMenuItem
                                    onClick={() => router?.visit(`/admin/galeri/${record?.id}/edit`)}
                                    className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                >
                                    <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                    <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                </DropdownMenuItem>

                                {/* Hapus */}
                                <DropdownMenuItem
                                    className={cn('group hover:bg-error/10! flex cursor-pointer items-center justify-between p-2 transition-all')}
                                >
                                    <DeleteButton id={record.id} judul={record.judul} />
                                    <Trash className={cn('text-muted-foreground! group-hover:text-error!')} />
                                </DropdownMenuItem>
                            </div>
                        }
                    />
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div style={{ backgroundColor: 'var(--secondary)' }}>
                <div className="mb-6 flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        Kelola Galeri
                    </h1>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        + Tambah Foto
                    </Button>
                </div>
                <div className="p-4">
                    <DataTable data={props?.galeris?.data} columns={columnsGaleri} />
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-8 shadow-md">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Tambah Foto Galeri</h2>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Judul */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Judul Foto</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Contoh: Kegiatan Olahraga"
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                            </div>

                            {/* Gambar */}
                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Foto</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full rounded-lg border border-gray-300 p-2"
                                />
                                {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-3 h-40 w-full rounded-lg object-cover"
                                    />
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-700 px-5 py-2 text-white transition hover:bg-indigo-800 disabled:opacity-50"
                                >
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setPreview(null);
                                        reset();
                                    }}
                                    className="rounded-lg bg-gray-400 px-5 py-2 text-white transition hover:bg-gray-500"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}