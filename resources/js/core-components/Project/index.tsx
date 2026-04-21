import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppSearchInput from '@/components/app-input-search';
import AppSelect from '@/components/app-select';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/laravel.type';
import { initialProyek, ProyekProps, StatusProyek } from '@/types/project.type';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Plus, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyek',
        href: '/project',
    },
];

interface PropTypes {
    proyeks: PaginatedResponse<ProyekProps>;
    filters: {
        search: string;
        per_page: number;
    };
}

const ProjectIndex = ({ proyeks, filters }: PropTypes) => {
    const [open, setIsOpen] = useState<boolean>(false);
    // const [optionStatus, setOptionStatus] = useState<StatusProyek | null>(null);
    const [selectedProyekId, setSelectedProyekId] = useState<string | null>(null);
    const [selectedDataProyek, setSelectedDataProyek] = useState<ProyekProps | null>(null);
    const isMobile = useIsMobile();
    // const [loading, setLoading] = useState<boolean>(false);
    const form = useForm<ProyekProps>(initialProyek);
    const { processing } = form;
    const currentPage = new URLSearchParams(window.location.search).get('page') ?? '1';
    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
    const [search, setSearch] = useState(filters?.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    console.log('Proyeks: ', proyeks);

    useEffect(() => {
        const findedDataProyek = proyeks?.data?.find((item) => item.proyek_id === selectedProyekId);

        setSelectedDataProyek(findedDataProyek as ProyekProps);
    }, [selectedProyekId]);

    const OpenDeleteModal = (proyek_id: string) => {
        if (proyek_id === null) return;
        setSelectedProyekId(proyek_id);
        setIsOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedProyekId(null);
        setSelectedDataProyek(null);
        setIsOpen(false);
    };
    const handleSearch = (val: string) => {
        setSearch(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            router.get(
                route('project.index'),
                {
                    ...route().params,
                    search: val,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400);
    };
    const handleUpdateOptionStatus = (proyek_id: string, status: StatusProyek, nama_proyek: string) => {
        if (!proyek_id) return;
        const currentPage = new URLSearchParams(window.location.search).get('page') ?? '1';
        router.patch(
            `/project/${proyek_id}?page=${currentPage}&per_page=${currentPerPage}`,
            { status: status },

            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Berhasil update status proyek ${nama_proyek || 'No Content'}.`, { position: 'top-right' });
                },
                onError: (err) => {
                    toast.error(`Gagal update status proyek ${nama_proyek || 'No Content'}.`, { position: 'top-right' });
                    console.log('error update status: ', err);
                },
            },
        );
    };

    const handleDeleteProyek = () => {
        form.delete(`/project/${selectedProyekId}?page=${currentPage}&per_page=${currentPerPage}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Berhasil menghapus proyek ${selectedDataProyek?.nama_proyek || 'No Content'}.`, { position: 'top-right' });
            },

            onError: (err) => {
                toast.error(`Gagal menghapus proyek ${selectedDataProyek?.nama_proyek || 'No Content'}.`, { position: 'top-right' });
                console.log('Error: ', err);
            },

            onFinish: () => closeDeleteModal(),
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/project', { ...route().params, page, per_page: currentPerPage }, { preserveState: true, preserveScroll: true });
    };

    const handlePageSizeChange = (perPage: number) => {
        router.get('/project', { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
    };
    const columnsProyek: Column<ProyekProps>[] = [
        {
            key: 'nama_proyek',
            label: 'Nama Proyek',
            sortable: true,
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (_: any, record: ProyekProps) => {
                return (
                    <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-sm font-semibold uppercase">
                        {record?.kategori?.nama}
                    </span>
                );
            },
        },
        {
            key: 'jenis',
            label: 'Jenis Proyek',
            render: (_: any, record: ProyekProps) => {
                return <span className="bg-secondary text-secondary-foreground rounded-md py-0.5 text-sm font-semibold">{record?.jenis?.nama}</span>;
            },
        },
        // {
        //     key: 'pagu_total',
        //     label: 'Pagu Total',
        //     sortable: true,
        //     render: (value) => (
        //         <span>
        //             {new Intl.NumberFormat('id-ID', {
        //                 style: 'currency',
        //                 currency: 'IDR',
        //                 maximumFractionDigits: 0,
        //             }).format(value as number)}
        //         </span>
        //     ),
        // },
        // {
        //     key: 'tanggal_mulai',
        //     label: 'Tanggal Mulai',
        //     sortable: true,
        //     render: (value) =>
        //         new Date(value as string).toLocaleDateString('id-ID', {
        //             day: '2-digit',
        //             month: 'short',
        //             year: 'numeric',
        //         }),
        // },
        {
            key: 'nama_klien',
            label: 'Klien',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            render: (value, record: ProyekProps) => {
                return (
                    <AppSelect
                        disabled={processing}
                        tone={
                            value === 'selesai' ? 'success' : value === 'dibatalkan' ? 'error' : value === 'sedang_berjalan' ? 'default' : 'default'
                        }
                        value={value as StatusProyek}
                        options={[
                            { value: 'selesai', label: 'Selesai' },
                            { value: 'sedang_berjalan', label: 'Berjalan' },
                            { value: 'dibatalkan', label: 'Dibatalkan' },
                        ]}
                        onValueChange={(val) => handleUpdateOptionStatus(record?.proyek_id, val as StatusProyek, record?.nama_proyek)}
                    />
                );
            },
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: (_: any, record: ProyekProps) => {
                return (
                    <AppDropdownMenu
                        openDisplay={<EllipsisVertical />}
                        menuItem={
                            <>
                                <div className="flex flex-col gap-2 p-2">
                                    {/* Detail */}
                                    <DropdownMenuItem
                                        onClick={() => router?.visit(`/project/${record?.proyek_id}/detail`)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                        <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                                    </DropdownMenuItem>

                                    {/* Ubah */}
                                    <DropdownMenuItem
                                        onClick={() => router?.visit(`/project/${record?.proyek_id}/edit`)}
                                        className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                                    >
                                        <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                        <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                                    </DropdownMenuItem>

                                    {/* Hapus */}
                                    <DropdownMenuItem
                                        onClick={() => OpenDeleteModal(record?.proyek_id)}
                                        className={cn('group hover:bg-error/10! flex cursor-pointer items-center justify-between p-2 transition-all')}
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
            <Head title="Proyek" />
            <div className="p-4">
                <div className="flex w-full justify-between">
                    <AppSearchInput
                        placeholder="Cari proyek dengan nama . . ."
                        value={search}
                        className="w-84!"
                        onChange={(e) => handleSearch(e.target.value)}
                        clearable={false}
                    />
                    <Button
                        className="cursor-pointer"
                        disabled={processing}
                        size={isMobile ? 'sm' : 'default'}
                        onClick={() => router.visit('/project/create')}
                    >
                        <Plus />
                        <p>Proyek Baru</p>
                    </Button>
                </div>
                <DataTable
                    className="mt-4"
                    emptyMessage="Tidak ada proyek saat ini"
                    data={proyeks.data}
                    columns={columnsProyek}
                    pagination={{
                        current_page: proyeks.current_page,
                        last_page: proyeks.last_page,
                        per_page: proyeks.per_page,
                        total: proyeks.total,
                        from: proyeks.from,
                        to: proyeks.to,
                    }}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
            <Modal open={open} key={selectedProyekId}>
                <ModalContent size="xl" hideClose>
                    <ModalHeader>
                        <ModalTitle className="text-xl">Hapus Proyek {selectedDataProyek?.nama_proyek || 'No Content'}</ModalTitle>
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-sm">Anda yakin ingin menghapus proyek ini?</p>
                    </ModalBody>
                    <ModalFooter className="flex items-center gap-3">
                        <ModalClose asChild>
                            <Button variant={'default'} onClick={closeDeleteModal} className="...">
                                Batal
                            </Button>
                        </ModalClose>
                        <Button variant={'destructive'} onClick={handleDeleteProyek} className="...">
                            Hapus
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AppLayout>
    );
};

export default ProjectIndex;
