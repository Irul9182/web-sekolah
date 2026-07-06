export interface GaleriProps {
    id: number;
    judul: string;
    gambar: string | null;
    created_at: string;
}

export type GaleriPropsForm = {
    judul: string;
    gambar: File | null;
    existing_gambar: string | null;
};

export const initialGaleriValue: GaleriPropsForm = {
    judul: '',
    gambar: null,
    existing_gambar: null,
};
