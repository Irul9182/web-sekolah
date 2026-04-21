import { Button } from '@/components/ui-shadcn/button';
import { Input } from '@/components/ui-shadcn/input';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui-shadcn/table';
import { Button as ButtonBig } from '@/components/ui/button';
import { KategoriTransaksi, TransaksiItem } from '@/types/transaction.type';
import { Plus, Trash2 } from 'lucide-react';
type ItemForm = Omit<TransaksiItem, 'item_id' | 'transaksi_id' | 'created_at' | 'updated_at'>;

const defaultItem = (): ItemForm => ({
    tanggal: '',
    nama_item: '',
    satuan: '',
    qty: '',
    harga_satuan: '',
    subtotal: '0',
    keterangan: '',
});

const formatRupiah = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value);

interface ItemTableProps {
    items: ItemForm[];
    errors: Record<string, string>;
    onChange: (items: ItemForm[]) => void;
    kategori?: KategoriTransaksi;
}

export default function ItemTable({ items = [], errors, onChange }: ItemTableProps) {
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
        <div className="space-y-0">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                    <p className="text-sm font-medium">Daftar Item </p>
                    <span className="text-destructive ml-1 text-[8px] sm:text-[12px]">*</span>
                </div>
                <ButtonBig type="button" variant="default" size="sm" onClick={handleAdd} className="flex items-center gap-1">
                    <Plus size={14} />
                    Tambah Item
                </ButtonBig>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader className="bg-foreground">
                        <TableRow className="p-4!">
                            <TableHead className="text-muted! font-semibold">Tanggal</TableHead>
                            <TableHead className="text-muted! font-semibold">Nama Item</TableHead>
                            <TableHead className="text-muted! font-semibold">Satuan</TableHead>
                            <TableHead className="text-muted! font-semibold">Qty</TableHead>
                            <TableHead className="text-muted! font-semibold">Harga Satuan</TableHead>
                            <TableHead className="text-muted! font-semibold">Subtotal</TableHead>
                            <TableHead className="text-muted! font-semibold">Keterangan</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {safeItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-muted-foreground py-6 text-center">
                                    Belum ada item. Klik "Tambah Item" untuk mulai.
                                </TableCell>
                            </TableRow>
                        )}

                        {safeItems.map((item, index) => (
                            <TableRow key={index}>
                                {/* Tanggal */}
                                <TableCell>
                                    <Input
                                        type="date"
                                        value={item.tanggal}
                                        onChange={(e) => handleChange(index, 'tanggal', e.target.value)}
                                        className="w-36"
                                    />
                                    {errors[`items.${index}.tanggal`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.tanggal`]}</p>
                                    )}
                                </TableCell>

                                {/* Nama Item */}
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={item.nama_item}
                                        onChange={(e) => handleChange(index, 'nama_item', e.target.value)}
                                        placeholder="Nama item..."
                                        className="w-40"
                                    />
                                    {errors[`items.${index}.nama_item`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.nama_item`]}</p>
                                    )}
                                </TableCell>

                                {/* Satuan */}
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={item.satuan}
                                        onChange={(e) => handleChange(index, 'satuan', e.target.value)}
                                        placeholder="sak, m3..."
                                        className="w-20"
                                    />
                                </TableCell>

                                {/* Qty */}
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => handleChange(index, 'qty', e.target.value)}
                                        placeholder="0"
                                        min={0}
                                        className="w-20"
                                    />
                                    {errors[`items.${index}.qty`] && <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.qty`]}</p>}
                                </TableCell>

                                {/* Harga Satuan */}
                                <TableCell>
                                    <Input
                                        type="number"
                                        value={item.harga_satuan}
                                        onChange={(e) => handleChange(index, 'harga_satuan', e.target.value)}
                                        placeholder="0"
                                        min={0}
                                        className="w-32"
                                    />
                                    {errors[`items.${index}.harga_satuan`] && (
                                        <p className="text-destructive mt-1 text-xs">{errors[`items.${index}.harga_satuan`]}</p>
                                    )}
                                </TableCell>

                                {/* Subtotal — readonly */}
                                <TableCell>
                                    <span className="text-sm font-medium">{formatRupiah(parseFloat(item.subtotal) || 0)}</span>
                                </TableCell>

                                {/* Keterangan */}
                                <TableCell>
                                    <Input
                                        type="text"
                                        value={item.keterangan}
                                        onChange={(e) => handleChange(index, 'keterangan', e.target.value)}
                                        placeholder="Opsional..."
                                        className="w-36"
                                    />
                                </TableCell>

                                {/* Hapus */}
                                <TableCell>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(index)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    {/* Footer total */}
                    {safeItems.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} className="text-right font-medium">
                                    Total
                                </TableCell>
                                <TableCell className="font-semibold">{formatRupiah(total)}</TableCell>
                                <TableCell colSpan={2} />
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>

            {errors['items'] && <p className="text-destructive text-xs">{errors['items']}</p>}
        </div>
    );
}
