import DetailItem from '@/components/app-detail-item';
import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppInput from '@/components/app-input';
import AppSearchInput from '@/components/app-input-search';
import { Column, DataTable } from '@/components/app-table';
import AppTextArea from '@/components/app-textare';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Switch } from '@/components/ui-shadcn/switch';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { formatDate } from '@/helpers/format';
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
    filters: {
        search: string;
        per_page: number;
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
    const { filters, beritas } = props;
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleOpenModal, handleCloseModal, isOpen, modalType, selectedData, selectedId } = useModal<BeritaProps>();
    const { data, setData, post, processing, errors, reset, delete: deleteBerita, put, patch } = useForm<BeritaPropsForm>(initialBeritaValue);
    const [search, setSearch] = useState(filters?.search ?? '');
    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const hasImage = !!file || !!existingImage;
    useEffect(() => {
        setData('uploaded_image', file as File);

        setData('existing_image', existingImage);
    }, [file, existingImage]);
    const handleSearch = (val: string) => {
        setSearch(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                route('berita.index'),
                { ...route().params, search: val, per_page: filters?.per_page },
                { preserveState: true, replace: true },
            );
        }, 400);
    };

    const handlePageChange = (page: number) => {
        router.get(route('berita.index'), { ...route().params, page: page, per_page: currentPerPage }, { preserveState: true, preserveScroll: true });
    };

    const handlePageSizeChange = (perPage: number) => {
        router.get(route('berita.index'), { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
    };

    const handleUpdateStatus = async (status: boolean, id: string) => {
        if (!id) {
            toast.error('Id invalid');
            return;
        }

        await setData('status', status);

        await patch(route('berita.updateStatus', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Berhasil update status berita.');
                router.reload({ only: ['beritas'] });
            },
            onError: () => {
                toast.error('Gagal update status berita.');
                router.reload({ only: ['beritas'] });
            },
        });
    };
    const handleSubmit = () => {
        if (modalType === 'create') {
            post(route('berita.store'), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Berhasil upload berita.');
                },
                onError: () => {
                    toast.error('Gagal upload berita, coba lagi nanti.');
                },
                onFinish: () => {
                    handleCloseModal();
                    setFile(null);
                    setExistingImage(null);
                },
            });
        }

        if (modalType === 'update') {
            post(route('berita.update', selectedId as string), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success(`Berhasil edit berita ${selectedData?.judul}.`);
                },
                onError: () => {
                    toast.error('Gagal edit berita, coba lagi nanti.');
                },
                onFinish: () => {
                    handleCloseModal();
                    setFile(null);
                    setExistingImage(null);
                },
            });
        }

        if (modalType === 'delete') {
            deleteBerita(route('berita.destroy', selectedId as string), {
                // forceFormData: true,
                onSuccess: () => {
                    toast.success(`Berhasil hapus berita ${selectedData?.judul}.`);
                    handleCloseModal();
                },
                onError: () => {
                    toast.error('Gagal hapus berita, coba lagi nanti.');
                },
                onFinish: () => {
                    handleCloseModal();
                    setFile(null);
                    setExistingImage(null);
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
        if (modalType === 'update' || modalType === 'delete' || modalType === 'detail') {
            setData(selectedData as BeritaProps);
            setExistingImage(selectedData?.berita_image?.image_url ?? '');
        }

        // console.log('modal type: ', modalType);
        // console.log('Selected id: ', selectedId);
    }, [modalType, selectedId]);

    const columnsBerita: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
        },
        {
            key: 'berita_image',
            label: 'Gambar',
            render: (_: any, record: BeritaProps) => (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 sm:h-30 sm:w-40">
                    <img src={record?.berita_image?.image_url || '/images/default-img.png'} alt="Berita" className="h-full w-full object-cover" />
                </div>
            ),
        },
        {
            key: 'judul',
            label: 'Judul',
            className: ' truncate max-w-[100px] sm:max-w-[300px]',
            render: (_: any, row: BeritaProps) => <span>{row.judul}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            className: ' truncate max-w-[100px] sm:max-w-[300px]',
            render: (_: any, row: BeritaProps) => (
                <Switch
                    className="cursor-pointer"
                    disabled={processing}
                    checked={row.status}
                    onCheckedChange={(checked) => handleUpdateStatus(checked, row.id)}
                />
            ),
        },
        {
            key: 'created_at',
            label: 'Tanggal dibuat',
            render: (_: any, record: BeritaProps) => <span className="text-muted-foreground text-sm">{formatDate(record?.created_at) || '-'}</span>,
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
                                        onClick={() => handleOpenModal(record.id, 'detail', listBerita)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                        <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'update', listBerita)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                        <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'delete', listBerita)}
                                        className={cn(
                                            'group hover:bg-error/10! flex cursor-pointer items-center justify-between rounded-sm p-2 transition-all',
                                        )}
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
                <div className="flex items-center justify-between px-4 pt-4">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        Kelola Berita
                    </h1>
                    <div className="flex flex-row items-center gap-3">
                        <AppSearchInput placeholder="Cari berdasarkan judul" onChange={(e) => handleSearch(e.target.value)} />
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
                </div>
                <div className="px-4 pt-4">
                    <DataTable
                        data={props?.beritas?.data}
                        columns={columnsBerita}
                        emptyMessage="Tidak ada berita saat ini"
                        mobileColumns={['berita_image', 'judul', 'action']}
                        pagination={{
                            current_page: beritas?.current_page as number,
                            last_page: beritas?.last_page as number,
                            per_page: beritas?.per_page as number,
                            total: beritas?.total as number,
                            from: beritas?.from as number,
                            to: beritas?.to as number,
                        }}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            </div>

            <Modal open={isOpen} key={modalType}>
                <ModalContent hideClose className="custom-scrollbar! overflow-x-hidden">
                    {(modalType === 'create' || modalType === 'update') && (
                        <ModalBody>
                            <ModalHeader>
                                <ModalTitle className="text-2xl font-semibold">
                                    {modalType === 'create' ? 'Tambah' : modalType === 'update' ? 'Ubah' : ''} Berita
                                </ModalTitle>
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
                                                {existingImage || file ? 'Edit Foto' : 'Tambah Foto'}
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
                                        value={data?.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                    />
                                    {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                                </div>

                                <div>
                                    <AppTextArea
                                        label="Isi Berita"
                                        value={data?.isi}
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
                        <div className="p-0 sm:p-4">
                            <ModalHeader>
                                <ModalTitle>Hapus berita</ModalTitle>
                            </ModalHeader>
                            <ModalBody className="max-w-150 text-[10px] break-words sm:text-sm">
                                Anda yakin ingin menghapus berita {selectedData?.judul} ?
                            </ModalBody>
                            <ModalFooter>
                                <div className="mt-2 flex items-center gap-2">
                                    <Button
                                        variant={'outline'}
                                        onClick={() => {
                                            handleCloseModal(), setExistingImage(null), setFile(null);
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button onClick={() => handleSubmit()} variant={'destructive'}>
                                        Hapus
                                    </Button>
                                </div>
                            </ModalFooter>
                        </div>
                    )}

                    {modalType === 'detail' && (
                        <div className="p-4">
                            <ModalHeader>
                                <ModalTitle className="font-semibold">Detail berita</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <div className="mx-auto mb-4 h-50 w-full overflow-hidden rounded-md sm:w-70">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={selectedData?.berita_image?.image_url ?? '/images/default-img.png'}
                                    />
                                </div>
                                <DetailItem value={selectedData?.judul ?? ''} valueClassName="max-w-70 break-words" label="Judul" />
                                <DetailItem value={formatDate(selectedData?.created_at) ?? '-'} label="Dibuat pada" />
                                <div>
                                    <p className="mt-2 mb-2 font-semibold">Deskripsi :</p>
                                    <div className="bg-background/50 max-w-70 rounded-md p-4 text-[12px] break-words sm:max-w-100 sm:text-sm">
                                        {selectedData?.isi ?? ''}
                                    </div>
                                </div>
                            </ModalBody>
                            <div>
                                <Button
                                    onClick={() => {
                                        handleCloseModal(), setExistingImage(null), setFile(null);
                                    }}
                                >
                                    Tutup
                                </Button>
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
