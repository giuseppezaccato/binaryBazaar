import { Button, InputGroup } from "react-bootstrap";

export default function QuantityControl({ quantity, onQuantityChange }) {
    const handleIncrement = () => {
        onQuantityChange(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    return (
        <InputGroup className="w-auto">
            <Button
                variant="outline-secondary"
                onClick={handleDecrement}
                disabled={quantity <= 1}
            >
                -
            </Button>
            <InputGroup.Text className="px-2">{quantity}</InputGroup.Text>
            <Button variant="outline-secondary" onClick={handleIncrement}>
                +
            </Button>
        </InputGroup>
    );
}