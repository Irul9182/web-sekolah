import DetailItem from '@/components/app-detail-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatPercent } from '@/helpers/format';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AnggaranProps } from '@/types/anggaran.type';
import { TransaksiProps } from '@/types/transaction.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';

interface PageProps extends InertiaPageProps {
    transaksi?: TransaksiProps;
    anggaran?: AnggaranProps;
}
const TransactionDetailIndex = () => {
    const { props } = usePage<PageProps>();
    const transaksi = props?.transaksi;
    const anggaran = props?.anggaran;

    const transaksid = props?.transaksi_id ?? null;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Detail transaksi',
            href: `/transaction/${transaksid}/detail`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Transaksi" />

            <div className="mt-4 flex w-full items-center justify-end px-4">
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.visit('/transaction')} className={`"transition-all duration-150"`} variant={'secondary'}>
                        <p>{'Kembali'}</p>
                    </Button>
                </div>
            </div>
            <Card className="m-4">
                <CardHeader>
                    <CardTitle className="xl font-bold">Detail Transaksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <DetailItem label="Nama Proyek" value={transaksi?.proyek?.nama_proyek} />
                    <DetailItem label="Dana Setelah Pajak" value={formatCurrency(anggaran?.dana_setelah_pajak)} />
                    <DetailItem label="Kategori " value={transaksi?.kategori} />
                    <DetailItem label="Persen Total (%)" value={formatPercent(transaksi?.persen)} />
                    <DetailItem label="Jumlah Total (IDR)" value={formatCurrency(transaksi?.jumlah)} />
                    <DetailItem label="Tanggal" value={formatDate(transaksi?.tanggal)} />
                    <DetailItem label="Keterangan" value={transaksi?.keterangan} />
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default TransactionDetailIndex;
