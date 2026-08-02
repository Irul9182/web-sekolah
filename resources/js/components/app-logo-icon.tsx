import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src="/images/OIP.jpg" alt="Logo SMK Baidhaul Ahkam" {...props} className={`object-cover ${props.className ?? ''}`} />;
}