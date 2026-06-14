import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../api';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    search: searchParams.get('search') || '',
    minRent: '',
    maxRent: ''
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set('category', filters.category);
      if (filters.subcategory) params.set('subcategory', filters.subcategory);
      if (filters.search) params.set('search', filters.search);
      if (filters.minRent) params.set('minRent', filters.minRent);
      if (filters.maxRent) params.set('maxRent', filters.maxRent);
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync URL params on filter change
  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.subcategory) params.subcategory = filters.subcategory;
    if (filters.search) params.search = filters.search;
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchInput);
  };

  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', search: '', minRent: '', maxRent: '' });
    setSearchInput('');
    setPage(1);
  };

  const subcategories = {
    Furniture: ['Bed', 'Sofa', 'Table'],
    Appliances: ['Fridge', 'Washing Machine', 'TV']
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-layout">
          {/* Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="clear-filters">Clear all</button>
              )}
            </div>

            {/* Category */}
            <div className="filter-section">
              <h4>Category</h4>
              <div className="filter-options">
                {['Furniture', 'Appliances'].map(cat => (
                  <label key={cat} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={() => handleFilterChange('category', filters.category === cat ? '' : cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory */}
            {filters.category && (
              <div className="filter-section">
                <h4>Type</h4>
                <div className="filter-options">
                  {(subcategories[filters.category] || []).map(sub => (
                    <label key={sub} className="filter-option">
                      <input
                        type="radio"
                        name="subcategory"
                        value={sub}
                        checked={filters.subcategory === sub}
                        onChange={() => handleFilterChange('subcategory', filters.subcategory === sub ? '' : sub)}
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price range */}
            <div className="filter-section">
              <h4>Monthly Rent (₹)</h4>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minRent}
                  onChange={e => handleFilterChange('minRent', e.target.value)}
                />
                <span>–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxRent}
                  onChange={e => handleFilterChange('maxRent', e.target.value)}
                />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="products-main">
            {/* Search + results header */}
            <div className="products-top">
              <form className="search-bar" onSubmit={handleSearchSubmit}>
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
              <div className="results-count">
                {loading ? '...' : `${total} product${total !== 1 ? 's' : ''} found`}
              </div>
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="active-filters">
                {filters.category && (
                  <span className="filter-tag">
                    {filters.category}
                    <button onClick={() => handleFilterChange('category', '')}>✕</button>
                  </span>
                )}
                {filters.subcategory && (
                  <span className="filter-tag">
                    {filters.subcategory}
                    <button onClick={() => handleFilterChange('subcategory', '')}>✕</button>
                  </span>
                )}
                {filters.search && (
                  <span className="filter-tag">
                    "{filters.search}"
                    <button onClick={() => { handleFilterChange('search', ''); setSearchInput(''); }}>✕</button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="loading-screen"><div className="spinner"></div><p>Loading products...</p></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid-main">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="page-btn"
                    >← Prev</button>
                    <span>Page {page} of {pages}</span>
                    <button
                      onClick={() => setPage(p => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="page-btn"
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
