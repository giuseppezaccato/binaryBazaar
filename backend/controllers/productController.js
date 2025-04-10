import connection from '../data/db.js'


//* chiama INDEX di TUTTI i prodotti
function index(req, res) {


    const sql = 'SELECT * FROM products'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({
            error: 'error'
        })

        // res.json(results); 
        const products = results.map(p => {
            return {
                ...p,
                image_url: `${req.imagePath}${p.slug}.webp`
            }

        });
        res.json(products)//* AGGIORNAMENTO CON USO MIDDLEWARE
    })
}

function searchProduct(req, res) {
    const { q, category, minPrice, maxPrice, sortBy, discounted } = req.query;
    const searchTerm = q || '';

    let sql = `
      SELECT 
        products.product_id,  
        products.name AS product_name, 
        products.slug, 
        products.price, 
        products.discount_price, 
        products.category,
        products.image_url,
        brands.name AS brand_name,
        products.description,
        products.model
      FROM products
      LEFT JOIN brands ON products.brand_id = brands.brand_id
    `;
    let params = [];
    let conditions = [];

    if (searchTerm) {
        conditions.push(`LOWER(products.name) LIKE LOWER(?)`);
        params.push(`%${searchTerm}%`);
    }
    if (category) {
        conditions.push(`products.category = ?`);
        params.push(category);
    }
    if (minPrice) {
        conditions.push(`COALESCE(products.discount_price, products.price) >= ?`);
        params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
        conditions.push(`COALESCE(products.discount_price, products.price) <= ?`);
        params.push(parseFloat(maxPrice));
    }
    if (discounted === 'true') {
        conditions.push(`products.discount_price IS NOT NULL`);
    }

    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (sortBy) {
        switch (sortBy) {
            case 'name-asc':
                sql += ` ORDER BY products.name ASC`;
                break;
            case 'name-desc':
                sql += ` ORDER BY products.name DESC`;
                break;
            case 'price-asc':
                sql += ` ORDER BY COALESCE(products.discount_price, products.price) ASC`;
                break;
            case 'price-desc':
                sql += ` ORDER BY COALESCE(products.discount_price, products.price) DESC`;
                break;
            default:
                sql += ` ORDER BY products.name ASC`;
        }
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Errore nella query dei prodotti:', err);
            return res.status(500).json({ error: 'Errore del database' });
        }

        const products = results.map(product => ({
            ...product,
            image_url: product.image_url || `${req.imagePath}${product.slug}.webp`
        }));

        res.json(products);
    });
}




//*chiamata SHOW del singolo prodotto a prescindere dal TYPE

function showProductDetails(req, res) {
    const { slug } = req.params;

    const sql = "SELECT * FROM products WHERE slug = ?";
    connection.query(sql, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: 'Errore del server' });
        if (results.length === 0) return res.status(404).json({ error: 'Prodotto non trovato' });

        const product = results[0];
        let detailsSql;

        // Usa il campo category dal database invece di req.query.category
        if (product.category === 'laptop') {
            detailsSql = 'SELECT * FROM laptop_details WHERE product_id = ?';
        } else if (product.category === 'accessory') {
            detailsSql = 'SELECT * FROM accessory_details WHERE product_id = ?';
        } else {
            return res.status(400).json({ error: 'Tipo di prodotto non valido' });
        }

        connection.query(detailsSql, [product.product_id], (err, detailsResults) => {
            if (err) return res.status(500).json({ error: 'Errore del server' });
            product.product_details = detailsResults; // Dettagli del prodotto
            product.details = detailsResults[0] || {};
            res.json({
                ...product,
                image_url: `${req.imagePath}${product.slug}.webp`
            });
        });
    });
}


//TODO aggiornare funzione di ricerca!
// function searchProduct(req, res){

// }


export { index, showProductDetails, searchProduct }