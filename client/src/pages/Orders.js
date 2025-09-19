import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../store/slices/orderSlice';
import { Link } from 'react-router-dom';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const getStatusText = (status) => {
    const statusMap = {
      'beklemede': 'Beklemede',
      'hazirlaniyor': 'Hazırlanıyor',
      'kargoda': 'Kargoda',
      'teslim_edildi': 'Teslim Edildi',
      'iptal': 'İptal'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'beklemede': '#ffc107',
      'hazirlaniyor': '#17a2b8',
      'kargoda': '#007bff',
      'teslim_edildi': '#28a745',
      'iptal': '#dc3545'
    };
    return colorMap[status] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="container">
        <h1 className="mb-4">Siparişlerim</h1>
        
        {orders.length === 0 ? (
          <div className="text-center" style={{ padding: '60px 0' }}>
            <h3>Henüz siparişiniz yok</h3>
            <p style={{ marginBottom: '30px' }}>Alışverişe başlamak için ürünleri inceleyin</p>
            <Link to="/products" className="btn btn-primary">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order._id} className="card" style={{ marginBottom: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h4>Sipariş #{order._id.slice(-8)}</h4>
                    <p style={{ color: '#666', margin: 0 }}>
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      background: getStatusColor(order.status),
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px'
                    }}>
                      {getStatusText(order.status)}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      ₺{order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h5>Ürünler:</h5>
                  <div className="grid grid-2" style={{ gap: '10px' }}>
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="d-flex gap-2" style={{ 
                        padding: '10px', 
                        background: '#f8f9fa', 
                        borderRadius: '6px' 
                      }}>
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500' }}>{item.name}</div>
                          <div style={{ color: '#666', fontSize: '14px' }}>
                            {item.qty} adet × ₺{item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Teslimat Adresi:</strong>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <Link 
                      to={`/order/${order._id}`} 
                      className="btn btn-outline"
                      style={{ fontSize: '14px' }}
                    >
                      Detayları Gör
                    </Link>
                    
                    {order.status === 'beklemede' && !order.isPaid && (
                      <button className="btn btn-primary" style={{ fontSize: '14px' }}>
                        Ödeme Yap
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
