interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthSimpleLayout({ children }: AuthLayoutProps) {
    return <div className="">{children}</div>;
}
