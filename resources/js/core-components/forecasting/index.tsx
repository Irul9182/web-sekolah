import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    type ChartData,
    type ChartOptions,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui-shadcn/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ChartNoAxesCombined, Loader2, TrendingUp, TriangleAlert } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ForecastPoint {
    ds: string;
    yhat: number;
    yhat_lower: number;
    yhat_upper: number;
}

interface Summary {
    total_pagu: number;
    total_pengeluaran: number;
    total_cashflow: number;
    total_netto: number;
    total_proyek: number;
    proyek_berjalan: number;
    proyek_selesai: number;
    proyek_dibatalkan: number;
}

interface ForecastingResult {
    actual: ForecastPoint[];
    forecast: ForecastPoint[];
    periods: number;
    trained_on: number;
    summary: Summary | null;
    mae: number;
    mape: number;
}

interface PageProps extends InertiaPageProps {
    forecasting: ForecastingResult | null;
    errors: {
        data?: string;
        forecast?: string;
    };
}

const fmt = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(n);

const fmtFull = (n: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(n);

const fmtMonth = (ds: string) =>
    new Date(ds).toLocaleDateString('id-ID', {
        month: 'short',
        year: '2-digit',
    });

function buildChartConfig(forecasting: ForecastingResult): ChartData<'line'> {
    const actualLabels = forecasting.actual.map((r) => fmtMonth(r.ds));
    const forecastLabels = forecasting.forecast.map((r) => fmtMonth(r.ds));
    const labels = [...actualLabels, ...forecastLabels];

    const actualLen = actualLabels.length;
    const totalLen = labels.length;

    const aktualData: (number | null)[] = [...forecasting.actual.map((r) => r.yhat), ...Array(totalLen - actualLen).fill(null)];

    const proyeksiData: (number | null)[] = [
        ...Array(actualLen - 1).fill(null),
        forecasting.actual[forecasting.actual.length - 1]?.yhat ?? null,
        ...forecasting.forecast.map((r) => r.yhat),
    ];

    const upperData: (number | null)[] = [
        ...Array(actualLen - 1).fill(null),
        forecasting.actual[forecasting.actual.length - 1]?.yhat ?? null,
        ...forecasting.forecast.map((r) => r.yhat_upper),
    ];
    const lowerData: (number | null)[] = [
        ...Array(actualLen - 1).fill(null),
        forecasting.actual[forecasting.actual.length - 1]?.yhat ?? null,
        ...forecasting.forecast.map((r) => r.yhat_lower),
    ];

    return {
        labels,
        datasets: [
            {
                label: 'CI Upper',
                data: upperData,
                borderColor: 'transparent',
                backgroundColor: 'rgba(52,211,153,0.13)',
                fill: { target: '+1', above: 'rgba(52,211,153,0.13)' },
                pointRadius: 0,
                tension: 0.4,
                spanGaps: true,
            },
            {
                label: 'CI Lower',
                data: lowerData,
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                fill: false,
                pointRadius: 0,
                tension: 0.4,
                spanGaps: true,
            },
            {
                label: 'Proyeksi',
                data: proyeksiData,
                borderColor: '#34d399',
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [6, 4],
                pointRadius: 3,
                pointBackgroundColor: '#34d399',
                pointBorderWidth: 0,
                tension: 0.4,
                spanGaps: false,
            },
            {
                label: 'Aktual',
                data: aktualData,
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                borderWidth: 2.5,
                pointRadius: 3,
                pointBackgroundColor: '#3b82f6',
                pointBorderWidth: 0,
                tension: 0.4,
                spanGaps: false,
            },
        ],
    };
}

function buildChartOptions(): ChartOptions<'line'> {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                borderColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                titleFont: { family: 'monospace', size: 11 },
                bodyFont: { family: 'monospace', size: 11 },
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label(ctx) {
                        const hidden = ['CI Upper', 'CI Lower'];
                        if (hidden.includes(ctx.dataset.label ?? '')) return undefined;
                        if (ctx.parsed.y === null) return undefined;
                        return `${ctx.dataset.label}: ${fmtFull(ctx.parsed.y)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(148,163,184,0.08)' },
                ticks: {
                    color: '#64748b',
                    font: { family: 'monospace', size: 11 },
                },
                border: { display: false },
            },
            y: {
                grid: { color: 'rgba(148,163,184,0.08)' },
                ticks: {
                    color: '#64748b',
                    font: { family: 'monospace', size: 11 },
                    callback: (v) => fmt(v as number),
                },
                border: { display: false },
            },
        },
    };
}

interface MetricCardProps {
    label: string;
    value: string;
    sub?: string;
    valueClass?: string;
}

function MetricCard({ label, value, sub, valueClass }: MetricCardProps) {
    return (
        <Card>
            <CardContent className="px-5 pt-5 pb-4">
                <p className="text-muted-foreground mb-2 text-[11px] tracking-widest uppercase">{label}</p>
                <p className={`text-2xl leading-tight font-bold tracking-tight ${valueClass ?? 'text-foreground'}`}>{value}</p>
                {sub && <p className="text-muted-foreground mt-1.5 text-[11px]">{sub}</p>}
            </CardContent>
        </Card>
    );
}

function StatRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
    return (
        <div className="flex items-center justify-between py-2.5">
            <span className="text-muted-foreground text-[12px]">{label}</span>
            <span className={`text-[13px] font-semibold ${valueClass ?? 'text-foreground'}`}>{value}</span>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyek',
        href: '/forecasting',
    },
];

const ForecastingIndex = () => {
    const { props } = usePage<PageProps>();
    const { errors, forecasting } = props;
    const chartRef = useRef(null);

    const { data, setData, post, processing } = useForm({ periods: 6 });

    const forecastList = forecasting?.forecast ?? [];

    const avgForecast = forecastList.length > 0 ? forecastList.reduce((s, r) => s + r.yhat, 0) / forecastList.length : 0;
    const maxForecast = forecastList.length > 0 ? Math.max(...forecastList.map((r) => r.yhat_upper)) : 0;
    const minForecast = forecastList.length > 0 ? Math.min(...forecastList.map((r) => r.yhat_lower)) : 0;

    const chartData = forecasting ? buildChartConfig(forecasting) : null;
    const chartOptions = buildChartOptions();
    const summary = forecasting?.summary ?? null;

    useEffect(() => {
        console.log('Erros: ', errors);
        console.log('Forecasting: ', forecasting);
    }, [errors, forecasting]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Forecasting" />
            <div className="p-4">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Cashflow <span className="text-primary">Forecasting</span>
                        </h1>
                        <p className="text-muted-foreground mt-1.5 text-xs tracking-wide">
                            Prophet · 95% confidence interval · data transaksi aktual
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-muted-foreground text-xs">Proyeksi</span>
                        <Select value={String(data.periods)} onValueChange={(v) => setData('periods', Number(v))}>
                            <SelectTrigger className="h-9 w-32 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[6, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((n) => (
                                    <SelectItem key={n} value={String(n)} className="text-xs">
                                        {n} bulan
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => post(route('forecasting.generate'))}
                            disabled={processing}
                            size="sm"
                            className="gap-2 px-5 font-semibold"
                        >
                            {processing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <TrendingUp className="h-3.5 w-3.5" />}
                            {processing ? 'Memproses...' : 'Generate'}
                        </Button>
                    </div>
                </div>

                {/* ── Errors ── */}
                {(errors.data || errors.forecast) && (
                    <Alert variant="destructive" className="mb-6">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription className="text-xs">{errors.data ?? errors.forecast}</AlertDescription>
                    </Alert>
                )}

                {/* ── Empty state ── */}
                {!forecasting && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
                            <ChartNoAxesCombined className="text-muted-foreground/40 h-10 w-10" />
                            <p className="text-base font-semibold">Belum ada forecast</p>
                            <p className="text-muted-foreground text-center text-xs leading-relaxed">
                                Pilih jumlah periode dan klik Generate
                                <br />
                                untuk memulai prediksi cashflow.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* ── Hasil forecast ── */}
                {forecasting && chartData && (
                    <div className="space-y-5">
                        {/* Metric cards */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                            <MetricCard
                                label="Rata-rata proyeksi"
                                value={fmt(avgForecast)}
                                sub={`${forecasting.periods} bulan ke depan`}
                                valueClass="text-primary"
                            />
                            <MetricCard label="Proyeksi tertinggi" value={fmt(maxForecast)} sub="batas atas 95% CI" valueClass="text-emerald-500" />
                            <MetricCard label="Proyeksi terendah" value={fmt(minForecast)} sub="batas bawah 95% CI" valueClass="text-amber-500" />
                            <MetricCard label="Dilatih dari" value={`${forecasting.trained_on} bulan`} sub="data historis transaksi" />
                            <Card>
                                <CardContent className="pt-4">
                                    <p className="text-muted-foreground text-xs tracking-widest uppercase">MAE</p>
                                    <p className="text-2xl font-bold">{fmtFull(forecasting.mae)}</p>
                                    <p className="text-muted-foreground mt-1 text-xs">Rata-rata selisih prediksi vs aktual</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-4">
                                    <p className="text-muted-foreground text-xs tracking-widest uppercase">MAPE</p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            forecasting.mape < 10 ? 'text-emerald-500' : forecasting.mape < 20 ? 'text-yellow-500' : 'text-rose-500'
                                        }`}
                                    >
                                        {forecasting.mape.toFixed(2)}%
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {forecasting.mape < 10
                                            ? 'Sangat akurat'
                                            : forecasting.mape < 20
                                              ? 'Akurat'
                                              : forecasting.mape < 50
                                                ? 'Cukup akurat'
                                                : 'Tidak akurat'}
                                    </p>
                                </CardContent>
                            </Card>
                            {summary && (
                                <>
                                    <MetricCard
                                        label="Proyek aktif"
                                        value={String(summary.proyek_berjalan)}
                                        sub={`dari ${summary.total_proyek} proyek`}
                                    />
                                    <MetricCard
                                        label="Total cashflow"
                                        value={fmt(summary.total_cashflow)}
                                        sub="seluruh proyek"
                                        valueClass={summary.total_cashflow >= 0 ? 'text-emerald-500' : 'text-destructive'}
                                    />
                                </>
                            )}
                        </div>

                        {/* Main chart */}
                        <Card>
                            <CardHeader className="pb-2">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base font-semibold">Tren &amp; Proyeksi Cashflow</CardTitle>
                                        <CardDescription className="mt-1 text-[11px]">
                                            Aktual dari DB · Proyeksi Prophet · Confidence band 95%
                                        </CardDescription>
                                    </div>

                                    {/* Custom legend */}
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { color: 'bg-blue-500', label: 'Aktual' },
                                            { color: 'bg-emerald-400', label: 'Proyeksi' },
                                            { color: 'bg-emerald-400/20 border border-dashed border-emerald-400/40', label: 'CI 95%' },
                                        ].map((l) => (
                                            <span key={l.label} className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                                                <span className={`h-2.5 w-2.5 rounded-sm ${l.color}`} />
                                                {l.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="relative h-[300px]">
                                    <Line ref={chartRef} data={chartData} options={chartOptions} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bottom grid */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Tabel proyeksi */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Detail Proyeksi</CardTitle>
                                    <CardDescription className="text-[11px]">{forecasting.periods} bulan · confidence 95%</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-[11px] tracking-wide">Bulan</TableHead>
                                                <TableHead className="text-[11px] tracking-wide">Proyeksi</TableHead>
                                                <TableHead className="text-right text-[11px] tracking-wide">Bawah</TableHead>
                                                <TableHead className="text-right text-[11px] tracking-wide">Atas</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {forecastList.map((r, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="py-2.5 text-xs">{fmtMonth(r.ds)}</TableCell>
                                                    <TableCell className="py-2.5 text-xs">
                                                        <Badge
                                                            variant="secondary"
                                                            className="border-0 bg-emerald-50 text-[11px] text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                        >
                                                            {fmt(r.yhat)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground py-2.5 text-right text-[11px]">
                                                        {fmt(r.yhat_lower)}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground py-2.5 text-right text-[11px]">
                                                        {fmt(r.yhat_upper)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Ringkasan keuangan */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold">Ringkasan Keuangan</CardTitle>
                                    <CardDescription className="text-[11px]">Semua proyek aktif</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {summary ? (
                                        <div className="divide-border divide-y">
                                            <StatRow label="Total pagu" value={fmt(summary.total_pagu)} />
                                            <StatRow label="Total pengeluaran" value={fmt(summary.total_pengeluaran)} valueClass="text-amber-500" />
                                            <StatRow
                                                label="Total cashflow"
                                                value={fmt(summary.total_cashflow)}
                                                valueClass={summary.total_cashflow >= 0 ? 'text-emerald-500' : 'text-destructive'}
                                            />
                                            <StatRow
                                                label="Netto perusahaan"
                                                value={fmt(summary.total_netto)}
                                                valueClass={summary.total_netto >= 0 ? 'text-emerald-500' : 'text-destructive'}
                                            />
                                            <Separator className="my-1" />
                                            <StatRow label="Proyek berjalan" value={String(summary.proyek_berjalan)} />
                                            <StatRow label="Proyek selesai" value={String(summary.proyek_selesai)} valueClass="text-emerald-500" />
                                            <StatRow
                                                label="Proyek dibatalkan"
                                                value={String(summary.proyek_dibatalkan)}
                                                valueClass={summary.proyek_dibatalkan > 0 ? 'text-destructive' : 'text-foreground'}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-xs">Data summary tidak tersedia.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-2 gap-4"></div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default ForecastingIndex;
