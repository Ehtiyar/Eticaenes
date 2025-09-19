import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, loadUser } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    toast.success('Profil güncellendi');
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
        <h1 className="mb-4">Profilim</h1>
        
        <div className="grid grid-2" style={{ gap: '30px' }}>
          {/* Profile Form */}
          <div className="card">
            <h3 className="mb-3">Kişisel Bilgiler</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">İsim</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-posta</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <h4 className="mt-4 mb-3">Adres Bilgileri</h4>

              <div className="form-group">
                <label className="form-label">Adres</label>
                <input
                  type="text"
                  name="address.street"
                  className="form-control"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Şehir</label>
                  <input
                    type="text"
                    name="address.city"
                    className="form-control"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">İlçe</label>
                  <input
                    type="text"
                    name="address.state"
                    className="form-control"
                    value={formData.address.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Posta Kodu</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    className="form-control"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ülke</label>
                  <input
                    type="text"
                    name="address.country"
                    className="form-control"
                    value={formData.address.country}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Profili Güncelle
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div>
            <div className="card mb-3">
              <h3 className="mb-3">Hesap Bilgileri</h3>
              <p><strong>Üyelik Tarihi:</strong> {new Date(user?.createdAt).toLocaleDateString('tr-TR')}</p>
              <p><strong>Hesap Durumu:</strong> 
                <span style={{ color: user?.isActive ? '#28a745' : '#dc3545', marginLeft: '8px' }}>
                  {user?.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </p>
              <p><strong>Rol:</strong> 
                <span style={{ marginLeft: '8px', textTransform: 'capitalize' }}>
                  {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                </span>
              </p>
            </div>

            <div className="card">
              <h3 className="mb-3">Hızlı İşlemler</h3>
              <div className="d-flex flex-column gap-2">
                <a href="/orders" className="btn btn-outline">
                  Siparişlerim
                </a>
                <a href="/cart" className="btn btn-outline">
                  Sepetim
                </a>
                <a href="/products" className="btn btn-outline">
                  Alışverişe Devam Et
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
