import api from './api';

const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  payOrder: (id) => api.put(`/orders/${id}/pay`),
  getAllOrders: () => api.get('/orders/admin/all'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default orderService;
