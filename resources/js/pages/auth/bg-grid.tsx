import GridMotion from '@/components/GridMotion';
import { useAppearance } from '@/hooks/use-appearance';
const items = [
    // Menggantikan 'Item 1'
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2000&auto=format&fit=crop',
    // '/images/anime-girl-kuli.png',
    '/images/construct-img-1.jpg',
    '/images/construct-img-2.jpg',
    '/images/construct-img-3.jpg',
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
