// components/ui/app-date-picker.tsx
'use client';

import { Calendar } from '@/components/ui-shadcn/calendar';
import { Label } from '@/components/ui-shadcn/label';
import { Modal, ModalBody, ModalContent } from '@/components/ui-shadcn/modal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppDatePickerProps {
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    value?: Date;
    defaultValue?: Date; // ← tambah
    onChange?: (date: Date | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    fromYear?: number;
    toYear?: number;
    className?: string;
    inputClassName?: string;
    dateFormat?: string;
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

// ─── Component ────────────────────────────────────────────────────────────────

const AppDatePicker = ({
    label,
    hint,
    error,
    placeholder = 'DD/MM/YYYY',
    value: valueProp,
    defaultValue,
    onChange,
    disabled,
    required,
    fromYear = 1900,
    toYear = new Date().getFullYear() + 10,
    className,
    inputClassName,
    dateFormat = 'dd/MM/yyyy',
}: AppDatePickerProps) => {
    // ── uncontrolled fallback: pakai internal state jika value tidak dipass ──
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<Date | undefined>(defaultValue);

    const value = isControlled ? valueProp : internalValue;

    const [open, setOpen] = React.useState(false);
    const inputId = label?.toLowerCase().replace(/\s+/g, '-');

    const displayValue = value ? format(value, dateFormat) : '';

    const handleDaySelect = (date: Date | undefined) => {
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
                    placeholder={placeholder}
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
                        <SharedCalendar value={value} onSelect={handleDaySelect} fromYear={fromYear} toYear={toYear} />
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
