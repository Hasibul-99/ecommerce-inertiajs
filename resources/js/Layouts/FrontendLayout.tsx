import { PropsWithChildren } from 'react';
import Header from '@/Components/Frontend/Header';
import Footer from '@/Components/Frontend/Footer';

interface FrontendLayoutProps extends PropsWithChildren {
    auth?: {
        user?: {
            name: string;
            email: string;
        };
    };
    cartCount?: number;
    wishlistCount?: number;
}

export default function FrontendLayout({
    children,
    auth,
    cartCount = 0,
    wishlistCount = 0
}: FrontendLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header auth={auth} cartCount={cartCount} wishlistCount={wishlistCount} />

            <main className="flex-1">
                {children}
            </main>

            <Footer />
        </div>
    );
}
