export interface GaleriProps {
    id: string;
    judul: string;
    galeri_image?: GaleriImage;
    created_at: string;
}

export interface GaleriImage {
    id: string;
    galeri_id: string;
    image_url: string;
    created_at?: string;
    updated_at?: string;
}

export type GaleriPropsForm = GaleriProps & {
    [key: string]: any;
    uploaded_image?: File;
    existing_image_id?: string;
};

export const initialGaleriValue: GaleriPropsForm = {
    id: '',
    gambar: '',
    judul: '',
    isi: '',
    created_at: '',
    uploaded_image: undefined,
    existing_image_id: '',
};
