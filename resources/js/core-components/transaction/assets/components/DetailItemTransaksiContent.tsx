import DetailItem from '@/components/app-detail-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Empty, EmptyContent, EmptyHeader } from '@/components/ui-shadcn/empty';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/helpers/format';
import { useIsMobile } from '@/hooks/use-mobile';
import { KategoriTransaksi, TransaksiItem, TransaksiProps } from '@/types/transaction.type';
import { router } from '@inertiajs/react';
import { BadgeInfo, Plus, ShieldQuestion, SquarePen, Trash2 } from 'lucide-react';

interface PropTypes {
    kategoriTransaksi: KategoriTransaksi;
    // icon?: ReactNode;
    title?: string;
    itemValueList?: TransaksiItem[];
    itemValue?: TransaksiItem;
    transaksiValue?: TransaksiProps;
    openModal?: (id: string, type: 'update' | 'delete' | null) => void;
    closeModal?: () => void;
}

const DetailItemTransaksiContent = ({ kategoriTransaksi, title, itemValueList, transaksiValue, openModal, closeModal }: PropTypes) => {
    const isMobile = useIsMobile();
    const namaItem =
        kategoriTransaksi === 'biaya_tak_terduga'
            ? 'Barang/kegiatan'
            : kategoriTransaksi === 'material'
              ? 'Barang/Bahan'
              : kategoriTransaksi === 'operasional'
                ? 'Kegiatan/Pekerjaan'
                : '';

    const namaSatuan =
        kategoriTransaksi === 'biaya_tak_terduga'
            ? 'Jumlah biaya'
            : kategoriTransaksi === 'material'
              ? 'Harga Satuan'
              : kategoriTransaksi === 'operasional'
                ? 'Jumlah biaya'
                : '';
    return (
        <>
            {kategoriTransaksi === 'jasa_tukang' ||
            kategoriTransaksi === 'mandor' ||
            kategoriTransaksi === 'staff_entry_data' ||
            kategoriTransaksi === 'staff_perpajakan' ? (
                <></>
            ) : (
                <Card className="border-primary/20 bg-card mx-4 mt-0 mb-4 shadow-sm">
                    <CardHeader className="border-border flex flex-col items-start justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center sm:gap-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                                <div className="text-primary">
                                    <div className="text-primary">
                                        {kategoriTransaksi === 'biaya_tak_terduga' ? (
                                            <ShieldQuestion />
                                        ) : kategoriTransaksi === 'material' ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="lucide lucide-brick-wall-fire-icon lucide-brick-wall-fire"
                                            >
                                                <path d="M16 3v2.107" />
                                                <path d="M17 9c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 22 17a5 5 0 0 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C13 11.5 16 9 17 9" />
                                                <path d="M21 8.274V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.938" />
                                                <path d="M3 15h5.253" />
                                                <path d="M3 9h8.228" />
                                                <path d="M8 15v6" />
                                                <path d="M8 3v6" />
                                            </svg>
                                        ) : kategoriTransaksi === 'operasional' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12">
                                                <path
                                                    fill="currentColor"
                                                    d="M8 8H7v1H6v1h5V9h-1V8H9v1H8Zm0 0h1V4h2V3H4V1H3v2H0v2h2V4h1v2h1V4h4Zm-6 4h3V6H4v1H3V6H2Zm1-1v-1h1v1Zm0-2V8h1v1Zm0 0"
                                                />
                                            </svg>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-card-foreground text-sm font-bold sm:text-base">{title}</CardTitle>
                        </div>
                        <div className="bg-muted flex items-center gap-2 rounded-xl border px-4 py-2 text-[12px] font-semibold sm:text-sm">
                            <span>Total:</span>
                            <span className="font-semibold">{formatCurrency(transaksiValue?.jumlah)}</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex w-full flex-col items-center justify-center">
                        {itemValueList?.length === 0 ? (
                            <div>
                                <h4 className="text-foreground text-sm font-bold tracking-wide sm:text-base">Belum ada {namaItem} yang di beli</h4>

                                <Empty>
                                    <EmptyHeader>
                                        <BadgeInfo size={40} />
                                        {/* <EmptyTitle>No data</EmptyTitle> */}
                                    </EmptyHeader>
                                    <EmptyContent className="mt-2">
                                        <Button onClick={() => router.visit(`/transaction/${transaksiValue?.transaksi_id}/edit`)}>
                                            <Plus /> Tambah
                                        </Button>
                                    </EmptyContent>
                                </Empty>
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-center gap-3">
                                {itemValueList?.map((item, index) => (
                                    <div className="bg-muted-foreground w-full rounded-xl p-4" key={item?.item_id}>
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-muted text-sm font-bold tracking-wide sm:text-base">
                                                {index + 1}. {item?.nama_item}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    onClick={() => openModal?.(item?.item_id, 'update')}
                                                    className="bg-muted text-foreground cursor-pointer rounded-full p-1 transition-all hover:opacity-50 sm:p-2"
                                                >
                                                    <SquarePen size={isMobile ? 14 : 17} />
                                                </div>
                                                <div
                                                    onClick={() => openModal?.(item?.item_id, 'delete')}
                                                    className="bg-destructive text-foreground cursor-pointer rounded-full p-1 transition-all hover:opacity-50 sm:p-2"
                                                >
                                                    <Trash2 size={isMobile ? 14 : 17} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mx-auto w-full p-0">
                                            <DetailItem
                                                className="!border-white"
                                                labelClassName="text-muted! text-[10px] sm:text-sm"
                                                valueClassName="text-muted! text-[10px] sm:text-sm"
                                                label="Harga Satuan"
                                                value={formatCurrency(item?.harga_satuan)}
                                            />
                                            <DetailItem
                                                className="!border-white"
                                                labelClassName="text-muted! text-[10px] sm:text-sm"
                                                valueClassName="text-muted! text-[10px] sm:text-sm"
                                                label="Kuantitas"
                                                value={item?.qty !== undefined && item?.qty !== null ? Number(item.qty).toString() : ''}
                                            />
                                            <DetailItem
                                                className="!border-white"
                                                labelClassName="text-muted! text-[10px] sm:text-sm"
                                                valueClassName="text-muted! text-[10px] sm:text-sm"
                                                label="satuan"
                                                isStatus
                                                value={item?.satuan}
                                            />
                                            <DetailItem
                                                className="!border-white"
                                                labelClassName="text-muted! text-[10px] sm:text-sm"
                                                valueClassName="text-muted! text-[10px] sm:text-sm"
                                                label="Tanggal Transaksi"
                                                value={formatDate(item?.tanggal)}
                                            />
                                            <DetailItem
                                                className="!border-white"
                                                labelClassName="text-muted! text-[10px] sm:text-sm"
                                                valueClassName="text-muted! text-[10px] sm:text-sm"
                                                label="Terakhir di edit"
                                                value={formatDate(item?.updated_at)}
                                            />
                                            <DetailItem
                                                className="!border-white"
                                                labelClassName="text-muted! text-[10px] sm:text-sm"
                                                valueClassName="text-muted! text-[10px] sm:text-sm"
                                                label="Sub Total"
                                                value={formatCurrency(item?.subtotal)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default DetailItemTransaksiContent;
