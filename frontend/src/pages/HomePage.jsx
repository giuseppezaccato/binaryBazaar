import { useEffect, useState } from "react";
import axios from 'axios';
import Card from "../components/Card";
import Hero from "../components/hero";
import { Link } from "react-router-dom";

export default function HomePage() {
    const [products, setProducts] = useState([]);


    const fetchProducts = () => {
        axios.get('http://localhost:3000/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const renderLaptops = () => {
        const laptops = products.filter(product => product.category === 'laptop');
        return laptops.map((product) => (

            <Link
                to={`/products/${product.slug}`}
                key={product.product_id}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <Card product={product} />

            </Link>
        ));
    };

    const renderAccessories = () => {
        const accessories = products.filter(product => product.category === 'accessory');
        return accessories.map((product) => (

            <Link
                to={`/products/${product.slug}`}
                key={product.product_id}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <Card product={product} />

            </Link>
        ));
    };

    return (
        <>
            <Hero />

            <div className="titolo-nome">
                <h1 className="lime">LAPTOP</h1>

            </div>
            <div className="container mx-auto ">


                {/* <Button variant="primary" onClick={handleShow} style={{ marginBottom: '20px' }}>
                    Carrello ({cart.length})
                </Button> */}
                <div className="row row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-1">
                    {renderLaptops()}
                </div>


            </div>
            <div className="titolo-nome">
                <h1 className="lime">ACCESSORI</h1>

            </div>

            <div className="container mx-auto ">

                <div className="row row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-1">
                    {renderAccessories()}
                </div>
            </div>

            {/* <CartOffcanvas 
                show={show} 
                handleClose={handleClose} 
                cart={cart} 
                removeFromCart={removeFromCart} 
            /> */}
        </>
    );
}