// components/ui/app-select-search.tsx
'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui-shadcn/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-shadcn/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import * as React from 'react';
import { SelectOption, SelectOptionGroup, SelectTone } from './app-select';

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectOptions = SelectOption[] | SelectOptionGroup[];

function isGrouped(options: SelectOptions): options is SelectOptionGroup[] {
    return options.length > 0 && 'group' in options[0];
}

interface AppSelectSearchProps {
    options: SelectOptions;
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    required?: boolean;
    tone?: SelectTone;
    className?: string;
    triggerClassName?: string;

    // ── Async ──
    /** Aktifkan mode async — options diambil dari luar berdasarkan query */
    async?: boolean;
    /** Dipanggil setiap kali user mengetik di search box */
    onSearch?: (query: string) => void;
    /** Debounce delay dalam ms, default 400 */
    debounce?: number;
    /** Tampilkan loading spinner saat fetching */
    loading?: boolean;
}

// ─── Tone Styles ──────────────────────────────────────────────────────────────

const toneStyles: Record<SelectTone, React.CSSProperties> = {
    default: {
        '--tone-bg': 'var(--muted)',
        '--tone-border': 'var(--input)',
        '--tone-focus-border': 'var(--primary)',
        '--tone-ring': 'var(--primary)',
        '--tone-text': 'var(--foreground)',
        '--tone-placeholder': 'var(--muted-foreground)',
        '--tone-label': 'inherit',
        '--tone-hint': 'var(--muted-foreground)',
    } as React.CSSProperties,
    error: {
        '--tone-bg': 'color-mix(in srgb, var(--destructive) 12%, var(--background))',
        '--tone-border': 'var(--destructive)',
        '--tone-focus-border': 'var(--destructive)',
        '--tone-ring': 'var(--destructive)',
        '--tone-text': 'color-mix(in srgb, var(--destructive) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--destructive) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--destructive) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--destructive) 65%, var(--foreground))',
    } as React.CSSProperties,
    warning: {
        '--tone-bg': 'color-mix(in srgb, var(--color-warning) 12%, var(--background))',
        '--tone-border': 'var(--color-warning)',
        '--tone-focus-border': 'var(--color-warning)',
        '--tone-ring': 'var(--color-warning)',
        '--tone-text': 'color-mix(in srgb, var(--color-warning) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-warning) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-warning) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-warning) 65%, var(--foreground))',
    } as React.CSSProperties,
    success: {
        '--tone-bg': 'color-mix(in srgb, var(--color-success) 15%, var(--background))',
        '--tone-border': 'var(--color-success)',
        '--tone-focus-border': 'var(--color-success)',
        '--tone-ring': 'var(--color-success)',
        '--tone-text': 'color-mix(in srgb, var(--color-success) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-success) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-success) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-success) 65%, var(--foreground))',
    } as React.CSSProperties,
    info: {
        '--tone-bg': 'color-mix(in srgb, var(--color-info) 12%, var(--background))',
        '--tone-border': 'var(--color-info)',
        '--tone-focus-border': 'var(--color-info)',
        '--tone-ring': 'var(--color-info)',
        '--tone-text': 'color-mix(in srgb, var(--color-info) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-info) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-info) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-info) 65%, var(--foreground))',
    } as React.CSSProperties,
};

const AppSelectSearch = ({
    options,
    value: valueProp,
    onValueChange,
    defaultValue,
    label,
    hint,
    error,
    placeholder = 'Pilih opsi...',
    searchPlaceholder = 'Cari...',
    emptyMessage = 'Tidak ditemukan.',
    disabled,
    required,
    tone: toneProp = 'default',
    className,
    triggerClassName,
    async: isAsync = false,
    onSearch,
    debounce: debounceMs = 400,
    loading = false,
}: AppSelectSearchProps) => {
    const tone: SelectTone = error ? 'error' : toneProp;
    const message = error ?? hint;

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(defaultValue ?? '');
    const value = isControlled ? valueProp : internalValue;

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputId = label?.toLowerCase().replace(/\s+/g, '-');

    // ── reset query saat popover tutup ──
    React.useEffect(() => {
        if (!open) setQuery('');
    }, [open]);

    // ── handle search input ──
    const handleSearchChange = (val: string) => {
        setQuery(val);

        if (!isAsync || !onSearch) return;

        // debounce — batalkan timer sebelumnya
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(val);
        }, debounceMs);
    };

    // ── cleanup debounce ──
    React.useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const handleSelect = (selected: string) => {
        const next = selected === value ? '' : selected;
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
        setOpen(false);
    };

    const getLabel = (): string => {
        if (!value) return '';
        if (isGrouped(options)) {
            for (const group of options) {
                const found = group.options.find((o) => o.value === value);
                if (found) return found.label;
            }
        } else {
            const found = (options as SelectOption[]).find((o) => o.value === value);
            if (found) return found.label;
        }
        return value;
    };

    const renderOptions = () => {
        if (isGrouped(options)) {
            return options.map((group, i) => (
                <React.Fragment key={group.group}>
                    {i > 0 && <CommandSeparator />}
                    <CommandGroup heading={group.group}>
                        {group.options.map((opt) => (
                            <CommandItem
                                key={opt.value}
                                value={opt.label}
                                disabled={opt.disabled}
                                onSelect={() => handleSelect(opt.value)}
                                className="cursor-pointer text-xs font-semibold sm:text-sm"
                            >
                                <Check
                                    className={cn(
                                        'text-primary mr-2 h-4 w-4 shrink-0 transition-opacity',
                                        value === opt.value ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                {opt.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </React.Fragment>
            ));
        }

        return (
            <CommandGroup>
                {(options as SelectOption[]).map((opt) => (
                    <CommandItem
                        key={opt.value}
                        value={opt.label}
                        disabled={opt.disabled}
                        onSelect={() => handleSelect(opt.value)}
                        className="cursor-pointer text-xs font-semibold sm:text-sm"
                    >
                        <Check
                            className={cn('text-primary mr-2 h-4 w-4 shrink-0 transition-opacity', value === opt.value ? 'opacity-100' : 'opacity-0')}
                        />
                        {opt.label}
                    </CommandItem>
                ))}
            </CommandGroup>
        );
    };

    return (
        <div className={cn('flex flex-col gap-1.5', className)} style={toneStyles[tone]}>
            {label && (
                <Label
                    htmlFor={inputId}
                    className={cn('ml-0.5 text-sm font-medium transition-colors', disabled && 'opacity-50')}
                    style={{ color: 'var(--tone-label)' }}
                >
                    {label}
                    {required && (
                        <span className="ml-1" style={{ color: 'var(--destructive)' }}>
                            *
                        </span>
                    )}
                </Label>
            )}

            <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
                <PopoverTrigger asChild>
                    <button
                        id={inputId}
                        type="button"
                        disabled={disabled}
                        aria-expanded={open}
                        className={cn(
                            'flex h-10 w-full items-center justify-between rounded-md border px-3 py-2',
                            'text-xs font-semibold transition-all duration-200 sm:text-sm',
                            'cursor-pointer focus:ring-0 focus:outline-none',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            open && 'shadow-[0_0_0_3px_color-mix(in_srgb,var(--tone-ring)_25%,transparent)]',
                            triggerClassName,
                        )}
                        style={{
                            backgroundColor: 'var(--tone-bg)',
                            borderColor: open ? 'var(--tone-focus-border)' : 'var(--tone-border)',
                            color: value ? 'var(--tone-text)' : 'var(--tone-placeholder)',
                        }}
                    >
                        <span className="truncate">{getLabel() || placeholder}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    className="border-border w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    sideOffset={6}
                    avoidCollisions
                    collisionPadding={16}
                >
                    <Command
                        // mode async: matikan filter bawaan Command
                        // karena filtering sudah dilakukan di server
                        filter={isAsync ? () => 1 : undefined}
                    >
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={query}
                            onValueChange={handleSearchChange}
                            className="h-9 text-xs sm:text-sm"
                        />
                        <CommandList>
                            {/* Loading state */}
                            {loading ? (
                                <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-xs">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mencari...
                                </div>
                            ) : (
                                <>
                                    <CommandEmpty className="text-muted-foreground py-4 text-center text-xs sm:text-sm">
                                        {isAsync && query === '' ? 'Ketik untuk mencari...' : emptyMessage}
                                    </CommandEmpty>
                                    {renderOptions()}
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {message && (
                <p className="ml-0.5 text-xs" style={{ color: 'var(--tone-hint)' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

AppSelectSearch.displayName = 'AppSelectSearch';

export default AppSelectSearch;
