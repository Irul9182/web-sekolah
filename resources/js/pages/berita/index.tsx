import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppInput from '@/components/app-input';
import { Column, DataTable } from '@/components/app-table';
import AppTextArea from '@/components/app-textare';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { useModal } from '@/hooks/use-modal';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { BeritaProps, BeritaPropsForm, initialBeritaValue } from '@/types/berita.type';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    beritas: BaseResponse<BeritaProps>;
    flash?: {
        success?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Berita',
        href: '/berita',
    },
];

export default function BeritaIndex() {
    const props = usePage<PageProps>().props;
    const [loading, setLoading] = useState<boolean>(false);
    const listBerita = props?.beritas?.data;
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasImage = !!file || !!existingImage;
    const { handleOpenModal, handleCloseModal, isOpen, modalType, selectedData, selectedId } = useModal<BeritaProps>();
    const { data, setData, post, processing, errors, reset } = useForm<BeritaPropsForm>(initialBeritaValue);

    useEffect(() => {
        setData('uploaded_image', file as File);

        setData('existing_image', existingImage);
    }, [file, existingImage]);

    const handleSubmit = () => {
        if (modalType === 'create') {
            post(route('berita.store'), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Berhasil upload berita.');
                    handleCloseModal();
                },
                onError: () => {
                    toast.error('Gagal upload berita, coba lagi nanti.');
                },
            });
        }
    };

    // function submit(e: React.FormEvent) {
    //     e.preventDefault();
    //     post('/admin/berita', {
    //         onSuccess: () => {
    //             reset();
    //             handleCloseModal();
    //         },
    //     });
    // }

    useEffect(() => {
        console.log('Modal type: ', modalType);
    }, [modalType]);

    const handleDelete = (): void => {
        setLoading(true);
        router.delete(`/admin/berita/${selectedId}`, {
            onFinish: () => setLoading(false),
        });
    };

    const columnsBerita: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
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
                                        onClick={() => handleOpenModal(record.id, 'delete', listBerita)}
                                        className={cn('group hover:bg-error/10! flex cursor-pointer items-center justify-between p-2 transition-all')}
                                    >
                                        <p>Hapus</p>
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
            <div>
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        Kelola Berita
                    </h1>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        }}
                        onClick={() => handleOpenModal(null, 'create', listBerita)}
                    >
                        + Tambah Berita
                    </Button>
                </div>
                <div className="p-4">
                    <DataTable data={props?.beritas?.data} columns={columnsBerita} />
                </div>
            </div>

            <Modal open={isOpen} key={modalType}>
                <ModalContent hideClose>
                    {modalType === 'create' && (
                        <ModalBody>
                            <ModalHeader>
                                <ModalTitle className="text-2xl font-semibold">Tambah Berita</ModalTitle>
                            </ModalHeader>

                            <div className="mt-4 space-y-3">
                                <div className="space-y-4">
                                    <div className="flex w-full flex-col items-center justify-center gap-3">
                                        <div className="relative aspect-auto w-full overflow-hidden rounded-lg border-2">
                                            <img
                                                src={file ? URL.createObjectURL(file) : existingImage || '/images/default-img.png'}
                                                alt="Berita"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex items-center justify-center gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={!hasImage}
                                                onClick={() => {
                                                    if (file) setFile(null);
                                                    if (existingImage) setExistingImage(null);
                                                }}
                                            >
                                                Hapus Foto
                                            </Button>

                                            <Button type="button" onClick={() => inputRef.current?.click()}>
                                                Tambah Foto
                                            </Button>

                                            <input
                                                ref={inputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const selectedFile = e.target.files?.[0];
                                                    if (selectedFile) {
                                                        setFile(selectedFile);
                                                        setData('uploaded_image', selectedFile);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AppInput
                                        className="bg-background/50"
                                        placeholder="Masukkan judul . . ."
                                        label="Judul"
                                        onChange={(e) => setData('judul', e.target.value)}
                                    />
                                    {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                                </div>

                                <div>
                                    <AppTextArea
                                        label="Isi Berita"
                                        value={data.isi}
                                        onChange={(e) => setData('isi', e.target.value)}
                                        placeholder="Tulis isi berita di sini . . ."
                                        className="bg-background/50! h-48 w-full resize-y rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    {errors.isi && <p className="mt-1 text-sm text-red-500">{errors.isi}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        disabled={processing || loading}
                                        type="button"
                                        onClick={() => {
                                            handleCloseModal(), setExistingImage(null), setFile(null);
                                        }}
                                        className="rounded-lg bg-gray-400 px-5 py-2 text-white transition hover:bg-gray-500"
                                    >
                                        Batal
                                    </Button>
                                    <button
                                        disabled={processing}
                                        onClick={() => handleSubmit()}
                                        className="rounded-lg bg-indigo-700 px-5 py-2 text-white transition hover:bg-indigo-800 disabled:opacity-50"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </ModalBody>
                    )}

                    {modalType === 'delete' && (
                        <div className="p-4">
                            <h4>Hapus berita</h4>

                            <div>
                                <p>Anda yakin ingin menghapus berita {selectedData?.judul} ? </p>
                            </div>

                            <div>
                                <Button variant={'destructive'} onClick={handleCloseModal}>
                                    Batal
                                </Button>
                                <Button variant={'outline'}>Konfirmasi</Button>
                            </div>
                        </div>
                    )}

                    {modalType === 'detail' && (
                        <div className="p-4">
                            <h4>Detail berita {selectedData?.judul}</h4>

                            {/* Full properti / filed nya tinggal lu buat dibawah sini */}
                            <div>Judul: {selectedData?.judul}</div>
                            <div>
                                <Button onClick={handleCloseModal}>Tutup</Button>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>

            {/* <ConfirmModal
                open={isOpen}
                onOpenChange={() => {}}
                title="Hapus Berita?"
                description={
                    <>
                        Berita <span className="text-foreground font-semibold">"{selectedData?.judul}"</span> akan dihapus permanen dan tidak bisa
                        dikembalikan.
                    </>
                }
                confirmLabel="Ya, Hapus"
                cancelLabel="Batal"
                variant="danger"
                loading={loading}
                onConfirm={handleDelete}
            /> */}
        </AppLayout>
    );
}
