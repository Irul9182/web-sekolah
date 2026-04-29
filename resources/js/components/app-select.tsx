import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Info } from 'lucide-react';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui-shadcn/tooltip';

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface SelectOptionGroup {
    group: string;
    options: SelectOption[];
}

export type SelectOptions = SelectOption[] | SelectOptionGroup[];

export type SelectTone = 'default' | 'error' | 'warning' | 'success' | 'info';

function isGrouped(options: SelectOptions): options is SelectOptionGroup[] {
    return options.length > 0 && 'group' in options[0];
}

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

    //-color-error: #e76f51 (light) / #e76f51 (dark — sama)
    error: {
        '--tone-bg': 'color-mix(in srgb, var(--color-error) 12%, var(--background))',
        '--tone-border': 'var(--color-error)',
        '--tone-focus-border': 'var(--color-error)',
        '--tone-ring': 'var(--color-error)',
        '--tone-text': 'color-mix(in srgb, var(--color-error) 80%, var(--foreground))',
        '--tone-placeholder': 'color-mix(in srgb, var(--color-error) 55%, var(--foreground))',
        '--tone-label': 'color-mix(in srgb, var(--color-error) 70%, var(--foreground))',
        '--tone-hint': 'color-mix(in srgb, var(--color-error) 65%, var(--foreground))',
    } as React.CSSProperties,

    // color-warning: #f4a261 (light) / #f4a261 (dark)
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

    // color-success: #52b788 (light) / #52b788 dark: chart-2 #52b788 — pakai color-success konsisten
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

    // color-info: #2a9d8f (light) / #3bbfb0 (dark)
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

// Icon components for each tone (rendered alongside hint/message)
const ToneIcon: React.FC<{ tone: SelectTone }> = ({ tone }) => {
    if (tone === 'default') return null;

    const iconMap: Record<Exclude<SelectTone, 'default'>, React.ReactNode> = {
        error: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M6 3.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
            </svg>
        ),
        warning: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1.5L11 10.5H1L6 1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                <path d="M6 5V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6" cy="9" r="0.6" fill="currentColor" />
            </svg>
        ),
        success: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M3.5 6L5.5 8L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        info: (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
                <path d="M6 5.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6" cy="3.5" r="0.6" fill="currentColor" />
            </svg>
        ),
    };

    return <span className="inline-flex items-center">{iconMap[tone]}</span>;
};

interface AppSelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
    options: SelectOptions;
    label?: string;
    hint?: string;
    tooltip?: string;
    /**
     * @deprecated Use `tone="error"` + `hint` instead.
     * Still supported for backward compatibility — when provided it forces tone="error".
     */
    error?: string;
    placeholder?: string;
    triggerClassName?: string;
    /** Visual tone of the select field. Defaults to "default". */
    tone?: SelectTone;
}

const AppSelect = ({
    options,
    label,
    tooltip,
    hint,
    error,
    placeholder = 'Pilih opsi...',
    triggerClassName,
    required,
    disabled,
    tone: toneProp = 'default',
    ...props
}: AppSelectProps) => {
    // Legacy `error` prop overrides tone
    const tone: SelectTone = error ? 'error' : toneProp;
    const message = error ?? hint;

    const id = label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5" style={toneStyles[tone]}>
            <div className="flex items-center gap-2">
                {label && (
                    <Label
                        htmlFor={id}
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
                {tooltip && (
                    <>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="animate-bounce cursor-pointer rounded-full">
                                    <Info size={17} />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                )}
            </div>
            <Select disabled={disabled} required={required} {...props}>
                <SelectTrigger
                    id={id}
                    className={cn(
                        'border font-semibold transition-all duration-200',
                        'focus:ring-0 focus:outline-none',
                        'cursor-pointer text-[10px] sm:text-sm',
                        triggerClassName,
                    )}
                    style={
                        {
                            backgroundColor: 'var(--tone-bg)',
                            borderColor: 'var(--tone-border)',
                            color: 'var(--tone-text)',
                            '--tw-ring-color': 'var(--tone-ring)',
                        } as React.CSSProperties
                    }
                    data-tone={tone}
                >
                    <SelectValue
                        className="text-[10px] font-semibold sm:text-sm [&>span]:text-[color:var(--tone-placeholder)]"
                        placeholder={placeholder}
                    />
                </SelectTrigger>

                <SelectContent>
                    {isGrouped(options)
                        ? options.map((group) => (
                              <SelectGroup key={group.group}>
                                  <SelectLabel className="text-[10px] sm:text-sm">{group.group}</SelectLabel>
                                  {group.options.map((opt) => (
                                      <SelectItem style={toneStyles[tone]} key={opt.value} value={opt.value} disabled={opt.disabled}>
                                          {opt.label}
                                      </SelectItem>
                                  ))}
                              </SelectGroup>
                          ))
                        : (options as SelectOption[]).map((opt) => (
                              <SelectItem
                                  style={toneStyles[tone]}
                                  className="cursor-pointer text-[10px] font-semibold sm:text-sm"
                                  key={opt.value}
                                  value={opt.value}
                                  disabled={opt.disabled}
                              >
                                  {opt.label}
                              </SelectItem>
                          ))}
                </SelectContent>
            </Select>

            {message && (
                <p className="ml-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--tone-hint)' }}>
                    <ToneIcon tone={tone} />
                    {message}
                </p>
            )}
        </div>
    );
};

AppSelect.displayName = 'AppSelect';

export default AppSelect;
