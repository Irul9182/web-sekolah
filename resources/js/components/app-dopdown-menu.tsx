import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ReactNode } from 'react';

interface PropTypes {
    openDisplay?: ReactNode;
    menuLabel?: string;
    menuItem?: ReactNode;
}

const AppDropdownMenu = ({ menuItem, menuLabel, openDisplay = 'open' }: PropTypes) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary">{openDisplay}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {menuLabel && <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>}
                    {menuItem}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AppDropdownMenu;
