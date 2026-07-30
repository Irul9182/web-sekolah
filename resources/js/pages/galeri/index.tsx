import DetailItem from '@/components/app-detail-item';
import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppInput from '@/components/app-input';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { useModal } from '@/hooks/use-modal';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface GaleriImage {
    id: number;
    image_url: string;
}

interface GaleriProps {
    id: number;
    judul: string;
    bulan: number;
    tahun: number;
    images: GaleriImage[];
    created_at: string;
}

interface PageProps {
    galeris: BaseResponse<GaleriProps>;
}

const BULAN = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Galeri',
        href: '/admin/galeri',
    },
];

export default function GaleriIndex() {
    const props = usePage<PageProps>().props;

    const listGaleri = props?.galeris?.data;

    const {
        handleOpenModal,
        handleCloseModal,
        isOpen,
        modalType,
        selectedData,
        selectedId,
    } = useModal<GaleriProps>();

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: deleteGaleri,
    } = useForm<{
        judul: string;
        bulan: string;
        tahun: string;
        gambar: File[];
    }>({
        judul: '',
        bulan: String(new Date().getMonth() + 1),
        tahun: String(new Date().getFullYear()),
        gambar: [],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    /**
     * Mengisi data form ketika modal Ubah dibuka
     */
    useEffect(() => {
        if (
            modalType === 'update' ||
            modalType === 'delete' ||
            modalType === 'detail'
        ) {
            setData({
                judul: selectedData?.judul ?? '',
                bulan: String(selectedData?.bulan ?? ''),
                tahun: String(selectedData?.tahun ?? ''),
                gambar: [],
            });
        }
    }, [modalType, selectedId]);

    /**
     * Memilih file gambar
     */
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);

        setData('gambar', files);

        setPreviews(
            files.map((file) => URL.createObjectURL(file))
        );
    }

    /**
     * Submit data berdasarkan jenis modal
     */
    const handleSubmit = () => {
        /**
         * Tambah Galeri
         */
        if (modalType === 'create') {
            post(route('galeri.store'), {
                forceFormData: true,

                onSuccess: () => {
                    toast.success('Berhasil menambah galeri.');
                },

                onError: () => {
                    toast.error('Gagal menambah galeri.');
                },

                onFinish: () => {
                    handleCloseModal();
                    reset();
                    setPreviews([]);
                },
            });
        }

        /**
         * Ubah Galeri
         */
        if (modalType === 'update') {
            post(
                route(
                    'galeri.update',
                    selectedId as string
                ),
                {
                    forceFormData: true,

                    onSuccess: () => {
                        toast.success(
                            `Berhasil mengubah galeri ${selectedData?.judul}.`
                        );
                    },

                    onError: () => {
                        toast.error(
                            'Gagal mengubah galeri.'
                        );
                    },

                    onFinish: () => {
                        handleCloseModal();
                        reset();
                        setPreviews([]);
                    },
                }
            );
        }

        /**
         * Hapus Galeri
         */
        if (modalType === 'delete') {
            deleteGaleri(
                route(
                    'galeri.destroy',
                    selectedId as string
                ),
                {
                    onSuccess: () => {
                        toast.success(
                            `Berhasil menghapus galeri ${selectedData?.judul}.`
                        );
                    },

                    onError: () => {
                        toast.error(
                            'Gagal menghapus galeri.'
                        );
                    },

                    onFinish: () => {
                        handleCloseModal();
                    },
                }
            );
        }
    };

    /**
     * Kolom DataTable
     */
    const columnsGaleri: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',

            render: (
                _value: any,
                _record: any,
                index: number
            ) => (
                <span className="text-muted-foreground text-sm">
                    {index + 1}
                </span>
            ),
        },

        {
            key: 'judul',
            label: 'Judul',

            render: (
                _value: any,
                record: GaleriProps
            ) => (
                <span>
                    {record.judul}
                </span>
            ),
        },

        {
            key: 'bulan',
            label: 'Bulan',

            render: (
                _value: any,
                record: GaleriProps
            ) => (
                <span>
                    {BULAN[record.bulan - 1]} {record.tahun}
                </span>
            ),
        },

        {
            key: 'images',
            label: 'Foto',

            render: (
                _value: any,
                record: GaleriProps
            ) => (
                <div className="flex gap-1">
                    {record.images
                        ?.slice(0, 3)
                        .map((image) => (
                            <img
                                key={image.id}
                                src={image.image_url}
                                alt={record.judul}
                                className="h-10 w-14 rounded object-cover"
                            />
                        ))}

                    {record.images?.length > 3 && (
                        <span className="text-muted-foreground self-center text-xs">
                            +{record.images.length - 3}
                        </span>
                    )}
                </div>
            ),
        },

        {
            key: 'action',
            label: 'Action',
            className: 'text-center',

            render: (
                _value: any,
                record: GaleriProps
            ) => (
                <AppDropdownMenu
                    openDisplay={
                        <EllipsisVertical />
                    }

                    menuItem={
                        <div className="flex flex-col gap-2 p-2">

                            {/* DETAIL */}
                            <DropdownMenuItem
                                onClick={() =>
                                    handleOpenModal(
                                        record.id,
                                        'detail',
                                        listGaleri
                                    )
                                }

                                className={cn(
                                    'group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2'
                                )}
                            >
                                <p
                                    className={cn(
                                        'text-foreground! group-hover:text-chart-1!'
                                    )}
                                >
                                    Detail
                                </p>

                                <Eye
                                    size={16}
                                    className={cn(
                                        'text-muted-foreground! group-hover:text-chart-1!'
                                    )}
                                />
                            </DropdownMenuItem>

                            {/* UBAH */}
                            <DropdownMenuItem
                                onClick={() =>
                                    handleOpenModal(
                                        record.id,
                                        'update',
                                        listGaleri
                                    )
                                }

                                className={cn(
                                    'group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2'
                                )}
                            >
                                <p
                                    className={cn(
                                        'text-foreground! group-hover:text-chart-2!'
                                    )}
                                >
                                    Ubah
                                </p>

                                <Edit
                                    size={16}
                                    className={cn(
                                        'text-muted-foreground! group-hover:text-chart-2!'
                                    )}
                                />
                            </DropdownMenuItem>

                            {/* HAPUS */}
                            <DropdownMenuItem
                                onClick={() =>
                                    handleOpenModal(
                                        record.id,
                                        'delete',
                                        listGaleri
                                    )
                                }

                                className={cn(
                                    'group hover:bg-error/10! flex cursor-pointer items-center justify-between rounded-sm p-2 transition-all'
                                )}
                            >
                                <p>
                                    Hapus
                                </p>

                                <Trash
                                    size={16}
                                    className={cn(
                                        'text-muted-foreground! group-hover:text-error!'
                                    )}
                                />
                            </DropdownMenuItem>

                        </div>
                    }
                />
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            {/* ================================
                HEADER DAN TABLE
            ================================= */}
            <div>

                <div className="flex items-center justify-between px-4 pt-4">

                    <h1
                        className="text-2xl font-bold"
                        style={{
                            color: 'var(--foreground)',
                        }}
                    >
                        Kelola Galeri
                    </h1>

                    <Button
                        style={{
                            backgroundColor:
                                'var(--primary)',

                            color:
                                'var(--primary-foreground)',
                        }}

                        onClick={() =>
                            handleOpenModal(
                                null,
                                'create',
                                listGaleri
                            )
                        }
                    >
                        + Tambah Galeri
                    </Button>

                </div>

                <div className="px-4 pt-4">

                    <DataTable
                        data={
                            props?.galeris?.data
                        }

                        columns={
                            columnsGaleri
                        }

                        emptyMessage="Tidak ada galeri saat ini"

                        mobileColumns={[
                            'judul',
                            'images',
                            'action',
                        ]}
                    />

                </div>

            </div>


            {/* ================================
                MODAL
            ================================= */}
            <Modal
                open={isOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleCloseModal();
                    }
                }}
            >

                <ModalContent
                    className="custom-scrollbar! overflow-x-hidden"
                >

                    {/* =========================
                        TAMBAH / UBAH
                    ========================== */}
                    {(modalType === 'create' ||
                        modalType === 'update') && (

                        <ModalBody>

                            <ModalHeader>

                                <ModalTitle
                                    className="text-2xl font-semibold"
                                >
                                    {modalType === 'create'
                                        ? 'Tambah Galeri'
                                        : 'Ubah Galeri'}
                                </ModalTitle>

                            </ModalHeader>

                            <div className="mt-4 space-y-4">

                                {/* JUDUL */}
                                <div>

                                    <AppInput
                                        className="bg-background/50"
                                        placeholder="Masukkan judul galeri . . ."
                                        label="Judul"
                                        value={data.judul}
                                        onChange={(e) =>
                                            setData(
                                                'judul',
                                                e.target.value
                                            )
                                        }
                                    />

                                    {errors.judul && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.judul}
                                        </p>
                                    )}

                                </div>


                                {/* BULAN DAN TAHUN */}
                                <div className="grid grid-cols-2 gap-4">

                                    <div>

                                        <label className="mb-1 block text-sm text-gray-600">
                                            Bulan
                                        </label>

                                        <select
                                            value={data.bulan}
                                            onChange={(e) =>
                                                setData(
                                                    'bulan',
                                                    e.target.value
                                                )
                                            }

                                            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        >

                                            {BULAN.map(
                                                (
                                                    bulan,
                                                    index
                                                ) => (
                                                    <option
                                                        key={index}
                                                        value={index + 1}
                                                    >
                                                        {bulan}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {errors.bulan && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.bulan}
                                            </p>
                                        )}

                                    </div>


                                    <div>

                                        <label className="mb-1 block text-sm text-gray-600">
                                            Tahun
                                        </label>

                                        <input
                                            type="number"
                                            value={data.tahun}
                                            onChange={(e) =>
                                                setData(
                                                    'tahun',
                                                    e.target.value
                                                )
                                            }

                                            min="2000"
                                            max="2100"

                                            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />

                                        {errors.tahun && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.tahun}
                                            </p>
                                        )}

                                    </div>

                                </div>


                                {/* FOTO */}
                                <div>

                                    <label className="mb-1 block text-sm text-gray-600">
                                        Foto Galeri
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={
                                            handleFileChange
                                        }

                                        className="w-full rounded-lg border border-gray-300 p-2"
                                    />

                                    {errors.gambar && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.gambar}
                                        </p>
                                    )}

                                    {previews.length > 0 && (

                                        <div className="mt-3 grid grid-cols-4 gap-2">

                                            {previews.map(
                                                (
                                                    preview,
                                                    index
                                                ) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt="Preview"
                                                        className="h-20 w-full rounded-lg object-cover"
                                                    />
                                                )
                                            )}

                                        </div>

                                    )}

                                    <p className="mt-1 text-xs text-gray-400">
                                        {data.gambar.length > 0
                                            ? `${data.gambar.length} foto dipilih`
                                            : 'Belum ada foto dipilih'}
                                    </p>

                                </div>


                                {/* BUTTON */}
                                <div className="flex gap-3 pt-2">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            handleCloseModal();
                                            reset();
                                            setPreviews([]);
                                        }}
                                    >
                                        Batal
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={
                                            handleSubmit
                                        }
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Menyimpan...'
                                            : 'Simpan'}
                                    </Button>

                                </div>

                            </div>

                        </ModalBody>
                    )}


                    {/* =========================
                        DETAIL
                    ========================== */}
                    {modalType === 'detail' && (

                        <div className="p-4">

                            <ModalHeader>

                                <ModalTitle>
                                    Detail Galeri
                                </ModalTitle>

                            </ModalHeader>

                            <ModalBody>

                                <DetailItem
                                    label="Judul"
                                    value={
                                        selectedData?.judul ?? ''
                                    }
                                />

                                <DetailItem
                                    label="Periode"
                                    value={`${BULAN[
                                        (selectedData?.bulan ?? 1) - 1
                                    ]} ${
                                        selectedData?.tahun ?? ''
                                    }`}
                                />

                                <div className="mt-4">

                                    <p className="mb-2 font-semibold">
                                        Foto Galeri
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                                        {selectedData?.images?.map(
                                            (image) => (

                                                <img
                                                    key={image.id}
                                                    src={image.image_url}
                                                    alt={
                                                        selectedData.judul
                                                    }

                                                    className="h-32 w-full rounded-lg object-cover"
                                                />

                                            )
                                        )}

                                    </div>

                                </div>

                            </ModalBody>

                            <ModalFooter>

                                <Button
                                    onClick={
                                        handleCloseModal
                                    }
                                >
                                    Tutup
                                </Button>

                            </ModalFooter>

                        </div>

                    )}


                    {/* =========================
                        HAPUS
                    ========================== */}
                    {modalType === 'delete' && (

                        <div className="p-4">

                            <ModalHeader>

                                <ModalTitle>
                                    Hapus Galeri
                                </ModalTitle>

                            </ModalHeader>

                            <ModalBody>

                                <p>
                                    Apakah Anda yakin ingin
                                    menghapus galeri{' '}

                                    <strong>
                                        {selectedData?.judul}
                                    </strong>
                                    ?
                                </p>

                            </ModalBody>

                            <ModalFooter>

                                <Button
                                    variant="outline"
                                    onClick={
                                        handleCloseModal
                                    }
                                >
                                    Batal
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={
                                        handleSubmit
                                    }

                                    disabled={
                                        processing
                                    }
                                >
                                    {processing
                                        ? 'Menghapus...'
                                        : 'Hapus'}
                                </Button>

                            </ModalFooter>

                        </div>

                    )}

                </ModalContent>

            </Modal>

        </AppLayout>
    );
}