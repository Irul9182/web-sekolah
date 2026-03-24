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

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    pageSizeOptions?: number[];
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// cast row ke Record agar bisa akses dengan string key
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
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    className,
    emptyMessage = 'Tidak ada data.',
    loading = false,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDirection>(null);

    // ── Sorting ──
    const handleSort = (key: string) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');
        } else if (sortDir === 'asc') setSortDir('desc');
        else {
            setSortKey(null);
            setSortDir(null);
        }
        setCurrentPage(1);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey || !sortDir) return 0;
        const aVal = String(getRowValue(a, sortKey) ?? '');
        const bVal = String(getRowValue(b, sortKey) ?? '');
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
    });

    // ── Pagination ──
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    const pageData = sortedData.slice(start, start + pageSize);
    const goTo = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    const pageNumbers = (() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (safePage <= 4) return [1, 2, 3, 4, 5, '…', totalPages];
        if (safePage >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '…', safePage - 1, safePage, safePage + 1, '…', totalPages];
    })();

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {/* ── Table ── */}
            <div className="border-border bg-card overflow-hidden rounded-xl border">
                <Table>
                    <TableHeader className="bg-muted/60">
                        <TableRow className="border-border hover:bg-transparent">
                            {columns.map((col) => {
                                const key = String(col.key);
                                const isActive = sortKey === key;
                                return (
                                    <TableHead
                                        key={key}
                                        onClick={() => col.sortable && handleSort(key)}
                                        className={cn(
                                            'text-muted-foreground font-medium select-none',
                                            col.sortable && 'group hover:text-foreground cursor-pointer transition-colors',
                                            isActive && 'text-foreground',
                                            col.className,
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {col.label}
                                            {col.sortable && <SortIcon direction={isActive ? sortDir : null} />}
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
                                <TableRow key={rowIdx} className="border-border hover:bg-muted/40 transition-colors duration-100">
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
                    <span>
                        {data.length === 0
                            ? 'Tidak ada hasil'
                            : `${start + 1}–${Math.min(start + pageSize, sortedData.length)} dari ${sortedData.length}`}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Tampil</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val: string) => {
                                setPageSize(Number(val));
                                setCurrentPage(1);
                            }}
                        >
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
                                aria-disabled={safePage === 1}
                                className={cn('h-8 w-8 cursor-pointer', safePage === 1 && 'pointer-events-none opacity-40')}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => goTo(safePage - 1)}
                                aria-disabled={safePage === 1}
                                className={cn('h-8 cursor-pointer gap-1 px-2', safePage === 1 && 'pointer-events-none opacity-40')}
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
                                        isActive={p === safePage}
                                        className={cn(
                                            'h-8 w-8 cursor-pointer',
                                            p === safePage && 'shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_20%,transparent)]',
                                        )}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            ),
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => goTo(safePage + 1)}
                                aria-disabled={safePage === totalPages}
                                className={cn('h-8 cursor-pointer gap-1 px-2', safePage === totalPages && 'pointer-events-none opacity-40')}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink
                                onClick={() => goTo(totalPages)}
                                aria-disabled={safePage === totalPages}
                                className={cn('h-8 w-8 cursor-pointer', safePage === totalPages && 'pointer-events-none opacity-40')}
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
