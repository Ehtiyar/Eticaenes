import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, clearProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector(state => state.products);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(getProduct(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (qty > product.stock) {
      toast.error('Yeterli stok bulunmuyor');
      return;
    }
    
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      qty: qty
    }));
    toast.success('Ürün sepete eklendi!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Ürün bulunamadı</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="container">
        <div className="grid grid-2" style={{ gap: '40px' }}>
          {/* Product Images */}
          <div>
            <img
              src={product.images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '20px'
              }}
            />
            
            {product.images.length > 1 && (
              <div className="d-flex gap-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #007bff' : '2px solid transparent'
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{ marginBottom: '16px' }}>{product.name}</h1>
            
            {product.rating > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '18px' }}>⭐ {product.rating.toFixed(1)}</span>
                <span style={{ color: '#666', marginLeft: '8px' }}>
                  ({product.numReviews} değerlendirme)
                </span>
              </div>
            )}

            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>
              ₺{product.price.toFixed(2)}
            </div>

            <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>{product.description}</p>

            {product.brand && (
              <p style={{ marginBottom: '20px' }}>
                <strong>Marka:</strong> {product.brand}
              </p>
            )}

            <p style={{ marginBottom: '20px' }}>
              <strong>Kategori:</strong> {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <strong>Stok Durumu:</strong>
              {product.stock > 0 ? (
                <span style={{ color: '#28a745', marginLeft: '8px' }}>
                  {product.stock} adet mevcut
                </span>
              ) : (
                <span style={{ color: '#dc3545', marginLeft: '8px' }}>
                  Stokta yok
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">Adet:</label>
                <select
                  className="form-control"
                  style={{ width: '100px', display: 'inline-block', marginLeft: '10px' }}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="btn btn-primary"
              disabled={product.stock === 0}
              style={{ fontSize: '18px', padding: '12px 30px' }}
            >
              {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
            </button>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3>Özellikler</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {product.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3>Teknik Özellikler</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px 0', fontWeight: '500' }}>{key}:</td>
                        <td style={{ padding: '8px 0' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
