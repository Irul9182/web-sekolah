'use client';

import { Calendar } from '@/components/ui-shadcn/calendar';
import { Label } from '@/components/ui-shadcn/label';
import { Modal, ModalBody, ModalContent } from '@/components/ui-shadcn/modal';
import { cn } from '@/lib/utils';
import { format, formatDate } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppDatePickerProps {
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    value?: Date;
    defaultValue?: Date;
    onChange?: (date: Date | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    fromYear?: number;
    toYear?: number;
    className?: string;
    inputClassName?: string;
    dateFormat?: string;
    granularity?: 'day' | 'month';
}

// ─── Shared Calendar ──────────────────────────────────────────────────────────

interface SharedCalendarProps {
    value?: Date;
    onSelect: (date: Date | undefined) => void;
    fromYear: number;
    toYear: number;
}

function SharedCalendar({ value, onSelect, fromYear, toYear }: SharedCalendarProps) {
    return (
        <Calendar
            mode="single"
            selected={value}
            onSelect={onSelect}
            defaultMonth={value}
            locale={id}
            captionLayout="dropdown"
            fromYear={fromYear}
            toYear={toYear}
            initialFocus
        />
    );
}

// ─── Month Picker ─────────────────────────────────────────────────────────────

interface MonthPickerProps {
    value?: Date;
    onSelect: (date: Date | undefined) => void;
    fromYear: number;
    toYear: number;
}

function MonthPicker({ value, onSelect, fromYear, toYear }: MonthPickerProps) {
    const [viewYear, setViewYear] = React.useState(value?.getFullYear() ?? new Date().getFullYear());

    const MONTHS = Array.from({ length: 12 }, (_, i) => format(new Date(viewYear, i, 1), 'MMM', { locale: id }));

    return (
        <div className="flex flex-col gap-3 p-1">
            {/* ── Year navigation ── */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    disabled={viewYear <= fromYear}
                    onClick={() => setViewYear((y) => y - 1)}
                    className={cn(
                        'rounded-md p-1 transition-colors',
                        'text-muted-foreground hover:text-foreground hover:bg-accent',
                        'disabled:pointer-events-none disabled:opacity-40',
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="text-sm font-semibold">{viewYear}</span>

                <button
                    type="button"
                    disabled={viewYear >= toYear}
                    onClick={() => setViewYear((y) => y + 1)}
                    className={cn(
                        'rounded-md p-1 transition-colors',
                        'text-muted-foreground hover:text-foreground hover:bg-accent',
                        'disabled:pointer-events-none disabled:opacity-40',
                    )}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            {/* ── Month grid ── */}
            <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((name, i) => {
                    const isSelected = value && value.getMonth() === i && value.getFullYear() === viewYear;

                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelect(new Date(viewYear, i, 1))}
                            className={cn(
                                'rounded-md px-2 py-2 text-sm capitalize transition-colors',
                                isSelected ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-accent',
                            )}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

const AppDatePicker = ({
    label,
    hint,
    error,
    placeholder,
    value: valueProp,
    defaultValue,
    onChange,
    disabled,
    required,
    fromYear = 1900,
    toYear = new Date().getFullYear() + 10,
    className,
    inputClassName,
    dateFormat,
    granularity = 'day',
}: AppDatePickerProps) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue);

    const value = isControlled ? valueProp : internalValue;

    const [open, setOpen] = React.useState(false);
    const inputId = label?.toLowerCase().replace(/\s+/g, '-');

    // ── default placeholder & format per granularity ──
    const resolvedPlaceholder = placeholder ?? (granularity === 'month' ? 'MM/YYYY' : 'DD/MM/YYYY');
    const resolvedFormat = dateFormat ?? (granularity === 'month' ? 'MMMM yyyy' : 'dd/MM/yyyy');

    const displayValue = value ? formatDate(value, resolvedFormat, { locale: id }) : '';

    const handleSelect = (date: Date | undefined) => {
        if (!isControlled) setInternalValue(date);
        onChange?.(date);
        setOpen(false);
    };

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {/* ── Label ── */}
            {label && (
                <Label
                    htmlFor={inputId}
                    className={cn('ml-0.5 text-[12px] font-medium sm:text-sm', error && 'text-destructive', disabled && 'opacity-50')}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            {/* ── Input ── */}
            <div className="relative">
                <input
                    id={inputId}
                    type="text"
                    readOnly
                    value={displayValue}
                    placeholder={resolvedPlaceholder}
                    disabled={disabled}
                    onClick={() => !disabled && setOpen(true)}
                    className={cn(
                        'border-input bg-muted text-foreground flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-[10px] sm:text-sm',
                        'placeholder:text-muted-foreground transition-all duration-200',
                        'cursor-pointer select-none',
                        'focus:border-primary focus:bg-background focus:outline-none',
                        'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error && [
                            'border-destructive',
                            'focus:border-destructive',
                            'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--destructive)_20%,transparent)]',
                        ],
                        inputClassName,
                    )}
                />
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setOpen(true)}
                    className={cn(
                        'absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1',
                        'text-muted-foreground hover:text-foreground hover:bg-accent',
                        'transition-all duration-150',
                        'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)] focus:outline-none',
                        'disabled:pointer-events-none disabled:opacity-50',
                    )}
                >
                    <CalendarIcon className="h-4 w-4" />
                </button>
            </div>

            {/* ── Modal ── */}
            <Modal open={open} onOpenChange={setOpen}>
                <ModalContent size="sm" className="w-fit p-0">
                    <ModalBody className="flex items-center justify-center p-3">
                        {granularity === 'month' ? (
                            <MonthPicker value={value} onSelect={handleSelect} fromYear={fromYear} toYear={toYear} />
                        ) : (
                            <SharedCalendar value={value} onSelect={handleSelect} fromYear={fromYear} toYear={toYear} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* ── Hint / Error ── */}
            {(hint || error) && <p className={cn('ml-0.5 text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error ?? hint}</p>}
        </div>
    );
};

AppDatePicker.displayName = 'AppDatePicker';

export default AppDatePicker;
