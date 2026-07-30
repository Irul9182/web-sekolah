export interface PengumumanProps {
    id: number;
    judul: string;
    deskripsi: string;
    tanggal: string;
    created_at: string;
}

export type PengumumanPropsForm = {
    judul: string;
    deskripsi: string;
    tanggal: string;
};

export const initialPengumumanValue: PengumumanPropsForm = {
    judul: '',
    deskripsi: '',
    tanggal: '',
};