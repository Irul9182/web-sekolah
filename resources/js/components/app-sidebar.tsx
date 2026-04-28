import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { Blocks, ChartBar, Cog, LayoutGrid, Pickaxe, UtilityPoleIcon, Wallet, Wrench } from 'lucide-react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';

const mainNavItems: NavGroup[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Proyek',
        url: '/project',
        icon: Pickaxe,
    },
    {
        title: 'Transaksi',
        url: '/transaction',
        icon: Wallet,
    },
    {
        title: 'Cashflow',
        url: '/cashflow',
        icon: ChartBar,
    },
    {
        title: 'Forecasting',
        url: '/forecasting',
        icon: UtilityPoleIcon,
    },
    {
        title: 'Konfigurasi',
        url: '/config',
        icon: Cog,
        items: [
            {
                title: 'Kategori Proyek',
                url: '/config/project-config/category',
                icon: Blocks,
            },
            {
                title: 'Jenis Proyek',
                url: '/config/project-config/type',
                icon: Wrench,
            },
        ],
    },
];

const footerNavItems: NavGroup[] = [
    // {
    //     title: 'Konfigurasi',
    //     url: '/config',
    //     icon: Cog,
    //     items: [
    //         {
    //             title: 'Proyek',
    //             url: '/config/project',
    //             icon: Hammer,
    //         },
    //     ],
    // },
    // {
    //     title: 'Repository',
    //     url: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     url: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
