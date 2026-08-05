export interface EkstrakulikulerImageProps {
    id: number;
    ekstrakulikuler_id: number;
    image_url: string;
}

export interface PrestasiProps {
    id: number;
    ekstrakulikuler_id: number;
    judul: string;
    tingkat: string | null;
    tahun: number;
    deskripsi: string | null;
}

export interface EkstrakulikulerProps {
    id: number;
    nama: string;
    slug: string;
    deskripsi: string;
    thumbnail: string | null;
    images: EkstrakulikulerImageProps[];
    prestasis: PrestasiProps[];
    prestasis_count?: number;
}

export interface EkstrakulikulerPropsForm {
    nama: string;
    deskripsi: string;
    thumbnail: File | null;
    existing_thumbnail: string | null;
    foto: File[];
    hapus_foto: number[];
    [key: string]: any;
}

export const initialEkstrakulikulerValue: EkstrakulikulerPropsForm = {
    nama: '',
    deskripsi: '',
    thumbnail: null,
    existing_thumbnail: null,
    foto: [],
    hapus_foto: [],
};

export interface PrestasiPropsForm {
    judul: string;
    tingkat: string;
    tahun: string;
    deskripsi: string;
    [key: string]: any;
}

export const initialPrestasiValue: PrestasiPropsForm = {
    judul: '',
    tingkat: '',
    tahun: '',
    deskripsi: '',
};