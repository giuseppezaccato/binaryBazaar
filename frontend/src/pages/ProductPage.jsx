import { useParams, } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SingleCard from "../components/SingleCard";
import CartOffcanvas from "../components/CartOffcanvas";

function ProductPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/products/${slug}`)
            .then((res) => setProduct(res.data))
            .catch((err) => setError(err.response?.data?.error || "Errore sconosciuto"));
    }, [slug]);

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div>Caricamento...</div>;
    }

    return (
        <>
        
            <SingleCard product={product} />
            <CartOffcanvas />
        </>
    )
}

export default ProductPage;

