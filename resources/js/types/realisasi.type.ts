import { TransaksiProps } from './transaction.type';

export interface RealisasiProps {
    jasa_tukang: KategoriAnggaran;
    material: KategoriAnggaran;
    mandor: KategoriAnggaran;
    staff_perpajakan: KategoriAnggaran;
    staff_entry_data: KategoriAnggaran;
    biaya_tak_terduga: KategoriAnggaran;
    operasional: KategoriAnggaran;
}

export interface KategoriAnggaran {
    rencana: number;
    aktual: number;
    items: TransaksiProps;
    selisih: number;
}
