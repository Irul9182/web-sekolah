import { Icon } from '@/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui-shadcn/collapsible';

export function NavFooter({
    items,
    className,
    ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavGroup[];
}) {
    const [openItem, setOpenItem] = useState<string | null>(null);
    const page = usePage();
    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupContent>
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
                                        <SidebarMenuButton>
                                            <div className="flex cursor-pointer items-center gap-2">
                                                {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="flex flex-col gap-2 pl-6 transition-all">
                                        {item.items?.map((sub) => (
                                            <SidebarMenuButton asChild>
                                                <a href={sub.url} target="_blank" className="flex items-center gap-2" rel="noopener noreferrer">
                                                    {sub.icon && <Icon iconNode={sub.icon} className="h-5 w-5" />}
                                                    <span>{sub.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
