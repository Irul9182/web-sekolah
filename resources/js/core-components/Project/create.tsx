import AppDatePicker from '@/components/app-day-picker';
import AppInput from '@/components/app-input';
import AppSelect from '@/components/app-select';
import AppTextArea from '@/components/app-textare';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const ProjectCreateIndex = () => {
    const { props } = usePage();

    const projectId = props?.projectId ?? null;

    console.log('Id:', projectId);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: projectId !== null ? 'Ubah proyek' : 'Buat Proyek Baru',
            href: projectId !== null ? `project/${projectId}/edit` : 'project/create',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={projectId !== null ? 'Ubah proyek' : 'Buat Proyek Baru'} />
            <div className="grid grid-cols-1 items-center gap-4 p-4 sm:grid-cols-2">
                <AppInput placeholder="Masukkan nama proyek . . ." label="Nama Proyek" />
                <AppSelect
                    label="Tipe Proyek"
                    options={[
                        {
                            value: 'papping',
                            label: 'PAPPING',
                        },
                        {
                            value: 'u_ditch',
                            label: 'U-DITCH',
                        },
                        {
                            value: 'spall',
                            label: 'SPALL',
                        },
                        {
                            value: 'beton',
                            label: 'BETON',
                        },
                        {
                            value: 'sab',
                            label: 'SAB',
                        },
                    ]}
                />
                <AppInput type="number" placeholder="Masukkan total pagu . . ." label="Total Pagu (IDR)" />

                <AppDatePicker label="Dimulai pada" />
                <AppDatePicker label="Selesai pada" />

                <AppInput type="number" placeholder="Masukkan pajak . . ." label="Pajak (%)" />
                <AppInput type="number" placeholder="Masukkan uang bahan . . ." label="Uang Bahan (%)" />
                <AppInput placeholder="Masukkan nama client . . ." label="Nama Client" />
            </div>
            <div className="px-4">
                <AppTextArea placeholder="Masukkan deskripsi proyek . . ." label="Deskripsi" />
            </div>
        </AppLayout>
    );
};

export default ProjectCreateIndex;
