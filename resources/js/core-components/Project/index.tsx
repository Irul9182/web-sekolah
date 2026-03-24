import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppSelect from '@/components/app-select';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/laravel.type';
import { ProyekProps, StatusProyek, TipeProyek } from '@/types/project.type';
import { Head, router } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Plus, Trash } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyek',
        href: '/project',
    },
];

interface PropTypes {
    proyeks: PaginatedResponse<ProyekProps>;
}

const ProjectIndex = ({ proyeks }: PropTypes) => {
    const [open, setIsOpen] = useState<boolean>(false);
    const [optionStatus, setOptionStatus] = useState<StatusProyek | null>(null);
    const isMobile = useIsMobile();

    console.log('Data proyeks: ', proyeks);

    const columnsProyek: Column<ProyekProps>[] = [
        {
            key: 'nama_proyek',
            label: 'Nama Proyek',
            sortable: true,
        },
        {
            key: 'tipe_proyek',
            label: 'Tipe',
            render: (value) => {
                const map: Record<TipeProyek, string> = {
                    papping: 'Papping',
                    u_ditch: 'U-Ditch',
                    spall: 'Spall',
                    beton: 'Beton',
                    sab: 'SAB',
                };
                return (
                    <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs">{map[value as TipeProyek] ?? value}</span>
                );
            },
        },
        {
            key: 'pagu_total',
            label: 'Pagu Total',
            sortable: true,
            render: (value) => (
                <span>
                    {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                    }).format(value as number)}
                </span>
            ),
        },
        {
            key: 'tanggal_mulai',
            label: 'Tanggal Mulai',
            sortable: true,
            render: (value) =>
                new Date(value as string).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            key: 'nama_klien',
            label: 'Klien',
            sortable: true,
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => {
                return (
                    <AppSelect
                        tone={
                            value === 'selesai' ? 'success' : value === 'dibatalkan' ? 'error' : value === 'sedang_berjalan' ? 'warning' : 'default'
                        }
                        value={value as StatusProyek}
                        options={[
                            { value: 'selesai', label: 'Selesai' },
                            { value: 'sedang_berjalan', label: 'Berjalan' },
                            { value: 'dibatalkan', label: 'Dibatalkan' },
                        ]}
                        onValueChange={(val: StatusProyek) => setOptionStatus(val)}
                    />
                );
            },
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: () => {
                return (
                    <AppDropdownMenu
                        openDisplay={<EllipsisVertical />}
                        menuItem={
                            <>
                                <div className="p-2">
                                    <DropdownMenuItem className="flex cursor-pointer items-center justify-between p-2">
                                        <p>Detail</p>
                                        <Eye />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-chart-5! flex cursor-pointer items-center justify-between p-2">
                                        <p>Ubah</p>
                                        <Edit />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-chart-3! flex cursor-pointer items-center justify-between p-2 transition-all">
                                        <p>Hapus</p>
                                        <Trash />
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
                <div className="flex w-full justify-end">
                    <Button className="cursor-pointer" size={isMobile ? 'sm' : 'default'} onClick={() => router.visit('/project/create')}>
                        <Plus />
                        <p>Proyek Baru</p>
                    </Button>
                </div>
                <DataTable className="mt-4" emptyMessage="Tidak ada proyek saat ini" data={proyeks?.data} columns={columnsProyek} />
            </div>
            <Modal open={open} onOpenChange={setIsOpen}>
                <ModalContent className="max-h-[90vh] max-w-[90%] overflow-y-scroll sm:max-w-[79%]">
                    <ModalHeader>
                        <ModalTitle>Tambah proyek baru</ModalTitle>
                    </ModalHeader>
                    <ModalBody></ModalBody>
                    <ModalFooter className="flex items-center gap-3">
                        <ModalClose asChild>
                            <Button variant={'secondary'} className="...">
                                Batal
                            </Button>
                        </ModalClose>
                        <Button className="..." onClick={() => setIsOpen(false)}>
                            Simpan
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AppLayout>
    );
};

export default ProjectIndex;
