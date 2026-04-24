export interface KategoriProyek {
    id: number;
    nama: string;
    created_at?: string;
    updated_at?: string;
}

export const initialKategoriProyek: KategoriProyek = {
    id: 0,
    nama: '',
    created_at: undefined,
    updated_at: undefined,
};
