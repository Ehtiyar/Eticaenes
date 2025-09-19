const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Yeni sipariş oluştur
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Sipariş ürünleri bulunamadı' });
    }

    // Ürünleri kontrol et ve fiyatları hesapla
    let totalPrice = 0;
    const orderItemsWithPrices = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Ürün bulunamadı: ${item.name}` });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Yetersiz stok: ${item.name}` });
      }

      const itemTotal = product.price * item.qty;
      totalPrice += itemTotal;

      orderItemsWithPrices.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        qty: item.qty
      });
    }

    // KDV hesapla (%18)
    const taxPrice = totalPrice * 0.18;
    
    // Kargo ücreti (100 TL üzeri ücretsiz)
    const shippingPrice = totalPrice >= 100 ? 0 : 25;

    const order = await Order.create({
      user: req.user._id,
      orderItems: orderItemsWithPrices,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice: totalPrice + taxPrice + shippingPrice
    });

    // Stokları güncelle
    for (const item of orderItemsWithPrices) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @route   GET /api/orders
// @desc    Kullanıcının siparişlerini getir
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @route   GET /api/orders/:id
// @desc    Tek sipariş getir
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    // Sadece sipariş sahibi veya admin görebilir
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu siparişi görme yetkiniz yok' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Siparişi ödendi olarak işaretle
// @access  Private
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu siparişi güncelleme yetkiniz yok' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'hazirlaniyor';

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Tüm siparişleri getir (Admin)
// @access  Private (Admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Sipariş durumunu güncelle (Admin)
// @access  Private (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    order.status = status;
    
    if (status === 'teslim_edildi') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;
