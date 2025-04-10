import { useState } from "react";
import SearchBar from "./SearchBar";
import { NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { FaGift, FaShoppingCart, FaHeart, FaInfoCircle } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";

export default function NavBar() {
    const { cart, handleShowCart } = useCart();
    const { wishlist } = useWishlist();
    const [menuOpen, setMenuOpen] = useState(false); // Stato per gestire l'apertura del menu

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen); // Alterna lo stato del menu
    };

    const handleMenuClose = () => {
        setMenuOpen(false); // Chiude il menu
    };

    return (
        <header className="header">
            <NavLink to="/home">
                <img src="/Logo.png" alt="" className="img-logo img-fluid" />
            </NavLink>

            {/* Menu Hamburger */}
            <input
                type="checkbox"
                className="menu-checkbox"
                id="menu-toggle"
                checked={menuOpen} // Collega lo stato al checkbox
                onChange={handleMenuToggle} // Gestisce l'apertura/chiusura
            />
            <label className="menu-toggle" htmlFor="menu-toggle">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </label>

            {/* SearchBar visibile solo su desktop */}
            <div className="desktop-search">
                <SearchBar />
            </div>

            {/* Menu Items */}
            <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
                {/* SearchBar dentro il menu su mobile */}
                <div className="mobile-search">
                    <SearchBar />
                </div>

                <ul className="nav">
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            to="/home"
                            onClick={handleMenuClose} // Chiude il menu al click
                        >
                            HomePage
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            to="/products"
                            onClick={handleMenuClose} // Chiude il menu al click
                        >
                            I Nostri Prodotti
                        </NavLink>
                    </li>

                    <li className="wishlist-container nav-item">
                        <NavLink
                            to="/WishList"
                            className="nav-link"
                            onClick={handleMenuClose} // Chiude il menu al click
                        >
                            <FaHeart size={25} />
                            {wishlist?.length > 0 && (
                                <span className="wishlist-badge">{wishlist.length}</span>
                            )}
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            className="nav-link gift-link"
                            to="/gameDiscount"
                            onClick={handleMenuClose} // Chiude il menu al click
                        >
                            <FaGift className="gift-icon" size={25} />
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            className="nav-link"
                            to="/credits"
                            onClick={handleMenuClose} // Chiude il menu al click
                        >
                            <FaInfoCircle size={25} />
                        </NavLink>
                    </li>
                    <li className="cart-container nav-item">
                        <button
                            className="cart-button rounded"
                            onClick={() => {
                                handleShowCart();
                                handleMenuClose(); // Chiude il menu al click
                            }}
                        >
                            <FaShoppingCart size={25} />
                            {cart?.length > 0 && (
                                <span className="cart-badge">{cart.length}</span>
                            )}
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
}