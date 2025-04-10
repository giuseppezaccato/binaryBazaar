// import { Link } from "react-router-dom";

export default function Card({ product, addToCart }) {
    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };




    return (

        <div className="box-card ">
            <div className="product-card rounded">
                {product.discount_price && <span className="sconto"></span>}
                <img src={product.image_url} alt="Product Image" className="product-image" />

                <hr className="color" />
                <div className="product-info">
                    <h2 className="product-name">{product.name || product.product_name}</h2>

                    <p className="product-description">{product.description}</p>
                    <p className="product-model"><strong>Modello: </strong>{product.model}</p>
                    <p className="product-price">

                        {product.discount_price ? (
                            <>


                                <span className="original-price">{product.price} €</span>
                                <span
                                    className="discount-price"
                                    style={{ color: 'black', fontWeight: 'bold' }}
                                >
                                    {product.discount_price} €
                                </span>
                            </>
                        ) : (
                            <span className="normal-price" style={{ color: 'black' }}>
                                {product.price} €
                            </span>
                        )}
                    </p>
                    {/* <button className="buy-button" onClick={handleAddToCart}>
                        Aggiungi al carrello
                    </button> */}

                </div>
            </div>
        </div>
    );

}




