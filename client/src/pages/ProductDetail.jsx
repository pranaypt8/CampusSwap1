import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { OfferModal } from '../components/OfferModal';
import { ReportModal } from '../components/ReportModal';
import { ReviewModal } from '../components/ReviewModal';
import {
  MapPin,
  Tag,
  Star,
  MessageSquare,
  Heart,
  Flag,
  ShieldCheck,
  Calendar,
  Eye,
  Sparkles,
  ArrowLeft,
  User,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlistIds, fetchWishlist } = useNotifications();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Modals state
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProduct(data);
        setIsWishlisted(wishlistIds.includes(data._id));
      } catch (err) {
        toast.error('Product not found or removed.');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to save products.');
      return;
    }
    try {
      const { data } = await axiosInstance.post('/wishlist/toggle', { productId: product._id });
      setIsWishlisted(data.isSaved);
      fetchWishlist();
      toast.success(data.message);
    } catch (err) {
      toast.error('Failed to update wishlist.');
    }
  };

  const handleChatSeller = async () => {
    if (!user) {
      toast.error('Please login to chat with seller.');
      navigate('/login');
      return;
    }
    if (product.seller._id === user._id) {
      toast.error('This is your own listing!');
      return;
    }

    try {
      const { data: chat } = await axiosInstance.post('/chats/initiate', {
        receiverId: product.seller._id,
        productId: product._id,
      });
      navigate(`/chat?chatId=${chat._id}`);
    } catch (err) {
      toast.error('Could not open chat session.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="glass-card rounded-3xl h-96 animate-pulse" />
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'];
  const isOwner = user && user._id === product.seller?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-3xl overflow-hidden h-96 sm:h-[480px] relative bg-slate-900 flex items-center justify-center">
            <img
              src={images[selectedImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain"
            />
            {product.isBoosted && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Featured Listing
              </span>
            )}
            {product.status === 'sold' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-500 text-white font-black text-sm uppercase px-6 py-3 rounded-full tracking-wider shadow-2xl">
                  ITEM SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-cyan-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                Condition: {product.condition}
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-3xl font-black text-cyan-400">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.isNegotiable && (
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    Negotiable
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-b border-slate-800/80 py-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Metadata Stats */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-cyan-400" /> Listed {new Date(product.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-cyan-400" /> {product.viewsCount || 1} Views</span>
            </div>

            {/* Action Buttons Grid */}
            {!isOwner ? (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleChatSeller}
                    disabled={product.status === 'sold'}
                    className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4 fill-slate-950" /> Chat Seller
                  </button>

                  <button
                    onClick={() => setOfferModalOpen(true)}
                    disabled={product.status === 'sold'}
                    className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 transition-all disabled:opacity-50"
                  >
                    <Tag className="w-4 h-4" /> Make Offer
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 py-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isWishlisted
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    {isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                  </button>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    title="Report suspicious listing"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-center space-y-2">
                <p className="text-xs font-bold text-cyan-400">This is your listing</p>
                <Link
                  to="/mylistings"
                  className="inline-block px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                >
                  Manage Listing in My Listings
                </Link>
              </div>
            )}
          </div>

          {/* Seller Profile Card */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seller Information</h3>

            <div className="flex items-center gap-4">
              <img
                src={product.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={product.seller?.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-500/40"
              />
              <div className="flex-1">
                <h4 className="font-extrabold text-slate-100 text-base flex items-center gap-1.5">
                  {product.seller?.name || 'Campus Student'}
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> {product.sellerHostel}</span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {product.seller?.ratingAverage || 5.0} ({product.seller?.ratingCount || 0})
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-slate-400 block text-[11px]">Items Sold</span>
                <span className="font-black text-cyan-400 text-base">{product.seller?.itemsSold || 0}</span>
              </div>
              <button
                onClick={() => setReviewModalOpen(true)}
                disabled={isOwner || !user}
                className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 hover:border-cyan-500/40 text-center transition-colors disabled:opacity-50"
              >
                <span className="text-slate-400 block text-[11px]">Leave Review</span>
                <span className="font-bold text-amber-400 text-xs">Rate Seller ★</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OfferModal
        product={product}
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
      />
      <ReportModal
        product={product}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
      <ReviewModal
        seller={product.seller}
        productId={product._id}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </div>
  );
};
