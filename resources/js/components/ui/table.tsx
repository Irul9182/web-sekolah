// components/ui/data-table.tsx

import { cn } from '@/lib/utils';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: SortDirection }) {
    if (direction === 'asc') return <ChevronUp className="text-primary h-3.5 w-3.5" />;
    if (direction === 'desc') return <ChevronDown className="text-primary h-3.5 w-3.5" />;
    return <ChevronsUpDown className="text-muted-foreground/50 group-hover:text-muted-foreground h-3.5 w-3.5 transition-colors" />;
}

function PageButton({
    onClick,
    disabled,
    active,
    children,
    className,
}: {
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1.5 text-sm transition-all duration-150',
                'disabled:cursor-not-allowed disabled:opacity-40',
                active
                    ? 'bg-primary text-primary-foreground font-medium shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_20%,transparent)]'
                    : 'text-foreground hover:bg-muted hover:border-border border border-transparent',
                className,
            )}
        >
            {children}
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    pageSize: initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    className,
    emptyMessage = 'No data available.',
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
        } else if (sortDir === 'asc') {
            setSortDir('desc');
        } else {
            setSortKey(null);
            setSortDir(null);
        }
        setCurrentPage(1);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortKey || !sortDir) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
    });

    // ── Pagination ──
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    const pageData = sortedData.slice(start, start + pageSize);

    const goTo = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

    // page numbers with ellipsis
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
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-border bg-muted/60 border-b">
                                {columns.map((col) => {
                                    const key = String(col.key);
                                    const isActive = sortKey === key;
                                    return (
                                        <th
                                            key={key}
                                            className={cn(
                                                'text-muted-foreground px-4 py-3 text-left font-medium select-none',
                                                col.sortable && 'group hover:text-foreground cursor-pointer transition-colors',
                                                col.className,
                                            )}
                                            onClick={() => col.sortable && handleSort(key)}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn(isActive && 'text-foreground')}>{col.label}</span>
                                                {col.sortable && <SortIcon direction={isActive ? sortDir : null} />}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: pageSize }).map((_, i) => (
                                    <tr key={i} className="border-border border-b last:border-0">
                                        {columns.map((col) => (
                                            <td key={String(col.key)} className="px-4 py-3">
                                                <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : pageData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-muted-foreground px-4 py-12 text-center text-[10px] sm:text-sm">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                pageData.map((row, rowIdx) => (
                                    <tr
                                        key={rowIdx}
                                        className="border-border hover:bg-muted/40 border-b transition-colors duration-100 last:border-0"
                                    >
                                        {columns.map((col) => {
                                            const key = String(col.key);
                                            const value = row[key];
                                            return (
                                                <td key={key} className={cn('text-foreground px-4 py-3', col.className)}>
                                                    {col.render ? col.render(value, row) : String(value ?? '—')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="text-muted-foreground flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-between">
                {/* Info + page size */}
                <div className="flex items-center gap-3">
                    <span>
                        {data.length === 0
                            ? 'Tidak ada hasil'
                            : `${start + 1}–${Math.min(start + pageSize, sortedData.length)} of ${sortedData.length}`}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs">Tampil Baris</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val) => {
                                setPageSize(Number(val));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="border-input bg-muted focus:ring-ring h-7 w-16 px-2 text-xs focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]">
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
                <div className="flex items-center gap-1">
                    <PageButton onClick={() => goTo(1)} disabled={safePage === 1}>
                        <ChevronsLeft className="h-4 w-4" />
                    </PageButton>
                    <PageButton onClick={() => goTo(safePage - 1)} disabled={safePage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </PageButton>

                    {pageNumbers.map((p, i) =>
                        p === '…' ? (
                            <span key={`ellipsis-${i}`} className="text-muted-foreground px-1">
                                …
                            </span>
                        ) : (
                            <PageButton key={p} active={p === safePage} onClick={() => goTo(Number(p))}>
                                {p}
                            </PageButton>
                        ),
                    )}

                    <PageButton onClick={() => goTo(safePage + 1)} disabled={safePage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </PageButton>
                    <PageButton onClick={() => goTo(totalPages)} disabled={safePage === totalPages}>
                        <ChevronsRight className="h-4 w-4" />
                    </PageButton>
                </div>
            </div>
        </div>
    );
}
