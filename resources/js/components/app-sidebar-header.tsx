import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <label className="relative inline-block h-8 w-14 cursor-pointer text-[17px]">
                    <input
                        type="checkbox"
                        className="peer h-0 w-0 opacity-0"
                        checked={isDark}
                        onChange={() => updateAppearance(isDark ? 'light' : 'dark')}
                    />
                    <span className="border-border bg-background peer-checked:border-primary peer-checked:bg-primary absolute inset-0 rounded-[30px] border transition-all duration-[400ms] peer-focus:shadow-[0_0_1px_var(--ring)]"></span>
                    <span className="bg-input peer-checked:bg-primary-foreground absolute bottom-[0.25em] left-[0.27em] h-[1.4em] w-[1.4em] rounded-[20px] transition-all duration-[400ms] peer-checked:translate-x-[1.4em]"></span>
                </label>
            </div>
        </header>
    );
}
