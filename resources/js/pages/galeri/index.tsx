// // import AppDropdownMenu from '@/components/app-dopdown-menu';
// // import AppInput from '@/components/app-input';
// // import { Column, DataTable } from '@/components/app-table';
// // import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
// // import { Button } from '@/components/ui/button';
// // import { Modal, ModalBody, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
// // import { formatDate } from '@/helpers/format';
// // import { useModal } from '@/hooks/use-modal';
// // import AppLayout from '@/layouts/app-layout';
// // import { cn } from '@/lib/utils';
// // import { BaseResponse, BreadcrumbItem } from '@/types';
// // import { GaleriProps, GaleriPropsForm, initialGaleriValue } from '@/types/galeri.type';
// // import { router, useForm, usePage } from '@inertiajs/react';
// // import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
// // import { useEffect, useRef, useState } from 'react';
// // import { toast } from 'sonner';

// // interface PageProps {
// //     galeris: BaseResponse<GaleriProps>;
// //     flash?: {
// //         success?: string;
// //     };
// //     filters: {
// //         search: string;
// //         per_page: number;
// //     };
// // }

// // const breadcrumbs: BreadcrumbItem[] = [
// //     {
// //         title: 'Galeri',
// //         href: '/galeri',
// //     },
// // ];

// // export default function GaleriIndex() {
// //     const props = usePage<PageProps>().props;
// //     const [loading, setLoading] = useState<boolean>(false);
// //     const listGaleri = props?.galeris?.data;
// //     const { filters, galeris } = props;
// //     const [file, setFile] = useState<File | null>(null);
// //     const inputRef = useRef<HTMLInputElement>(null);
// //     const { handleOpenModal, handleCloseModal, isOpen, modalType, selectedData, selectedId } = useModal<GaleriProps>();
// //     const { data, setData, post, processing, errors, reset, delete: deleteGaleri } = useForm<GaleriPropsForm>(initialGaleriValue);
// //     const [search, setSearch] = useState(filters?.search ?? '');
// //     const currentPerPage = new URLSearchParams(window.location.search).get('per_page') ?? '10';
// //     const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// //     const [existingImage, setExistingImage] = useState<string | null>(null);
// //     const hasImage = !!file || !!existingImage;

// //     console.log('Galeri: ', galeris);
// //     useEffect(() => {
// //         setData('uploaded_image', file as File);
// //         setData('existing_gambar', existingImage);
// //     }, [file, existingImage]);

// //     const handleSearch = (val: string) => {
// //         setSearch(val);

// //         if (debounceRef.current) clearTimeout(debounceRef.current);
// //         debounceRef.current = setTimeout(() => {
// //             router.get(
// //                 route('galeri.index'),
// //                 { ...route().params, search: val, per_page: filters?.per_page },
// //                 { preserveState: true, replace: true },
// //             );
// //         }, 400);
// //     };

// //     const handlePageChange = (page: number) => {
// //         router.get(route('galeri.index'), { ...route().params, page: page, per_page: currentPerPage }, { preserveState: true, preserveScroll: true });
// //     };

// //     const handlePageSizeChange = (perPage: number) => {
// //         router.get(route('galeri.index'), { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
// //     };

// //     const handleSubmit = () => {
// //         if (modalType === 'create') {
// //             post(route('galeri.store'), {
// //                 forceFormData: true,
// //                 onSuccess: () => {
// //                     toast.success('Berhasil menambah foto galeri.');
// //                 },
// //                 onError: () => {
// //                     toast.error('Gagal menambah foto galeri, coba lagi nanti.');
// //                 },
// //                 onFinish: () => {
// //                     handleCloseModal();
// //                     setFile(null);
// //                     setExistingImage(null);
// //                 },
// //             });
// //         }

// //         if (modalType === 'update') {
// //             post(route('galeri.update', selectedId as string), {
// //                 forceFormData: true,
// //                 onSuccess: () => {
// //                     toast.success(`Berhasil edit foto ${selectedData?.judul}.`);
// //                 },
// //                 onError: () => {
// //                     toast.error('Gagal edit foto, coba lagi nanti.');
// //                 },
// //                 onFinish: () => {
// //                     handleCloseModal();
// //                     setFile(null);
// //                     setExistingImage(null);
// //                 },
// //             });
// //         }

// //         if (modalType === 'delete') {
// //             deleteGaleri(route('galeri.destroy', selectedId as string), {
// //                 onSuccess: () => {
// //                     toast.success(`Berhasil hapus foto ${selectedData?.judul}.`);
// //                 },
// //                 onError: () => {
// //                     toast.error('Gagal hapus foto, coba lagi nanti.');
// //                 },
// //                 onFinish: () => {
// //                     handleCloseModal();
// //                     setFile(null);
// //                     setExistingImage(null);
// //                 },
// //             });
// //         }
// //     };

// //     useEffect(() => {
// //         if (modalType === 'update' || modalType === 'delete' || modalType === 'detail') {
// //             setData(selectedData as GaleriProps);
// //             setExistingImage(selectedData?.galeri_image?.image_url ?? '');
// //         }
// //     }, [modalType, selectedId]);

// //     const columnsGaleri: Column<any>[] = [
// //         {
// //             key: 'no',
// //             label: 'No',
// //             className: 'text-center',
// //             render: (_: any, __: any, index: number) => <span className="text-muted-foreground text-sm">{index + 1}</span>,
// //         },
// //         {
// //             key: 'galeri_image',
// //             label: 'Foto',
// //             render: (_: any, record: GaleriProps) => (
// //                 <div className="relative h-20 w-20 overflow-hidden rounded-lg border-2 sm:h-30 sm:w-40">
// //                     <img src={record?.galeri_image?.image_url ?? '/images/default-img.png'} alt="Galeri" className="h-full w-full object-cover" />
// //                 </div>
// //             ),
// //         },
// //         {
// //             key: 'judul',
// //             label: 'Judul',
// //             className: 'truncate max-w-[100px] sm:max-w-[300px]',
// //             render: (_: any, row: GaleriProps) => <span>{row.judul}</span>,
// //         },
// //         {
// //             key: 'created_at',
// //             label: 'Tanggal Ditambahkan',
// //             render: (_: any, record: GaleriProps) => <span className="text-muted-foreground text-sm">{formatDate(record?.created_at) || '-'}</span>,
// //         },
// //         {
// //             key: 'action',
// //             label: 'Action',
// //             className: 'text-center',
// //             render: (_: any, record: GaleriProps) => {
// //                 return (
// //                     <AppDropdownMenu
// //                         openDisplay={<EllipsisVertical />}
// //                         menuItem={
// //                             <>
// //                                 <div className="flex flex-col gap-2 p-2">
// //                                     <DropdownMenuItem
// //                                         onClick={() => handleOpenModal(record.id, 'detail', listGaleri)}
// //                                         className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
// //                                     >
// //                                         <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
// //                                         <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} />
// //                                     </DropdownMenuItem>

// //                                     <DropdownMenuItem
// //                                         onClick={() => handleOpenModal(record.id, 'update', listGaleri)}
// //                                         className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between rounded-sm p-2')}
// //                                     >
// //                                         <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
// //                                         <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} />
// //                                     </DropdownMenuItem>

// //                                     <DropdownMenuItem
// //                                         onClick={() => handleOpenModal(record.id, 'delete', listGaleri)}
// //                                         className={cn(
// //                                             'group hover:bg-error/10! flex cursor-pointer items-center justify-between rounded-sm p-2 transition-all',
// //                                         )}
// //                                     >
// //                                         <p>Hapus</p>
// //                                         <Trash className={cn('text-muted-foreground! group-hover:text-error!')} />
// //                                     </DropdownMenuItem>
// //                                 </div>
// //                             </>
// //                         }
// //                     />
// //                 );
// //             },
// //         },
// //     ];

// //     return (
// //         <AppLayout breadcrumbs={breadcrumbs}>
// //             <div>
// //                 <div className="flex items-center justify-between px-4 pt-4">
// //                     <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
// //                         Kelola Galeri
// //                     </h1>
// //                     <Button
// //                         style={{
// //                             backgroundColor: 'var(--primary)',
// //                             color: 'var(--primary-foreground)',
// //                         }}
// //                         onClick={() => handleOpenModal(null, 'create', listGaleri)}
// //                     >
// //                         + Tambah Foto
// //                     </Button>
// //                 </div>
// //                 <div className="px-4 pt-4">
// //                     <DataTable
// //                         data={props?.galeris?.data}
// //                         columns={columnsGaleri}
// //                         emptyMessage="Tidak ada foto galeri saat ini"
// //                         mobileColumns={['gambar', 'judul', 'action']}
// //                         pagination={{
// //                             current_page: galeris?.current_page as number,
// //                             last_page: galeris?.last_page as number,
// //                             per_page: galeris?.per_page as number,
// //                             total: galeris?.total as number,
// //                             from: galeris?.from as number,
// //                             to: galeris?.to as number,
// //                         }}
// //                         onPageChange={handlePageChange}
// //                         onPageSizeChange={handlePageSizeChange}
// //                     />
// //                 </div>
// //             </div>

// //             <Modal open={isOpen} key={modalType}>
// //                 <ModalContent hideClose>
// //                     {(modalType === 'create' || modalType === 'update') && (
// //                         <ModalBody>
// //                             <ModalHeader>
// //                                 <ModalTitle className="text-2xl font-semibold">
// //                                     {modalType === 'create' ? 'Tambah Foto Galeri' : 'Ubah Foto Galeri'}
// //                                 </ModalTitle>
// //                             </ModalHeader>

// //                             <div className="mt-4 space-y-3">
// //                                 <div className="space-y-4">
// //                                     <div className="flex w-full flex-col items-center justify-center gap-3">
// //                                         <div className="relative aspect-auto w-full overflow-hidden rounded-lg border-2">
// //                                             <img
// //                                                 src={file ? URL.createObjectURL(file) : existingImage || '/images/default-img.png'}
// //                                                 alt="Berita"
// //                                                 className="h-full w-full object-cover"
// //                                             />
// //                                         </div>

// //                                         <div className="flex items-center justify-center gap-3">
// //                                             <Button
// //                                                 type="button"
// //                                                 variant="outline"
// //                                                 disabled={!hasImage}
// //                                                 onClick={() => {
// //                                                     if (file) setFile(null);
// //                                                     if (existingImage) setExistingImage(null);
// //                                                 }}
// //                                             >
// //                                                 Hapus Foto
// //                                             </Button>

// //                                             <Button type="button" onClick={() => inputRef.current?.click()}>
// //                                                 {existingImage || file ? 'Edit Foto' : 'Tambah Foto'}
// //                                             </Button>

// //                                             <input
// //                                                 ref={inputRef}
// //                                                 type="file"
// //                                                 accept="image/*"
// //                                                 className="hidden"
// //                                                 onChange={(e) => {
// //                                                     const selectedFile = e.target.files?.[0];
// //                                                     if (selectedFile) {
// //                                                         setFile(selectedFile);
// //                                                         setData('uploaded_image', selectedFile);
// //                                                     }
// //                                                 }}
// //                                             />
// //                                         </div>
// //                                     </div>
// //                                     {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
// //                                 </div>

// //                                 <div>
// //                                     <AppInput
// //                                         className="bg-background/50"
// //                                         placeholder="Contoh: Kegiatan Olahraga"
// //                                         label="Judul"
// //                                         value={data?.judul}
// //                                         onChange={(e) => setData('judul', e.target.value)}
// //                                     />
// //                                     {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
// //                                 </div>
// //                                 <div>
// //                                     <AppInput
// //                                         className="bg-background/50"
// //                                         placeholder="Contoh: Kegiatan Olahraga"
// //                                         label="Isi"
// //                                         value={data?.isi}
// //                                         onChange={(e) => setData('isi', e.target.value)}
// //                                     />
// //                                     {errors.isi && <p className="mt-1 text-sm text-red-500">{errors.isi}</p>}
// //                                 </div>

// //                                 <div className="flex gap-3 pt-2">
// //                                     <Button
// //                                         disabled={processing || loading}
// //                                         type="button"
// //                                         onClick={() => {
// //                                             handleCloseModal(), setExistingImage(null), setFile(null);
// //                                         }}
// //                                         className="rounded-lg bg-gray-400 px-5 py-2 text-white transition hover:bg-gray-500"
// //                                     >
// //                                         Batal
// //                                     </Button>
// //                                     <button
// //                                         disabled={processing}
// //                                         onClick={() => handleSubmit()}
// //                                         className="rounded-lg bg-indigo-700 px-5 py-2 text-white transition hover:bg-indigo-800 disabled:opacity-50"
// //                                     >
// //                                         Simpan
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         </ModalBody>
// //                     )}

// //                     {modalType === 'delete' && (
// //                         <div className="p-4">
// //                             <h4>Hapus foto</h4>

// //                             <div>
// //                                 <p>Anda yakin ingin menghapus foto {selectedData?.judul} ? </p>
// //                             </div>

// //                             <div className="flex items-center gap-2">
// //                                 <Button
// //                                     variant={'destructive'}
// //                                     onClick={() => {
// //                                         handleCloseModal(), setExistingImage(null), setFile(null);
// //                                     }}
// //                                 >
// //                                     Batal
// //                                 </Button>
// //                                 <Button onClick={() => handleSubmit()} variant={'outline'}>
// //                                     Hapus
// //                                 </Button>
// //                             </div>
// //                         </div>
// //                     )}

// //                     {modalType === 'detail' && (
// //                         <div className="p-4">
// //                             <h4>Detail foto {selectedData?.judul}</h4>

// //                             <div className="relative aspect-auto w-full overflow-hidden rounded-lg border-2">
// //                                 <img
// //                                     src={selectedData?.galeri_image?.image_url ?? '/images/default-img.png'}
// //                                     alt="Galeri"
// //                                     className="h-full w-full object-cover"
// //                                 />
// //                             </div>
// //                             <div>Judul: {selectedData?.judul}</div>
// //                             <div>
// //                                 <Button
// //                                     onClick={() => {
// //                                         handleCloseModal(), setExistingImage(null), setFile(null);
// //                                     }}
// //                                 >
// //                                     Tutup
// //                                 </Button>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </ModalContent>
// //             </Modal>
// //         </AppLayout>
// //     );
// // }

// import { ConfirmModal } from '@/components/app-confirm-mdal';
// import { Column, DataTable } from '@/components/app-table';
// import { Button } from '@/components/ui/button';
// import AppLayout from '@/layouts/app-layout';
// import { BaseResponse, BreadcrumbItem } from '@/types';
// import { router, useForm, usePage } from '@inertiajs/react';
// import { Edit, Trash } from 'lucide-react';
// import { useState } from 'react';

// interface GaleriImage {
//     id: number;
//     image_url: string;
// }

// interface GaleriProps {
//     id: number;
//     judul: string;
//     bulan: number;
//     tahun: number;
//     images: GaleriImage[];
//     created_at: string;
// }

// interface PageProps {
//     galeris: BaseResponse<GaleriProps>;
// }

// const BULAN = [
//     'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
//     'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
// ];

// function DeleteButton({ id, judul }: { id: number; judul: string }) {
//     const [open, setOpen] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);

//     const handleDelete = (): void => {
//         setLoading(true);
//         router.delete(`/admin/galeri/${id}`, {
//             onFinish: () => setLoading(false),
//         });
//     };

//     return (
//         <>
//             <Button
//                 size="sm"
//                 className="text-xs"
//                 onClick={() => setOpen(true)}
//                 style={{
//                     backgroundColor: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
//                     color: 'var(--color-error)',
//                     border: '1px solid color-mix(in srgb, var(--color-error) 30%, transparent)',
//                 }}
//             >
//                 <Trash size={14} />
//             </Button>

//             <ConfirmModal
//                 open={open}
//                 onOpenChange={setOpen}
//                 title="Hapus Galeri?"
//                 description={
//                     <>
//                         Galeri <span className="text-foreground font-semibold">"{judul}"</span> beserta semua fotonya akan dihapus permanen.
//                     </>
//                 }
//                 confirmLabel="Ya, Hapus"
//                 cancelLabel="Batal"
//                 variant="danger"
//                 loading={loading}
//                 onConfirm={handleDelete}
//             />
//         </>
//     );
// }

// const breadcrumbs: BreadcrumbItem[] = [
//     { title: 'Galeri', href: '/admin/galeri' },
// ];

// export default function GaleriIndex() {
//     const props = usePage<PageProps>().props;
//     const { data, setData, post, processing, errors, reset } = useForm<{
//         judul: string;
//         bulan: string;
//         tahun: string;
//         gambar: File[];
//     }>({
//         judul: '',
//         bulan: String(new Date().getMonth() + 1),
//         tahun: String(new Date().getFullYear()),
//         gambar: [],
//     });

//     const [isOpen, setIsOpen] = useState<boolean>(false);
//     const [previews, setPreviews] = useState<string[]>([]);

//     function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//         const files = Array.from(e.target.files || []);
//         setData('gambar', files);
//         setPreviews(files.map(f => URL.createObjectURL(f)));
//     }

//     function submit(e: React.FormEvent) {
//         e.preventDefault();
//         post('/admin/galeri', {
//             forceFormData: true,
//             onSuccess: () => {
//                 reset();
//                 setPreviews([]);
//                 setIsOpen(false);
//             },
//         });
//     }

//     const columnsGaleri: Column<any>[] = [
//         {
//             key: 'no',
//             label: 'No',
//             className: 'text-center',
//             render: (_: any, __: any, index: number) => (
//                 <span className="text-muted-foreground text-sm">{index + 1}</span>
//             ),
//         },
//         {
//             key: 'judul',
//             label: 'Judul',
//         },
//         {
//             key: 'bulan',
//             label: 'Bulan',
//             render: (_: any, record: GaleriProps) => (
//                 <span>{BULAN[record.bulan - 1]} {record.tahun}</span>
//             ),
//         },
//         {
//             key: 'images',
//             label: 'Foto',
//             render: (_: any, record: GaleriProps) => (
//                 <div className="flex gap-1">
//                     {record.images?.slice(0, 3).map((img) => (
//                         <img
//                             key={img.id}
//                             src={img.image_url}
//                             className="h-10 w-14 rounded object-cover"
//                         />
//                     ))}
//                     {record.images?.length > 3 && (
//                         <span className="text-muted-foreground self-center text-xs">
//                             +{record.images.length - 3}
//                         </span>
//                     )}
//                 </div>
//             ),
//         },
//         {
//             key: 'action',
//             label: 'Action',
//             className: 'text-center',
//             render: (_: any, record: GaleriProps) => (
//                 <div className="flex items-center justify-center gap-2">
//                     <Button
//                         size="sm"
//                         className="text-xs"
//                         onClick={() => router?.visit(`/admin/galeri/${record?.id}/edit`)}
//                         style={{
//                             backgroundColor: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
//                             color: 'var(--color-error)',
//                             border: '1px solid color-mix(in srgb, var(--color-error) 30%, transparent)',
//                         }}
//                     >
//                         <Edit size={14} />
//                     </Button>
//                     <DeleteButton id={record.id} judul={record.judul} />
//                 </div>
//             ),
//         },
//     ];

//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <div style={{ backgroundColor: 'var(--secondary)' }}>
//                 <div className="mb-6 flex items-center justify-between p-4">
//                     <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
//                         Kelola Galeri
//                     </h1>
//                     <Button
//                         style={{
//                             backgroundColor: 'var(--primary)',
//                             color: 'var(--primary-foreground)',
//                         }}
//                         onClick={() => setIsOpen(true)}
//                     >
//                         + Tambah Galeri
//                     </Button>
//                 </div>
//                 <div className="p-4">
//                     <DataTable data={props?.galeris?.data} columns={columnsGaleri} />
//                 </div>
//             </div>

//             {isOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//                     <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-md max-h-[90vh] overflow-y-auto">
//                         <h2 className="mb-6 text-2xl font-semibold text-gray-800">Tambah Galeri</h2>

//                         <form onSubmit={submit} className="space-y-5">
//                             <div>
//                                 <label className="mb-1 block text-sm text-gray-600">Judul Galeri</label>
//                                 <input
//                                     type="text"
//                                     value={data.judul}
//                                     onChange={(e) => setData('judul', e.target.value)}
//                                     placeholder="Contoh: Kegiatan Agustus 2026"
//                                     className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                                 />
//                                 {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="mb-1 block text-sm text-gray-600">Bulan</label>
//                                     <select
//                                         value={data.bulan}
//                                         onChange={(e) => setData('bulan', e.target.value)}
//                                         className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                                     >
//                                         {BULAN.map((b, i) => (
//                                             <option key={i} value={i + 1}>{b}</option>
//                                         ))}
//                                     </select>
//                                     {errors.bulan && <p className="mt-1 text-sm text-red-500">{errors.bulan}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="mb-1 block text-sm text-gray-600">Tahun</label>
//                                     <input
//                                         type="number"
//                                         value={data.tahun}
//                                         onChange={(e) => setData('tahun', e.target.value)}
//                                         min="2000"
//                                         max="2100"
//                                         className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                                     />
//                                     {errors.tahun && <p className="mt-1 text-sm text-red-500">{errors.tahun}</p>}
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="mb-1 block text-sm text-gray-600">
//                                     Foto (bisa pilih banyak sekaligus)
//                                 </label>
//                                 <input
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={handleFileChange}
//                                     className="w-full rounded-lg border border-gray-300 p-2"
//                                 />
//                                 {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
//                                 {previews.length > 0 && (
//                                     <div className="mt-3 grid grid-cols-4 gap-2">
//                                         {previews.map((src, i) => (
//                                             <img
//                                                 key={i}
//                                                 src={src}
//                                                 className="h-20 w-full rounded-lg object-cover"
//                                             />
//                                         ))}
//                                     </div>
//                                 )}
//                                 <p className="mt-1 text-xs text-gray-400">
//                                     {data.gambar.length > 0 ? `${data.gambar.length} foto dipilih` : 'Belum ada foto dipilih'}
//                                 </p>
//                             </div>

//                             <div className="flex gap-3 pt-2">
//                                 <button
//                                     type="submit"
//                                     disabled={processing}
//                                     className="rounded-lg bg-indigo-700 px-5 py-2 text-white transition hover:bg-indigo-800 disabled:opacity-50"
//                                 >
//                                     {processing ? 'Menyimpan...' : 'Simpan'}
//                                 </button>
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setIsOpen(false);
//                                         setPreviews([]);
//                                         reset();
//                                     }}
//                                     className="rounded-lg bg-gray-400 px-5 py-2 text-white transition hover:bg-gray-500"
//                                 >
//                                     Batal
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </AppLayout>
//     );
// }

import { ConfirmModal } from '@/components/app-confirm-mdal';
import AppDropdownMenu from '@/components/app-dopdown-menu';
import { Column, DataTable } from '@/components/app-table';
import { DropdownMenuItem } from '@/components/ui-shadcn/dropdown-menu';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Edit, EllipsisVertical, Eye, Trash } from 'lucide-react';
import { useState } from 'react';

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
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function DeleteButton({ id, judul }: { id: number; judul: string }) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = (): void => {
        setLoading(true);
        router.delete(`/admin/galeri/${id}`, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={cn('group hover:bg-error/10! flex w-full cursor-pointer items-center justify-between p-2 transition-all rounded')}
            >
                <p className={cn('text-foreground! group-hover:text-error!')}>Hapus</p>
                <Trash className={cn('text-muted-foreground! group-hover:text-error!')} size={16} />
            </button>

            <ConfirmModal
                open={open}
                onOpenChange={setOpen}
                title="Hapus Galeri?"
                description={
                    <>
                        Galeri <span className="text-foreground font-semibold">"{judul}"</span> beserta semua fotonya akan dihapus permanen.
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
    { title: 'Galeri', href: '/admin/galeri' },
];

export default function GaleriIndex() {
    const props = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm<{
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

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [previews, setPreviews] = useState<string[]>([]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        setData('gambar', files);
        setPreviews(files.map(f => URL.createObjectURL(f)));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/galeri', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviews([]);
                setIsOpen(false);
            },
        });
    }

    const columnsGaleri: Column<any>[] = [
        {
            key: 'no',
            label: 'No',
            className: 'text-center',
            render: (_: any, __: any, index: number) => (
                <span className="text-muted-foreground text-sm">{index + 1}</span>
            ),
        },
        {
            key: 'judul',
            label: 'Judul',
        },
        {
            key: 'bulan',
            label: 'Bulan',
            render: (_: any, record: GaleriProps) => (
                <span>{BULAN[record.bulan - 1]} {record.tahun}</span>
            ),
        },
        {
            key: 'images',
            label: 'Foto',
            render: (_: any, record: GaleriProps) => (
                <div className="flex gap-1">
                    {record.images?.slice(0, 3).map((img) => (
                        <img
                            key={img.id}
                            src={img.image_url}
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
            render: (_: any, record: GaleriProps) => (
                <AppDropdownMenu
                    openDisplay={<EllipsisVertical />}
                    menuItem={
                        <div className="flex flex-col gap-1 p-2">
                            {/* Detail */}
                            <DropdownMenuItem
                                onClick={() => router?.visit(`/admin/galeri/${record?.id}`)}
                                className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                            >
                                <p className={cn('text-foreground! group-hover:text-chart-1!')}>Detail</p>
                                <Eye className={cn('text-muted-foreground! group-hover:text-chart-1!')} size={16} />
                            </DropdownMenuItem>

                            {/* Ubah */}
                            <DropdownMenuItem
                                onClick={() => router?.visit(`/admin/galeri/${record?.id}/edit`)}
                                className={cn('group hover:bg-muted! flex cursor-pointer items-center justify-between p-2')}
                            >
                                <p className={cn('text-foreground! group-hover:text-chart-2!')}>Ubah</p>
                                <Edit className={cn('text-muted-foreground! group-hover:text-chart-2!')} size={16} />
                            </DropdownMenuItem>

                            {/* Hapus */}
                            <DropdownMenuItem
                                className="p-0"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <DeleteButton id={record.id} judul={record.judul} />
                            </DropdownMenuItem>
                        </div>
                    }
                />
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div style={{ backgroundColor: 'var(--secondary)' }}>
                <div className="mb-6 flex items-center justify-between p-4">
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                        Kelola Galeri
                    </h1>
                    <Button
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'var(--primary-foreground)',
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        + Tambah Galeri
                    </Button>
                </div>
                <div className="p-4">
                    <DataTable data={props?.galeris?.data} columns={columnsGaleri} />
                </div>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-auto w-full max-w-2xl rounded-xl bg-white p-8 shadow-md max-h-[90vh] overflow-y-auto">
                        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Tambah Galeri</h2>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-1 block text-sm text-gray-600">Judul Galeri</label>
                                <input
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Contoh: Kegiatan Agustus 2026"
                                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                {errors.judul && <p className="mt-1 text-sm text-red-500">{errors.judul}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-600">Bulan</label>
                                    <select
                                        value={data.bulan}
                                        onChange={(e) => setData('bulan', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        {BULAN.map((b, i) => (
                                            <option key={i} value={i + 1}>{b}</option>
                                        ))}
                                    </select>
                                    {errors.bulan && <p className="mt-1 text-sm text-red-500">{errors.bulan}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-600">Tahun</label>
                                    <input
                                        type="number"
                                        value={data.tahun}
                                        onChange={(e) => setData('tahun', e.target.value)}
                                        min="2000"
                                        max="2100"
                                        className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                    {errors.tahun && <p className="mt-1 text-sm text-red-500">{errors.tahun}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-600">
                                    Foto (bisa pilih banyak sekaligus)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full rounded-lg border border-gray-300 p-2"
                                />
                                {errors.gambar && <p className="mt-1 text-sm text-red-500">{errors.gambar}</p>}
                                {previews.length > 0 && (
                                    <div className="mt-3 grid grid-cols-4 gap-2">
                                        {previews.map((src, i) => (
                                            <img key={i} src={src} className="h-20 w-full rounded-lg object-cover" />
                                        ))}
                                    </div>
                                )}
                                <p className="mt-1 text-xs text-gray-400">
                                    {data.gambar.length > 0 ? `${data.gambar.length} foto dipilih` : 'Belum ada foto dipilih'}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-indigo-700 px-5 py-2 text-white transition hover:bg-indigo-800 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsOpen(false); setPreviews([]); reset(); }}
                                    className="rounded-lg bg-gray-400 px-5 py-2 text-white transition hover:bg-gray-500"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}