import { Button } from '@/components/ui/button';
import { Modal, ModalBody, ModalClose, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { DataTable } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proyek',
        href: '/project',
    },
];

const ProjectIndex = () => {
    const [open, setIsOpen] = useState<boolean>(false);
    const isMobile = useIsMobile();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proyek" />
            <div className="p-4">
                <div className="flex w-full justify-end">
                    <Button className="cursor-pointer" size={isMobile ? 'sm' : 'default'} onClick={() => router.visit('/project/edit')}>
                        <Plus />
                        <p>Proyek Baru</p>
                    </Button>
                </div>
                <DataTable data={[]} columns={[]} className="mt-4" emptyMessage="Tidak ada proyek saat ini" />
            </div>
            <Modal open={open} onOpenChange={setIsOpen}>
                <ModalContent className="max-h-[90vh] max-w-[90%] overflow-y-scroll sm:max-w-[79%]">
                    <ModalHeader>
                        <ModalTitle>Tambah proyek baru</ModalTitle>
                    </ModalHeader>
                    <ModalBody></ModalBody>
                    <ModalFooter className="flex items-center gap-3">
                        <ModalClose asChild>
                            <Button variant={'secondary'} className="...">
                                Batal
                            </Button>
                        </ModalClose>
                        <Button className="..." onClick={() => setIsOpen(false)}>
                            Simpan
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AppLayout>
    );
};

export default ProjectIndex;
