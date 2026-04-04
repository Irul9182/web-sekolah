import { SelectTone } from './app-select';
import { Badge } from './ui-shadcn/badge';

type DetailItemProps = {
    label: string;
    value: string | number | undefined | null;
    isStatus?: boolean;
    toneStatus?: SelectTone;
};

/**
 * Tone styles menggunakan CSS custom properties dari tema aktif.
 * Kompatibel dengan light mode (cool blue-white) maupun dark mode (void black + cyber cyan).
 */
const toneStyles: Record<SelectTone, React.CSSProperties> = {
    default: {
        '--tone-bg': 'var(--muted)',
        '--tone-border': 'var(--border)',
        '--tone-text': 'var(--muted-foreground)',
    } as React.CSSProperties,

    error: {
        '--tone-bg': 'var(--color-error-bg)',
        '--tone-border': 'color-mix(in srgb, var(--color-error) 35%, transparent)',
        '--tone-text': 'var(--color-error)',
    } as React.CSSProperties,

    warning: {
        '--tone-bg': 'var(--color-warning-bg)',
        '--tone-border': 'color-mix(in srgb, var(--color-warning) 35%, transparent)',
        '--tone-text': 'var(--color-warning)',
    } as React.CSSProperties,

    success: {
        '--tone-bg': 'var(--color-success-bg)',
        '--tone-border': 'color-mix(in srgb, var(--color-success) 35%, transparent)',
        '--tone-text': 'var(--color-success)',
    } as React.CSSProperties,

    info: {
        '--tone-bg': 'var(--color-info-bg)',
        '--tone-border': 'color-mix(in srgb, var(--color-info) 35%, transparent)',
        '--tone-text': 'var(--color-info)',
    } as React.CSSProperties,
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value, isStatus = false, toneStatus = 'default' }) => {
    const tone: SelectTone = toneStatus;

    return (
        <div className="border-border flex items-center justify-between border-b py-2.5 last:border-b-0">
            <span className="text-foreground text-sm font-semibold">{label}</span>

            {isStatus ? (
                <Badge
                    style={{
                        ...toneStyles[tone],
                        backgroundColor: 'var(--tone-bg)',
                        borderColor: 'var(--tone-border)',
                        color: 'var(--tone-text)',
                    }}
                    data-tone={tone}
                    className="border px-2.5 py-0.5 text-xs font-semibold tracking-wide"
                >
                    {value}
                </Badge>
            ) : (
                <span className="text-foreground/80 text-sm">{value ?? '-'}</span>
            )}
        </div>
    );
};

export default DetailItem;
