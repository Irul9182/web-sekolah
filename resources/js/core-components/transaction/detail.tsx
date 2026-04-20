import DetailItem from '@/components/app-detail-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
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
                            <Receipt className="text-primary h-4 w-4" />
                        </div>
                        <CardTitle className="text-card-foreground text-base font-bold">List Material Yang dibeli</CardTitle>
                    </div>
                </CardHeader>
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
