import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui-shadcn/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui-shadcn/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronsLeft, ChevronsRight, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    className?: string;
    render?: (value: unknown, row: T) => React.ReactNode;
}

/** Meta pagination dari response API Laravel (format paginate()) */
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];

    // ── Server-side pagination (opsional) ──────────────────────────────────────
    // Jika diisi → mode server-side aktif; DataTable tidak melakukan slicing sendiri.
    pagination?: PaginationMeta;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;

    // ── Client-side (dipakai saat `pagination` tidak diisi) ───────────────────
    pageSize?: number;
    pageSizeOptions?: number[];

    className?: string;
    emptyMessage?: string;
    loading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRowValue(row: unknown, key: string): unknown {
    if (row !== null && typeof row === 'object') {
        return (row as Record<string, unknown>)[key];
    }
    return undefined;
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
    if (direction === 'asc') return <ChevronUp className="text-primary h-3.5 w-3.5" />;
    if (direction === 'desc') return <ChevronDown className="text-primary h-3.5 w-3.5" />;
    return <ChevronsUpDown className="text-muted-foreground/50 group-hover:text-muted-foreground h-3.5 w-3.5 transition-colors" />;
}

// ─── Data Table ───────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
    data,
    columns,
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    className,
    emptyMessage = 'Tidak ada data.',
    loading = false,
}: DataTableProps<T>) {
    // ── State (hanya dipakai saat client-side) ────────────────────────────────
    const [clientPage, setClientPage] = useState(1);
    const [clientPageSize, setClientPageSize] = useState(initialPageSize);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);

    const isServerSide = pagination !== undefined;

    // ── Derived pagination values ─────────────────────────────────────────────
    const currentPage = isServerSide ? pagination!.current_page : clientPage;
    const totalPages = isServerSide ? pagination!.last_page : Math.max(1, Math.ceil(data.length / clientPageSize));
    const pageSize = isServerSide ? pagination!.per_page : clientPageSize;
    const totalItems = isServerSide ? pagination!.total : data.length;
    const fromItem = isServerSide ? (pagination!.from ?? 0) : (clientPage - 1) * clientPageSize + 1;
    const toItem = isServerSide ? (pagination!.to ?? 0) : Math.min(clientPage * clientPageSize, data.length);

    // ── Sorting (hanya client-side) ───────────────────────────────────────────
    const handleSort = (key: string) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');
        } else if (sortDir === 'asc') setSortDir('desc');
        else {
            setSortKey(null);
            setSortDir(null);
        }
        if (!isServerSide) setClientPage(1);
    };

    const sortedData = isServerSide
        ? data // server sudah mengurutkan
        : [...data].sort((a, b) => {
              if (!sortKey || !sortDir) return 0;
              const aVal = String(getRowValue(a, sortKey) ?? '');
              const bVal = String(getRowValue(b, sortKey) ?? '');
              const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
              return sortDir === 'asc' ? cmp : -cmp;
          });

    // ── Slicing (hanya client-side) ───────────────────────────────────────────
    const pageData = isServerSide
        ? sortedData // server sudah memotong
        : sortedData.slice((clientPage - 1) * clientPageSize, clientPage * clientPageSize);

    // ── Navigation ────────────────────────────────────────────────────────────
    const goTo = (page: number) => {
        const safe = Math.max(1, Math.min(page, totalPages));
        if (isServerSide) {
            onPageChange?.(safe);
        } else {
            setClientPage(safe);
        }
    };

    const handlePageSizeChange = (val: string) => {
        const n = Number(val);
        if (isServerSide) {
            onPageSizeChange?.(n);
        } else {
            setClientPageSize(n);
            setClientPage(1);
        }
    };

    // ── Page number list ──────────────────────────────────────────────────────
    const pageNumbers: (number | '…')[] = (() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
        if (currentPage >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
    })();

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {/* ── Table ── */}
            <div className="border-border bg-card overflow-hidden rounded-xl border">
                <Table>
                    <TableHeader className="!bg-muted/60">
                        <TableRow className="border-border hover:bg-transparent">
                            {columns.map((col) => {
                                const key = String(col.key);
                                const isActive = sortKey === key;
                                return (
                                    <TableHead
                                        key={key}
                                        onClick={() => col.sortable && handleSort(key)}
                                        className={cn(
                                            'text-background bg-sidebar-accent-foreground p-4 font-semibold select-none',
                                            col.sortable && 'group hover:text-muted/80! cursor-pointer transition-colors',
                                            isActive && 'text-background',
                                            col.className,
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {col.label}
                                            {/* {col.sortable && <SortIcon direction={isActive ? sortDir : null} />} */}
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            Array.from({ length: pageSize }).map((_, i) => (
                                <TableRow key={i} className="border-border hover:bg-transparent">
                                    {columns.map((col) => (
                                        <TableCell key={String(col.key)}>
                                            <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : pageData.length === 0 ? (
                            <TableRow className="border-0 hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="text-muted-foreground py-12 text-center text-[10px] sm:text-sm">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageData.map((row, rowIdx) => (
                                <TableRow key={rowIdx} className="border-border hover:bg-muted/80! transition-colors duration-100">
                                    {columns.map((col) => {
                                        const key = String(col.key);
                                        const value = getRowValue(row, key);
                                        return (
                                            <TableCell key={key} className={cn('text-foreground', col.className)}>
                                                {col.render ? col.render(value, row) : String(value ?? '—')}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Footer ── */}
            <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
                {/* Info + page size */}
                <div className="flex items-center gap-3">
                    <span>{totalItems === 0 ? 'Tidak ada hasil' : `${fromItem}–${toItem} dari ${totalItems}`}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Tampil</span>
                        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="border-input bg-muted focus:border-primary h-7 w-16 px-2 text-xs focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)] focus:ring-0 focus:outline-none">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((n) => (
                                    <SelectItem key={n} value={String(n)} className="text-xs">
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Pagination */}
                <Pagination className="mx-0 w-fit">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => goTo(1)}
                                aria-disabled={currentPage === 1}
                                className={cn('h-8 w-8 cursor-pointer', currentPage === 1 && 'pointer-events-none opacity-40')}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => goTo(currentPage - 1)}
                                aria-disabled={currentPage === 1}
                                className={cn('h-8 cursor-pointer gap-1 px-2', currentPage === 1 && 'pointer-events-none opacity-40')}
                            />
                        </PaginationItem>

                        {pageNumbers.map((p, i) =>
                            p === '…' ? (
                                <PaginationItem key={`e-${i}`}>
                                    <PaginationEllipsis className="h-8 w-8" />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        onClick={() => goTo(Number(p))}
                                        isActive={p === currentPage}
                                        className={cn(
                                            'h-8 w-8 cursor-pointer',
                                            p === currentPage && 'shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_20%,transparent)]',
                                        )}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => goTo(currentPage + 1)}
                                aria-disabled={currentPage === totalPages}
                                className={cn('h-8 cursor-pointer gap-1 px-2', currentPage === totalPages && 'pointer-events-none opacity-40')}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink
                                onClick={() => goTo(totalPages)}
                                aria-disabled={currentPage === totalPages}
                                className={cn('h-8 w-8 cursor-pointer', currentPage === totalPages && 'pointer-events-none opacity-40')}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
