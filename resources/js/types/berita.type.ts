export interface BeritaProps {
    id: string;
    gambar: string;
    judul: string;
    isi: string;
    berita_image?: BeritaImage;
    status?: boolean;
    created_at?: string;
}

export type BeritaPropsForm = BeritaProps & {
    [key: string]: any;
    uploaded_image?: File;
    existing_image_id?: string;
};

export interface BeritaImage {
    id: string;
    berita_id: string;
    image_url: string;
    created_at?: string;
    updated_at?: string;
}

export const initialBeritaValue: BeritaPropsForm = {
    id: '',
    gambar: '',
    judul: '',
    isi: '',
    berita_image: undefined,
    created_at: '',
    uploaded_image: undefined,
    existing_image_id: '',
    status: false,
};
