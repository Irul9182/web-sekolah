import { z } from 'zod';
const COLUMN_LIST_ITEM = [{}];
const KATEGORI_DENGAN_ITEM = ['material', 'operasional', 'biaya_tak_terduga'];
const KATEGORI_LANGSUNG = ['jasa_tukang', 'mandor', 'staff_perpajakan', 'staff_entry_data'];
export const transaksiItemSchema = z.object({
    item_id: z.string().optional(),
    transaksi_id: z.string().optional(),
    tanggal: z.string().min(1, 'Tanggal wajib diisi'),
    nama_item: z.string().min(1, 'Nama  wajib diisi').max(255, 'Nama  maksimal 255 karakter'),
    satuan: z.string().min(1, 'Satuan wajib diisi').max(50, 'Satuan maksimal 50 karakter'),
    qty: z
        .string()
        .min(1, 'Kuantitas wajib diisi')
        .refine((val) => !isNaN(Number(val)), 'Kuantitas harus berupa angka')
        .refine((val) => Number(val) > 0, 'Kuantitas harus lebih dari 0'),
    harga_satuan: z
        .string()
        .min(1, 'Harga satuan wajib diisi')
        .refine((val) => !isNaN(Number(val)), 'Harga satuan harus berupa angka')
        .refine((val) => Number(val) >= 0, 'Harga satuan tidak boleh negatif'),
    subtotal: z.string().optional(),
    keterangan: z.string().max(500, 'Keterangan maksimal 500 karakter').optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type TransaksiItemFormSchema = z.infer<typeof transaksiItemSchema>;
export { COLUMN_LIST_ITEM, KATEGORI_DENGAN_ITEM, KATEGORI_LANGSUNG };
