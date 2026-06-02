import AppLayout from '@/layouts/app-layout';
import { BaseResponse, BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengumuman',
        href: '/pengumuman',
    },
];

interface PengumumanProps {
    id: string;
    judul: string;
    deskripsi: string;
    created_at: string;
    update_at: string;
    [key: string]: any;
}

interface PengumumanPageProps extends InertiaPageProps {
    list_pengumuman: BaseResponse<PengumumanProps>;
    flash?: {
        success?: string;
    };
}

const PengumumanIndex = () => {
    const props = usePage<PengumumanPageProps>().props;
    console.log('Response Pengumuman: ', props);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div>{props?.list_pengumuman?.data?.map((item) => <p key={item.id}>{item?.judul}</p>)}</div>
        </AppLayout>
    );
};

export default PengumumanIndex;
