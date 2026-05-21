import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { Blocks, ChartBar, ChevronsUpDown, Cog, LayoutGrid, Pickaxe, Plus, Wallet, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';
import { NavFooter } from './nav-footer';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui-shadcn/dropdown-menu';

const mainNavItemsAffren: NavGroup[] = [
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
    // {
    //     title: 'Cashflow',
    //     url: '/cashflow',
    //     icon: ChartBar,
    // },
    {
        title: 'Forecasting',
        url: '/forecasting',
        icon: ChartBar,
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
                        {/* <SidebarMenuButton size="lg" asChild>
                            <div>
                                <AppLogo />
                            </div>
                        </SidebarMenuButton> */}
                        <DropdownMenu>
                            {/* Trigger Dropdown menggunakan SidebarMenuButton */}
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <AppLogo />
                                    </div>

                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{activeWorkspace.name}</span>
                                        <span className="truncate text-xs">{activeWorkspace.plan}</span>
                                    </div>

                                    {/* Ikon panah atas-bawah untuk indikator dropdown */}
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            {/* Isi Dropdown */}
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                align="start"
                                side="bottom"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="text-muted-foreground text-xs">Workspaces</DropdownMenuLabel>

                                {navHeaderItems.map((item) => (
                                    <DropdownMenuItem key={item.value} onClick={() => setActiveWorkspace(item)} className="cursor-pointer gap-2 p-2">
                                        {/* Anda bisa menambahkan logo spesifik per item di sini jika ada */}
                                        <div className="flex size-6 items-center justify-center rounded-sm border">{item.name.charAt(0)}</div>
                                        {item.name}
                                    </DropdownMenuItem>
                                ))}

                                <DropdownMenuSeparator />

                                {/* Opsi tambahan (opsional) */}
                                <DropdownMenuItem className="cursor-pointer gap-2 p-2">
                                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                        <Plus className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground font-medium">Add Workspace</div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
