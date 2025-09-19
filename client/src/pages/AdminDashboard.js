import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getAllOrders } from '../store/slices/orderSlice';
import { getProducts } from '../store/slices/productSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { orders, loading: ordersLoading } = useSelector(state => state.orders);
  const { products, loading: productsLoading } = useSelector(state => state.products);

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
      const pendingOrders = orders.filter(order => order.status === 'beklemede').length;
      
      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        pendingOrders
      });
    }
  }, [orders, products]);

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

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="container">
        <h1 className="mb-4">Admin Panel</h1>
        
        <div className="grid grid-2" style={{ gap: '30px' }}>
          {/* Sidebar */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 className="mb-3">Menü</h3>
            <nav>
              <Link 
                to="/admin" 
                className={`btn ${location.pathname === '/admin' ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', marginBottom: '10px', textAlign: 'left' }}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/orders" 
                className={`btn ${location.pathname === '/admin/orders' ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', marginBottom: '10px', textAlign: 'left' }}
              >
                Siparişler
              </Link>
              <Link 
                to="/admin/products" 
                className={`btn ${location.pathname === '/admin/products' ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', marginBottom: '10px', textAlign: 'left' }}
              >
                Ürünler
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div>
            <Routes>
              <Route path="/" element={<Dashboard stats={stats} />} />
              <Route path="/orders" element={<OrdersList orders={orders} loading={ordersLoading} getStatusText={getStatusText} getStatusColor={getStatusColor} />} />
              <Route path="/products" element={<ProductsList products={products} loading={productsLoading} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ stats }) => (
  <div>
    <h2 className="mb-4">Genel Bakış</h2>
    
    <div className="grid grid-4 mb-4">
      <div className="card text-center">
        <h3 style={{ color: '#007bff' }}>{stats.totalOrders}</h3>
        <p>Toplam Sipariş</p>
      </div>
      <div className="card text-center">
        <h3 style={{ color: '#28a745' }}>₺{stats.totalRevenue.toFixed(2)}</h3>
        <p>Toplam Gelir</p>
      </div>
      <div className="card text-center">
        <h3 style={{ color: '#ffc107' }}>{stats.totalProducts}</h3>
        <p>Toplam Ürün</p>
      </div>
      <div className="card text-center">
        <h3 style={{ color: '#dc3545' }}>{stats.pendingOrders}</h3>
        <p>Bekleyen Sipariş</p>
      </div>
    </div>

    <div className="card">
      <h3>Son Siparişler</h3>
      <p>Son 5 sipariş burada görüntülenir...</p>
    </div>
  </div>
);

// Orders List Component
const OrdersList = ({ orders, loading, getStatusText, getStatusColor }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Siparişler</h2>
      
      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: '60px 0' }}>
          <h3>Henüz sipariş yok</h3>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} className="card" style={{ marginBottom: '20px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h4>Sipariş #{order._id.slice(-8)}</h4>
                  <p style={{ color: '#666', margin: 0 }}>
                    {order.user?.name} - {new Date(order.createdAt).toLocaleDateString('tr-TR')}
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

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Ürün Sayısı:</strong> {order.orderItems.length} adet
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline" style={{ fontSize: '14px' }}>
                    Detayları Gör
                  </button>
                  <button className="btn btn-primary" style={{ fontSize: '14px' }}>
                    Durumu Güncelle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Products List Component
const ProductsList = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ürünler</h2>
        <button className="btn btn-primary">
          Yeni Ürün Ekle
        </button>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center" style={{ padding: '60px 0' }}>
          <h3>Henüz ürün yok</h3>
          <button className="btn btn-primary">
            İlk Ürünü Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-3">
          {products.map(product => (
            <div key={product._id} className="card">
              <img
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '12px'
                }}
              />
              <h4 style={{ marginBottom: '8px' }}>{product.name}</h4>
              <p style={{ color: '#666', marginBottom: '12px' }}>
                {product.description.substring(0, 80)}...
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  ₺{product.price.toFixed(2)}
                </span>
                <div className="d-flex gap-1">
                  <button className="btn btn-outline" style={{ fontSize: '12px' }}>
                    Düzenle
                  </button>
                  <button className="btn btn-danger" style={{ fontSize: '12px' }}>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
