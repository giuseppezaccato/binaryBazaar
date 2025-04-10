import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [showCart, setShowCart] = useState(false);

    const addToCart = (product) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.slug === product.slug);
            if (existingItem) {
                return prev.map((item) =>
                    item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                { ...product, quantity: 1, price: parseFloat(product.price) || 0 },
            ];
        });
    };

    const removeFromCart = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (slug, newQuantity) => {
        if (newQuantity < 1) return; // Impedisce quantità inferiori a 1
        setCart((prev) =>
            prev.map((item) =>
                item.slug === slug ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleShowCart = () => setShowCart(true);
    const handleCloseCart = () => setShowCart(false);

    const resetCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                showCart,
                handleShowCart,
                handleCloseCart,
                resetCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}