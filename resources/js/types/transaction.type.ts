import { ProyekProps } from './project.type';

export type TipeTransaksi = 'pemasukan' | 'pengeluaran';

export type KategoriTransaksi =
    | 'material'
    | 'operasional'
    | 'jasa_tukang'
    | 'mandor'
    | 'staff_perpajakan'
    | 'staff_entry_data'
    | 'biaya_tak_terduga'
    | '';

export interface TransaksiProps {
    [key: string]: any;
    transaksi_id: string;
    proyek_id: string;

    tipe: TipeTransaksi;
    kategori: KategoriTransaksi;

    persen?: number;

    jumlah: number | string;
    tanggal: string;

    keterangan?: string | null;

    proyek?: ProyekProps;

    created_at?: string | null;
    updated_at?: string | null;
}

export const initialTransaksi: TransaksiProps = {
    transaksi_id: '',
    proyek_id: '',

    tipe: 'pemasukan',
    kategori: 'material',

    jumlah: 0,
    tanggal: '',

    keterangan: '',

    created_at: null,
    updated_at: null,
};
