import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../store/slices/cartSlice';
import { selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Ürün sepetten çıkarıldı');
  };

  const handleQuantityChange = (productId, qty) => {
    if (qty < 1) {
      handleRemoveItem(productId);
    } else {
      dispatch(updateCartItemQuantity({ productId, qty }));
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2>Sepetiniz Boş</h2>
          <p style={{ marginBottom: '30px' }}>Alışverişe devam etmek için ürünleri inceleyin</p>
          <Link to="/products" className="btn btn-primary">
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="container">
        <h1 className="mb-4">Sepetim</h1>
        
        <div className="grid grid-2" style={{ gap: '30px' }}>
          {/* Cart Items */}
          <div>
            {cartItems.map(item => (
              <div key={item.product} className="card" style={{ marginBottom: '20px' }}>
                <div className="d-flex gap-3">
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '6px'
                    }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '8px' }}>{item.name}</h4>
                    <p style={{ color: '#666', marginBottom: '12px' }}>
                      ₺{item.price.toFixed(2)}
                    </p>
                    
                    <div className="d-flex align-items-center gap-2">
                      <label>Adet:</label>
                      <select
                        value={item.qty}
                        onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value))}
                        style={{ width: '80px', padding: '4px' }}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => handleRemoveItem(item.product)}
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      ₺{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card">
              <h3 className="mb-3">Sipariş Özeti</h3>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Ürünler ({cartItems.reduce((acc, item) => acc + item.qty, 0)} adet)</span>
                <span>₺{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>KDV (%18)</span>
                <span>₺{(cartTotal * 0.18).toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Kargo</span>
                <span>{cartTotal >= 100 ? 'Ücretsiz' : '₺25.00'}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                <span>Toplam</span>
                <span>₺{(cartTotal + (cartTotal * 0.18) + (cartTotal >= 100 ? 0 : 25)).toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '10px' }}
              >
                Siparişi Tamamla
              </button>

              <button
                onClick={() => dispatch(clearCart())}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Sepeti Temizle
              </button>

              {cartTotal < 100 && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#fff3cd', borderRadius: '6px', fontSize: '14px' }}>
                  ₺{(100 - cartTotal).toFixed(2)} daha alışveriş yapın, kargo ücretsiz olsun!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
