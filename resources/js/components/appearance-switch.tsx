import { useAppearance } from '@/hooks/use-appearance';

// Toggle switch ini sengaja disamakan persis (markup & class Tailwind-nya)
// dengan yang ada di app-sidebar-header.tsx (panel admin), supaya dark
// mode terasa satu sistem yang sama di halaman publik maupun admin —
// bukan komponen/gaya baru yang beda sendiri.
export default function AppearanceSwitch() {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <label className="relative inline-block h-8 w-14 cursor-pointer text-[17px]">
            <input type="checkbox" className="peer h-0 w-0 opacity-0" checked={isDark} onChange={() => updateAppearance(isDark ? 'light' : 'dark')} />
            <span className="border-border bg-background peer-checked:border-primary peer-checked:bg-primary absolute inset-0 rounded-[30px] border transition-all duration-[400ms] peer-focus:shadow-[0_0_1px_var(--ring)]"></span>
            <span className="bg-input peer-checked:bg-primary-foreground absolute bottom-[0.25em] left-[0.27em] h-[1.4em] w-[1.4em] rounded-[20px] transition-all duration-[400ms] peer-checked:translate-x-[1.4em]"></span>
        </label>
    );
}