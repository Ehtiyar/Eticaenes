# E-Ticaret Sitesi

Modern, kullanıcı dostu ve tam özellikli bir e-ticaret web uygulaması. React.js frontend ve Node.js/Express backend ile geliştirilmiştir.

## 🚀 Özellikler

### Kullanıcı Özellikleri
- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Ürün kataloğu ve arama
- ✅ Kategori filtreleme
- ✅ Sepet yönetimi
- ✅ Sipariş oluşturma ve takibi
- ✅ Profil yönetimi
- ✅ Responsive tasarım

### Admin Özellikleri
- ✅ Admin paneli
- ✅ Ürün yönetimi (ekleme, düzenleme, silme)
- ✅ Sipariş yönetimi
- ✅ Kullanıcı yönetimi
- ✅ İstatistikler ve raporlar

### Teknik Özellikler
- ✅ JWT tabanlı kimlik doğrulama
- ✅ MongoDB veritabanı
- ✅ Redux state yönetimi
- ✅ RESTful API
- ✅ Güvenli şifre hashleme
- ✅ Form validasyonu
- ✅ Toast bildirimleri

## 🛠️ Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### Frontend
- React.js
- Redux Toolkit
- React Router
- Axios
- React Toastify
- React Icons

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- MongoDB
- npm veya yarn

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd ecommerce-site
```

### 2. Backend kurulumu
```bash
# Bağımlılıkları yükleyin
npm install

# Ortam değişkenlerini ayarlayın
cp config.env.example config.env
# config.env dosyasını düzenleyin

# MongoDB'yi başlatın
# MongoDB'nin çalıştığından emin olun

# Sunucuyu başlatın
npm run dev
```

### 3. Frontend kurulumu
```bash
cd client
npm install
npm start
```

### 4. Veritabanı kurulumu
MongoDB'de `ecommerce` adında bir veritabanı oluşturun. Uygulama otomatik olarak gerekli koleksiyonları oluşturacaktır.

## ⚙️ Yapılandırma

### Backend Yapılandırması
`config.env` dosyasını düzenleyin:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

### Frontend Yapılandırması
`client/.env` dosyası oluşturun:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Kullanım

### Geliştirme Modu
```bash
# Backend (Terminal 1)
npm run dev

# Frontend (Terminal 2)
cd client
npm start
```

Uygulama şu adreslerde çalışacak:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Production Modu
```bash
# Frontend build
cd client
npm run build

# Backend başlat
npm start
```

## 📁 Proje Yapısı

```
ecommerce-site/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── store/         # Redux store
│   │   ├── services/      # API servisleri
│   │   └── App.js
│   └── package.json
├── models/                 # MongoDB modelleri
├── routes/                 # API rotaları
├── middleware/             # Middleware fonksiyonları
├── server.js              # Ana sunucu dosyası
└── package.json
```

## 🔐 API Endpoints

### Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Kullanıcı bilgileri
- `PUT /api/auth/profile` - Profil güncelleme

### Ürünler
- `GET /api/products` - Ürünleri listele
- `GET /api/products/:id` - Tek ürün getir
- `POST /api/products` - Yeni ürün oluştur (Admin)
- `PUT /api/products/:id` - Ürün güncelle (Admin)
- `DELETE /api/products/:id` - Ürün sil (Admin)

### Siparişler
- `POST /api/orders` - Yeni sipariş oluştur
- `GET /api/orders` - Kullanıcı siparişleri
- `GET /api/orders/:id` - Tek sipariş getir
- `PUT /api/orders/:id/pay` - Sipariş ödeme
- `GET /api/orders/admin/all` - Tüm siparişler (Admin)

## 👤 Varsayılan Admin Hesabı

İlk admin hesabını oluşturmak için MongoDB'de manuel olarak bir kullanıcı oluşturun:

```javascript
// MongoDB'de çalıştırın
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hash'lenmiş şifre
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🧪 Test

```bash
# Backend testleri
npm test

# Frontend testleri
cd client
npm test
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Proje hakkında sorularınız için issue açabilirsiniz.

## 🎯 Gelecek Özellikler

- [ ] Ödeme entegrasyonu (Stripe, PayPal)
- [ ] E-posta bildirimleri
- [ ] Ürün değerlendirme sistemi
- [ ] Favoriler listesi
- [ ] Çoklu dil desteği
- [ ] Mobil uygulama
- [ ] Gelişmiş arama ve filtreleme
- [ ] Kupon ve indirim sistemi
