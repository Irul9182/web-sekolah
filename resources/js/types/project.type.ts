export interface ProyekProps {
    proyek_id: string;

    nama_proyek: string;
    tipe_proyek: TipeProyek;

    pagu_total: number;

    tanggal_mulai: string;
    tangga_selesai?: string | null;

    pajak_persen: number;
    uang_bahan_persen: number;
    jasa_tukang_persen: number;

    biaya_staff_perpajakan: number;
    biaya_staff_entry_data: number;

    nama_klien: string;

    status: StatusProyek;

    deskripsi_proyek?: string | null;

    created_at?: string;
    updated_at?: string;
}

export type TipeProyek = 'papping' | 'u_ditch' | 'spall' | 'beton' | 'sab';

export type StatusProyek = 'sedang_berjalan' | 'selesai' | 'dibatalkan';
