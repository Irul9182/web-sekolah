import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface SelectOptionGroup {
    group: string;
    options: SelectOption[];
}

type SelectOptions = SelectOption[] | SelectOptionGroup[];

function isGrouped(options: SelectOptions): options is SelectOptionGroup[] {
    return options.length > 0 && 'group' in options[0];
}

interface AppSelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
    options: SelectOptions;
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    triggerClassName?: string;
}

const AppSelect = ({
    options,
    label,
    hint,
    error,
    placeholder = 'Pilih opsi...',
    triggerClassName,
    required,
    disabled,
    ...props
}: AppSelectProps) => {
    const id = label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <Label htmlFor={id} className={cn('ml-0.5 text-sm font-medium', error && 'text-destructive', disabled && 'opacity-50')}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            <Select disabled={disabled} required={required} {...props}>
                <SelectTrigger
                    id={id}
                    className={cn(
                        'bg-muted border-input focus:border-primary transition-all duration-200',
                        'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]',
                        'text-[10px] font-semibold focus:ring-0 focus:outline-none sm:text-sm',

                        error && [
                            'border-destructive',
                            'focus:border-destructive',
                            'focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--destructive)_20%,transparent)]',
                        ],
                        triggerClassName,
                    )}
                >
                    <SelectValue className="text-[10px] font-semibold sm:text-sm" placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {isGrouped(options)
                        ? options.map((group) => (
                              <SelectGroup key={group.group}>
                                  <SelectLabel className="text-[10px] font-semibold! sm:text-sm">{group.group}</SelectLabel>
                                  {group.options.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                                          {opt.label}
                                      </SelectItem>
                                  ))}
                              </SelectGroup>
                          ))
                        : (options as SelectOption[]).map((opt) => (
                              <SelectItem className="text-[10px] font-semibold! sm:text-sm" key={opt.value} value={opt.value} disabled={opt.disabled}>
                                  {opt.label}
                              </SelectItem>
                          ))}
                </SelectContent>
            </Select>

            {(hint || error) && <p className={cn('ml-0.5 text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error ?? hint}</p>}
        </div>
    );
};

AppSelect.displayName = 'AppSelect';

export default AppSelect;
