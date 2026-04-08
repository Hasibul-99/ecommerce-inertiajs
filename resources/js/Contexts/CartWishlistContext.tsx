import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { router } from '@inertiajs/react';

interface CartWishlistContextType {
    cartCount: number;
    wishlistCount: number;
    setCartCount: (count: number) => void;
    setWishlistCount: (count: number) => void;
    incrementCart: () => void;
    decrementCart: () => void;
    incrementWishlist: () => void;
    decrementWishlist: () => void;
    addToCart: (productId: number, quantity?: number, variantId?: number) => Promise<void>;
    addToWishlist: (productId: number) => Promise<void>;
    removeFromCart: (itemId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    isAddingToCart: boolean;
    isAddingToWishlist: boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(undefined);

interface CartWishlistProviderProps {
    children: ReactNode;
    initialCartCount?: number;
    initialWishlistCount?: number;
}

export const CartWishlistProvider: React.FC<CartWishlistProviderProps> = ({
    children,
    initialCartCount = 0,
    initialWishlistCount = 0,
}) => {
    const [cartCount, setCartCount] = useState(initialCartCount);
    const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    const incrementCart = useCallback(() => {
        setCartCount((prev) => prev + 1);
    }, []);

    const decrementCart = useCallback(() => {
        setCartCount((prev) => Math.max(0, prev - 1));
    }, []);

    const incrementWishlist = useCallback(() => {
        setWishlistCount((prev) => prev + 1);
    }, []);

    const decrementWishlist = useCallback(() => {
        setWishlistCount((prev) => Math.max(0, prev - 1));
    }, []);

    const addToCart = useCallback(
        async (productId: number, quantity: number = 1, variantId?: number) => {
            setIsAddingToCart(true);

            return new Promise<void>((resolve, reject) => {
                router.post(
                    '/cart/add',
                    {
                        product_id: productId,
                        quantity: quantity,
                        variant_id: variantId,
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            incrementCart();
                            resolve();
                        },
                        onError: (errors) => {
                            console.error('Failed to add to cart:', errors);
                            reject(new Error('Failed to add to cart'));
                        },
                        onFinish: () => {
                            setIsAddingToCart(false);
                        },
                    }
                );
            });
        },
        [incrementCart]
    );

    const addToWishlist = useCallback(
        async (productId: number) => {
            setIsAddingToWishlist(true);

            return new Promise<void>((resolve, reject) => {
                router.post(
                    '/wishlist/add',
                    {
                        product_id: productId,
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            incrementWishlist();
                            resolve();
                        },
                        onError: (errors) => {
                            console.error('Failed to add to wishlist:', errors);
                            reject(new Error('Failed to add to wishlist'));
                        },
                        onFinish: () => {
                            setIsAddingToWishlist(false);
                        },
                    }
                );
            });
        },
        [incrementWishlist]
    );

    const removeFromCart = useCallback(
        async (itemId: number) => {
            return new Promise<void>((resolve, reject) => {
                router.delete(`/cart/${itemId}`, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        decrementCart();
                        resolve();
                    },
                    onError: (errors) => {
                        console.error('Failed to remove from cart:', errors);
                        reject(new Error('Failed to remove from cart'));
                    },
                });
            });
        },
        [decrementCart]
    );

    const removeFromWishlist = useCallback(
        async (productId: number) => {
            return new Promise<void>((resolve, reject) => {
                router.delete(`/wishlist/${productId}`, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        decrementWishlist();
                        resolve();
                    },
                    onError: (errors) => {
                        console.error('Failed to remove from wishlist:', errors);
                        reject(new Error('Failed to remove from wishlist'));
                    },
                });
            });
        },
        [decrementWishlist]
    );

    const value: CartWishlistContextType = {
        cartCount,
        wishlistCount,
        setCartCount,
        setWishlistCount,
        incrementCart,
        decrementCart,
        incrementWishlist,
        decrementWishlist,
        addToCart,
        addToWishlist,
        removeFromCart,
        removeFromWishlist,
        isAddingToCart,
        isAddingToWishlist,
    };

    return (
        <CartWishlistContext.Provider value={value}>
            {children}
        </CartWishlistContext.Provider>
    );
};

export const useCartWishlist = (): CartWishlistContextType => {
    const context = useContext(CartWishlistContext);
    if (context === undefined) {
        throw new Error('useCartWishlist must be used within a CartWishlistProvider');
    }
    return context;
};
