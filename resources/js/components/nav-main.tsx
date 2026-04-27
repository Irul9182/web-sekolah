import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui-shadcn/collapsible';
import { Icon } from './ui-shadcn/icon';
export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const page = usePage();
    const [openItems, setOpenItems] = useState<string[]>(() =>
        items.filter((item) => item.items?.some((sub) => sub.url === page.url)).map((item) => item.title),
    );
    const { open: isOpenSideBar } = useSidebar();

    // const [isOpenSideBar, setIsOpenSideBar] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar') !== 'false' : true));

    useEffect(() => {
        console.log('Sidebar open: ', isOpenSideBar);
    }, [isOpenSideBar]);
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const isAnySubActive = item.items?.some((sub) => sub.url === page.url);
                    const isOpen = openItems.includes(item.title) || !!isAnySubActive;

                    return (
                        <SidebarMenuItem key={item.title}>
                            {!item?.items ? (
                                <SidebarMenuButton asChild isActive={item.url === page.url}>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            ) : (
                                <Collapsible
                                    open={isOpen}
                                    onOpenChange={(open) => {
                                        if (open) {
                                            setOpenItems((prev) => [...prev, item.title]);
                                        } else {
                                            if (!isAnySubActive) {
                                                setOpenItems((prev) => prev.filter((i) => i !== item.title));
                                            }
                                        }
                                    }}
                                    className="flex flex-col gap-2"
                                >
                                    <CollapsibleTrigger className="cursor-pointer" asChild>
                                        <SidebarMenuButton
                                            onClick={() =>
                                                setOpenItems((prev) =>
                                                    prev.includes(item.title) ? prev.filter((i) => i !== item.title) : [...prev, item.title],
                                                )
                                            }
                                            isActive={isOpen}
                                        >
                                            <div className="flex cursor-pointer items-center gap-2">
                                                {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                <span>{item.title}</span>
                                            </div>
                                            <motion.div
                                                className="ml-auto"
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </motion.div>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent forceMount asChild>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key={item.title}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div className={`flex flex-col gap-2 pt-1 ${cn(isOpenSideBar ? 'pl-6' : 'pl-0')}`}>
                                                        {item.items?.map((sub) => (
                                                            <SidebarMenuButton key={sub.title} asChild isActive={sub.url === page.url}>
                                                                <Link href={sub.url} prefetch>
                                                                    {sub.icon && <sub.icon />}
                                                                    <span>{sub.title}</span>
                                                                </Link>
                                                            </SidebarMenuButton>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CollapsibleContent>
                                </Collapsible>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
