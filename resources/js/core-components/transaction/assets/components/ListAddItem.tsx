import AppDatePicker from '@/components/app-day-picker';
import AppInput from '@/components/app-input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/helpers/format';
import { KategoriTransaksi, TransaksiItem } from '@/types/transaction.type';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeInfo, Plus, Trash2 } from 'lucide-react';
type ItemForm = Omit<TransaksiItem, 'transaksi_id' | 'created_at' | 'updated_at'>;
const defaultItem = (): ItemForm => ({
    tanggal: '',
    nama_item: '',
    satuan: '',
    qty: '',
    harga_satuan: '',
    subtotal: '0',
    keterangan: '',
    item_id: crypto.randomUUID(),
});
interface ItemTableProps {
    items: ItemForm[];
    errors: Record<string, string>;
    onChange: (items: ItemForm[]) => void;
    kategori?: KategoriTransaksi;
}
const ListAddItem = ({ items = [], errors, onChange, kategori }: ItemTableProps) => {
    const safeItems = Array.isArray(items) ? items : [];

    const handleAdd = () => {
        onChange([...safeItems, defaultItem()]);
    };

    const handleRemove = (index: number) => {
        onChange(safeItems.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof ItemForm, value: string) => {
        const updated = [...safeItems];
        updated[index] = { ...updated[index], [field]: value };

        const qty = parseFloat(updated[index].qty) || 0;
        const harga_satuan = parseFloat(updated[index].harga_satuan) || 0;
        updated[index].subtotal = String(qty * harga_satuan);

        onChange(updated);
    };

    const total = safeItems.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);

    const namaItem =
        kategori === 'biaya_tak_terduga'
            ? 'Barang/kegiatan'
            : kategori === 'material'
              ? 'Barang/Bahan'
              : kategori === 'operasional'
                ? 'Kegiatan/Pekerjaan'
                : '';

    const namaSatuan =
        kategori === 'biaya_tak_terduga'
            ? 'Biaya tiap satuan'
            : kategori === 'material'
              ? 'Harga Satuan'
              : kategori === 'operasional'
                ? 'Biaya tiap satuan'
                : '';

    return (
        <div>
            <div className="mb-3 flex items-baseline justify-between sm:items-center">
                <div className="flex items-center">
                    <p className="text-sm font-medium">Daftar Item </p>
                    <span className="text-destructive ml-1 text-[8px] sm:text-[12px]">*</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-muted hidden rounded-xl border px-4 py-2 text-[12px] sm:block sm:text-sm">
                        Sub Total:
                        <span className="ml-2 font-semibold text-blue-500">{formatCurrency(total)}</span>
                    </span>
                    <Button type="button" variant="default" size="sm" onClick={handleAdd} className="flex h-7 items-center gap-1 sm:h-10">
                        <Plus size={14} />
                        Tambah Item
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-center pb-2 sm:hidden">
                <span className="bg-muted rounded-xl border px-4 py-2 text-[12px]">
                    Sub Total:
                    <span className="ml-2 font-semibold text-blue-500">{formatCurrency(total)}</span>
                </span>
            </div>
            <div className="flex flex-col items-center gap-3">
                <AnimatePresence initial={false} mode="popLayout">
                    <>
                        {safeItems.length === 0 && (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.2 } }}
                                transition={{
                                    duration: 0.25,
                                    ease: 'easeOut',
                                }}
                                className="flex w-full flex-col items-center justify-center gap-[-10px] rounded-xl border p-4"
                            >
                                <BadgeInfo size={40} />
                                <span className="text-muted-foreground py-6 text-center">Belum ada {namaItem}. Klik Tambah untuk mulai.</span>
                            </motion.div>
                        )}
                    </>
                    {[...safeItems].reverse().map((item) => {
                        const realIndex = safeItems.findIndex((i) => i.item_id === item.item_id);
                        return (
                            <motion.div
                                key={item.item_id}
                                layout
                                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.2 } }}
                                transition={{
                                    duration: 0.25,
                                    ease: 'easeOut',
                                }}
                                className="w-full rounded-xl border p-4"
                            >
                                <div className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            type="text"
                                            placeholder={`Masukkan Nama ${namaItem} . . .`}
                                            label={
                                                kategori === 'biaya_tak_terduga'
                                                    ? 'Nama/Judul'
                                                    : kategori === 'operasional'
                                                      ? 'Nama kegiatan'
                                                      : kategori === 'material'
                                                        ? 'Nama Barang'
                                                        : ''
                                            }
                                            value={item?.nama_item}
                                            required
                                            onChange={(e) => handleChange(realIndex, 'nama_item', e.target.value)}
                                            className="h-8 w-full"
                                        />
                                        {errors[`items.${realIndex}.nama_item`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.nama_item`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            label="Satuan (hari, meter, m3, cm, dll)"
                                            required
                                            type="text"
                                            value={item?.satuan}
                                            onChange={(e) => handleChange(realIndex, 'satuan', e.target.value)}
                                            className="h-8 w-full"
                                            placeholder="Masukkan satuan . . ."
                                        />
                                        {errors[`items.${realIndex}.satuan`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.satuan`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            type="number"
                                            value={item?.qty !== undefined && item?.qty !== null ? Number(item.qty).toString() : ''}
                                            label="Kuantitas"
                                            required
                                            placeholder="Masukkan kuantitas . . ."
                                            onChange={(e) => handleChange(realIndex, 'qty', e.target.value)}
                                            className="h-8 w-full"
                                        />
                                        {errors[`items.${realIndex}.qty`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.qty`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppDatePicker
                                            label="Tanggal Transaksi"
                                            required
                                            placeholder="Masukkan tanggal . . . "
                                            inputClassName="h-8"
                                            value={item.tanggal ? new Date(item.tanggal) : undefined}
                                            onChange={(e) => handleChange(realIndex, 'tanggal', e ? format(e, 'yyyy-MM-dd') : '')}
                                            className="w-full"
                                        />
                                        {errors[`items.${realIndex}.tanggal`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.tanggal`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            type="number"
                                            label={namaSatuan}
                                            placeholder={`Masukkan ${namaSatuan} . . .`}
                                            value={item?.harga_satuan}
                                            onChange={(e) => handleChange(realIndex, 'harga_satuan', e.target.value)}
                                            required
                                            className="h-8 w-full"
                                        />
                                        {errors[`items.${realIndex}.harga_satuan`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.harga_satuan`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            type="text"
                                            value={item?.keterangan}
                                            label="Keterangan"
                                            onChange={(e) => handleChange(realIndex, 'keterangan', e.target.value)}
                                            placeholder="Masukkan keterangan . . ."
                                            className="h-8 w-full"
                                        />
                                        {errors[`items.${realIndex}.keterangan`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.keterangan`]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleRemove(realIndex)}
                                        type="button"
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={14} /> Hapus
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ListAddItem;
