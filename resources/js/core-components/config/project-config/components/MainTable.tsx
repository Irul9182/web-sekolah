import AppSearchInput from '@/components/app-input-search';
import { Column, DataTable } from '@/components/app-table';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { PaginatedResponse } from '@/types/laravel.type';
import { Plus } from 'lucide-react';

interface PropTypes<T> {
    // dataTableKategori?: KategoriProyek[];
    // dataTableJenis?: JenisProyek[];
    // columnTableKategori?: Column<KategoriProyek>[];
    // columnTableJenis?: Column<JenisProyek>[];
    dataTable: T[];
    columnTable: Column<T>[];

    type: 'KATEGORI' | 'JENIS';
    handleSearch: (val: string) => void;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (perPage: number) => void;
    search?: string;
    response_list?: PaginatedResponse<T>;
}

const MainTable = <T extends object>({
    type,

    dataTable,
    columnTable,
    handlePageChange,
    handlePageSizeChange,
    search,
    response_list,
    handleSearch,
}: PropTypes<T>) => {
    const isMobile = useIsMobile();
    return (
        <div className="p-4">
            <div className="flex w-full justify-between">
                <AppSearchInput
                    placeholder="Cari transaksi dengan nama proyek . . ."
                    value={search}
                    className="w-84!"
                    onChange={(e) => handleSearch(e.target.value as string)}
                    clearable={false}
                />

                <Button
                    className="cursor-pointer"
                    // disabled={processing}
                    size={isMobile ? 'sm' : 'default'}
                    // onClick={() => router.visit('/transaction/create')}
                >
                    <Plus />
                    <p>Transaksi Baru</p>
                </Button>
            </div>
            <DataTable
                className="mt-4"
                emptyMessage="Tidak ada proyek saat ini"
                data={dataTable}
                columns={columnTable}
                key={dataTable?.length}
                pagination={{
                    current_page: response_list?.current_page as number,
                    last_page: response_list?.last_page as number,
                    per_page: response_list?.per_page as number,
                    total: response_list?.total as number,
                    from: response_list?.from as number,
                    to: response_list?.to as number,
                }}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    );
};

export default MainTable;
