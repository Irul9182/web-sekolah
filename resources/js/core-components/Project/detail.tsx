import { SelectTone } from '@/components/app-select';
import { Badge } from '@/components/ui-shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { ProyekProps } from '@/types/project.type';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
type DetailItemProps = {
    label: string;
    value: string | number | undefined | null;
    isStatus?: boolean;
    toneStatus?: SelectTone;
};
const toneStyles: Record<SelectTone, React.CSSProperties> = {
    default: {
        '--tone-bg': 'var(--muted)',
        '--tone-border': 'var(--input)',
        '--tone-focus-border': 'var(--primary)',
        '--tone-ring': 'var(--primary)',
        '--tone-text': 'var(--foreground)',
        '--tone-placeholder': 'var(--muted-foreground)',
        '--tone-label': 'inherit',
        '--tone-hint': 'var(--muted-foreground)',
    } as React.CSSProperties,

    //-color-error: #e76f51 (light) / #e76f51 (dark — sama)
    error: {
        '--tone-bg': 'color-mix(in srgb, var(--color-error) 12%, var(--background))',
        '--tone-border': 'var(--color-error)',
        '--tone-focus-border': 'var(--color-error)',
        '--tone-ring': 'var(--color-error)',
        '--tone-text': 'color-mix(in srgb, var(--color-error) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-error) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-error) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-error) 65%, var(--foreground))',
    } as React.CSSProperties,

    // color-warning: #f4a261 (light) / #f4a261 (dark)
    warning: {
        '--tone-bg': 'color-mix(in srgb, var(--color-warning) 12%, var(--background))',
        '--tone-border': 'var(--color-warning)',
        '--tone-focus-border': 'var(--color-warning)',
        '--tone-ring': 'var(--color-warning)',
        '--tone-text': 'color-mix(in srgb, var(--color-warning) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-warning) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-warning) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-warning) 65%, var(--foreground))',
    } as React.CSSProperties,

    // color-success: #52b788 (light) / #52b788 dark: chart-2 #52b788 — pakai color-success konsisten
    success: {
        '--tone-bg': 'color-mix(in srgb, var(--color-success) 15%, var(--background))',
        '--tone-border': 'var(--color-success)',
        '--tone-focus-border': 'var(--color-success)',
        '--tone-ring': 'var(--color-success)',
        '--tone-text': 'color-mix(in srgb, var(--color-success) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-success) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-success) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-success) 65%, var(--foreground))',
    } as React.CSSProperties,

    // color-info: #2a9d8f (light) / #3bbfb0 (dark)
    info: {
        '--tone-bg': 'color-mix(in srgb, var(--color-info) 12%, var(--background))',
        '--tone-border': 'var(--color-info)',
        '--tone-focus-border': 'var(--color-info)',
        '--tone-ring': 'var(--color-info)',
        '--tone-text': 'color-mix(in srgb, var(--color-info) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-info) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-info) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-info) 65%, var(--foreground))',
    } as React.CSSProperties,
};
const DetailItem: React.FC<DetailItemProps> = ({ label, value, isStatus = false, toneStatus = 'default' }) => {
    const tone: SelectTone = toneStatus;
    return (
        <div className="flex items-center justify-between border-b py-2 last:border-b-0">
            <span className="text-foreground font-semibold">{label}</span>
            {isStatus ? (
                <Badge
                    style={{
                        ...toneStyles[tone],
                        backgroundColor: 'var(--tone-bg)',
                        borderColor: 'var(--tone-border)',
                        color: 'var(--tone-text)',
                    }}
                    data-tone={tone}
                    className="border text-sm font-semibold"
                >
                    {value}
                </Badge>
            ) : (
                <span className="text-foreground">{value ?? '-'}</span>
            )}
        </div>
    );
};
interface PageProps extends InertiaPageProps {
    proyek?: ProyekProps;
}
const ProjectDetailIndex = () => {
    const { props } = usePage<PageProps>();

    const proyek = props?.proyek;
    const formatDate = (date?: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };
    const formatCurrency = (val?: string | number) => {
        if (val === undefined || val === null) return '-';
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return num.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
    };
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
                    <DetailItem label="Uang Bahan (%)" value={formatPercent(proyek?.uang_bahan_persen)} />
                    <DetailItem label="Jasa Tukang (%)" value={formatPercent(proyek?.jasa_tukang_persen)} />
                    <DetailItem label="Biaya Tak Terduga (%)" value={formatPercent(proyek?.biaya_tak_terduga_persen)} />
                    <DetailItem label="Biaya Staff Perpajakan" value={formatCurrency(proyek?.biaya_staff_perpajakan)} />
                    <DetailItem label="Biaya Staff Entry Data" value={formatCurrency(proyek?.biaya_staff_entry_data)} />
                    <DetailItem label="Nama Klien" value={proyek?.nama_klien} />
                    <DetailItem label="Deskripsi Proyek" value={proyek?.deskripsi_proyek ?? '-'} />
                </CardContent>
            </Card>
        </AppLayout>
    );
};

export default ProjectDetailIndex;
