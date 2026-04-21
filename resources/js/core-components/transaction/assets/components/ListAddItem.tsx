import AppDatePicker from '@/components/app-day-picker';
import AppInput from '@/components/app-input';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/helpers/format';
import { KategoriTransaksi, TransaksiItem } from '@/types/transaction.type';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
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
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                    <p className="text-sm font-medium">Daftar Item </p>
                    <span className="text-destructive ml-1 text-[8px] sm:text-[12px]">*</span>
                </div>
                <div className="flex items-center gap-4">
                    <span>
                        Sub Total:
                        <span className="ml-2 font-semibold text-blue-500">{formatCurrency(total)}</span>
                    </span>
                    <Button type="button" variant="default" size="sm" onClick={handleAdd} className="flex items-center gap-1">
                        <Plus size={14} />
                        Tambah Item
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-center gap-3">
                {/* <AnimatePresence initial={false}>
                    {safeItems?.map((item, index) => (
                        <motion.div
                            key={item?.item_id} 
                            layout
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.97 }}
                            transition={{
                                duration: 0.25,
                                delay: index * 0.06,
                                ease: 'easeOut',
                            }}
                            className="w-full rounded-xl border p-4"
                        >
                            <div className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-2">
                                <div className="flex w-full flex-col gap-3">
                                    <AppDatePicker
                                        placeholder="masukkan tanggal . . ."
                                        value={item.tanggal ? new Date(item.tanggal) : undefined}
                                        onChange={(e) => handleChange(index, 'tanggal', e ? formatDate(e.toDateString()) : '')}
                                        className="h-8 w-full"
                                    />
                                    {errors[`items.${index}.tanggal`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.tanggal`]}</p>
                                    )}
                                </div>
                                <div className="flex w-full flex-col gap-3">
                                    <AppInput
                                        type="text"
                                        value={item?.nama_item}
                                        onChange={(e) => handleChange(index, 'nama_item', e.target.value)}
                                        className="h-8 w-full"
                                    />
                                    {errors[`items.${index}.nama_item`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.nama_item`]}</p>
                                    )}
                                </div>
                                <div className="flex w-full flex-col gap-3">
                                    <AppInput
                                        type="text"
                                        value={item?.satuan}
                                        onChange={(e) => handleChange(index, 'satuan', e.target.value)}
                                        className="h-8 w-full"
                                    />
                                    {errors[`items.${index}.satuan`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.satuan`]}</p>
                                    )}
                                </div>
                                <div className="flex w-full flex-col gap-3">
                                    <AppInput
                                        type="number"
                                        value={item?.qty}
                                        onChange={(e) => handleChange(index, 'qty', e.target.value)}
                                        className="h-8 w-full"
                                    />
                                    {errors[`items.${index}.qty`] && <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.qty`]}</p>}
                                </div>
                                <div className="flex w-full flex-col gap-3">
                                    <AppInput
                                        type="number"
                                        value={item?.harga_satuan}
                                        onChange={(e) => handleChange(index, 'harga_satuan', e.target.value)}
                                        className="h-8 w-full"
                                    />
                                    {errors[`items.${index}.harga_satuan`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.harga_satuan`]}</p>
                                    )}
                                </div>
                                <div className="flex w-full flex-col gap-3">
                                    <AppInput
                                        type="text"
                                        value={item?.keterangan}
                                        onChange={(e) => handleChange(index, 'keterangan', e.target.value)}
                                        className="h-8 w-full"
                                    />
                                    {errors[`items.${index}.keterangan`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.keterangan`]}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-end">
                                <Button variant={'secondary'} onClick={() => handleRemove(index)} type="button">
                                    <Trash size={14} /> Hapus Item
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence> */}

                <AnimatePresence initial={false} mode="popLayout">
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
                                        />
                                        {errors[`items.${realIndex}.satuan`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.satuan`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            type="number"
                                            value={item?.qty}
                                            label="Kuantitas"
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
                                            inputClassName="h-8"
                                            value={item.tanggal ? new Date(item.tanggal) : undefined}
                                            onChange={(e) => handleChange(realIndex, 'tanggal', e ? formatDate(e.toDateString()) : '')}
                                            className="w-full"
                                        />
                                        {errors[`items.${realIndex}.tanggal`] && (
                                            <p className="text-destructive mt-1 text-xs">{errors[`items.${realIndex}.tanggal`]}</p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col gap-3">
                                        <AppInput
                                            type="number"
                                            label="Harga Satuan"
                                            value={item?.harga_satuan}
                                            onChange={(e) => handleChange(realIndex, 'harga_satuan', e.target.value)}
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
