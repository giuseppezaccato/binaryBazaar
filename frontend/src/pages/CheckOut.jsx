import { useCart } from "../contexts/CartContext";
import { Container, Row, Col, Card, ListGroup, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuantityControl from "../components/quantityControl";

export default function CheckOut() {
    const { cart, updateQuantity, resetCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        billing: {
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            city: "",
            telephone: "",
        },
        shipping: {
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            telephone: "",
        },
        promotionCode: "",
        termsAccepted: false,
        differentShipping: false,
    });
    const [errors, setErrors] = useState({ billing: {}, shipping: {} });
    const [isLoading, setIsLoading] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [promoCodeStatus, setPromoCodeStatus] = useState('');

    // Calcolo del subtotale e totale con sconto
    const subtotal = cart
        .reduce((sum, item) => {
            const price = parseFloat(item.discount_price || item.price) || 0;
            const quantity = item.quantity || 1;
            return sum + price * quantity;
        }, 0)
        .toFixed(2);

    const shippingCost = parseFloat(subtotal) >= 50 ? 0 : 5;
    const discountAmount = (parseFloat(subtotal) * (discount / 100)).toFixed(2);
    const total = (parseFloat(subtotal) + shippingCost - discountAmount).toFixed(2);

    const handleChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        let tempErrors = { billing: {}, shipping: {} };

        const billing = formData.billing;
        if (!billing.firstName) tempErrors.billing.firstName = "Il nome è obbligatorio";
        else if (billing.firstName.trim().length < 3) tempErrors.billing.firstName = "Il nome deve avere almeno 3 lettere";
        if (!billing.lastName) tempErrors.billing.lastName = "Il cognome è obbligatorio";
        else if (billing.lastName.trim().length < 3) tempErrors.billing.lastName = "Il cognome deve avere almeno 3 lettere";
        if (!billing.email) tempErrors.billing.email = "L'email è obbligatoria";
        else if (!/^\S+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/.test(billing.email))
            tempErrors.billing.email = "Email deve essere nel formato nome@provider.dominio";
        if (!billing.address) tempErrors.billing.address = "L'indirizzo è obbligatorio";
        if (!billing.city) tempErrors.billing.city = "La città è obbligatoria";
        if (!billing.telephone) tempErrors.billing.telephone = "Il telefono è obbligatorio";
        else if (!/^\d{10,12}$/.test(billing.telephone))
            tempErrors.billing.telephone = "Il telefono deve contenere 10-12 numeri";

        if (formData.differentShipping) {
            const shipping = formData.shipping;
            if (!shipping.firstName) tempErrors.shipping.firstName = "Il nome è obbligatorio";
            else if (shipping.firstName.trim().length < 3) tempErrors.shipping.firstName = "Il nome deve avere almeno 3 lettere";
            if (!shipping.lastName) tempErrors.shipping.lastName = "Il cognome è obbligatorio";
            else if (shipping.lastName.trim().length < 3) tempErrors.shipping.lastName = "Il cognome deve avere almeno 3 lettere";
            if (!shipping.address) tempErrors.shipping.address = "L'indirizzo è obbligatorio";
            if (!shipping.city) tempErrors.shipping.city = "La città è obbligatoria";
            if (!shipping.telephone) tempErrors.shipping.telephone = "Il telefono è obbligatorio";
            else if (!/^\d{10,12}$/.test(shipping.telephone))
                tempErrors.shipping.telephone = "Il telefono deve contenere 10-12 numeri";
        }

        if (!formData.termsAccepted)
            tempErrors.termsAccepted = "È obbligatorio accettare i termini e condizioni";

        setErrors(tempErrors);
        return (
            Object.keys(tempErrors.billing).length === 0 &&
            (!formData.differentShipping || Object.keys(tempErrors.shipping).length === 0) &&
            !tempErrors.termsAccepted
        );
    };

    const validatePromoCode = () => {
        const validCodes = {
            'SUMMER25': 25,
            'WELCOME10': 10,
            'LORIS10': 10,
            'ARTUR30': 30
        };

        const code = formData.promotionCode.toUpperCase().trim();
        
        if (validCodes[code]) {
            setDiscount(validCodes[code]);
            setPromoCodeStatus('Codice valido applicato!');
        } else {
            setDiscount(0);
            setPromoCodeStatus('Codice non valido');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const dataToUse = formData.differentShipping ? formData.shipping : formData.billing;

        const orderData = {
            name: dataToUse.firstName,
            lastname: dataToUse.lastName,
            email: formData.billing.email,
            address: dataToUse.address,
            city: dataToUse.city,
            telephone: dataToUse.telephone,
            promotion_code: formData.promotionCode || null,
            discount: discount,
            products: cart.map((item) => ({
                slug: item.slug,
                quantity: item.quantity || 1,
                price: parseFloat(item.discount_price || item.price) || 0,
                name: item.name,
            })),
            shipping_cost: shippingCost,
            subtotal: subtotal,
            total: total,
        };

        axios
            .post("http://localhost:3000/orders", orderData, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                console.log("Ordine creato:", response.data);
                navigate("/allDone", { state: { orderId: response.data.orderId } });
            })
            .catch((error) => {
                console.error("Errore:", error.response ? error.response.data : error.message);
                alert("Errore: " + (error.response?.data?.error || error.message));
            })
            .finally(() => {
                setIsLoading(false);
                resetCart();
            });
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Checkout sicuro</h2>

            {cart.length === 0 ? (
                <p className="text-center">Il carrello è vuoto</p>
            ) : (
                <Row>
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSubmit} className="mt-4">
                                    <h5>Dati di Fatturazione</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.billing.firstName}
                                                    onChange={(e) => handleChange(e, "billing")}
                                                    isInvalid={!!errors.billing.firstName}
                                                    disabled={isLoading}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.billing.firstName}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Cognome</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.billing.lastName}
                                                    onChange={(e) => handleChange(e, "billing")}
                                                    isInvalid={!!errors.billing.lastName}
                                                    disabled={isLoading}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.billing.lastName}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.billing.email}
                                            onChange={(e) => handleChange(e, "billing")}
                                            isInvalid={!!errors.billing.email}
                                            disabled={isLoading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.billing.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Indirizzo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.billing.address}
                                            onChange={(e) => handleChange(e, "billing")}
                                            isInvalid={!!errors.billing.address}
                                            disabled={isLoading}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.billing.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Città</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    value={formData.billing.city}
                                                    onChange={(e) => handleChange(e, "billing")}
                                                    isInvalid={!!errors.billing.city}
                                                    disabled={isLoading}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.billing.city}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Telefono</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="telephone"
                                                    value={formData.billing.telephone}
                                                    onChange={(e) => handleChange(e, "billing")}
                                                    isInvalid={!!errors.billing.telephone}
                                                    disabled={isLoading}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.billing.telephone}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            name="differentShipping"
                                            label="Spedizione diversa dalla fatturazione"
                                            checked={formData.differentShipping}
                                            onChange={(e) => handleChange(e)}
                                            disabled={isLoading}
                                        />
                                    </Form.Group>

                                    {formData.differentShipping && (
                                        <>
                                            <h5 className="mt-4">Dati di Spedizione</h5>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nome</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="firstName"
                                                            value={formData.shipping.firstName}
                                                            onChange={(e) => handleChange(e, "shipping")}
                                                            isInvalid={!!errors.shipping.firstName}
                                                            disabled={isLoading}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.shipping.firstName}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Cognome</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="lastName"
                                                            value={formData.shipping.lastName}
                                                            onChange={(e) => handleChange(e, "shipping")}
                                                            isInvalid={!!errors.shipping.lastName}
                                                            disabled={isLoading}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.shipping.lastName}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Indirizzo</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="address"
                                                    value={formData.shipping.address}
                                                    onChange={(e) => handleChange(e, "shipping")}
                                                    isInvalid={!!errors.shipping.address}
                                                    disabled={isLoading}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.shipping.address}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Città</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="city"
                                                            value={formData.shipping.city}
                                                            onChange={(e) => handleChange(e, "shipping")}
                                                            isInvalid={!!errors.shipping.city}
                                                            disabled={isLoading}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.shipping.city}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Telefono</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="telephone"
                                                            value={formData.shipping.telephone}
                                                            onChange={(e) => handleChange(e, "shipping")}
                                                            isInvalid={!!errors.shipping.telephone}
                                                            disabled={isLoading}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.shipping.telephone}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label>Codice Promozionale (opzionale)</Form.Label>
                                        <div className="d-flex gap-2">
                                            <Form.Control
                                                type="text"
                                                name="promotionCode"
                                                value={formData.promotionCode}
                                                onChange={(e) => handleChange(e)}
                                                disabled={isLoading}
                                                className="flex-grow-1"
                                            />
                                            <Button
                                                variant="outline-success"
                                                onClick={validatePromoCode}
                                                disabled={isLoading || !formData.promotionCode}
                                            >
                                                Applica
                                            </Button>
                                        </div>
                                        {promoCodeStatus && (
                                            <Form.Text className={discount > 0 ? "text-success" : "text-danger"}>
                                                {promoCodeStatus}
                                            </Form.Text>
                                        )}
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            required
                                            type="checkbox"
                                            name="termsAccepted"
                                            label="Accetto i termini e condizioni *"
                                            checked={formData.termsAccepted}
                                            onChange={(e) => handleChange(e)}
                                            isInvalid={!!errors.termsAccepted}
                                            disabled={isLoading}
                                        />
                                        <Form.Text className="text-muted">* Campo obbligatorio</Form.Text>
                                        <Form.Control.Feedback type="invalid" className="d-block">
                                            {errors.termsAccepted}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Button
                                        variant="success"
                                        type="submit"
                                        className="w-100 mt-3"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Elaborazione..." : "Completa Pagamento"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <ListGroup variant="flush">
                            {cart.map((item, index) => {
                                const price = parseFloat(item.discount_price || item.price) || 0;
                                const quantity = item.quantity || 1;
                                const itemTotal = (price * quantity).toFixed(2);

                                return (
                                    <ListGroup.Item key={index} className="mb-3">
                                        <Card>
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col xs={6}>
                                                        <Card.Title>{item.name}</Card.Title>
                                                        {item.discount_price && (
                                                            <Card.Text>
                                                                <small className="text-muted">
                                                                    Prezzo originale: {item.price}€
                                                                </small>
                                                            </Card.Text>
                                                        )}
                                                    </Col>
                                                    <Col xs={3}>
                                                        <QuantityControl
                                                            quantity={quantity}
                                                            onQuantityChange={(newQuantity) =>
                                                                updateQuantity(item.slug, newQuantity)
                                                            }
                                                        />
                                                    </Col>
                                                    <Col xs={3} className="text-end">
                                                        <h5 className="mb-0">{itemTotal}€</h5>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                        <Card className="mt-4">
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <h5>Subtotale</h5>
                                    </Col>
                                    <Col className="text-end">
                                        <h5>{subtotal}€</h5>
                                    </Col>
                                </Row>
                                {discount > 0 && (
                                    <Row className="mt-2">
                                        <Col>
                                            <h5>Sconto ({discount}%)</h5>
                                        </Col>
                                        <Col className="text-end">
                                            <h5>-{discountAmount}€</h5>
                                        </Col>
                                    </Row>
                                )}
                                <Row className="mt-2">
                                    <Col>
                                        <h5>Spedizione</h5>
                                    </Col>
                                    <Col className="text-end">
                                        <h5>{shippingCost === 0 ? "Gratuita" : `${shippingCost.toFixed(2)}€`}</h5>
                                    </Col>
                                </Row>
                                {shippingCost > 0 && (
                                    <Row className="mt-2">
                                        <Col>
                                            <small className="text-muted">
                                                Spedizione gratuita per ordini superiori a 50€
                                            </small>
                                        </Col>
                                    </Row>
                                )}
                                <hr />
                                <Row>
                                    <Col>
                                        <h4>Totale</h4>
                                    </Col>
                                    <Col className="text-end">
                                        <h4>{total}€</h4>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
}