import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ReactNode } from 'react';

interface PropTypes {
    openDisplay?: ReactNode;
    menuLabel?: string;
    menuItem?: ReactNode;
    isLabelCustom?: boolean;
    labelCustom?: ReactNode;
}

const AppDropdownMenu = ({ menuItem, menuLabel, openDisplay = 'open', isLabelCustom = false, labelCustom }: PropTypes) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{isLabelCustom ? <>{labelCustom}</> : <Button variant="outline">{openDisplay}</Button>}</DropdownMenuTrigger>
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
