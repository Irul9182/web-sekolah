import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Galeri',
        href: '/galeri',
    },
];

const GaleriIndex = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div></div>
        </AppLayout>
    );
};

export default GaleriIndex;
