import AppDatePicker from '@/components/app-day-picker';
import AppInput from '@/components/app-input';
import AppSelect from '@/components/app-select';
import AppSelectSearch from '@/components/app-select-search';
import AppTextArea from '@/components/app-textare';
import { Button } from '@/components/ui/button';
import { useInertiaSearch } from '@/hooks/user-inertia-search';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { initialTransaksi, KategoriTransaksi, TransaksiProps } from '@/types/transaction.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { formatDate } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PageProps extends InertiaPageProps {
    transaksi?: TransaksiProps;
}

const TransactionCreateIndex = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { props } = usePage<PageProps>();
    const { transaksi: dataTransaksi } = props;
    const transaksiId = dataTransaksi?.transaksi_id ?? null;
    const [mode, setMode] = useState<'persen' | 'jumlah'>('persen');
    type SatuanOptionType = 'idr' | 'persen';
    const [satuanOption, setSatuanOption] = useState<SatuanOptionType | null>(null);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: transaksiId !== null ? 'Ubah Transaksi' : 'Buat Transaksi Baru',
            href: transaksiId !== null ? `transaction/${transaksiId}/edit` : 'transaction/create',
        },
    ];

    const form = useForm<TransaksiProps>(initialTransaksi);
    console.log('props: ', props);
    const { data, setData, post, processing, errors, put } = form;
    const {
        options: namaProyekOptions,
        loading: namaProyekLoading,
        search: searchNamaProyek,
    } = useInertiaSearch({
        url: route('transaction.search-nama-proyek'),
        mapFn: (item) => ({
            value: String(item.proyek_id),
            label: item.nama_proyek,
        }),
    });

    // useEffect(() => {
    //     if (transaksiId && dataTransaksi) {
    //         setData(props.proyek as TransaksiProps);
    //     }
    // }, [transaksiId, dataTransaksi]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Transaksi" />

            <div className="mt-2 flex w-full items-center justify-end gap-4 px-4">
                <Button
                    disabled={loading || processing}
                    onClick={() => router.visit('/transaction')}
                    className={`"transition-all duration-150"`}
                    variant={'secondary'}
                >
                    <p className={`${cn(loading || processing ? 'animate-spin' : 'animate-none')}`}>
                        {loading || processing ? <Loader2 /> : 'Kembali'}
                    </p>
                </Button>
                <Button
                    disabled={loading || processing}
                    className={`"transition-all duration-150"`}
                    // onClick={(e) => handleSubmitProyek(e)}
                >
                    <p className={`${cn(loading || processing ? 'animate-spin' : 'animate-none')}`}>
                        {loading || processing ? <Loader2 /> : 'Simpan'}
                    </p>
                </Button>
            </div>
            <div className="grid grid-cols-1 items-center gap-4 px-4 py-2 sm:grid-cols-2">
                <AppSelectSearch
                    async
                    label="Proyek"
                    required
                    placeholder="Pilih Proyek..."
                    searchPlaceholder="Ketik nama proyek ..."
                    options={namaProyekOptions}
                    loading={namaProyekLoading}
                    onSearch={searchNamaProyek}
                    value={data.proyek_id}
                    onValueChange={(val) => setData('proyek_id', val)}
                    error={errors.proyek_id}
                />

                <AppSelect
                    defaultValue={dataTransaksi?.kategori || ''}
                    label="Kategori"
                    placeholder="Pilih opsi . . ."
                    required={true}
                    onValueChange={(value) => setData('kategori', value as KategoriTransaksi)}
                    options={[
                        {
                            value: 'material',
                            label: 'Material',
                        },
                        {
                            value: 'operasional',
                            label: 'Operasional',
                        },
                        {
                            value: 'jasa_tukang',
                            label: 'Jasa Tukang',
                        },
                        {
                            value: 'mandor',
                            label: 'Mandor',
                        },
                        {
                            value: 'staff_perpajakan',
                            label: 'Staff Perpajakan',
                        },
                        {
                            value: 'staff_entry_data',
                            label: 'Staff Entry Data',
                        },
                        {
                            value: 'biaya_tak_terduga',
                            label: 'Biaya Tak Terduga',
                        },
                    ]}
                />

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="ml-0.5 text-sm font-medium">Nominal</label>
                        <div className="bg-muted border-border flex h-7 w-fit gap-0.5 rounded-md border p-0.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('persen');
                                    setData('persen', 0);
                                }}
                                className={cn(
                                    'rounded px-2.5 text-xs font-semibold transition-all duration-150',
                                    mode === 'persen' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                %
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('jumlah');
                                    setData('jumlah', 0);
                                }}
                                className={cn(
                                    'rounded px-2.5 text-xs font-semibold transition-all duration-150',
                                    mode === 'jumlah' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                IDR
                            </button>
                        </div>
                    </div>

                    <AppInput
                        type="number"
                        min={0}
                        max={mode === 'persen' ? 100 : undefined}
                        required
                        placeholder={mode === 'persen' ? 'Masukkan persen...' : 'Masukkan jumlah...'}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            if (mode === 'persen') {
                                setData('persen', val);
                                setData('jumlah', 0);
                            } else {
                                setData('jumlah', val);
                                setData('persen', 0);
                            }
                        }}
                    />
                </div>

                <AppDatePicker
                    defaultValue={dataTransaksi?.tanggal_mulai ? new Date(dataTransaksi.tanggal_mulai) : undefined}
                    required
                    label="Dimulai pada"
                    onChange={(e) => setData('tanggal_mulai', e ? formatDate(e, 'yyyy-MM-dd') : '')}
                />
            </div>
            <div className="px-4 pb-7">
                <AppTextArea
                    className="min-h-50 px-3 py-4"
                    defaultValue={dataTransaksi?.keterangan || ''}
                    onChange={(e) => setData('keterangan', e.target.value)}
                    placeholder="Masukkan keterangan transaksi . . ."
                    label="Keterangan Transaksi"
                />
            </div>
        </AppLayout>
    );
};

export default TransactionCreateIndex;
