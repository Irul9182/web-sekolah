export interface BeritaImage {
    id: string;
    berita_id: string;
    image_url: string;
    public_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface BeritaProps {
    id: string;
    judul: string;
    isi: string;
    slug?: string;
    tanggal: string;
    berita_image?: BeritaImage | null;
    created_at: string;
}

export type BeritaPropsForm = BeritaProps & {
    [key: string]: any;
    uploaded_image?: File;
    existing_image?: string | null;
};

// Helper: format YYYY-MM-DD sesuai zona waktu lokal, bukan UTC (hindari off-by-one-day)
function getTodayLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().split('T')[0];
}

export const initialBeritaValue: BeritaPropsForm = {
    id: '',
    judul: '',
    isi: '',
    slug: '',
    tanggal: getTodayLocal(),
    berita_image: null,
    created_at: '',
    uploaded_image: undefined,
    existing_image: '',
};