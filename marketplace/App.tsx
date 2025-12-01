

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register'; 
import { BecomeSeller } from './pages/BecomeSeller'; 
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { SellerPublicProfile } from './pages/SellerPublicProfile';
import { BuyerProfilePage } from './pages/BuyerProfile';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { User, Product, SellerProfile, CartItem, Review, Order, BuyerProfile } from './types';
import { MOCK_PRODUCTS, MOCK_SALES, SALES_STATS, MOCK_SELLERS, MOCK_ORDERS, MOCK_BUYER_PROFILE } from './services/mockData';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Simulated User Database for Auth
  const [users, setUsers] = useState<User[]>([
    { username: 'admin', email: 'admin@market.com', password: 'admin', role: 'admin' },
    { username: 'buyer', email: 'buyer@market.com', password: 'buyer', role: 'user' }
  ]);

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  
  // Sellers State (Database of sellers)
  const [sellers, setSellers] = useState<SellerProfile[]>(MOCK_SELLERS);
  
  // Selected Seller for Public Profile View
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null);

  // The logged-in seller's profile
  const [mySellerProfile, setMySellerProfile] = useState<SellerProfile>(MOCK_SELLERS[0]);
  
  // The logged-in buyer's profile
  const [myBuyerProfile, setMyBuyerProfile] = useState<BuyerProfile>(MOCK_BUYER_PROFILE);

  const handleLogin = (username: string, role: 'admin' | 'seller' | 'user') => {
    // Find full user details to set current user
    const user = users.find(u => u.username === username);
    if(user) setCurrentUser(user);
    
    if (role === 'admin' || role === 'seller') {
         const profile = sellers.find(s => s.username === username);
         if (profile) {
             setMySellerProfile(profile);
         } else if (role === 'admin') {
             // Fallback for default admin
             setMySellerProfile(MOCK_SELLERS[0]);
         }
    } else {
        if (username === 'buyer') {
             setMyBuyerProfile(MOCK_BUYER_PROFILE);
        }
    }
    
    if (currentPage === 'login_redirect') {
        setCurrentPage('checkout');
    } else if (role === 'admin' || role === 'seller') {
        setCurrentPage('dashboard');
    } else {
        setCurrentPage('home');
    }
  };

  const handleRegister = (newUser: User, newProfile: Partial<BuyerProfile>) => {
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      
      // Initialize buyer profile
      setMyBuyerProfile({
          username: newUser.username,
          email: newUser.email,
          avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200',
          bio: 'New member',
          joinDate: new Date().getFullYear().toString(),
          ...newProfile
      } as BuyerProfile);

      setCurrentPage('home');
      alert(`Welcome, ${newUser.username}! Account created.`);
  };

  const handleRegisterSeller = (newUser: User, newProfile: SellerProfile) => {
      setUsers([...users, newUser]);
      setSellers([...sellers, newProfile]);
      setCurrentUser(newUser);
      setMySellerProfile(newProfile);
      setCurrentPage('dashboard');
      alert(`Welcome to your new shop, ${newProfile.username}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    alert(`Added to cart: ${product.name}`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleInitiateCheckout = () => {
      if (!currentUser) {
          alert("Please login to complete your purchase.");
          setCurrentPage('login_redirect'); 
      } else {
          setCurrentPage('checkout');
      }
  };

  const handlePlaceOrder = (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      alert("Success! Your order has been placed.");
      setCurrentPage('home');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([{...newProduct, isActive: true}, ...products]);
  };

  const handleEditProduct = (updatedProduct: Product) => {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
        setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleToggleProductStatus = (id: string) => {
      setProducts(products.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  const handleViewSellerProfile = () => {
    if (selectedProduct) {
        const seller = sellers.find(s => s.username === selectedProduct.sellerId);
        if (seller) {
            setSelectedSeller(seller);
            setCurrentPage('seller-profile');
        }
    }
  };

  const handleSubmitReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        ...reviewData
    };
    
    setProducts(products.map(p => {
        if (p.id === productId) {
            return {
                ...p,
                reviews: [newReview, ...(p.reviews || [])]
            };
        }
        return p;
    }));
  };

  const handleUpdateProfile = (updatedProfile: SellerProfile) => {
    setMySellerProfile(updatedProfile);
    setSellers(sellers.map(s => s.username === updatedProfile.username ? updatedProfile : s));
  };

  const handleUpdateBuyerProfile = (updatedProfile: BuyerProfile) => {
      setMyBuyerProfile(updatedProfile);
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const currentProductSeller = selectedProduct 
    ? sellers.find(s => s.username === selectedProduct.sellerId) || MOCK_SELLERS[0]
    : MOCK_SELLERS[0];

  const activeProducts = products.filter(p => p.isActive);

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
      {/* Hide main navbar if on Dashboard to allow Dashboard's sidebar layout */}
      {currentPage !== 'dashboard' && (
        <Navbar 
          user={currentUser} 
          onNavigate={setCurrentPage} 
          onLogout={handleLogout} 
          cartCount={cartTotalItems}
        />
      )}
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home 
            products={activeProducts} 
            onAddToCart={handleAddToCart} 
            onProductClick={handleProductClick}
          />
        )}
        
        {currentPage === 'product-details' && selectedProduct && (
          <ProductDetails 
            product={products.find(p => p.id === selectedProduct.id) || selectedProduct} 
            sellerProfile={currentProductSeller}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentPage('home')}
            onViewSellerProfile={handleViewSellerProfile}
            onSubmitReview={handleSubmitReview}
          />
        )}

        {currentPage === 'seller-profile' && selectedSeller && (
            <SellerPublicProfile 
                sellerProfile={selectedSeller}
                products={activeProducts}
                onBack={() => setCurrentPage('home')}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
            />
        )}

        {currentPage === 'buyer-profile' && (
            <BuyerProfilePage 
                buyerProfile={myBuyerProfile}
                orders={orders}
                onUpdateProfile={handleUpdateBuyerProfile}
                onBack={() => setCurrentPage('home')}
            />
        )}

        {currentPage === 'cart' && (
          <Cart 
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={handleInitiateCheckout}
            onContinueShopping={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'checkout' && currentUser && (
            <Checkout 
                cart={cart}
                user={currentUser}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setCurrentPage('cart')}
            />
        )}

        {(currentPage === 'login' || currentPage === 'login_redirect') && (
          <Login 
            onLogin={handleLogin} 
            onNavigate={setCurrentPage}
            users={users}
          />
        )}

        {currentPage === 'register' && (
            <Register 
                onRegister={handleRegister}
                onNavigate={setCurrentPage}
                existingUsers={users}
            />
        )}

        {currentPage === 'become-seller' && (
            <BecomeSeller 
                onRegisterSeller={handleRegisterSeller}
                onNavigate={setCurrentPage}
                existingUsers={users}
            />
        )}
        
        {currentPage === 'dashboard' && currentUser && (currentUser.role === 'admin' || currentUser.role === 'seller') && (
          <Dashboard 
            user={currentUser}
            products={products}
            sales={MOCK_SALES}
            salesStats={SALES_STATS}
            sellerProfile={mySellerProfile}
            orders={orders}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentPage('home')}
            onViewProduct={handleProductClick}
            onToggleStatus={handleToggleProductStatus}
          />
        )}

        {currentPage === 'about' && (
          <About onBack={() => setCurrentPage('home')} />
        )}

        {currentPage === 'contact' && (
          <Contact onBack={() => setCurrentPage('home')} />
        )}

      </main>

      {/* Show Footer only on public pages */}
      {currentPage !== 'dashboard' && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'become-seller' && (
          <Footer onNavigate={setCurrentPage} />
      )}
    </div>
  );
};

export default App;