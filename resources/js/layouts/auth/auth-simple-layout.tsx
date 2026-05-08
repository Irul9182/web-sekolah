import BgGrid from '@/pages/auth/bg-grid';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthSimpleLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-transparent p-6 md:p-10">
            <BgGrid />
            <div className="w-full max-w-sm">
                <div className="from-muted to-muted-foreground flex flex-col gap-8 rounded-xl bg-linear-to-r">{children}</div>
            </div>
        </div>
    );
}
