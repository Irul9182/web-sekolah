import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

interface Stat {
    label: string;
    value: number;
    description?: string | null;
    format?: 'currency' | 'number';
}

interface DashboardPageProps {
    stats: Stat[];
    [key: string]: unknown;
}

function formatValue(stat: Stat) {
    if (stat.format === 'currency') {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(stat.value);
    }
    return new Intl.NumberFormat('id-ID').format(stat.value);
}

export default function Dashboard() {
    const { stats } = usePage<DashboardPageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats?.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="pb-2">
                            <CardDescription>{stat.label}</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums">
                                {formatValue(stat)}
                            </CardTitle>
                        </CardHeader>
                        {stat.description && (
                            <CardContent className="text-xs text-muted-foreground">
                                {stat.description}
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}