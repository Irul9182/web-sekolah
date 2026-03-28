import { SelectTone } from './app-select';
import { Badge } from './ui-shadcn/badge';

type DetailItemProps = {
    label: string;
    value: string | number | undefined | null;
    isStatus?: boolean;
    toneStatus?: SelectTone;
};
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
const DetailItem: React.FC<DetailItemProps> = ({ label, value, isStatus = false, toneStatus = 'default' }) => {
    const tone: SelectTone = toneStatus;
    return (
        <div className="flex items-center justify-between border-b py-2 last:border-b-0">
            <span className="text-foreground font-semibold">{label}</span>
            {isStatus ? (
                <Badge
                    style={{
                        ...toneStyles[tone],
                        backgroundColor: 'var(--tone-bg)',
                        borderColor: 'var(--tone-border)',
                        color: 'var(--tone-text)',
                    }}
                    data-tone={tone}
                    className="border text-sm font-semibold"
                >
                    {value}
                </Badge>
            ) : (
                <span className="text-foreground">{value ?? '-'}</span>
            )}
        </div>
    );
};
export default DetailItem;
