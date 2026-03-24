// components/ui/app-date-picker.tsx
'use client';

import { Label } from '@/components/ui/label';
import { Modal, ModalBody, ModalContent } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { format, isValid, parse } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import 'react-day-picker/dist/style.css';

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
    format?: string;
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
    format: dateFormat = 'dd/MM/yyyy',
}: AppDatePickerProps) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value ? format(value, dateFormat) : '');
    const [month, setMonth] = React.useState<Date>(value ?? new Date());

    const inputId = label?.toLowerCase().replace(/\s+/g, '-');

    // sync external value → input
    React.useEffect(() => {
        setInputValue(value ? format(value, dateFormat) : '');
        if (value) setMonth(value);
    }, [value, dateFormat]);

    // ── Handle manual typing ──
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);

        if (raw === '') {
            onChange?.(undefined);
            return;
        }

        const parsed = parse(raw, dateFormat, new Date());
        if (isValid(parsed)) {
            onChange?.(parsed);
            setMonth(parsed);
        }
    };

    // ── Handle calendar select ──
    const handleDaySelect = (date: Date | undefined) => {
        onChange?.(date);
        setInputValue(date ? format(date, dateFormat) : '');
        if (date) setMonth(date);
        setOpen(false);
    };

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <Label htmlFor={inputId} className={cn('ml-0.5 text-sm font-medium', error && 'text-destructive', disabled && 'opacity-50')}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            {/* ── Input + Icon ── */}
            <div className="relative">
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
                        'placeholder:text-muted-foreground',
                        'transition-all duration-200',
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

            {(hint || error) && <p className={cn('ml-0.5 text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error ?? hint}</p>}

            {/* ── Calendar Modal ── */}
            <Modal open={open} onOpenChange={setOpen}>
                <ModalContent size="sm" hideClose className="w-fit p-0">
                    <ModalBody className="p-3">
                        <DayPicker
                            mode="single"
                            selected={value}
                            onSelect={handleDaySelect}
                            month={month}
                            onMonthChange={setMonth}
                            locale={id}
                            captionLayout="dropdown"
                            fromYear={fromYear}
                            toYear={toYear}
                            classNames={{
                                root: 'rdp-custom',
                                months: 'flex flex-col',
                                month: 'space-y-3',
                                caption: 'flex items-center justify-between px-1',
                                caption_label: 'text-sm font-medium text-foreground hidden',
                                caption_dropdowns: 'flex items-center gap-1.5',
                                dropdown: cn(
                                    'border-input bg-muted text-foreground h-8 rounded-md border px-2 text-sm',
                                    'focus:border-primary focus:outline-none',
                                    'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]',
                                    'cursor-pointer transition-all duration-200',
                                ),
                                dropdown_month: 'font-medium',
                                dropdown_year: 'font-medium',
                                nav: 'flex items-center gap-1',
                                nav_button: cn(
                                    'inline-flex h-8 w-8 items-center justify-center rounded-md',
                                    'text-muted-foreground hover:text-foreground hover:bg-muted',
                                    'transition-all duration-150',
                                    'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)] focus:outline-none',
                                ),
                                nav_button_previous: '',
                                nav_button_next: '',
                                table: 'w-full border-collapse',
                                head_row: 'flex',
                                head_cell: 'text-muted-foreground w-9 text-[0.75rem] font-medium text-center py-1',
                                row: 'flex w-full mt-1',
                                cell: cn(
                                    'relative h-9 w-9 p-0 text-center text-sm',
                                    '[&:has([aria-selected])]:bg-primary/10',
                                    '[&:has([aria-selected].day-outside)]:bg-transparent',
                                    'first:[&:has([aria-selected])]:rounded-l-md',
                                    'last:[&:has([aria-selected])]:rounded-r-md',
                                ),
                                day: cn(
                                    'h-9 w-9 rounded-md text-sm font-normal',
                                    'text-foreground hover:bg-muted',
                                    'transition-all duration-100',
                                    'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)] focus:outline-none',
                                    'aria-selected:opacity-100',
                                ),
                                day_selected:
                                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                                day_today: 'border border-primary text-primary font-medium',
                                day_outside: 'text-muted-foreground opacity-40',
                                day_disabled: 'text-muted-foreground opacity-30 cursor-not-allowed',
                                day_hidden: 'invisible',
                            }}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

AppDatePicker.displayName = 'AppDatePicker';

export default AppDatePicker;
