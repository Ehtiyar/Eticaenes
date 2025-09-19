import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      qty: 1
    }));
    toast.success('Ürün sepete eklendi!');
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '6px',
            marginBottom: '12px'
          }}
        />
        <h4 style={{ marginBottom: '8px', fontSize: '18px' }}>{product.name}</h4>
        <p style={{ color: '#666', marginBottom: '12px', fontSize: '14px' }}>
          {product.description.substring(0, 100)}...
        </p>
      </Link>
      
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
            ₺{product.price.toFixed(2)}
          </span>
          {product.stock < 10 && product.stock > 0 && (
            <div style={{ fontSize: '12px', color: '#ffc107' }}>
              Son {product.stock} adet!
            </div>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          className="btn btn-primary"
          disabled={product.stock === 0}
          style={{ fontSize: '14px' }}
        >
          {product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}
        </button>
      </div>
      
      {product.rating > 0 && (
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          ⭐ {product.rating.toFixed(1)} ({product.numReviews} değerlendirme)
        </div>
      )}
    </div>
  );
};

export default ProductCard;
