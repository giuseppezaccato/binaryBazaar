import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext"; // Importa useCart

export default function WishList() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart, showCart, handleCloseCart, handleShowCart } = useCart();

    console.log("Wishlist corrente:", wishlist); // Debug

    // Funzione per aggiungere al carrello
    const handleAddToCart = (product) => {
        console.log("Aggiungendo al carrello dalla Wishlist:", product); // Debug
        addToCart(product);
        handleShowCart();
        removeFromWishlist(product.id);
    };

    return (
        <div className="wishlist-container text-center">
            <h1>I miei prodotti preferiti</h1>
            {wishlist.length === 0 ? (
                <p>La tua wishlist è vuota</p>
            ) : (
                <div className="wishlist-items">
                    {wishlist.map((product) => (
                        <div key={product.id} className="wishlist-card">
                            <div className="wishlist-card-content">
                                <img
                                    src={product.image_url || "placeholder-image.jpg"}
                                    alt={product.name}
                                    className="wishlist-item-image"
                                />
                                <div className="wishlist-item-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.category}</p>
                                    <p className="wishlist-price">
                                        {product.discount_price || product.price} €
                                    </p>
                                </div>
                                <div className="wishlist-actions">
                                    <button
                                        className="remove-wishlist-btn"
                                        onClick={() => removeFromWishlist(product.id)}
                                    >
                                        Rimuovi
                                    </button>
                                    <button
                                        className="add-to-cart-btn"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Aggiungi al carrello
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}