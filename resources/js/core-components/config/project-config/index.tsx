import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { JenisProyek } from '@/types/jenis_proyek.type';
import { KategoriProyek } from '@/types/kategori_proyek.type';
import { PaginatedResponse } from '@/types/laravel.type';
import { PageProps as InertiaPageProps, router } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { LIST_CATEGORY_COLUMNS } from './assets/project-config-assets';
import MainTable from './components/MainTable';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyek Konfigurasi',
        href: '/config/project-config',
    },
];

interface PageProps extends InertiaPageProps {
    list_kategori?: PaginatedResponse<KategoriProyek>;
    list_jenis?: PaginatedResponse<JenisProyek>;
    filtersJenis: {
        searchJenis: string;
        per_pageJenis: number;
    };
    filtersKategori: {
        searchKategori: string;
        per_pageKategori: number;
    };
}
const ProjectConfigIndex = () => {
    const { props } = usePage<PageProps>();
    const { filtersJenis, filtersKategori, list_kategori, list_jenis } = props;
    const [searchKategori, setSearchKategori] = useState(filtersKategori.searchKategori ?? '');
    const [searchJenis, setSearchJenis] = useState(filtersJenis.searchJenis ?? '');
    const currentPage = new URLSearchParams(window.location.search).get('page') ?? '1';
    const currentPerPageKategori = new URLSearchParams(window.location.search).get('per_pageKategori') ?? '10';
    const currentPerPageJenis = new URLSearchParams(window.location.search).get('per_pageJenis') ?? '10';
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMobile = useIsMobile();
    const handleSearch = (val: string, type: 'jenis' | 'kategori') => {
        if (type === 'kategori') {
            setSearchKategori(val);

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                router.get(
                    route('project-config.index'),
                    { ...route().params, search: val, per_page: filtersKategori?.per_pageKategori },
                    { preserveState: true, replace: true },
                );
            }, 400);
        } else if (type === 'jenis') {
            setSearchKategori(val);

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                router.get(
                    route('project-config.index'),
                    { ...route().params, search: val, per_page: filtersJenis.per_pageJenis },
                    { preserveState: true, replace: true },
                );
            }, 400);
        }
    };

    const handlePageChange = (page: number, type: 'jenis' | 'kategori') => {
        if (type === 'jenis') {
            router.get(
                'project-config.index',
                { ...route().params, page, per_page: currentPerPageJenis },
                { preserveState: true, preserveScroll: true },
            );
        } else if (type === 'kategori') {
            router.get(
                'project-config.index',
                { ...route().params, page, per_page: currentPerPageKategori },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    const handlePageSizeChange = (perPage: number, type: 'jenis' | 'kategori') => {
        if (type === 'jenis') {
            router.get('project-config.index', { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
        } else if (type === 'kategori') {
            router.get('project-config.index', { ...route().params, page: 1, per_page: perPage }, { preserveState: true, preserveScroll: true });
        }
    };

    console.log('Props config: ', props);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proyek" />
            <MainTable
                columnTable={LIST_CATEGORY_COLUMNS}
                dataTable={list_kategori?.data as KategoriProyek[]}
                type={'KATEGORI'}
                handleSearch={function (val: string): void {
                    throw new Error('Function not implemented.');
                }}
                handlePageChange={function (page: number): void {
                    throw new Error('Function not implemented.');
                }}
                handlePageSizeChange={function (perPage: number): void {
                    throw new Error('Function not implemented.');
                }}
            />
        </AppLayout>
    );
};

export default ProjectConfigIndex;
