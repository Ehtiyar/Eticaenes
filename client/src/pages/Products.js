import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, getCategories } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, totalPages, currentPage, total } = useSelector(state => state.products);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1
  });

  useEffect(() => {
    dispatch(getProducts(filters));
    dispatch(getCategories());
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="container">
        <h1 className="mb-4">Ürünler</h1>
        
        <div className="grid grid-2" style={{ marginBottom: '30px' }}>
          {/* Filters */}
          <div className="card">
            <h3 className="mb-3">Filtreler</h3>
            
            <div className="form-group">
              <label className="form-label">Arama</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ürün ara..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-control"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sıralama</label>
              <select
                className="form-control"
                value={`${filters.sort}-${filters.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  handleFilterChange('sort', sort);
                  handleFilterChange('order', order);
                }}
              >
                <option value="createdAt-desc">En Yeni</option>
                <option value="createdAt-asc">En Eski</option>
                <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                <option value="rating-desc">En Yüksek Puan</option>
                <option value="name-asc">İsim (A → Z)</option>
                <option value="name-desc">İsim (Z → A)</option>
              </select>
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p>{total} ürün bulundu</p>
            </div>

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-2">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center" style={{ padding: '60px 0' }}>
                    <h3>Ürün bulunamadı</h3>
                    <p>Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <button
                      className="btn btn-outline"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Önceki
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      className="btn btn-outline"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
