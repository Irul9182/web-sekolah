import AppDatePicker from '@/components/app-day-picker';
import AppInput from '@/components/app-input';
import AppSelect from '@/components/app-select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyek Edit',
        href: '/project/edit',
    },
];
const ProjectEditIndex = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proyek Edit" />
            <div className="flex flex-col gap-4 p-4">
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
                <AppDatePicker />
                <AppInput type="date" placeholder="Masukkan tanggal dimulai . . ." label="Dimulai pada" />
                <AppInput type="date" placeholder="Masukkan tanggal selesai . . ." label="Selesai pada" />
                <AppInput type="number" placeholder="Masukkan pajak . . ." label="Pajak (%)" />
                <AppInput type="number" placeholder="Masukkan uang bahan . . ." label="Uang Bahan (%)" />
                <AppInput placeholder="Masukkan nama client . . ." label="Nama Client" />
                <AppInput placeholder="Masukkan deskripsi proyek . . ." label="Deskripsi" />
            </div>
        </AppLayout>
    );
};

export default ProjectEditIndex;
