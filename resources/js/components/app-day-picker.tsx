// components/ui/app-date-picker.tsx
'use client';

import { Calendar } from '@/components/ui-shadcn/calendar';
import { Label } from '@/components/ui-shadcn/label';
import { Modal, ModalBody, ModalContent } from '@/components/ui-shadcn/modal';
import { cn } from '@/lib/utils';
import { format, isValid, parse } from 'date-fns';
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
    onChange?: (date: Date | undefined) => void;
    disabled?: boolean;
    required?: boolean;
    fromYear?: number;
    toYear?: number;
    className?: string;
    inputClassName?: string;
    dateFormat?: string;
}

// ─── Hook: deteksi mobile ─────────────────────────────────────────────────────

function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = React.useState(() => typeof window !== 'undefined' && window.innerWidth < breakpoint);

    React.useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);

    return isMobile;
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
    value,
    onChange,
    disabled,
    required,
    fromYear = 1900,
    toYear = new Date().getFullYear() + 10,
    className,
    inputClassName,
    dateFormat = 'dd/MM/yyyy',
}: AppDatePickerProps) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value ? format(value, dateFormat) : '');
    const isMobile = useIsMobile();
    const inputId = label?.toLowerCase().replace(/\s+/g, '-');

    React.useEffect(() => {
        setInputValue(value ? format(value, dateFormat) : '');
    }, [value, dateFormat]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        if (raw === '') {
            onChange?.(undefined);
            return;
        }
        const parsed = parse(raw, dateFormat, new Date());
        if (isValid(parsed)) onChange?.(parsed);
    };

    const handleDaySelect = (date: Date | undefined) => {
        onChange?.(date);
        setInputValue(date ? format(date, dateFormat) : '');
        setOpen(false);
    };

    // ── shared input ──
    const inputEl = (
        <input
            id={inputId}
            type="text"
            inputMode="numeric"
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled}
            onChange={handleInputChange}
            className={cn(
                'border-input bg-muted text-foreground flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-sm',
                'placeholder:text-muted-foreground transition-all duration-200',
                'focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none',
                'focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && [
                    'border-destructive',
                    'focus-visible:border-destructive',
                    'focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--destructive)_20%,transparent)]',
                ],
                inputClassName,
            )}
        />
    );

    const iconButton = (
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
    );

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {/* ── Label ── */}
            {label && (
                <Label htmlFor={inputId} className={cn('ml-0.5 text-sm font-medium', error && 'text-destructive', disabled && 'opacity-50')}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            {/* ── Mobile: Modal ── */}
            {isMobile ? (
                <>
                    <div className="relative">
                        {inputEl}
                        {iconButton}
                    </div>
                    <Modal open={open} onOpenChange={setOpen}>
                        <ModalContent size="sm" className="w-fit p-0">
                            <ModalBody className="flex items-center justify-center p-3">
                                <SharedCalendar value={value} onSelect={handleDaySelect} fromYear={fromYear} toYear={toYear} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </>
            ) : (
                /* ── Desktop: Popover ── */
                <>
                    <div className="relative">
                        {inputEl}
                        {iconButton}
                    </div>
                    <Modal open={open} onOpenChange={setOpen}>
                        <ModalContent size="sm" className="w-fit p-0">
                            <ModalBody className="flex items-center justify-center p-3">
                                <SharedCalendar value={value} onSelect={handleDaySelect} fromYear={fromYear} toYear={toYear} />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                </>
            )}

            {/* ── Hint / Error ── */}
            {(hint || error) && <p className={cn('ml-0.5 text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error ?? hint}</p>}
        </div>
    );
};

AppDatePicker.displayName = 'AppDatePicker';

export default AppDatePicker;
