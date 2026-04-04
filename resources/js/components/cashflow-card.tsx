import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { formatCurrency } from '@/helpers/format';
import { useCountUp } from '@/hooks/use-count';
import { useMounted } from '@/hooks/use-mounted';
import { ArrowDownLeft, ArrowUpRight, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CashFlowCardProps {
    kasMasuk?: number | string;
    kasKeluar?: number | string;
    netCash?: number | string;
    breakdown?: Record<string, number>;
}

const CashFlowCard = ({ kasMasuk, kasKeluar, netCash, breakdown }: CashFlowCardProps) => {
    const nilai = Number(netCash ?? 0);
    const isPositif = nilai > 0;
    const isNetral = nilai === 0;

    const tone = isNetral ? 'default' : isPositif ? 'success' : 'error';
    const isMounted = useMounted();

    const [progress, setProgress] = useState(0);

    const toneConfig = {
        success: {
            label: 'Surplus Kas',
            icon: ArrowUpRight,
            color: 'var(--color-success)',
        },
        error: {
            label: 'Defisit Kas',
            icon: ArrowDownLeft,
            color: 'var(--color-error)',
        },
        default: {
            label: 'Seimbang',
            icon: Minus,
            color: 'var(--color-muted-foreground)',
        },
    }[tone];

    const Icon = toneConfig.icon;

    const kasMasukNum = Number(kasMasuk ?? 0);
    const kasKeluarNum = Number(kasKeluar ?? 0);

    const rasioPercent = kasMasukNum > 0 ? Math.min(Math.round((kasKeluarNum / kasMasukNum) * 100), 100) : 0;

    useEffect(() => {
        if (isMounted) {
            const timer = setTimeout(() => {
                setProgress(rasioPercent);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isMounted, rasioPercent]);

    const animatedRatio = useCountUp(rasioPercent, 1200, isMounted);
    const animatedNet = useCountUp(nilai, 1200, isMounted);

    return (
        <Card className="bg-card mx-4 my-2! mt-0 border">
            <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                            <Icon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-base font-bold">Cash Flow Proyek</CardTitle>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold">{toneConfig.label}</span>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Net Cash */}
                <div className="mb-5 flex flex-col items-center justify-center gap-1 py-4">
                    <p className="text-muted-foreground text-xs font-medium uppercase">Arus Kas Bersih</p>
                    <h4 className="text-3xl font-bold" style={{ color: toneConfig.color }}>
                        {formatCurrency(Math.abs(animatedNet))}
                    </h4>
                </div>

                {/* Kas Masuk & Keluar */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 flex flex-col gap-1 rounded-lg border px-4 py-3">
                        <p className="text-muted-foreground text-[10px] uppercase">Kas Masuk</p>
                        <p className="text-base font-bold text-green-600">{formatCurrency(kasMasuk ?? 0)}</p>
                    </div>

                    <div className="bg-muted/30 flex flex-col gap-1 rounded-lg border px-4 py-3">
                        <p className="text-muted-foreground text-[10px] uppercase">Kas Keluar</p>
                        <p className="text-base font-bold text-red-600">{formatCurrency(kasKeluar ?? 0)}</p>
                    </div>
                </div>

                {/* Ratio */}
                {kasMasukNum > 0 && (
                    <div className="mt-4 space-y-1.5">
                        <div className="text-muted-foreground flex justify-between text-[10px]">
                            <span>Kas Keluar / Kas Masuk</span>
                            <span>{animatedRatio}%</span>
                        </div>
                        <div className="bg-muted h-1.5 w-full rounded-full">
                            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CashFlowCard;
