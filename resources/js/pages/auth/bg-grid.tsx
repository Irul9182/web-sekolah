import GridMotion from '@/components/GridMotion';
import { useAppearance } from '@/hooks/use-appearance';
const items = [
    // Menggantikan 'Item 1'
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 1
    'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 2'
    'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 2
    'https://images.unsplash.com/photo-1504307651254-35680f356f27?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 4'
    'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 3
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 5'
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 4
    'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34e?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 7'
    'https://images.unsplash.com/photo-1535732820275-9c6ae184e207?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 5
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 8'
    'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 6
    'https://images.unsplash.com/photo-1517089152318-42ec560349c0?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 10'
    'https://images.unsplash.com/photo-1503594384566-461fe158e797?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 7
    'https://images.unsplash.com/photo-1485611417579-2470e6bd93ca?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 11'
    'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 8
    'https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=2000&auto=format&fit=crop',

    // Menggantikan 'Item 13'
    'https://images.unsplash.com/photo-1505384664871-332e67a07019?q=80&w=2000&auto=format&fit=crop',

    // Dari JSX 9
    'https://images.unsplash.com/photo-1497911130635-c49eb92f7c00?q=80&w=2000&auto=format&fit=crop',

    // Original Unsplash
    'https://images.unsplash.com/photo-1723403804231-f4e9b515fe9d?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',

    // Menggantikan 'Item 14'
    'https://images.unsplash.com/photo-1628189679261-2bc7eb481b95?q=80&w=2000&auto=format&fit=crop',
];
const BgGrid = () => {
    const { appearance } = useAppearance();

    const isDark = appearance === 'dark';
    return (
        <div className="fixed top-0 left-[-5] z-[-10] min-h-screen min-w-full">
            <GridMotion gradientColor={'#ddfafe'} items={items} />
        </div>
    );
};
export default BgGrid;
