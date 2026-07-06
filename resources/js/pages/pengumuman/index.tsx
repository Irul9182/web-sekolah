import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppInput from '@/components/app-input';
import { Column, DataTable } from '@/components/app-table';
import AppTextArea from '@/components/app-textare';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { formatDate } from '@/helpers/format';
import { useModal } from '@/hooks/use-modal';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { initialPengumumanValue, PengumumanProps, PengumumanPropsForm } from '@/types/pengumuman.type';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    pengumumans: BaseResponse<PengumumanProps>;
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
        title: 'Pengumuman',
        href: '/pengumuman',
    },
];

export default function PengumumanIndex() {
    const props = usePage<PageProps>().props;
    const [loading, setLoading] = useState<boolean>(false);
    const listPengumuman = props?.pengumumans?.data;
    const { filters, pengumumans } = props;
    const { handleOpenModal, handleCloseModal, isOpen, modalType, selectedData, selectedId } = useModal<PengumumanProps>();
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: deletePengumuman,
    } = useForm<PengumumanPropsForm>(initialPengumumanValue);
    const [search, setSearch] = useState(filters?.search ?? '');
    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = (val: string) => {
        setSearch(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                route('pengumuman.index'),
                { ...route().params, search: val, per_page: filters?.per_page },
                { preserveState: true, replace: true },
            );
        }, 400);
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('pengumuman.index'),
            { ...route().params, page: page, per_page: currentPerPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePageSizeChange = (perPage: number) => {
        router.get(
            route('pengumuman.index'),
            { ...route().params, page: 1, per_page: perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSubmit = () => {
        if (modalType === 'create') {
            post(route('pengumuman.store'), {
                onSuccess: () => {
                    toast.success('Berhasil menambah pengumuman.');
                    handleCloseModal();
                },
                onError: () => {
                    toast.error('Gagal menambah pengumuman, coba lagi nanti.');
                },
            });
        }

        if (modalType === 'update') {
            post(route('pengumuman.update', selectedId as string), {
                onSuccess: () => {
                    toast.success(`Berhasil edit pengumuman ${selectedData?.judul}.`);
                    handleCloseModal();
                },
                onError: () => {
                    toast.error('Gagal edit pengumuman, coba lagi nanti.');
                },
            });
        }

        if (modalType === 'delete') {
            deletePengumuman(route('pengumuman.destroy', selectedId as string), {
                onSuccess: () => {
                    toast.success(`Berhasil hapus pengumuman ${selectedData?.judul}.`);
                    handleCloseModal();
                },
                onError: () => {
                    toast.error('Gagal hapus pengumuman, coba lagi nanti.');
                },
            });
        }
    };

    useEffect(() => {
        if (modalType === 'update' || modalType === 'delete' || modalType === 'detail') {
            setData(selectedData as PengumumanProps);
        }
    }, [modalType, selectedId]);

    const columnsPengumuman: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
        },
        {
            key: 'judul',
            label: 'Judul',
            className: 'truncate max-w-[100px] sm:max-w-[300px]',
            render: (_: any, row: PengumumanProps) => <span>{row.judul}</span>,
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (_: any, record: PengumumanProps) => (
                <span className="text-muted-foreground text-sm">{formatDate(record?.tanggal) || '-'}</span>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: (_: any, record: PengumumanProps) => {
                return (
                    <AppDropdownMenu
                        openDisplay={<EllipsisVertical />}
                        menuItem={
                            <>
                                <div className="flex flex-col gap-2 p-2">
                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'detail', listPengumuman)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                        <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'update', listPengumuman)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                        <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleOpenModal(record.id, 'delete', listPengumuman)}
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
                        Kelola Pengumuman
                    </h1>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        }}
                        onClick={() => handleOpenModal(null, 'create', listPengumuman)}
                    >
                        + Tambah Pengumuman
                    </Button>
                </div>
                <div className="px-4 pt-4">
                    <DataTable
                        data={props?.pengumumans?.data}
                        columns={columnsPengumuman}
                        emptyMessage="Tidak ada pengumuman saat ini"
                        mobileColumns={['judul', 'tanggal', 'action']}
                        pagination={{
                            current_page: pengumumans?.current_page as number,
                            last_page: pengumumans?.last_page as number,
                            per_page: pengumumans?.per_page as number,
                            total: pengumumans?.total as number,
                            from: pengumumans?.from as number,
                            to: pengumumans?.to as number,
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
                                    {modalType === 'create' ? 'Tambah Pengumuman' : 'Ubah Pengumuman'}
                                </ModalTitle>
                            </ModalHeader>

                            <div className="mt-4 space-y-3">
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
                                        label="Isi Pengumuman"
                                        value={data?.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Tulis isi pengumuman di sini . . ."
                                        className="bg-background/50! h-48 w-full resize-y rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    {errors.deskripsi && <p className="mt-1 text-sm text-red-500">{errors.deskripsi}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        disabled={processing || loading}
                                        type="button"
                                        onClick={() => handleCloseModal()}
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
                            <h4>Hapus pengumuman</h4>

                            <div>
                                <p>Anda yakin ingin menghapus pengumuman {selectedData?.judul} ? </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant={'destructive'} onClick={handleCloseModal}>
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
                            <h4>Detail pengumuman {selectedData?.judul}</h4>

                            <div>Judul: {selectedData?.judul}</div>
                            <div>Tanggal: {formatDate(selectedData?.tanggal) || '-'}</div>
                            <div>Isi: {selectedData?.deskripsi}</div>
                            <div>
                                <Button onClick={handleCloseModal}>Tutup</Button>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </AppLayout>
    );
}
