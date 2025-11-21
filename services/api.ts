
import { Product, AuthResponse, Review, User } from '../types';

const BASE_URL = 'https://handcrafted-backend.onrender.com';

// Helper para usar Proxy SOLO en GETs (lectura) para evitar bloqueos CORS si el backend falla
async function fetchWithProxy(endpoint: string) {
  const targetUrl = `${BASE_URL}${endpoint}`;
  // Usamos un proxy para GET request que suele saltar restricciones básicas
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Connection error via proxy');
    const proxyData = await res.json();
    return JSON.parse(proxyData.contents);
  } catch (error) {
    console.warn("Proxy failed, trying direct fetch as fallback:", error);
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error('Direct fetch failed');
    return res.json();
  }
}

export const ApiService = {
  // --- Auth ---
  async register(data: any): Promise<AuthResponse> {
    const res = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text() || 'Registration failed');
    return res.json();
  },

  async login(identifier: string, password: string): Promise<AuthResponse> {
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const payload = isEmail 
      ? { email: identifier, password } 
      : { username: identifier, password };

    const res = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Invalid credentials');
    }
    
    const data = await res.json();
    
    // Normalización de ID y User
    if (data.user) {
      data.user.id = Number(data.user.id || data.user._id);
    } else if (data._id) {
      data.user = { ...data, id: Number(data.id || data._id) };
    }

    return data;
  },

  async updateUserProfile(token: string, data: Partial<User>): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // --- Products ---
  async getAllProducts(): Promise<Product[]> {
    // Intentamos obtener productos. Si el backend tiene CORS bien configurado, el direct fetch funcionaría, 
    // pero mantenemos el proxy para lectura garantizada.
    return fetchWithProxy('/api/products');
  },

  async getProductById(id: number): Promise<Product> {
    try {
       return await fetchWithProxy(`/api/products/${id}`);
    } catch (e) {
       // Fallback: buscar en la lista completa si el endpoint individual falla
       const all = await this.getAllProducts();
       const found = all.find((p: Product) => Number(p.id) === Number(id));
       if (!found) throw new Error('Product not found');
       return found;
    }
  },

  async createProduct(data: any): Promise<Product> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');

    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price), // Convert string to number
      category: data.category,
      stock: Number(data.stock), // Convert string to number
      image_url: data.image_url || ''
    };

    // POST Directo a la API (sin proxy, ya que es escritura)
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Middleware 'protect' necesita esto
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(`Failed to create product: ${errorMsg}`);
    }
    
    return res.json();
  },

  async deleteProduct(id: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // --- Reviews ---
  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      return await fetchWithProxy(`/api/reviews/product/${productId}`);
    } catch (e) {
      console.warn("Could not fetch reviews", e);
      return [];
    }
  },

  async createReview(data: {product_id: number, user_id: number, rating: number, comment: string}): Promise<Review> {
    const token = localStorage.getItem('auth_token');
    const res = await fetch(`${BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to post review');
    return res.json();
  }
};
