import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { BookImage, LayoutGrid, Megaphone, Newspaper, PersonStandingIcon, Pickaxe, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';

const mainNavItemsAffren: NavGroup[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Dosen',
        url: '/dosen',
        icon: PersonStandingIcon,
    },
    {
        title: 'Berita',
        url: '/berita',
        icon: Newspaper,
    },
    {
        title: 'Pengumuman',
        url: '/pengumuman',
        icon: Megaphone,
    },
    {
        title: 'Galeri',
        url: '/galeri',
        icon: BookImage,
    },
    // {
    //     title: 'Transaksi',
    //     url: '/transaction',
    //     icon: Wallet,
    // },
    // {
    //     title: 'Cashflow',
    //     url: '/cashflow',
    //     icon: ChartBar,
    // },
    // {
    //     title: 'Forecasting',
    //     url: '/forecasting',
    //     icon: ChartBar,
    // },
    // {
    //     title: 'Konfigurasi',
    //     url: '/config',
    //     icon: Cog,
    //     items: [
    //         {
    //             title: 'Kategori Proyek',
    //             url: '/config/project-config/category',
    //             icon: Blocks,
    //         },
    //         {
    //             title: 'Jenis Proyek',
    //             url: '/config/project-config/type',
    //             icon: Wrench,
    //         },
    //     ],
    // },
];

const mainNavItems2: NavGroup[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Test 2',
        url: '/project',
        icon: Pickaxe,
    },
    {
        title: 'Test 1',
        url: '/transaction',
        icon: Wallet,
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

interface NavHeaderProps {
    name: string;
    value: string;
    plan: string;
    key: string;
}

const navHeaderItems = [
    { key: 'affren_flow', name: 'AffrenFlow', value: 'personal', plan: 'Test' },
    { key: 'test_1', name: 'Test 1', value: 'acme', plan: 'Test' },
    { key: 'test_2', name: 'Test 2', value: 'monsters', plan: 'Test' },
];

export function AppSidebar() {
    const [activeWorkspace, setActiveWorkspace] = useState<NavHeaderProps>(() => {
        if (typeof window !== 'undefined') {
            const savedWorkspace = localStorage.getItem('activeWorkspace');
            if (savedWorkspace) {
                try {
                    return JSON.parse(savedWorkspace);
                } catch (error) {
                    console.error('Gagal membaca workspace dari localStorage', error);
                }
            }
        }
        // Fallback ke item pertama jika belum ada yang disimpan
        return navHeaderItems[0];
    });

    // 2. Simpan ke localStorage setiap kali activeWorkspace berubah
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeWorkspace', JSON.stringify(activeWorkspace));
        }
    }, [activeWorkspace]);
    let mainNav = activeWorkspace.key === 'affren_flow' ? mainNavItemsAffren : mainNavItems2;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <AppLogo />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNav} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
