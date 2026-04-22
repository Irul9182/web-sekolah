import { Textarea } from '@/components/ui-shadcn/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface AppTextAreaProps extends React.ComponentProps<typeof Textarea> {
    label?: string;
    hint?: string;
    error?: string;
}

const AppTextArea = React.forwardRef<HTMLTextAreaElement, AppTextAreaProps>(({ label, hint, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <Label htmlFor={inputId} className={cn('ml-0.5 text-sm font-medium', error && 'text-destructive', props.disabled && 'opacity-50')}>
                    {label}
                    {props.required && <span className="text-destructive ml-1">*</span>}
                </Label>
            )}

            <Textarea
                ref={ref}
                id={inputId}
                className={cn(
                    'bg-muted border-input text-foreground min-h-[100px] resize-y text-[12px] sm:text-[16px]',
                    'placeholder:text-muted-foreground transition-all duration-200',
                    'focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none',
                    'focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_25%,transparent)]',
                    'focus-visible:ring-0',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    error && [
                        'border-destructive',
                        'focus-visible:border-destructive',
                        'focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--destructive)_20%,transparent)]',
                    ],
                    className,
                )}
                {...props}
            />

            {(hint || error) && <p className={cn('ml-0.5 text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>{error ?? hint}</p>}
        </div>
    );
});

AppTextArea.displayName = 'AppTextArea';

export default AppTextArea;
