import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState('single');

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || 'name-asc',
        discounted: searchParams.get('discounted') === 'true' || false,
    });

    useEffect(() => {
        let url = 'http://localhost:3000/products/s';
        let params = { ...filters };
        if (searchQuery) params.q = searchQuery;

        axios
            .get(url, { params })
            .then((res) => setProducts(res.data))
            .catch((err) => console.error('Error fetching products:', err));
    }, [searchQuery, filters]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFilters = {
            ...filters,
            [name]: type === 'checkbox' ? checked : value,
        };
        setFilters(newFilters);

        const newParams = {};
        if (searchQuery) newParams.q = searchQuery;
        if (newFilters.category) newParams.category = newFilters.category;
        if (newFilters.minPrice) newParams.minPrice = newFilters.minPrice;
        if (newFilters.maxPrice) newParams.maxPrice = newFilters.maxPrice;
        if (newFilters.sortBy) newParams.sortBy = newFilters.sortBy;
        if (newFilters.discounted) newParams.discounted = newFilters.discounted;
        setSearchParams(newParams);
    };

    const toggleViewMode = () => {
        setViewMode((prev) => (prev === 'single' ? 'row' : 'single'));
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Contenuto Principale */}
                <div className="col-md-9">
                    {/* Toggle Switch */}
                    <div className="form-check form-switch mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="viewModeSwitch"
                            checked={viewMode === 'row'}
                            onChange={toggleViewMode}
                        />
                        <label className="form-check-label" htmlFor="viewModeSwitch">
                            {viewMode === 'single' ? 'Griglia' : 'Lista'}
                        </label>
                    </div>

                    {/* Conteggio Risultati */}
                    <div className="mt-3 text-center">
                        <p>Trovati {products.length} prodotti</p>
                    </div>
                    {/* Griglia Prodotti */}
                    {viewMode === 'single' ? (
                        <div className="row  row-cols-md-2 row-cols-lg-2 g-4">
                            {products.map((p) => (
                                <div className="col" key={p.slug}>
                                    <Link to={`/products/${p.slug}`} className="text-decoration-none">
                                        <Card product={p} />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ul className="list-group list-group-flush">
                            {products.map((p) => (
                                <li
                                    key={p.slug}
                                    className="list-group-item d-flex align-items-center "
                                >
                                    <Link
                                        to={`/products/${p.slug}`}
                                        className="d-flex align-items-center text-decoration-none text-dark"
                                    >
                                        <img
                                            src={p.image_url}
                                            alt={p.product_name} // Usa product_name
                                            className="me-3"
                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                        />
                                        <span className='color'>{p.product_name}</span> {/* Usa product_name */}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}


                </div>

                {/* Sidebar Filtri */}
                <div className="col-md-3">
                    <div className="card p-3">
                        <h5 className="card-title">Filtri</h5>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">
                                Categoria
                            </label>
                            <select
                                id="category"
                                name="category"
                                className="form-select"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">Tutte le categorie</option>
                                <option value="laptop">Laptop</option>
                                <option value="accessory">Accessori</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="minPrice" className="form-label">
                                Prezzo Minimo
                            </label>
                            <input
                                id="minPrice"
                                type="number"
                                name="minPrice"
                                className="form-control"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="maxPrice" className="form-label">
                                Prezzo Massimo
                            </label>
                            <input
                                id="maxPrice"
                                type="number"
                                name="maxPrice"
                                className="form-control"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sortBy" className="form-label">
                                Ordina per
                            </label>
                            <select
                                id="sortBy"
                                name="sortBy"
                                className="form-select"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                            >
                                <option value="name-asc">Nome (A-Z)</option>
                                <option value="name-desc">Nome (Z-A)</option>
                                <option value="price-asc">Prezzo (basso-alto)</option>
                                <option value="price-desc">Prezzo (alto-basso)</option>
                            </select>
                        </div>
                        <div className="form-check">
                            <input
                                id="discounted"
                                type="checkbox"
                                name="discounted"
                                className="form-check-input"
                                checked={filters.discounted}
                                onChange={handleFilterChange}
                            />
                            <label htmlFor="discounted" className="form-check-label">
                                Solo prodotti scontati
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}