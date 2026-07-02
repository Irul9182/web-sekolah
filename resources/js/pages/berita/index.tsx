import { ConfirmModal } from '@/components/app-confirm-mdal';
import AppDropdownMenu from '@/components/app-dopdown-menu';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Modal, ModalContent } from '@/components/ui-shadcn/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { BeritaProps } from '@/types/berita.type';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
import { useState } from 'react';

interface PageProps {
    beritas: BaseResponse<BeritaProps>;
    flash?: {
        success?: string;
    };
}

interface DeleteButtonProps {
    id: number;
    judul: string;
}

function DeleteButton({ id, judul }: DeleteButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = (): void => {
        setLoading(true);
        router.delete(`/admin/berita/${id}`, {
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
                title="Hapus Berita?"
                description={
                    <>
                        Berita <span className="text-foreground font-semibold">"{judul}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
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
        title: 'Berita',
        href: '/berita',
    },
];

export default function BeritaIndex() {
    const props = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
        isi: '',
        gambar: null as File | null,
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/berita', {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    }

    const columnsBerita: Column<any>[] = [
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
            label: 'Gambar',
        },
        {
            key: 'judul',
            label: 'Judul',
        },
        {
            key: 'created_at',
            label: 'Tanggal dibuat',
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: (_: any, record: BeritaProps) => {
                return (
                    <AppDropdownMenu
                        openDisplay={<EllipsisVertical />}
                        menuItem={
                            <>
                                <div className="flex flex-col gap-2 p-2">
                                    <DropdownMenuItem
                                        onClick={() => router?.visit(`/berita/${record?.id}/detail`)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                        <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => router?.visit(`/admin/berita/${record?.id}/edit`)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                        <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        className={cn('group hover:bg-error/10! flex cursor-pointer items-center justify-between p-2 transition-all')}
                                    >
                                        <DeleteButton id={record.id} judul={record.judul} />
                                        <Trash className={cn('text-muted-foreground! group-hover:text-error!')} />
                                    </DropdownMenuItem>
                                </div>
                            </>
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
                        Kelola Berita
                    </h1>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        + Tambah Berita
                    </Button>
                </div>
                <div className="p-4">
                    <DataTable data={props?.beritas?.data} columns={columnsBerita} />
                </div>
            </div>

            <Modal open={isOpen}>
                <ModalContent hideClose>
                    <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-md">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Tambah Berita</h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Judul Berita</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Masukkan judul berita"
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Isi Berita</label>
                                <textarea
                                    value={data.isi}
                                    onChange={(e) => setData('isi', e.target.value)}
                                    placeholder="Tulis isi berita di sini..."
                                    className="h-48 w-full resize-y rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                {errors.isi && <p className="mt-1 text-sm text-red-500">{errors.isi}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Gambar (opsional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('gambar', e.target.files?.[0] || null)}
                                    className="w-full rounded-lg border border-gray-300 p-2"
                                />
                                {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-700 px-5 py-2 text-white transition hover:bg-indigo-800 disabled:opacity-50"
                                >
                                    Simpan
                                </button>
                                <Button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg bg-gray-400 px-5 py-2 text-white transition hover:bg-gray-500"
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalContent>
            </Modal>
        </AppLayout>
    );
}