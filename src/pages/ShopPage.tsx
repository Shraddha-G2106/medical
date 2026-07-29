import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, Product } from '../types';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  RotateCcw, 
  FileText, 
  Check, 
  Star, 
  ShoppingBag, 
  Heart,
  Eye,
  X
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo
  } = useApp();

  const [priceMax, setPriceMax] = useState<number>(2500);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [prescriptionOnly, setPrescriptionOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Tablets',
    'Syrups',
    'Personal Care',
    'Health Devices',
    'Vitamins',
    'First Aid'
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) return false;
      }

      // Price Filter
      if (p.price > priceMax) return false;

      // In Stock Filter
      if (inStockOnly && p.stock <= 0) return false;

      // Prescription Required Filter
      if (prescriptionOnly && !p.prescriptionRequired) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceMax, inStockOnly, prescriptionOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceMax(2500);
    setInStockOnly(false);
    setPrescriptionOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Medicines & Healthcare Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {filteredProducts.length} authentic medical items
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Filter Medicines
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-xs font-bold text-emerald-700">₹{priceMax.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹50.00</span>
                <span>₹3,000.00</span>
              </div>
            </div>

            {/* Toggle Filters */}
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                In Stock Only
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={prescriptionOnly}
                  onChange={(e) => setPrescriptionOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                Requires Doctor's Prescription
              </label>
            </div>

            {/* Sort By Dropdown */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Sort Products
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </aside>

          {/* Product Listing Area */}
          <main className="lg:col-span-3">
            {/* Active Filters Bar */}
            {(selectedCategory !== 'All' || searchQuery || priceMax < 2500 || inStockOnly || prescriptionOnly) && (
              <div className="mb-4 bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-emerald-900">Active Filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 font-semibold text-emerald-800">
                    Category: {selectedCategory}
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 font-semibold text-emerald-800">
                    Search: "{searchQuery}"
                  </span>
                )}
                {priceMax < 2500 && (
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 font-semibold text-emerald-800">
                    Max Price: ₹{priceMax}
                  </span>
                )}
                {inStockOnly && (
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 font-semibold text-emerald-800">
                    In Stock Only
                  </span>
                )}
                {prescriptionOnly && (
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 font-semibold text-emerald-800">
                    Rx Required Only
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="ml-auto font-bold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 my-4 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Medicines Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any products matching your current search or filter options.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-emerald-600 text-white font-semibold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* List View Format */
              <div className="space-y-4">
                {filteredProducts.map((p) => {
                  const isWishlisted = isInWishlist(p.id);
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-28 h-28 object-contain rounded-xl bg-slate-50 shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {p.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{p.brand}</span>
                        </div>
                        <h3
                          onClick={() => navigateTo('product-detail', p.id)}
                          className="font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer text-base"
                        >
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
                        <div className="text-[11px] text-slate-400">
                          Dosage: <span className="font-semibold text-slate-700">{p.dosage}</span>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 space-y-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                        <div>
                          <div className="text-lg font-black text-slate-900">₹{p.price.toFixed(2)}</div>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{p.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(p)}
                            className={`p-2 rounded-xl border ${
                              isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                          </button>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-extrabold text-slate-900 text-sm">Filter Medicines</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        selectedCategory === cat ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Max Price: ₹{priceMax}
                </label>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-emerald-600 text-white font-semibold text-xs py-3 rounded-xl shadow-md mt-6"
            >
              Apply Filters ({filteredProducts.length} Items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
