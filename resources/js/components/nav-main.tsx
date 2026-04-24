import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui-shadcn/collapsible';
import { Icon } from './ui-shadcn/icon';

export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const page = usePage();
    const [openItem, setOpenItem] = useState<string | null>(null);
    return (
        <SidebarGroup className="px-2 py-0">
            {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}

            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {!item?.items ? (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={item.url === page.url}>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ) : (
                            <Collapsible
                                open={openItem === item.title}
                                onOpenChange={() => setOpenItem(openItem === item.title ? null : item.title)}
                                className="flex flex-col gap-2"
                            >
                                <CollapsibleTrigger className="cursor-pointer" asChild>
                                    <SidebarMenuButton isActive={openItem === item?.title}>
                                        <div className="flex cursor-pointer items-center gap-2">
                                            {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                                    <div className="flex flex-col gap-2 pt-1 pl-6 transition-all">
                                        {item.items?.map((sub) => (
                                            <SidebarMenuButton asChild isActive={sub.url === page.url}>
                                                <Link href={sub.url} prefetch>
                                                    {sub.icon && <sub.icon />}
                                                    <span>{sub.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
