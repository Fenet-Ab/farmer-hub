import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheckCircle,
  FaUser,
  FaTag,
  FaArrowRight,
  FaSyncAlt,
  FaChevronDown,
  FaLeaf,
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addingToCart, setAddingToCart] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { refreshCartCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:5000/api/products');
      const list = res?.data?.product || res?.data?.products || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        !searchTerm || 
        [p.name, p.description, p.category, p.supplier?.name]
          .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(() => 
    ['All', ...new Set(products.map((p) => p.category).filter(Boolean))], 
  [products]);

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      setAddingToCart(productId);
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/add`,
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccess(productId);
      setTimeout(() => setShowSuccess(null), 2000);
      refreshCartCount();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      setError('Could not add to cart');
      setTimeout(() => setError(null), 3000);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] font-poppins pb-20">
      {/* --- Page Header --- */}
      <header className="bg-emerald-900 pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-800/20 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-4">
                <FaLeaf className="animate-bounce" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Premium Marketplace</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Fresh From <br /> <span className="text-emerald-400 italic">The Source.</span>
              </h1>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-3xl">
              <p className="text-emerald-100 text-sm font-medium">
                Showing <span className="text-white font-bold">{filteredProducts.length}</span> unique items
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* --- Search & Navigation Bar --- */}
      <section className="sticky top-[73px] z-40 -mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-slate-100 p-3 flex flex-col lg:flex-row items-center gap-4">
            
            {/* Search Input */}
            <div className="relative w-full group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for grain, fertilizer, tools..."
                className="w-full pl-12 pr-10 py-4 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500">
                  <FaTimes size={14} />
                </button>
              )}
            </div>

            {/* Category Toggle */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto px-2 no-scrollbar">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-wider ${
                    selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {categories.length > 5 && (
                <select 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-100 text-slate-500 px-3 py-2.5 rounded-2xl text-xs font-black uppercase outline-none"
                >
                  <option value="">More...</option>
                  {categories.slice(5).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </div>

            <button
              onClick={fetchProducts}
              className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
            >
              <FaSyncAlt className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </section>

      {/* --- Main Product Grid --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-[450px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTag className="text-4xl text-slate-200" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">No results found</h2>
            <p className="text-slate-500 mt-2">Try searching for something else or clear your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProducts.map((p) => (
              <div 
                key={p._id || p.id} 
                className="group bg-white rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 flex flex-col overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden m-3 rounded-[2rem]">
                  <img
                    src={p.image || p.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm border border-white/50">
                      {p.category || 'Essential'}
                    </span>
                  </div>
                  {p.stock <= 0 && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-tighter">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="px-7 pb-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="text-emerald-600 text-[10px]" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        {p.supplier?.name || 'Verified Partner'}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {p.name}
                    </h2>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 italic">
                    {p.description || 'Expertly sourced and quality tested for your peace of mind.'}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-3xl font-black text-slate-900 tracking-tighter">
                        ${p.price?.toFixed?.(2) ?? p.price ?? '0.00'}
                      </p>
                      <div className={`px-3 py-1.5 rounded-full text-[10px] font-black border ${
                        p.stock > 0 ? 'border-emerald-100 text-emerald-600 bg-emerald-50' : 'border-rose-100 text-rose-600 bg-rose-50'
                      }`}>
                        {p.stock > 0 ? `${p.stock} Units` : 'Waitlist'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(p._id || p.id)}
                        disabled={addingToCart === (p._id || p.id) || p.stock <= 0}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                          showSuccess === (p._id || p.id) 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-xl shadow-slate-200 hover:shadow-emerald-200 disabled:bg-slate-100 disabled:text-slate-400'
                        }`}
                      >
                        {addingToCart === (p._id || p.id) ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : showSuccess === (p._id || p.id) ? (
                          <FaCheckCircle className="text-lg" />
                        ) : (
                          <><FaShoppingCart /> Add to Cart</>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => window.open(`/products/${p._id || p.id}`, '_self')}
                        className="p-4 rounded-2xl border-2 border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all active:scale-90"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <span className="text-xs font-bold">{error}</span>
            <button onClick={() => setError(null)}><FaTimes className="text-rose-500" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;