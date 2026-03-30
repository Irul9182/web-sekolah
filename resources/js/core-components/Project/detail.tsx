import DetailItem from '@/components/app-detail-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatPercent } from '@/helpers/format';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { AnggaranProps } from '@/types/anggaran.type';
import { ProyekProps } from '@/types/project.type';
import { RealisasiProps } from '@/types/realisasi.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PageProps extends InertiaPageProps {
    proyek?: ProyekProps;
    anggaran?: AnggaranProps;
    realisasi?: RealisasiProps;
}
const ProjectDetailIndex = () => {
    const { props } = usePage<PageProps>();
    console.log('Props:', props);
    const proyek = props?.proyek;
    const anggaran = props?.anggaran;
    const realisasi = props?.realisasi;

    console.log('Proyek: ', proyek);
    const projectId = props?.proyek_id ?? null;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Detail Proyek',
            href: `/project/${projectId}/detail`,
        },
    ];

    const exportToExcel = () => {
        const wsData = [
            ['Field', 'Value'],
            ['Nama Proyek', proyek?.nama_proyek],
            ['Tipe Proyek', proyek?.tipe_proyek],
            ['Pagu Total', formatCurrency(proyek?.pagu_total)],
            ['Tanggal Mulai', formatDate(proyek?.tanggal_mulai)],
            ['Tanggal Selesai', formatDate(proyek?.tanggal_selesai as string)],
            ['Pajak (%)', formatPercent(proyek?.pajak_persen)],
            ['Uang Bahan (%)', formatPercent(proyek?.uang_bahan_persen)],
            ['Jasa Tukang (%)', formatPercent(proyek?.jasa_tukang_persen)],
            ['Biaya Tak Terduga (%)', formatPercent(proyek?.biaya_tak_terduga_persen)],
            ['Biaya Staff Perpajakan', formatCurrency(proyek?.biaya_staff_perpajakan)],
            ['Biaya Staff Entry Data', formatCurrency(proyek?.biaya_staff_entry_data)],
            ['Nama Klien', proyek?.nama_klien],
            ['Status', proyek?.status],
            ['Deskripsi Proyek', proyek?.deskripsi_proyek ?? '-'],
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);

        const wsCols = [{ wch: 25 }, { wch: 40 }];
        ws['!cols'] = wsCols;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Proyek');

        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buf], { type: 'application/octet-stream' });
        saveAs(blob, `${proyek?.nama_proyek || 'proyek'}.xlsx`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Proyek" />

            <div className="mt-4 flex w-full items-center justify-end px-4">
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.visit('/project')} className={`"transition-all duration-150"`} variant={'secondary'}>
                        <p>{'Kembali'}</p>
                    </Button>
                    <Button className="flex items-center gap-3" onClick={() => exportToExcel()}>
                        <p>Download Excel</p>
                        <Download />
                    </Button>
                </div>
            </div>
            <Card className="m-4">
                <CardHeader>
                    <CardTitle className="xl font-bold">Detail Proyek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <DetailItem label="Nama Proyek" value={proyek?.nama_proyek} />
                    <DetailItem label="Tipe Proyek" value={proyek?.tipe_proyek?.toLocaleUpperCase()} />
                    <DetailItem
                        isStatus
                        toneStatus={
                            proyek?.status === 'selesai'
                                ? 'success'
                                : proyek?.status === 'dibatalkan'
                                  ? 'error'
                                  : proyek?.status === 'sedang_berjalan'
                                    ? 'default'
                                    : 'default'
                        }
                        label="Status"
                        value={
                            proyek?.status === 'sedang_berjalan'
                                ? 'Sedang Berjalan'
                                : proyek?.status === 'dibatalkan'
                                  ? 'Dibatalkan'
                                  : proyek?.status === 'selesai'
                                    ? 'Selesai'
                                    : ''
                        }
                    />
                    <DetailItem label="Pagu Total" value={formatCurrency(proyek?.pagu_total)} />
                    <DetailItem label="Tanggal Mulai" value={formatDate(proyek?.tanggal_mulai)} />
                    <DetailItem label="Tanggal Selesai" value={formatDate(proyek?.tanggal_selesai as string)} />
                    <DetailItem label="Pajak (%)" value={formatPercent(proyek?.pajak_persen)} />
                    <DetailItem label="Total Dana Setelah Pajak" value={formatCurrency(anggaran?.dana_setelah_pajak || '-')} />

                    {/* <DetailItem label="Uang Bahan (%)" value={formatPercent(proyek?.uang_bahan_persen)} />
                    <DetailItem label="Jasa Tukang (%)" value={formatPercent(proyek?.jasa_tukang_persen)} />
                    <DetailItem label="Biaya Tak Terduga (%)" value={formatPercent(proyek?.biaya_tak_terduga_persen)} />
                    <DetailItem label="Biaya Staff Perpajakan" value={formatCurrency(proyek?.biaya_staff_perpajakan)} />
                    <DetailItem label="Biaya Staff Entry Data" value={formatCurrency(proyek?.biaya_staff_entry_data)} /> */}
                    <DetailItem label="Nama Klien" value={proyek?.nama_klien} />
                    <DetailItem label="Deskripsi Proyek" value={proyek?.deskripsi_proyek ?? '-'} />
                </CardContent>
            </Card>
            <Card className="mx-4 mt-2 mb-2">
                <CardHeader>
                    <CardTitle className="xl font-bold">Transaksi</CardTitle>
                </CardHeader>
                <CardContent className="space-y">
                    <DetailItem label="Jasa Tukang" value={formatPercent(realisasi?.jasa_tukang?.items?.persen) || '-'} />
                    <DetailItem label="Biaya Mandor" value={formatPercent(realisasi?.mandor?.items?.persen) || '-'} />
                    <DetailItem label="Material" value={formatPercent(realisasi?.material?.items?.persen) || '-'} />
                    <DetailItem label="Staff Entry Data" value={formatCurrency(realisasi?.staff_entry_data?.aktual) || '-'} />
                    <DetailItem label="Staff Perpajakan" value={formatCurrency(realisasi?.staff_perpajakan?.aktual) || '-'} />
                    <DetailItem label="Biaya Tak Terduga" value={formatPercent(realisasi?.biaya_tak_terduga?.items?.persen) || '-'} />
                </CardContent>
            </Card>
            <Card className="mx-4 mt-2 mb-4">
                <CardHeader>
                    <CardTitle className="xl font-bold">Total Netto</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <h4 className="text-2xl font-bold">{formatCurrency(anggaran?.netto || '')}</h4>
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ProjectDetailIndex;
