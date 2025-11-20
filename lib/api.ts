import axios from 'axios';

const API_URL = 'https://handcrafted-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Product endpoints
export const getProducts = () => api.get('/products');
export const getProductById = (id: string) => api.get(`/products/${id}`);
export const createProduct = (productData: any, token: string) => api.post('/products', productData, { headers: { Authorization: `Bearer ${token}` } });
export const updateProduct = (id: string, productData: any, token: string) => api.put(`/products/${id}`, productData, { headers: { Authorization: `Bearer ${token}` } });
export const deleteProduct = (id: string, token: string) => api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const getFeaturedProducts = async () => {
    const response = await api.get('/products');
    return {
        ...response,
        data: response.data.slice(0, 4)
    };
};

// Auth endpoints
export const login = (credentials: any) => api.post('/users/login', credentials);
export const register = (userData: any) => api.post('/users/register', userData);

export default api;
