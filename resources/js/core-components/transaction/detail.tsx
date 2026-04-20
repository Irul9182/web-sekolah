import DetailItem from '@/components/app-detail-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui-shadcn/empty';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatPercent } from '@/helpers/format';
import { useCountUp } from '@/hooks/use-count';
import { useMounted } from '@/hooks/use-mounted';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AnggaranProps } from '@/types/anggaran.type';
import { TransaksiProps } from '@/types/transaction.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Receipt } from 'lucide-react';

interface PageProps extends InertiaPageProps {
    transaksi?: TransaksiProps;
    anggaran?: AnggaranProps;
}

const TransactionDetailIndex = () => {
    const { props } = usePage<PageProps>();
    const transaksi = props?.transaksi;
    const anggaran = props?.anggaran;
    const transaksid = props?.transaksi_id ?? null;
    console.log('props: ', props);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Detail Transaksi',
            href: `/transaction/${transaksid}/detail`,
        },
    ];
    const mounted = useMounted();
    const animatedJumlah = useCountUp(transaksi?.jumlah as number, 1000, mounted);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Transaksi" />

            <div className="mt-4 flex w-full items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary h-1 w-6 rounded-full" />
                    <h2 className="text-foreground text-sm font-semibold tracking-wide uppercase opacity-60">Ringkasan Transaksi</h2>
                </div>
                <Button
                    onClick={() => router.visit('/transaction')}
                    variant="outline"
                    size="sm"
                    className="border-border text-muted-foreground hover:text-foreground gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>
            </div>

            <Card className="border-border bg-card m-4 shadow-sm">
                <CardHeader className="border-border border-b pb-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                            <Receipt className="text-primary h-4 w-4" />
                        </div>
                        <CardTitle className="text-card-foreground text-base font-bold">Rincian Transaksi</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-0 pt-4">
                    <DetailItem label="Nama Proyek" value={transaksi?.proyek?.nama_proyek} />
                    <DetailItem label="Dana Setelah Pajak" value={formatCurrency(anggaran?.dana_setelah_pajak)} />
                    <DetailItem
                        label="Kategori"
                        value={
                            transaksi?.kategori === 'biaya_tak_terduga'
                                ? 'Biaya Tak Terduga'
                                : transaksi?.kategori === 'jasa_tukang'
                                  ? 'Jasa Tukang'
                                  : transaksi?.kategori === 'mandor'
                                    ? 'Mandor'
                                    : transaksi?.kategori === 'material'
                                      ? 'Biaya Material'
                                      : transaksi?.kategori === 'operasional'
                                        ? 'Operasional'
                                        : transaksi?.kategori === 'staff_entry_data'
                                          ? 'Staff Entry Data'
                                          : transaksi?.kategori === 'staff_perpajakan'
                                            ? 'Staff Perpajakan'
                                            : '-'
                        }
                    />
                    <DetailItem label="Persen Total (%)" value={formatPercent(transaksi?.persen)} />
                    <DetailItem label="Jumlah Total (IDR)" value={formatCurrency(transaksi?.jumlah)} />
                    <DetailItem label="Tanggal" value={formatDate(transaksi?.tanggal)} />
                    <DetailItem label="Keterangan" value={transaksi?.keterangan} />
                </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card mx-4 mt-0 mb-4 shadow-sm">
                <CardHeader className="border-border border-b pb-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                            <div className="text-primary">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="lucide lucide-brick-wall-fire-icon lucide-brick-wall-fire"
                                >
                                    <path d="M16 3v2.107" />
                                    <path d="M17 9c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 22 17a5 5 0 0 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C13 11.5 16 9 17 9" />
                                    <path d="M21 8.274V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.938" />
                                    <path d="M3 15h5.253" />
                                    <path d="M3 9h8.228" />
                                    <path d="M8 15v6" />
                                    <path d="M8 3v6" />
                                </svg>
                            </div>
                        </div>
                        <CardTitle className="text-card-foreground text-base font-bold">List Material Yang dibeli</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="mx-4 flex flex-col items-center justify-center gap-3">
                    {transaksi?.items?.length === 0 ? (
                        <div>
                            <h4 className="text-foreground text-sm font-bold tracking-wide sm:text-base">Belum ada barang yang di beli</h4>

                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                                            <path
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M15 4v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8.739c.307.253.643.47 1 .654V12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5H9.975q.024-.247.025-.5q-.001-.253-.025-.5H14a2 2 0 0 0-2-2H9.393a5.5 5.5 0 0 0-.654-1H12a3 3 0 0 1 3 3M0 4.5a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0m1.5 0A.5.5 0 0 0 2 5h2v2a.5.5 0 0 0 1 0V5h2a.5.5 0 0 0 0-1H5V2a.5.5 0 0 0-1 0v2H2a.5.5 0 0 0-.5.5"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </EmptyMedia>
                                    <EmptyTitle>No data</EmptyTitle>
                                    <EmptyDescription>No data found</EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <Button>Add data</Button>
                                </EmptyContent>
                            </Empty>
                        </div>
                    ) : (
                        <>
                            {transaksi?.items?.map((item, index) => (
                                <div className="bg-muted-foreground w-full rounded-xl p-4" key={item?.item_id}>
                                    <h4 className="text-muted text-sm font-bold tracking-wide sm:text-base">
                                        {index + 1}. {item?.nama_item}
                                    </h4>
                                    <div className="mx-auto w-full p-0 sm:p-4">
                                        <DetailItem
                                            className="!border-white"
                                            labelClassName="text-muted! text-[10px] sm:text-sm"
                                            valueClassName="text-muted! text-[10px] sm:text-sm"
                                            label="Harga Satuan"
                                            value={formatCurrency(item?.harga_satuan)}
                                        />
                                        <DetailItem
                                            className="!border-white"
                                            labelClassName="text-muted! text-[10px] sm:text-sm"
                                            valueClassName="text-muted! text-[10px] sm:text-sm"
                                            label="Kuantitas"
                                            value={item?.qty}
                                        />
                                        <DetailItem
                                            className="!border-white"
                                            labelClassName="text-muted! text-[10px] sm:text-sm"
                                            valueClassName="text-muted! text-[10px] sm:text-sm"
                                            label="satuan"
                                            isStatus
                                            value={item?.satuan}
                                        />
                                        <DetailItem
                                            className="!border-white"
                                            labelClassName="text-muted! text-[10px] sm:text-sm"
                                            valueClassName="text-muted! text-[10px] sm:text-sm"
                                            label="Tanggal Transaksi"
                                            value={formatDate(item?.tanggal)}
                                        />
                                        <DetailItem
                                            className="!border-white"
                                            labelClassName="text-muted! text-[10px] sm:text-sm"
                                            valueClassName="text-muted! text-[10px] sm:text-sm"
                                            label="Terakhir di edit"
                                            value={formatDate(item?.updated_at)}
                                        />
                                        <DetailItem
                                            className="!border-white"
                                            labelClassName="text-muted! text-[10px] sm:text-sm"
                                            valueClassName="text-muted! text-[10px] sm:text-sm"
                                            label="Sub Total"
                                            value={formatCurrency(item?.subtotal)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card mx-4 mt-0 mb-4 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center gap-1 py-6">
                    <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">Total Transaksi</p>
                    <h4 className="text-primary text-3xl font-bold tracking-tight">{formatCurrency(animatedJumlah || '')}</h4>
                    <p className="text-muted-foreground mt-1 text-xs">
                        {formatDate(transaksi?.tanggal)} ·{' '}
                        {transaksi?.kategori === 'biaya_tak_terduga'
                            ? 'Biaya Tak Terduga'
                            : transaksi?.kategori === 'jasa_tukang'
                              ? 'Jasa Tukang'
                              : transaksi?.kategori === 'mandor'
                                ? 'Mandor'
                                : transaksi?.kategori === 'material'
                                  ? 'Biaya Material'
                                  : transaksi?.kategori === 'operasional'
                                    ? 'Operasional'
                                    : transaksi?.kategori === 'staff_entry_data'
                                      ? 'Staff Entry Data'
                                      : transaksi?.kategori === 'staff_perpajakan'
                                        ? 'Staff Perpajakan'
                                        : '-'}
                    </p>
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default TransactionDetailIndex;
