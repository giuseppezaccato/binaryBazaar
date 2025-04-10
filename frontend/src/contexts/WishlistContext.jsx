// WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);

    // Salva la wishlist nel localStorage quando cambia
    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product) => {
        setWishlist((prevWishlist) => {
            // Verifica se il prodotto ha un id valido
            if (!product.id) {
                console.error("Prodotto senza id:", product);
                // Aggiunge un id temporaneo se manca
                product.id = Date.now();
            }
            // Controlla se il prodotto è già presente
            if (!prevWishlist.some(item => item.id === product.id)) {
                const newWishlist = [...prevWishlist, product];
                console.log("Wishlist aggiornata:", newWishlist); // Debug
                return newWishlist;
            }
            console.log("Prodotto già nella wishlist:", product);
            return prevWishlist; // Non aggiunge duplicati
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prevWishlist) => {
            const updatedWishlist = prevWishlist.filter(item => item.id !== productId);
            console.log("Wishlist dopo rimozione:", updatedWishlist); // Debug
            return updatedWishlist;
        });
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

//*customHook
export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist deve essere usato all'interno di un WishlistProvider");
    }
    return context;
};