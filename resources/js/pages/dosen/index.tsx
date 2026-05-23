
import ProjectIndex from '@/core-components/Project';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { PaginatedResponse } from '@/types/laravel.type';
import { ProyekProps, StatusProyek } from '@/types/project.type';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dosen',
        href: '/dosen',
    },
];

const DosenPage = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Dosen Page'/>
            <div className='flex items-center justify-center min-h-screen w-full'>

            this is Dosen page perubahan herkal
                </div>
        </AppLayout>
    )
};

export default DosenPage;
