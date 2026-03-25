import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ProyekProps } from '@/types/project.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
type DetailItemProps = {
    label: string;
    value: string | number | undefined | null;
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
    return (
        <div className="flex justify-between border-b py-2 last:border-b-0">
            <span className="text-foreground font-medium">{label}</span>
            <span className="text-gray-300">{value ?? '-'}</span>
        </div>
    );
};
interface PageProps extends InertiaPageProps {
    proyek?: ProyekProps;
}
const ProjectDetailIndex = () => {
    const { props } = usePage<PageProps>();

    const proyek = props?.proyek;
    const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '-');
    const formatCurrency = (num?: number) => (num !== undefined ? num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) : '-');
    const formatPercent = (num?: number | string) => {
        if (num === undefined || num === null) return '-';
        const n = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(n)) return '-';
        return `${n.toFixed(2)}%`;
    };
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
                <Button className="flex items-center gap-3" onClick={() => exportToExcel()}>
                    <p>Download Excel</p>
                    <Download />
                </Button>
            </div>
            <Card className="m-4">
                <CardHeader>
                    <CardTitle>Detail Proyek</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <DetailItem label="Nama Proyek" value={proyek?.nama_proyek} />
                    <DetailItem label="Tipe Proyek" value={proyek?.tipe_proyek?.toLocaleUpperCase()} />
                    <DetailItem label="Pagu Total" value={'Rp. ' + formatCurrency(proyek?.pagu_total)} />
                    <DetailItem label="Tanggal Mulai" value={formatDate(proyek?.tanggal_mulai)} />
                    <DetailItem label="Tanggal Selesai" value={formatDate(proyek?.tanggal_selesai as string)} />
                    <DetailItem label="Pajak (%)" value={formatPercent(proyek?.pajak_persen)} />
                    <DetailItem label="Uang Bahan (%)" value={formatPercent(proyek?.uang_bahan_persen)} />
                    <DetailItem label="Jasa Tukang (%)" value={formatPercent(proyek?.jasa_tukang_persen)} />
                    <DetailItem label="Biaya Tak Terduga (%)" value={formatPercent(proyek?.biaya_tak_terduga_persen)} />
                    <DetailItem label="Biaya Staff Perpajakan" value={'Rp. ' + formatCurrency(proyek?.biaya_staff_perpajakan)} />
                    <DetailItem label="Biaya Staff Entry Data" value={'Rp. ' + formatCurrency(proyek?.biaya_staff_entry_data)} />
                    <DetailItem label="Nama Klien" value={proyek?.nama_klien} />
                    <DetailItem
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
                    <DetailItem label="Deskripsi Proyek" value={proyek?.deskripsi_proyek ?? '-'} />
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ProjectDetailIndex;
