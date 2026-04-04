import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { formatCurrency } from '@/helpers/format';
import { useCountUp } from '@/hooks/use-count';
import { useMounted } from '@/hooks/use-mounted';
import { cn } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LabaRugiCardProps {
    pemasukan?: number | string;
    pengeluaran?: number | string;
    selisih?: number | string;
    status?: 'laba' | 'rugi';
}

const LabaRugiCard = ({ pemasukan, pengeluaran, selisih, status }: LabaRugiCardProps) => {
    const nilai = Number(selisih ?? 0);
    const isLaba = status === 'laba' || (status === undefined && nilai >= 0);
    const isNetral = nilai === 0;
    const tone = isNetral ? 'default' : isLaba ? 'success' : 'error';
    const isMounted = useMounted();

    const [progress, setProgress] = useState(0);

    const toneConfig = {
        success: {
            label: 'Laba',
            icon: TrendingUp,
            cardBorder: 'border-[color:var(--color-success)]/25',
            iconBg: 'bg-[color:var(--color-success)]/10',
            iconColor: 'text-[color:var(--color-success)]',
            valueColor: 'text-[color:var(--color-success)]',
            badgeBg: 'bg-[color:var(--color-success-bg)]',
            badgeBorder: 'border-[color:var(--color-success)]/30',
            badgeText: 'text-[color:var(--color-success)]',
            dotColor: 'bg-[color:var(--color-success)]',
            barColor: 'bg-[color:var(--color-success)]',
        },
        error: {
            label: 'Rugi',
            icon: TrendingDown,
            cardBorder: 'border-[color:var(--color-error)]/25',
            iconBg: 'bg-[color:var(--color-error)]/10',
            iconColor: 'text-[color:var(--color-error)]',
            valueColor: 'text-[color:var(--color-error)]',
            badgeBg: 'bg-[color:var(--color-error-bg)]',
            badgeBorder: 'border-[color:var(--color-error)]/30',
            badgeText: 'text-[color:var(--color-error)]',
            dotColor: 'bg-[color:var(--color-error)]',
            barColor: 'bg-[color:var(--color-error)]',
        },
        default: {
            label: 'Impas',
            icon: Minus,
            cardBorder: 'border-border',
            iconBg: 'bg-muted',
            iconColor: 'text-muted-foreground',
            valueColor: 'text-foreground',
            badgeBg: 'bg-muted',
            badgeBorder: 'border-border',
            badgeText: 'text-muted-foreground',
            dotColor: 'bg-muted-foreground',
            barColor: 'bg-muted-foreground',
        },
    }[tone];

    const Icon = toneConfig.icon;

    const pemasukanNum = Number(pemasukan ?? 0);
    const pengeluaranNum = Number(pengeluaran ?? 0);
    const rasioPercent = pemasukanNum > 0 ? Math.min(Math.round((pengeluaranNum / pemasukanNum) * 100), 100) : 0;
    useEffect(() => {
        if (isMounted) {
            const timer = setTimeout(() => {
                setProgress(rasioPercent);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isMounted, rasioPercent]);
    const animatedValue = useCountUp(rasioPercent, 1600, isMounted);
    const animatedValueSelisih = useCountUp(nilai, 1400, isMounted);
    return (
        <Card className={cn('bg-card mx-4 my-2! mt-0', toneConfig.cardBorder)}>
            <CardHeader className="border-border border-b pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', toneConfig.iconBg)}>
                            <Icon className={cn('h-4 w-4', toneConfig.iconColor)} />
                        </div>
                        <CardTitle className="text-card-foreground text-base font-bold">Laba / Rugi Proyek</CardTitle>
                    </div>

                    <span
                        className={cn(
                            'flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold',
                            toneConfig.badgeBg,
                            toneConfig.badgeBorder,
                            toneConfig.badgeText,
                        )}
                    >
                        <span className={cn('h-1.5 w-1.5 rounded-full', toneConfig.dotColor)} />
                        {toneConfig.label}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="mb-5 flex flex-col items-center justify-center gap-1 py-4">
                    <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">Selisih ({toneConfig.label})</p>
                    <h4 className={cn('text-3xl font-bold tracking-tight', toneConfig.valueColor)}>
                        {formatCurrency(Math.abs(animatedValueSelisih))}
                    </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="border-border bg-muted/30 flex flex-col gap-1 rounded-lg border px-4 py-3">
                        <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Pemasukan</p>
                        <p className="text-base font-bold text-[color:var(--color-success)]">{formatCurrency(pemasukan ?? 0)}</p>
                    </div>

                    <div className="border-border bg-muted/30 flex flex-col gap-1 rounded-lg border px-4 py-3">
                        <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">Pengeluaran</p>
                        <p className="text-base font-bold text-[color:var(--color-error)]">{formatCurrency(pengeluaran ?? 0)}</p>
                    </div>
                </div>

                {pemasukanNum > 0 && (
                    <div className="mt-4 space-y-1.5">
                        <div className="text-muted-foreground flex justify-between text-[10px]">
                            <span>Pengeluaran / Pemasukan</span>
                            <span>{animatedValue}%</span>
                        </div>
                        <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                            <div
                                className={cn('h-full rounded-full transition-all duration-1000 ease-out', toneConfig.barColor)}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LabaRugiCard;
