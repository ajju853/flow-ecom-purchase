
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  updateInventory: (id, quantity) => api.put(`/products/${id}/inventory`, { quantity })
};

export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (orderNumber) => api.get(`/orders/${orderNumber}`)
};

export default api;
