import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Books',
  'Electronics',
  'Hostel Essentials',
  'Cycles',
  'Clothing',
  'Sports',
  'Musical Instruments',
  'Furniture',
  'Others',
];

const HOSTELS = ['All', 'Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Girls Hostel 1', 'Girls Hostel 2', 'Admin Block'];
const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair'];

export const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [hostel, setHostel] = useState(searchParams.get('hostel') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, page, sort]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const qp = new URLSearchParams();
      if (searchParams.get('search')) qp.append('search', searchParams.get('search'));
      if (searchParams.get('category') && searchParams.get('category') !== 'All') qp.append('category', searchParams.get('category'));
      if (searchParams.get('hostel') && searchParams.get('hostel') !== 'All') qp.append('hostel', searchParams.get('hostel'));
      if (searchParams.get('condition') && searchParams.get('condition') !== 'All') qp.append('condition', searchParams.get('condition'));
      if (minPrice) qp.append('minPrice', minPrice);
      if (maxPrice) qp.append('maxPrice', maxPrice);
      qp.append('sort', sort);
      qp.append('page', page);
      qp.append('limit', 12);

      const { data } = await axiosInstance.get(`/products?${qp.toString()}`);
      setProducts(data.products || []);
      setTotalPages(data.pages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (category !== 'All') newParams.category = category;
    if (hostel !== 'All') newParams.hostel = hostel;
    if (condition !== 'All') newParams.condition = condition;

    setPage(1);
    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setHostel('All');
    setCondition('All');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Campus Marketplace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <span className="text-cyan-400 font-bold">{totalCount}</span> student items listed for trade
          </p>
        </div>

        {/* Mobile Filter Toggle & Desktop Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Filters
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Newest First</option>
              <option value="oldest" className="bg-slate-900">Oldest First</option>
              <option value="price_asc" className="bg-slate-900">Price: Low → High</option>
              <option value="price_desc" className="bg-slate-900">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop & Mobile Modal) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-slate-950/95 p-6 overflow-y-auto'
              : 'hidden'
          } lg:relative lg:bg-transparent lg:p-0 space-y-6`}
        >
          <div className="flex items-center justify-between lg:hidden border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <Filter className="w-5 h-5 text-cyan-400" /> Filter Listings
            </h3>
            <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={applyFilters} className="glass-card rounded-3xl p-6 space-y-6 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" /> Refine Search
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Search Title / Hostel</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Kettle, Cycle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Seller Hostel Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Hostel / Campus Zone</label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {HOSTELS.map((h) => (
                  <option key={h} value={h} className="bg-slate-900">{h}</option>
                ))}
              </select>
            </div>

            {/* Item Condition */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond} className="bg-slate-900">{cond}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl p-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-900/40" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-cyan-400 text-2xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-slate-100">No products match your filters</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing your active filters or searching for different keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-xl glass-card text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-500/40"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-bold text-slate-400 px-3">
                    Page <span className="text-cyan-400">{page}</span> of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-xl glass-card text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-500/40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
