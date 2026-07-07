import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppInput from '@/components/app-input';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { formatDate } from '@/helpers/format';
import { useModal } from '@/hooks/use-modal';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { GaleriProps, GaleriPropsForm, initialGaleriValue } from '@/types/galeri.type';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    galeris: BaseResponse<GaleriProps>;
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
        title: 'Galeri',
        href: '/galeri',
    },
];

export default function GaleriIndex() {
    const props = usePage<PageProps>().props;
    const [loading, setLoading] = useState<boolean>(false);
    const listGaleri = props?.galeris?.data;
    const { filters, galeris } = props;
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { handleOpenModal, handleCloseModal, isOpen, modalType, selectedData, selectedId } = useModal<GaleriProps>();
    const { data, setData, post, processing, errors, reset, delete: deleteGaleri } = useForm<GaleriPropsForm>(initialGaleriValue);
    const [search, setSearch] = useState(filters?.search ?? '');
    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const hasImage = !!file || !!existingImage;

    console.log('Galeri: ', galeris);
    useEffect(() => {
        setData('uploaded_image', file as File);
        setData('existing_gambar', existingImage);
    }, [file, existingImage]);

    const handleSearch = (val: string) => {
        setSearch(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                route('galeri.index'),
                { ...route().params, search: val, per_page: filters?.per_page },
                { preserveState: true, replace: true },
            );
        }, 400);
    };

    const handlePageChange = (page: number) => {
        router.get(route('galeri.index'), { ...route().params, page: page, per_page: currentPerPage }, { preserveState: true, preserveScroll: true });
    };

    const handlePageSizeChange = (perPage: number) => {
        router.get(route('galeri.index'), { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
    };

    const handleSubmit = () => {
        if (modalType === 'create') {
            post(route('galeri.store'), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success('Berhasil menambah foto galeri.');
                },
                onError: () => {
                    toast.error('Gagal menambah foto galeri, coba lagi nanti.');
                },
                onFinish: () => {
                    handleCloseModal();
                    setFile(null);
                    setExistingImage(null);
                },
            });
        }

        if (modalType === 'update') {
            post(route('galeri.update', selectedId as string), {
                forceFormData: true,
                onSuccess: () => {
                    toast.success(`Berhasil edit foto ${selectedData?.judul}.`);
                },
                onError: () => {
                    toast.error('Gagal edit foto, coba lagi nanti.');
                },
                onFinish: () => {
                    handleCloseModal();
                    setFile(null);
                    setExistingImage(null);
                },
            });
        }

        if (modalType === 'delete') {
            deleteGaleri(route('galeri.destroy', selectedId as string), {
                onSuccess: () => {
                    toast.success(`Berhasil hapus foto ${selectedData?.judul}.`);
                },
                onError: () => {
                    toast.error('Gagal hapus foto, coba lagi nanti.');
                },
                onFinish: () => {
                    handleCloseModal();
                    setFile(null);
                    setExistingImage(null);
                },
            });
        }
    };

    useEffect(() => {
        if (modalType === 'update' || modalType === 'delete' || modalType === 'detail') {
            setData(selectedData as GaleriProps);
            setExistingImage(selectedData?.galeri_image?.image_url ?? '');
        }
    }, [modalType, selectedId]);

    const columnsGaleri: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
        },
        {
            key: 'galeri_image',
            label: 'Foto',
            render: (_: any, record: GaleriProps) => (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 sm:h-30 sm:w-40">
                    <img src={record?.galeri_image?.image_url ?? '/images/default-img.png'} alt="Galeri" className="h-full w-full object-cover" />
                </div>
            ),
        },
        {
            key: 'judul',
            label: 'Judul',
            className: 'truncate max-w-[100px] sm:max-w-[300px]',
            render: (_: any, row: GaleriProps) => <span>{row.judul}</span>,
        },
        {
            key: 'created_at',
            label: 'Tanggal Ditambahkan',
            render: (_: any, record: GaleriProps) => <span className="text-muted-foreground text-sm">{formatDate(record?.created_at) || '-'}</span>,
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
                            <>
                                <div className="flex flex-col gap-2 p-2">
                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'detail', listGaleri)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                        <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'update', listGaleri)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                        <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'delete', listGaleri)}
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
                        Kelola Galeri
                    </h1>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        }}
                        onClick={() => handleOpenModal(null, 'create', listGaleri)}
                    >
                        + Tambah Foto
                    </Button>
                </div>
                <div className="px-4 pt-4">
                    <DataTable
                        data={props?.galeris?.data}
                        columns={columnsGaleri}
                        emptyMessage="Tidak ada foto galeri saat ini"
                        mobileColumns={['gambar', 'judul', 'action']}
                        pagination={{
                            current_page: galeris?.current_page as number,
                            last_page: galeris?.last_page as number,
                            per_page: galeris?.per_page as number,
                            total: galeris?.total as number,
                            from: galeris?.from as number,
                            to: galeris?.to as number,
                        }}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </div>
            </div>

            <Modal open={isOpen} key={modalType}>
                <ModalContent hideClose>
                    {(modalType === 'create' || modalType === 'update') && (
                        <ModalBody>
                            <ModalHeader>
                                <ModalTitle className="text-2xl font-semibold">
                                    {modalType === 'create' ? 'Tambah Foto Galeri' : 'Ubah Foto Galeri'}
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
                                    {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
                                </div>

                                <div>
                                    <AppInput
                                        className="bg-background/50"
                                        placeholder="Contoh: Kegiatan Olahraga"
                                        label="Judul"
                                        value={data?.judul}
                                        onChange={(e) => setData('judul', e.target.value)}
                                    />
                                    {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                                </div>
                                <div>
                                    <AppInput
                                        className="bg-background/50"
                                        placeholder="Contoh: Kegiatan Olahraga"
                                        label="Isi"
                                        value={data?.isi}
                                        onChange={(e) => setData('isi', e.target.value)}
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
                            <h4>Hapus foto</h4>

                            <div>
                                <p>Anda yakin ingin menghapus foto {selectedData?.judul} ? </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={'destructive'}
                                    onClick={() => {
                                        handleCloseModal(), setExistingImage(null), setFile(null);
                                    }}
                                >
                                    Batal
                                </Button>
                                <Button onClick={() => handleSubmit()} variant={'outline'}>
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    )}

                    {modalType === 'detail' && (
                        <div className="p-4">
                            <h4>Detail foto {selectedData?.judul}</h4>

                            <div className="relative aspect-auto w-full overflow-hidden rounded-lg border-2">
                                <img
                                    src={selectedData?.galeri_image?.image_url ?? '/images/default-img.png'}
                                    alt="Galeri"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>Judul: {selectedData?.judul}</div>
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
        </AppLayout>
    );
}
