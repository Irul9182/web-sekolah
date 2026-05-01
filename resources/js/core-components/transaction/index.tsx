import DetailItem from '@/components/app-detail-item';
import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppSearchInput from '@/components/app-input-search';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Modal, ModalBody, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui-shadcn/modal';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatPercent } from '@/helpers/format';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/laravel.type';
import { TransaksiProps } from '@/types/transaction.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Plus, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transaksi',
        href: '/transaction',
    },
];

interface PageProps extends InertiaPageProps {
    list_transaksi?: PaginatedResponse<TransaksiProps>;
    filters: {
        search: string;
        per_page: number;
    };
}

type ModalType = 'detail' | 'delete';
const TransactionIndex = ({ filters, list_transaksi }: PageProps) => {
    const { props } = usePage<PageProps>();
    const { errors } = props;
    const [open, setIsOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalType | null>(null);
    const [selectedTransaksiId, setSelectedTransaksiId] = useState<string | null>(null);
    const [selectedDataTransaksi, setSelectedDataTransaksi] = useState<TransaksiProps | null>(null);
    const currentPage = new URLSearchParams(window.location.search).get('page') ?? '1';
    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    console.log('Transaksi response: ', list_transaksi);
    const form = useForm();
    const { processing } = form;
    // const { processing } = form;
    const isMobile = useIsMobile();
    useEffect(() => {
        const findedDataTransaksi = list_transaksi?.data?.find((item) => item.transaksi_id === selectedTransaksiId);

        setSelectedDataTransaksi(findedDataTransaksi as TransaksiProps);
    }, [selectedTransaksiId]);

    const OpenModal = (transaksi_id: string, modalType: ModalType | null) => {
        if (transaksi_id === null) return;
        if (modalType === null) return;

        if (modalType === 'delete') {
            setModalType('delete');
            setSelectedTransaksiId(transaksi_id);
            setIsOpen(true);
        } else if (modalType === 'detail') {
            setModalType('detail');
            setSelectedTransaksiId(transaksi_id);
            setIsOpen(true);
        }
    };
    const handleSearch = (val: string) => {
        setSearch(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                route('transaction.index'),
                { ...route().params, search: val, per_page: filters.per_page },
                { preserveState: true, replace: true },
            );
        }, 400);
    };
    const closeModal = () => {
        setSelectedTransaksiId(null);
        setSelectedDataTransaksi(null);
        setModalType(null);
        setIsOpen(false);
    };

    const handleDeleteTransaksi = () => {
        form.delete(`/transaction/${selectedTransaksiId}?page=${currentPage}&per_page=${currentPerPage}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    `Berhasil menghapus transaksi ${selectedDataTransaksi?.kategori} pada proyek ${selectedDataTransaksi?.proyek?.nama_proyek || 'No Content'}.`,
                    { position: 'top-right' },
                );
            },

            onError: (err) => {
                toast.error(
                    `Gagal mmenghapus transaksi ${selectedDataTransaksi?.kategori} pada proyek ${selectedDataTransaksi?.proyek?.nama_proyek || 'No Content'}.`,
                    { position: 'top-right' },
                );
                console.log('Error: ', err);
            },

            onFinish: () => closeModal(),
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/transaction', { ...route().params, page, per_page: currentPerPage }, { preserveState: true, preserveScroll: true });
    };

    const handlePageSizeChange = (perPage: number) => {
        router.get('/transaction', { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
    };
    const columnsTransaksi: Column<TransaksiProps>[] = [
        {
            key: 'transaksi_id',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
        },
        {
            key: 'proyek_name',
            className: 'text-start',
            label: 'Nama Proyek',
            render: (_: any, record: TransaksiProps) => <span className="text-muted-foreground text-sm">{record?.proyek?.nama_proyek || '-'}</span>,
        },
        // {
        //     key: 'tipe',
        //     label: 'Tipe',
        //     sortable: true,
        //     render: (value) => {
        //         const isPemasukan = value === 'pemasukan';
        //         return (
        //             <span
        //                 className={cn(
        //                     'rounded-md px-2 py-0.5 text-sm font-semibold uppercase',
        //                     isPemasukan ? 'bg-success/10 text-success' : 'bg-error/10 text-error',
        //                 )}
        //             >
        //                 {isPemasukan ? 'Pemasukan' : 'Pengeluaran'}
        //             </span>
        //         );
        //     },
        // },
        {
            key: 'kategori',
            label: 'Kategori',
            sortable: true,
            render: (value) => {
                const map: Record<string, string> = {
                    operasional: 'Operasional',
                    biaya_tak_terduga: 'Biaya Tak Terduga',
                    staff_entry_data: 'Staff Entry Data',
                    staff_perpajakan: 'Staff Perpajakan',
                    mandor: 'Jasa Mandor',
                    jasa_tukang: 'Jasa Tukang',
                    material: 'Material',
                };
                return (
                    <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-sm text-[12px] font-semibold sm:text-sm">
                        {map[value as string] ?? value}
                    </span>
                );
            },
        },
        {
            key: 'jumlah',
            label: 'Jumlah',
            sortable: true,
            render: (value, record: TransaksiProps) => {
                return (
                    <span className={cn('font-semibold', 'text-blue-500')}>
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                        }).format(Number(value))}
                    </span>
                );
            },
        },
        {
            key: 'persen',
            label: 'Persen',
            sortable: true,
            render: (value, record: TransaksiProps) => {
                return <span className={cn('font-semibold')}>{value === null ? '-' : ((value + ' %') as string)} </span>;
            },
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            sortable: true,
            render: (value) =>
                new Date(value as string).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: (_: any, record: TransaksiProps) => {
                return (
                    <AppDropdownMenu
                        openDisplay={<EllipsisVertical />}
                        menuItem={
                            <>
                                <div className="flex flex-col gap-2 p-2">
                                    {/* Detail */}
                                    <DropdownMenuItem
                                        onClick={() => router?.visit(`/transaction/${record?.transaksi_id}/detail`)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                        <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                                    </DropdownMenuItem>

                                    {/* Ubah */}
                                    <DropdownMenuItem
                                        onClick={() => router?.visit(`/transaction/${record?.transaksi_id}/edit`)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                        <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                    </DropdownMenuItem>

                                    {/* Hapus */}
                                    <DropdownMenuItem
                                        // onClick={() => OpenModal(record?.transaksi_id)}
                                        className={cn('group hover:bg-error/10! flex cursor-pointer items-center justify-between p-2 transition-all')}
                                        onClick={() => OpenModal(record?.transaksi_id, 'delete')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-error!')}>Hapus</p>
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
            <Head title="Transaksi" />

            <div className="p-4">
                <div className="flex w-full items-center justify-between">
                    <AppSearchInput
                        placeholder="Cari transaksi dengan nama proyek . . ."
                        value={search}
                        className="w-[90%] sm:w-84!"
                        onChange={(e) => handleSearch(e.target.value)}
                        clearable={false}
                    />

                    <Button
                        className="cursor-pointer"
                        // disabled={processing}
                        size={isMobile ? 'sm' : 'default'}
                        onClick={() => router.visit('/transaction/create')}
                    >
                        <Plus />
                        <p>Transaksi Baru</p>
                    </Button>
                </div>
                <DataTable
                    className="mt-4"
                    emptyMessage="Tidak ada transaksi saat ini"
                    data={list_transaksi?.data as TransaksiProps[]}
                    columns={columnsTransaksi}
                    key={list_transaksi?.data?.length}
                    mobileColumns={['proyek_name', 'kategori', 'action']}
                    pagination={{
                        current_page: list_transaksi?.current_page as number,
                        last_page: list_transaksi?.last_page as number,
                        per_page: list_transaksi?.per_page as number,
                        total: list_transaksi?.total as number,
                        from: list_transaksi?.from as number,
                        to: list_transaksi?.to as number,
                    }}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
            <Modal open={open} key={selectedTransaksiId}>
                {modalType === 'delete' ? (
                    <ModalContent size="xl" hideClose>
                        <ModalHeader>
                            <ModalTitle className="text-xl">Hapus Transaksi</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-sm">Anda yakin ingin menghapus transaksi ini?</p>
                        </ModalBody>
                        <ModalFooter className="flex items-center gap-3">
                            <ModalClose asChild>
                                <Button variant={'default'} onClick={closeModal} className="...">
                                    Batal
                                </Button>
                            </ModalClose>
                            <Button variant={'destructive'} onClick={handleDeleteTransaksi} className="...">
                                Hapus
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                ) : modalType === 'detail' ? (
                    <ModalContent size="xl" hideClose>
                        <ModalHeader>
                            <ModalTitle className="text-xl">Detail Transaksi</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            <div>
                                <DetailItem label="Nama Proyek" value={selectedDataTransaksi?.proyek?.nama_proyek} />
                                <DetailItem label="Dana Setelah Pajak" value={selectedDataTransaksi?.proyek?.biaya_staff_perpajakan} />
                                <DetailItem label="Kategori " value={selectedDataTransaksi?.kategori} />
                                <DetailItem label="Persen Total (%)" value={formatPercent(selectedDataTransaksi?.persen)} />
                                <DetailItem label="Jumlah Total (IDR)" value={formatCurrency(selectedDataTransaksi?.jumlah)} />
                                <DetailItem label="Tanggal" value={formatDate(selectedDataTransaksi?.tanggal)} />
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex items-center gap-3">
                            <ModalClose asChild>
                                <Button variant={'default'} onClick={closeModal} className="...">
                                    Kembali
                                </Button>
                            </ModalClose>
                        </ModalFooter>
                    </ModalContent>
                ) : (
                    <ModalContent size="xl" hideClose>
                        <ModalHeader>
                            <ModalTitle className="text-xl">Tipe Modal Invalid</ModalTitle>
                        </ModalHeader>

                        <ModalFooter className="flex items-center gap-3">
                            <ModalClose asChild>
                                <Button variant={'default'} onClick={closeModal} className="...">
                                    Batal
                                </Button>
                            </ModalClose>
                        </ModalFooter>
                    </ModalContent>
                )}
            </Modal>
        </AppLayout>
    );
};

export default TransactionIndex;
