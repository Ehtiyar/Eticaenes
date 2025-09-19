import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, loadUser } from '../store/slices/authSlice';
import { selectCartItemsCount } from '../store/slices/cartSlice';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const cartItemsCount = useSelector(selectCartItemsCount);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            <h2 style={{ margin: 0, color: '#007bff' }}>E-Ticaret</h2>
          </Link>

          <div className="d-flex align-items-center gap-3">
            <Link to="/products" className="btn btn-outline">
              Ürünler
            </Link>

            {isAuthenticated && (
              <Link to="/cart" className="btn btn-outline" style={{ position: 'relative' }}>
                <FaShoppingCart />
                {cartItemsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <div className="dropdown">
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUser />
                    {user?.name}
                  </button>
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    borderRadius: '6px',
                    padding: '8px 0',
                    minWidth: '150px',
                    zIndex: 1000
                  }}>
                    <Link to="/profile" style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: '#333' }}>
                      Profil
                    </Link>
                    <Link to="/orders" style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: '#333' }}>
                      Siparişlerim
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" style={{ display: 'block', padding: '8px 16px', textDecoration: 'none', color: '#333' }}>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'none',
                        padding: '8px 16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#dc3545'
                      }}
                    >
                      <FaSignOutAlt />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaSignInAlt />
                  Giriş Yap
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUserPlus />
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
