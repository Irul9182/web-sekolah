import AppDropdownMenu from '@/components/app-dopdown-menu';
import AppInput from '@/components/app-input';
import AppSearchInput from '@/components/app-input-search';
import { Column, DataTable } from '@/components/app-table';
import AppTextArea from '@/components/app-textare';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { useModal } from '@/hooks/use-modal';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import {
    EkstrakulikulerProps,
    EkstrakulikulerPropsForm,
    initialEkstrakulikulerValue,
    initialPrestasiValue,
    PrestasiPropsForm,
} from '@/types/ekstrakulikuler.type';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Plus, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    ekstrakulikulers: BaseResponse<EkstrakulikulerProps>;
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
        title: 'Ekstrakulikuler',
        href: '/ekstrakulikuler',
    },
];

export default function EkstrakulikulerIndex() {
    const props = usePage<PageProps>().props;
    const listEkskul = props?.ekstrakulikulers?.data;
    const { filters, ekstrakulikulers } = props;

    const { handleOpenModal, handleCloseModal, isOpen, modalType, selectedData, selectedId } = useModal<EkstrakulikulerProps>();
    const { data, setData, post, processing, errors, reset, delete: deleteEkskul } = useForm<EkstrakulikulerPropsForm>(
        initialEkstrakulikulerValue,
    );

    const [search, setSearch] = useState(filters?.search ?? '');
    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const thumbInputRef = useRef<HTMLInputElement>(null);
    const fotoInputRef = useRef<HTMLInputElement>(null);

    // form kecil untuk tambah prestasi, hanya aktif waktu modalType === 'update'
    const {
        data: prestasiData,
        setData: setPrestasiData,
        post: postPrestasi,
        processing: prestasiProcessing,
        errors: prestasiErrors,
        reset: resetPrestasi,
    } = useForm<PrestasiPropsForm>(initialPrestasiValue);
    const [showPrestasiForm, setShowPrestasiForm] = useState(false);

    useEffect(() => {
        if (modalType === 'update' || modalType === 'delete' || modalType === 'detail') {
            setData({
                nama: selectedData?.nama ?? '',
                deskripsi: selectedData?.deskripsi ?? '',
                thumbnail: null,
                existing_thumbnail: selectedData?.thumbnail ?? null,
                foto: [],
                hapus_foto: [],
            });
        }
        setShowPrestasiForm(false);
        resetPrestasi();
    }, [modalType, selectedId]);

    const handleSearch = (val: string) => {
        setSearch(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get(
                route('ekstrakulikuler.index'),
                { ...route().params, search: val, per_page: filters?.per_page },
                { preserveState: true, replace: true },
            );
        }, 400);
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('ekstrakulikuler.index'),
            { ...route().params, page, per_page: currentPerPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePageSizeChange = (perPage: number) => {
        router.get(
            route('ekstrakulikuler.index'),
            { ...route().params, page: 1, per_page: perPage },
            { preserveState: true, preserveScroll: true },
        );
    };

    const resetLocalState = () => {
        reset();
        setShowPrestasiForm(false);
        resetPrestasi();
    };

    const handleSubmit = () => {
        if (modalType === 'create') {
            post(route('ekstrakulikuler.store'), {
                forceFormData: true,
                onSuccess: () => toast.success('Berhasil menambahkan ekstrakulikuler.'),
                onError: () => toast.error('Gagal menambahkan ekstrakulikuler, coba lagi nanti.'),
                onFinish: () => {
                    handleCloseModal();
                    resetLocalState();
                },
            });
        }

        if (modalType === 'update') {
            post(route('ekstrakulikuler.update', selectedId as string), {
                forceFormData: true,
                onSuccess: () => toast.success(`Berhasil mengubah ${selectedData?.nama}.`),
                onError: () => toast.error('Gagal mengubah ekstrakulikuler, coba lagi nanti.'),
                onFinish: () => {
                    handleCloseModal();
                    resetLocalState();
                },
            });
        }

        if (modalType === 'delete') {
            deleteEkskul(route('ekstrakulikuler.destroy', selectedId as string), {
                onSuccess: () => toast.success(`Berhasil menghapus ${selectedData?.nama}.`),
                onError: () => toast.error('Gagal menghapus ekstrakulikuler, coba lagi nanti.'),
                onFinish: () => {
                    handleCloseModal();
                    resetLocalState();
                },
            });
        }
    };

    // ── manajemen foto kegiatan (multi) ──
    const handleAddFoto = (files: FileList | null) => {
        if (!files) return;
        setData('foto', [...data.foto, ...Array.from(files)]);
    };

    const handleRemoveNewFoto = (index: number) => {
        setData(
            'foto',
            data.foto.filter((_, i) => i !== index),
        );
    };

    const handleRemoveExistingFoto = (imageId: number) => {
        setData('hapus_foto', [...data.hapus_foto, imageId]);
    };

    const remainingExistingImages = (selectedData?.images ?? []).filter((img) => !data.hapus_foto.includes(img.id));

    // ── manajemen prestasi (langsung hit endpoint, partial reload) ──
    const handleAddPrestasi = () => {
        if (!selectedId) return;
        postPrestasi(route('prestasi.store', selectedId as string), {
            preserveScroll: true,
            preserveState: true,
            only: ['ekstrakulikulers'],
            onSuccess: () => {
                toast.success('Prestasi berhasil ditambahkan.');
                resetPrestasi();
                setShowPrestasiForm(false);
            },
            onError: () => toast.error('Gagal menambahkan prestasi, cek kembali isian.'),
        });
    };

    const handleDeletePrestasi = (prestasiId: number) => {
        router.delete(route('prestasi.destroy', prestasiId), {
            preserveScroll: true,
            preserveState: true,
            only: ['ekstrakulikulers'],
            onSuccess: () => toast.success('Prestasi berhasil dihapus.'),
            onError: () => toast.error('Gagal menghapus prestasi.'),
        });
    };

    // ambil data ekskul yang sedang dibuka dari props terbaru (biar prestasi/foto ikut ke-update setelah partial reload)
    const currentEkskul = listEkskul?.find((e) => e.id === selectedId) ?? selectedData;

    const columns: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
        },
        {
            key: 'thumbnail',
            label: 'Foto',
            render: (_: any, record: EkstrakulikulerProps) => (
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 sm:h-30 sm:w-40">
                    <img src={record?.thumbnail || '/images/default-img.png'} alt={record.nama} className="h-full w-full object-cover" />
                </div>
            ),
        },
        {
            key: 'nama',
            label: 'Nama',
            className: 'truncate max-w-[100px] sm:max-w-[300px]',
            render: (_: any, row: EkstrakulikulerProps) => <span>{row.nama}</span>,
        },
        {
            key: 'prestasi',
            label: 'Prestasi',
            className: 'text-center',
            render: (_: any, row: EkstrakulikulerProps) => (
                <span className="text-muted-foreground text-sm">{row.prestasis_count ?? row.prestasis?.length ?? 0}</span>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            className: 'text-center',
            render: (_: any, record: EkstrakulikulerProps) => (
                <AppDropdownMenu
                    openDisplay={<EllipsisVertical />}
                    menuItem={
                        <div className="flex flex-col gap-2 p-2">
                            <DropdownMenuItem
                                onClick={() => handleOpenModal(record.id, 'detail', listEkskul)}
                                className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                            >
                                <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => handleOpenModal(record.id, 'update', listEkskul)}
                                className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
                            >
                                <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => handleOpenModal(record.id, 'delete', listEkskul)}
                                className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2 transition-all')}
                            >
                                <p className={cn('text-foreground! group-hover:text-error!')}>Hapus</p>
                                <Trash className={cn('text-muted-foreground! group-hover:text-error!')} />
                            </DropdownMenuItem>
                        </div>
                    }
                />
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex items-center justify-between px-4 pt-4">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        Kelola Ekstrakulikuler
                    </h1>
                    <div className="flex flex-row items-center gap-3">
                        <AppSearchInput placeholder="Cari berdasarkan nama" onChange={(e) => handleSearch(e.target.value)} />
                        <Button
                            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                            onClick={() => handleOpenModal(null, 'create', listEkskul)}
                        >
                            + Tambah Ekstrakulikuler
                        </Button>
                    </div>
                </div>
                <div className="px-4 pt-4">
                    <DataTable
                        data={listEkskul}
                        columns={columns}
                        emptyMessage="Belum ada ekstrakulikuler saat ini"
                        mobileColumns={['thumbnail', 'nama', 'action']}
                        pagination={{
                            current_page: ekstrakulikulers?.current_page as number,
                            last_page: ekstrakulikulers?.last_page as number,
                            per_page: ekstrakulikulers?.per_page as number,
                            total: ekstrakulikulers?.total as number,
                            from: ekstrakulikulers?.from as number,
                            to: ekstrakulikulers?.to as number,
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
                                    {modalType === 'create' ? 'Tambah' : 'Ubah'} Ekstrakulikuler
                                </ModalTitle>
                            </ModalHeader>

                            <div className="mt-4 space-y-5">
                                {/* thumbnail */}
                                <div className="flex w-full flex-col items-center justify-center gap-3">
                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2">
                                        <img
                                            src={
                                                data.thumbnail
                                                    ? URL.createObjectURL(data.thumbnail)
                                                    : data.existing_thumbnail || '/images/default-img.png'
                                            }
                                            alt="Thumbnail"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        <Button type="button" onClick={() => thumbInputRef.current?.click()}>
                                            {data.thumbnail || data.existing_thumbnail ? 'Ganti Thumbnail' : 'Tambah Thumbnail'}
                                        </Button>
                                        <input
                                            ref={thumbInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setData('thumbnail', file);
                                            }}
                                        />
                                    </div>
                                    {errors.thumbnail && <p className="mt-1 text-sm text-red-500">{errors.thumbnail}</p>}
                                </div>

                                {/* nama & deskripsi */}
                                <div>
                                    <AppInput
                                        className="bg-background/50"
                                        placeholder="Masukkan nama . . ."
                                        label="Nama Ekstrakulikuler"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                    />
                                    {errors.nama && <p className="mt-1 text-sm text-red-500">{errors.nama}</p>}
                                </div>

                                <div>
                                    <AppTextArea
                                        label="Deskripsi Singkat"
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Tulis deskripsi singkat ekstrakulikuler . . ."
                                        className="bg-background/50! h-32 w-full resize-y rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    {errors.deskripsi && <p className="mt-1 text-sm text-red-500">{errors.deskripsi}</p>}
                                </div>

                                {/* foto kegiatan (multi) */}
                                <div>
                                    <label className="mb-2 block text-sm text-gray-600">Foto Kegiatan</label>
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                        {remainingExistingImages.map((img) => (
                                            <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border-2">
                                                <img src={img.image_url} className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveExistingFoto(img.id)}
                                                    className="bg-error absolute top-1 right-1 rounded-full p-1 text-white"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {data.foto.map((file, i) => (
                                            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border-2">
                                                <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveNewFoto(i)}
                                                    className="bg-error absolute top-1 right-1 rounded-full p-1 text-white"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => fotoInputRef.current?.click()}
                                            className="border-muted-foreground/40 text-muted-foreground flex aspect-square items-center justify-center rounded-lg border-2 border-dashed"
                                        >
                                            <Plus />
                                        </button>
                                        <input
                                            ref={fotoInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => handleAddFoto(e.target.files)}
                                        />
                                    </div>
                                    {errors.foto && <p className="mt-1 text-sm text-red-500">{errors.foto}</p>}
                                </div>

                                {/* prestasi — hanya muncul saat ubah, karena butuh id yang sudah ada */}
                                {modalType === 'update' && (
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="text-sm text-gray-600">Daftar Prestasi</label>
                                            <Button type="button" variant="outline" onClick={() => setShowPrestasiForm(!showPrestasiForm)}>
                                                <Plus className="mr-1 h-4 w-4" /> Tambah Prestasi
                                            </Button>
                                        </div>

                                        {showPrestasiForm && (
                                            <div className="bg-background/50 mb-3 space-y-3 rounded-lg border p-3">
                                                <AppInput
                                                    label="Judul Prestasi"
                                                    placeholder="Contoh: Juara 1 Lomba Futsal"
                                                    value={prestasiData.judul}
                                                    onChange={(e) => setPrestasiData('judul', e.target.value)}
                                                />
                                                {prestasiErrors.judul && <p className="text-sm text-red-500">{prestasiErrors.judul}</p>}

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="mb-1 block text-sm text-gray-600">Tingkat (opsional)</label>
                                                        <select
                                                            value={prestasiData.tingkat}
                                                            onChange={(e) => setPrestasiData('tingkat', e.target.value)}
                                                            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        >
                                                            <option value="">— Pilih —</option>
                                                            <option value="Sekolah">Sekolah</option>
                                                            <option value="Kecamatan">Kecamatan</option>
                                                            <option value="Kabupaten">Kabupaten</option>
                                                            <option value="Provinsi">Provinsi</option>
                                                            <option value="Nasional">Nasional</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-sm text-gray-600">Tahun</label>
                                                        <input
                                                            type="number"
                                                            value={prestasiData.tahun}
                                                            onChange={(e) => setPrestasiData('tahun', e.target.value)}
                                                            className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        />
                                                        {prestasiErrors.tahun && <p className="text-sm text-red-500">{prestasiErrors.tahun}</p>}
                                                    </div>
                                                </div>

                                                <AppTextArea
                                                    label="Deskripsi (opsional)"
                                                    value={prestasiData.deskripsi}
                                                    onChange={(e) => setPrestasiData('deskripsi', e.target.value)}
                                                    className="bg-background! h-20 w-full resize-y rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                />

                                                <Button type="button" disabled={prestasiProcessing} onClick={handleAddPrestasi}>
                                                    Simpan Prestasi
                                                </Button>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            {(currentEkskul?.prestasis ?? []).map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="bg-background/50 flex items-center justify-between rounded-lg border p-3 text-sm"
                                                >
                                                    <div>
                                                        <p className="font-medium">{p.judul}</p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {[p.tingkat, p.tahun].filter(Boolean).join(' · ')}
                                                        </p>
                                                    </div>
                                                    <button type="button" onClick={() => handleDeletePrestasi(p.id)}>
                                                        <Trash className="text-muted-foreground h-4 w-4 hover:text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(currentEkskul?.prestasis ?? []).length === 0 && (
                                                <p className="text-muted-foreground text-sm">Belum ada prestasi.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        disabled={processing}
                                        type="button"
                                        onClick={() => {
                                            handleCloseModal();
                                            resetLocalState();
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
                                <ModalTitle>Hapus ekstrakulikuler</ModalTitle>
                            </ModalHeader>
                            <ModalBody className="max-w-150 text-[10px] break-words sm:text-sm">
                                Anda yakin ingin menghapus ekstrakulikuler {selectedData?.nama}? Seluruh foto dan prestasi terkait juga akan
                                terhapus.
                            </ModalBody>
                            <ModalFooter>
                                <div className="mt-2 flex items-center gap-2">
                                    <Button
                                        variant={'outline'}
                                        onClick={() => {
                                            handleCloseModal();
                                            resetLocalState();
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
                                <ModalTitle className="font-semibold">Detail Ekstrakulikuler</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <div className="mx-auto mb-4 aspect-video w-full overflow-hidden rounded-md">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={selectedData?.thumbnail ?? '/images/default-img.png'}
                                    />
                                </div>
                                <p className="mb-1 font-semibold">{selectedData?.nama}</p>
                                <p className="text-muted-foreground mb-3 text-sm">{selectedData?.deskripsi}</p>

                                <div className="mb-3 grid grid-cols-3 gap-2">
                                    {(selectedData?.images ?? []).map((img) => (
                                        <div key={img.id} className="aspect-square overflow-hidden rounded-lg border">
                                            <img src={img.image_url} className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>

                                <p className="mb-2 font-semibold">Prestasi:</p>
                                <div className="space-y-2">
                                    {(selectedData?.prestasis ?? []).map((p) => (
                                        <div key={p.id} className="bg-background/50 rounded-lg border p-2 text-sm">
                                            <p className="font-medium">{p.judul}</p>
                                            <p className="text-muted-foreground text-xs">{[p.tingkat, p.tahun].filter(Boolean).join(' · ')}</p>
                                        </div>
                                    ))}
                                    {(selectedData?.prestasis ?? []).length === 0 && (
                                        <p className="text-muted-foreground text-sm">Belum ada prestasi.</p>
                                    )}
                                </div>
                            </ModalBody>
                            <div>
                                <Button onClick={() => handleCloseModal()}>Tutup</Button>
                            </div>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </AppLayout>
    );
}