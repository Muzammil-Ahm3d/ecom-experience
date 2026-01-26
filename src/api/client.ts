import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

console.log('🚀 API Client Initialized with Base URL:', API_BASE_URL);

export const fetchProducts = async (category?: string, search?: string, sale?: string) => {
    try {
        const params: any = {};
        if (category) params.category = category;
        if (search) params.search = search;
        if (sale) params.sale = sale;

        const response = await api.get('/products', { params });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
};

export const fetchProductById = async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

// Cart API
export const fetchCart = async () => {
    const response = await api.get('/cart');
    return response.data;
};

export const addToCartAPI = async (productId: string, quantity: number = 1, variant?: { size?: string; color?: string }) => {
    const response = await api.post('/cart/add', { productId, quantity, variant });
    return response.data;
};

export const updateCartItemAPI = async (productId: string, quantity: number) => {
    const response = await api.put(`/cart/update/${productId}`, { quantity });
    return response.data;
};

export const removeFromCartAPI = async (productId: string) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data;
};

export const clearCartAPI = async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
};

// Order API
export interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export const createOrderAPI = async (shippingAddress: ShippingAddress, paymentMethod: string = 'COD') => {
    const response = await api.post('/orders', { shippingAddress, paymentMethod });
    return response.data;
};

export const fetchMyOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
};

export const fetchOrderById = async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

export const cancelOrderAPI = async (orderId: string) => {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data;
};

export default api;
