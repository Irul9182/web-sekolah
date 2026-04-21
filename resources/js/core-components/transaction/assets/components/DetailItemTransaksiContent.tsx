import DetailItem from '@/components/app-detail-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-shadcn/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui-shadcn/empty';
import { formatCurrency, formatDate } from '@/helpers/format';
import { KategoriTransaksi, TransaksiItem } from '@/types/transaction.type';
import { ShieldQuestion } from 'lucide-react';
import { Button } from 'react-day-picker';

interface PropTypes {
    kategoriTransaksi: KategoriTransaksi;
    // icon?: ReactNode;
    title?: string;
    itemValueList?: TransaksiItem[];
    itemValue?: TransaksiItem;
}

const DetailItemTransaksiContent = ({ kategoriTransaksi, title, itemValue, itemValueList }: PropTypes) => {
    return (
        <>
            {kategoriTransaksi === 'jasa_tukang' ||
            kategoriTransaksi === 'mandor' ||
            kategoriTransaksi === 'staff_entry_data' ||
            kategoriTransaksi === 'staff_perpajakan' ? (
                <></>
            ) : (
                <Card className="border-primary/20 bg-card mx-4 mt-0 mb-4 shadow-sm">
                    <CardHeader className="border-border border-b pb-3">
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
                            <CardTitle className="text-card-foreground text-base font-bold">{title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex w-full flex-col items-center justify-center">
                        {itemValueList?.length === 0 ? (
                            <div>
                                <h4 className="text-foreground text-sm font-bold tracking-wide sm:text-base">Belum ada barang yang di beli</h4>

                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="M15 4v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8.739c.307.253.643.47 1 .654V12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5H9.975q.024-.247.025-.5q-.001-.253-.025-.5H14a2 2 0 0 0-2-2H9.393a5.5 5.5 0 0 0-.654-1H12a3 3 0 0 1 3 3M0 4.5a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0m1.5 0A.5.5 0 0 0 2 5h2v2a.5.5 0 0 0 1 0V5h2a.5.5 0 0 0 0-1H5V2a.5.5 0 0 0-1 0v2H2a.5.5 0 0 0-.5.5"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </EmptyMedia>
                                        <EmptyTitle>No data</EmptyTitle>
                                        <EmptyDescription>No data found</EmptyDescription>
                                    </EmptyHeader>
                                    <EmptyContent>
                                        <Button>Add data</Button>
                                    </EmptyContent>
                                </Empty>
                            </div>
                        ) : (
                            <div className="flex w-full flex-col items-center gap-3">
                                {itemValueList?.map((item, index) => (
                                    <div className="bg-muted-foreground w-full rounded-xl p-4" key={item?.item_id}>
                                        <h4 className="text-muted text-sm font-bold tracking-wide sm:text-base">
                                            {index + 1}. {item?.nama_item}
                                        </h4>
                                        <div className="mx-auto w-full p-0 sm:p-4">
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
                                                value={Number(item?.qty)}
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
                        {/* <>
                            {kategoriTransaksi === 'material' && (
                                <>
                                    {itemValueList?.length === 0 ? (
                                        <div>
                                            <h4 className="text-foreground text-sm font-bold tracking-wide sm:text-base">
                                                Belum ada barang yang di beli
                                            </h4>

                                            <Empty>
                                                <EmptyHeader>
                                                    <EmptyMedia variant="icon">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                                                            <path
                                                                fill="currentColor"
                                                                fillRule="evenodd"
                                                                d="M15 4v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8.739c.307.253.643.47 1 .654V12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5H9.975q.024-.247.025-.5q-.001-.253-.025-.5H14a2 2 0 0 0-2-2H9.393a5.5 5.5 0 0 0-.654-1H12a3 3 0 0 1 3 3M0 4.5a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0m1.5 0A.5.5 0 0 0 2 5h2v2a.5.5 0 0 0 1 0V5h2a.5.5 0 0 0 0-1H5V2a.5.5 0 0 0-1 0v2H2a.5.5 0 0 0-.5.5"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </EmptyMedia>
                                                    <EmptyTitle>No data</EmptyTitle>
                                                    <EmptyDescription>No data found</EmptyDescription>
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    <Button>Add data</Button>
                                                </EmptyContent>
                                            </Empty>
                                        </div>
                                    ) : (
                                        <div className="flex w-full flex-col items-center gap-3">
                                            {itemValueList?.map((item, index) => (
                                                <div className="bg-muted-foreground w-full rounded-xl p-4" key={item?.item_id}>
                                                    <h4 className="text-muted text-sm font-bold tracking-wide sm:text-base">
                                                        {index + 1}. {item?.nama_item}
                                                    </h4>
                                                    <div className="mx-auto w-full p-0 sm:p-4">
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
                                                            value={item?.qty}
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
                                </>
                            )}
                        </>

                        <>{kategoriTransaksi === 'biaya_tak_terduga' && <div>Biaya tak terduga</div>}</>
                        <>{kategoriTransaksi === 'operasional' && <div>List operasional yang dilakukan</div>}</> */}
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default DetailItemTransaksiContent;
