import { PropsWithChildren } from 'react';
import Header from '@/Components/Frontend/Header';
import Footer from '@/Components/Frontend/Footer';
import { CartWishlistProvider } from '@/Contexts/CartWishlistContext';
import { Toaster } from 'sonner';

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
        <CartWishlistProvider initialCartCount={cartCount} initialWishlistCount={wishlistCount}>
            <div className="min-h-screen flex flex-col">
                <Header auth={auth} />

                <main className="flex-1">
                    {children}
                </main>

                <Footer />

                {/* Toast notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#fff',
                            color: '#4b5966',
                            border: '1px solid #eeeeee',
                        },
                        className: 'sonner-toast',
                    }}
                />
            </div>
        </CartWishlistProvider>
    );
}
