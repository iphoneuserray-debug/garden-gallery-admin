const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Products
  getProducts: () => request('/products'),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request('/customers'),
  createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Product Images
  getProductImages: (productId) => request(`/products/${productId}/images`),
  uploadProductImage: (productId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`${API_BASE}/products/${productId}/images`, { method: 'POST', body: formData }).then(async (res) => {
      if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
      return res.json()
    })
  },
  deleteProductImage: (productId, imageId) =>
    request(`/products/${productId}/images/${imageId}`, { method: 'DELETE' }),
  setCoverImage: (productId, imageId) =>
    request(`/products/${productId}/images/${imageId}/cover`, { method: 'PATCH' }),

  // Orders (fulfillment)
  getOrders: () => request('/orders'),
  toggleOrderCompleted: (id, completed) =>
    request(`/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ completed }) }),

  // Transactions (shopping records)
  getTransactions: () => request('/transactions'),
  createTransaction: (data) => request('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  updateTransactionStatus: (id, status) =>
    request(`/transactions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Coupons
  getCoupons: () => request('/coupons'),
  createCoupon: (data) => request('/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id, data) => request(`/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCoupon: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),

  // Pickup Locations
  getPickupLocations: () => request('/pickup-locations'),
  createPickupLocation: (data) => request('/pickup-locations', { method: 'POST', body: JSON.stringify(data) }),
  updatePickupLocation: (id, data) => request(`/pickup-locations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deletePickupLocation: (id) => request(`/pickup-locations/${id}`, { method: 'DELETE' }),
};
