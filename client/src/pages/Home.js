import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            En İyi Ürünler Burada
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Kaliteli ürünler, hızlı teslimat ve güvenli ödeme
          </p>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
            Alışverişe Başla
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 0', background: '#f8f9fa' }}>
        <div className="container">
          <div className="grid grid-3">
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
              <h3>Hızlı Teslimat</h3>
              <p>24 saat içinde kargo, 2-3 gün içinde teslimat</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h3>Güvenli Ödeme</h3>
              <p>SSL sertifikalı güvenli ödeme sistemi</p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💯</div>
              <h3>Kalite Garantisi</h3>
              <p>Orijinal ürün garantisi ve müşteri memnuniyeti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 className="text-center mb-4">Öne Çıkan Ürünler</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-4">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{
        background: '#007bff',
        color: 'white',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2>Kampanyalardan Haberdar Olun</h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            E-posta bültenimize abone olun, özel indirimlerden ilk siz haberdar olun
          </p>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="d-flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="form-control"
                style={{ flex: 1 }}
              />
              <button className="btn btn-success">Abone Ol</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
