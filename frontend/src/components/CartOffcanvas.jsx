import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { useCart } from "../contexts/CartContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import QuantityControl from "./quantityControl";

export default function CartOffcanvas() {
    const { cart, removeFromCart, updateQuantity, showCart, handleCloseCart } = useCart();

    // Calcola il totale considerando la quantità, con gestione di NaN
    const calculateTotal = () => {
        return cart
            .reduce((total, item) => {
                const price = parseFloat(item.discount_price || item.price) || 0; // Fallback a 0 se non numerico
                return total + price * (item.quantity || 1); // Fallback a 1 per quantity
            }, 0)
            .toFixed(2);
    };

    // Salva il carrello nel localStorage quando cambia
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    return (
        <Offcanvas show={showCart} onHide={handleCloseCart} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Carrello</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cart.length === 0 ? (
                    <p>Il carrello è vuoto.</p>
                ) : (
                    <>
                        <ul style={{ listStyleType: "none", padding: 0 }}>
                            {cart.map((item, index) => {
                                const price = parseFloat(item.discount_price || item.price) || 0; // Fallback a 0
                                const totalItemPrice = (price * (item.quantity || 1)).toFixed(2); // Calcolo sicuro

                                return (
                                    <li
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "15px",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <span>
                                                {item.name} - {totalItemPrice}€
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <QuantityControl
                                                quantity={item.quantity || 1} // Fallback a 1
                                                onQuantityChange={(newQuantity) =>
                                                    updateQuantity(item.slug, newQuantity)
                                                }
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFromCart(index)}
                                            >
                                                Rimuovi
                                            </Button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div
                            style={{
                                marginTop: "20px",
                                borderTop: "1px solid #dee2e6",
                                paddingTop: "10px",
                            }}
                        >
                            <h5>Totale: {calculateTotal()}€</h5>
                            <Link to="/checkout">
                                <Button
                                    variant="success"
                                    onClick={handleCloseCart}
                                    style={{ width: "100%", marginTop: "10px" }}
                                >
                                    Procedi al Pagamento
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}