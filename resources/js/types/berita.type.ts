export interface BeritaImage {
    id: string;
    berita_id: string;
    image_url: string;
    created_at?: string;
    updated_at?: string;
}

export interface BeritaProps {
    id: string;
    gambar: string;
    judul: string;
    isi: string;
    tanggal: string;
    berita_image?: BeritaImage;
    created_at?: string;
}

export type BeritaPropsForm = BeritaProps & {
    [key: string]: any;
    uploaded_image?: File;
    existing_image_id?: string;
};

function getTodayLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().split('T')[0];
}

export const initialBeritaValue: BeritaPropsForm = {
    id: '',
    gambar: '',
    judul: '',
    isi: '',
    tanggal: getTodayLocal(),
    berita_image: undefined,
    created_at: '',
    uploaded_image: undefined,
    existing_image_id: '',
};