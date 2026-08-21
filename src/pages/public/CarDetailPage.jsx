import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiSettings,
  FiZap,
  FiCheckCircle,
  FiShield,
  FiArrowLeft,
  FiShare2,
  FiCalendar,
  FiClock,
  FiTruck,
  FiKey,
  FiPhoneCall,
  FiMaximize2,
  FiX,
  FiFileText,
  FiCheck,
  FiInfo,
} from 'react-icons/fi';
import { BsFuelPump, BsStarFill, BsLuggage, BsShieldCheck } from 'react-icons/bs';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BookingForm from '../../components/ui/BookingForm';
import TermsAndConditions from '../../components/ui/TermsAndConditions';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';

import { useTenant } from '../../contexts/TenantContext';
import { getCar, getCars } from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CarDetailPage() {
  const { carId } = useParams();
  const { tenantId } = useTenant();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'tariff' | 'terms'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCar(tenantId, carId)
      .then((data) => {
        setCar(data);
        if (data) {
          getCars(tenantId).then((all) => {
            const filtered = all.filter((c) => c.id !== carId && c.category === data.category);
            setSimilarCars(filtered.slice(0, 3));
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching car:', err);
        toast.error('Failed to load car details');
      })
      .finally(() => setLoading(false));
  }, [tenantId, carId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
        <Navbar />
        <main style={{ paddingTop: 84, flex: 1 }} className="container">
          <CarSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!car) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
        <Navbar />
        <main style={{ paddingTop: 110, flex: 1, textAlign: 'center' }} className="container">
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A' }}>Car Not Found</h2>
          <p style={{ color: '#475569', marginBottom: 16, fontWeight: 600, fontSize: 13 }}>
            The requested car listing does not exist or has been removed.
          </p>
          <Link to="/fleet" className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: 99, fontSize: 13 }}>
            Browse Fleet
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.images && car.images.length > 0
    ? car.images
    : ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80'];

  const extraKmRate = car.extraKmRate || (car.name?.toLowerCase().includes('thar') ? 14 : (car.seats === 7 ? 12 : 9));
  const extraTimeRate = car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200);
  const securityDeposit = car.securityDeposit || 2000;
  const dailyKmLimit = car.dailyKmLimit || 300;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.name} - VK Rental Cars Pune`,
        text: `Rent ${car.name} in Pune with 300 km daily limit & doorstep delivery!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Vehicle link copied to clipboard!');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi VK Rental Cars, I want to book ${car.name} (₹${car.pricePerDay || 2300}/day). Please confirm availability.`
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main className="car-detail-main">
        <div className="car-detail-container">
          
          {/* Compact Navigation Bar */}
          <div className="car-compact-nav">
            <Link to="/fleet" className="compact-back-btn">
              <FiArrowLeft size={13} /> Back to Fleet
            </Link>

            <div className="compact-crumb-info">
              <span className="crumb-item">Pune Fleet</span>
              <span className="crumb-dot">•</span>
              <span className="crumb-cat">{(car.category || 'FLEET').toUpperCase()}</span>
              <span className="crumb-dot">•</span>
              <span className="crumb-name">{car.name}</span>
            </div>
          </div>

          {/* Master 2-Column Compact Layout */}
          <div className="car-main-layout">
            
            {/* LEFT COLUMN: Gallery & Interactive Tabbed Dashboard */}
            <div className="car-left-pane">
              
              {/* Compact Showroom Gallery Card */}
              <div className="compact-gallery-card">
                <div className="compact-viewport" onClick={() => setIsLightboxOpen(true)}>
                  {/* Ambient Backdrop Depth */}
                  <img
                    src={images[selectedImageIndex]}
                    alt=""
                    aria-hidden="true"
                    className="compact-ambient-bg"
                  />

                  {/* Fully Visible Car Photo without weird cropping */}
                  <img
                    src={images[selectedImageIndex]}
                    alt={car.name}
                    className="compact-car-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />

                  {/* Floating Micro-Badges */}
                  <div className="compact-img-badges">
                    <span className="img-badge category">{(car.category || 'FLEET').toUpperCase()}</span>
                    <span className="img-badge kmlimit">⚡ {dailyKmLimit} KM/Day Included</span>
                  </div>

                  {/* Top Action Icons */}
                  <div className="compact-img-actions">
                    <button
                      type="button"
                      className="img-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                      }}
                      title="Share Vehicle"
                    >
                      <FiShare2 size={13} />
                    </button>
                    <button
                      type="button"
                      className="img-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      title="Fullscreen Preview"
                    >
                      <FiMaximize2 size={13} />
                    </button>
                  </div>

                  {/* Counter */}
                  {images.length > 1 && (
                    <div className="compact-img-counter">
                      {selectedImageIndex + 1}/{images.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="compact-thumb-strip">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`compact-thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                      >
                        <img src={img} alt={`${car.name} ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vehicle Title & Quick Highlights Bar */}
              <div className="compact-title-card">
                <div className="compact-title-row">
                  <div className="title-left">
                    <div className="compact-meta-pills">
                      {car.rating && (
                        <span className="pill-rating">
                          <BsStarFill size={10} /> {car.rating} Rating
                        </span>
                      )}
                      <span className="pill-verified">
                        <BsShieldCheck size={11} /> VK Verified
                      </span>
                      <span className="pill-available">
                        <FiCheckCircle size={10} /> Available Today
                      </span>
                    </div>

                    <h1 className="compact-vehicle-name">{car.name}</h1>
                  </div>
                </div>

                <p className="compact-vehicle-desc">
                  {car.description || 'Sanitized self-drive car with 300 KM daily limit, commercial insurance & 24/7 doorstep delivery in Pune & PCMC.'}
                </p>

                {/* Fast Inclusion Pills Bar */}
                <div className="quick-inclusions-bar">
                  <span className="q-inc-item"><FiTruck /> 30m Doorstep Delivery</span>
                  <span className="q-inc-item"><FiKey /> 300 KM Daily Quota</span>
                  <span className="q-inc-item"><FiShield /> Roadside Assistance</span>
                  <span className="q-inc-item"><FiCheck /> Zero Hidden Charges</span>
                </div>
              </div>

              {/* Compact Tabbed Content Section (Zero Vertical Bloat) */}
              <div className="compact-tabs-card">
                <div className="tabs-header-strip">
                  <button
                    type="button"
                    onClick={() => setActiveTab('specs')}
                    className={`tab-toggle-btn ${activeTab === 'specs' ? 'active' : ''}`}
                  >
                    <FiSettings size={13} /> Specifications & Specs
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('tariff')}
                    className={`tab-toggle-btn ${activeTab === 'tariff' ? 'active' : ''}`}
                  >
                    <FiClock size={13} /> Tariff & Rates
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('terms')}
                    className={`tab-toggle-btn ${activeTab === 'terms' ? 'active' : ''}`}
                  >
                    <FiFileText size={13} /> Terms & Documents
                  </button>
                </div>

                {/* Tab 1: Vehicle Specifications */}
                {activeTab === 'specs' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="tab-panel"
                  >
                    <div className="compact-specs-grid">
                      <div className="c-spec-box">
                        <span className="c-spec-label">Transmission</span>
                        <strong className="c-spec-val">
                          <FiSettings size={13} className="c-spec-icon" /> {car.transmission || 'Manual'}
                        </strong>
                      </div>

                      <div className="c-spec-box">
                        <span className="c-spec-label">Fuel Type</span>
                        <strong className="c-spec-val">
                          <BsFuelPump size={13} className="c-spec-icon" /> {car.fuelType || 'Diesel'}
                        </strong>
                      </div>

                      <div className="c-spec-box">
                        <span className="c-spec-label">Seating</span>
                        <strong className="c-spec-val">
                          <FiUsers size={13} className="c-spec-icon" /> {car.seats || 5} Seats
                        </strong>
                      </div>

                      <div className="c-spec-box">
                        <span className="c-spec-label">Mileage</span>
                        <strong className="c-spec-val">
                          <FiZap size={13} className="c-spec-icon" /> {car.mileage || '18 kmpl'}
                        </strong>
                      </div>

                      <div className="c-spec-box">
                        <span className="c-spec-label">Luggage</span>
                        <strong className="c-spec-val">
                          <BsLuggage size={13} className="c-spec-icon" /> {car.luggage || '2-3 Bags'}
                        </strong>
                      </div>

                      <div className="c-spec-box">
                        <span className="c-spec-label">Insurance</span>
                        <strong className="c-spec-val">
                          <FiShield size={13} className="c-spec-icon" /> Full Comprehensive
                        </strong>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 2: Tariff & Transparent Rates */}
                {activeTab === 'tariff' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="tab-panel"
                  >
                    <div className="compact-tariff-grid">
                      <div className="c-tariff-box">
                        <span className="c-t-label">Daily KM Limit</span>
                        <div className="c-t-val">{dailyKmLimit} KM <span className="unit">/ 24h</span></div>
                        <span className="c-t-sub">Free 300 km included</span>
                      </div>

                      <div className="c-tariff-box">
                        <span className="c-t-label">Extra KM Rate</span>
                        <div className="c-t-val">₹{extraKmRate} <span className="unit">/ km</span></div>
                        <span className="c-t-sub">After {dailyKmLimit} km</span>
                      </div>

                      <div className="c-tariff-box">
                        <span className="c-t-label">Extra Time Rate</span>
                        <div className="c-t-val">₹{extraTimeRate} <span className="unit">/ hr</span></div>
                        <span className="c-t-sub">Standard overtime charge</span>
                      </div>

                      <div className="c-tariff-box">
                        <span className="c-t-label">Refundable Deposit</span>
                        <div className="c-t-val">{formatCurrency(securityDeposit)}</div>
                        <span className="c-t-sub">Instant refund on return</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab 3: Documents & Rules */}
                {activeTab === 'terms' && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="tab-panel"
                  >
                    <div className="compact-docs-grid">
                      <div className="c-doc-item">
                        <FiCheck className="c-doc-icon" />
                        <div>
                          <strong>Valid Driving License</strong>
                          <span>Original or DigiLocker verified LMV car license.</span>
                        </div>
                      </div>
                      <div className="c-doc-item">
                        <FiCheck className="c-doc-icon" />
                        <div>
                          <strong>Aadhaar Card / Govt ID</strong>
                          <span>For quick identity and address verification.</span>
                        </div>
                      </div>
                      <div className="c-doc-item">
                        <FiCheck className="c-doc-icon" />
                        <div>
                          <strong>Age Criteria</strong>
                          <span>Driver must be 21+ years with 1+ yr driving experience.</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <TermsAndConditions expandable={true} defaultOpen={false} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Compact Sticky Booking Box */}
            <aside className="car-right-pane">
              <div className="compact-sticky-box">
                
                {/* Price Display Card */}
                <div className="compact-price-strip">
                  <div>
                    <span className="c-price-caption">TARIFF (LIVE ADMIN RATE)</span>
                    <div className="c-price-row">
                      <span className="c-price-val">{formatCurrency(car.pricePerDay || 2300)}</span>
                      <span className="c-price-period">/ 24 hrs</span>
                    </div>
                  </div>
                  <span className="c-price-tag">Best Rate</span>
                </div>

                {/* Benefits Checklist */}
                <div className="compact-perks-list">
                  <div className="c-perk">
                    <FiTruck className="c-perk-ico" />
                    <span>Doorstep Delivery in 30 Mins</span>
                  </div>
                  <div className="c-perk">
                    <FiKey className="c-perk-ico" />
                    <span>300 KM Daily Quota Included</span>
                  </div>
                  <div className="c-perk">
                    <FiShield className="c-perk-ico" />
                    <span>Comprehensive Commercial Insurance</span>
                  </div>
                </div>

                {/* Primary Booking Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="compact-btn-primary"
                >
                  <FiCalendar size={15} /> Book / Inquire Vehicle
                </motion.button>

                {/* Direct WhatsApp CTA */}
                <a
                  href={`https://wa.me/918381052230?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="compact-btn-whatsapp"
                >
                  <FaWhatsapp size={16} /> Instant WhatsApp Booking
                </a>

                {/* Phone Call Support */}
                <a href="tel:+918381052230" className="compact-btn-call">
                  <FiPhoneCall size={12} /> Direct Call: +91 8381052230
                </a>

                {/* Security Guarantee */}
                <div className="compact-trust-strip">
                  <span>🔒 Zero Hidden Fees</span>
                  <span>•</span>
                  <span>💯 Sanitized Fleet</span>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar Recommended Cars */}
          {similarCars.length > 0 && (
            <div className="compact-similar-section">
              <div className="similar-title-bar">
                <h2 className="similar-title">Similar Recommended Vehicles</h2>
                <Link to="/fleet" className="similar-viewall">
                  View All Fleet <FiArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </Link>
              </div>
              <div className="grid-3">
                {similarCars.map((sCar) => (
                  <RevvCarCard key={sCar.id} car={sCar} onEnquire={(c) => navigate(`/cars/${c.id}`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Bar for Mobile View */}
      <div className="mobile-bottom-bar">
        <div className="mobile-b-price">
          <span className="val">{formatCurrency(car.pricePerDay || 2300)}</span>
          <span className="unit">/ 24 hrs</span>
        </div>

        <div className="mobile-b-actions">
          <a
            href={`https://wa.me/918381052230?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-wa-icon"
            title="WhatsApp Inquiry"
          >
            <FaWhatsapp size={18} />
          </a>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mobile-book-btn"
          >
            <FiCalendar size={14} /> Book Now
          </button>
        </div>
      </div>

      {/* Booking Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Book ${car.name}`}
      >
        <BookingForm
          car={car}
          onSuccess={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* High-Resolution Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
            >
              <FiX size={22} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[selectedImageIndex]}
                alt={car.name}
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <strong>{car.name}</strong> • {car.category?.toUpperCase()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style>{`
        .car-detail-main {
          padding-top: 74px;
          padding-bottom: 30px;
          flex: 1;
        }
        .car-detail-container {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 14px;
        }

        /* Top Navigation Strip */
        .car-compact-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .compact-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 800;
          color: #FF4500;
          text-decoration: none;
          background: rgba(255, 69, 0, 0.08);
          padding: 4px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 69, 0, 0.22);
          transition: all 0.18s ease;
        }
        .compact-back-btn:hover {
          background: #FF4500;
          color: #FFFFFF;
        }
        .compact-crumb-info {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #64748B;
          font-weight: 700;
        }
        .crumb-dot { color: #CBD5E1; }
        .crumb-cat {
          background: #EEF2F6;
          color: #334155;
          padding: 1px 6px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 800;
        }
        .crumb-name { color: #0F172A; font-weight: 800; }

        /* Master 2-Column Grid */
        .car-main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 16px;
          align-items: start;
        }
        .car-left-pane {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }
        .car-right-pane {
          position: sticky;
          top: 80px;
          align-self: start;
        }

        /* Compact Gallery */
        .compact-gallery-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 6px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 14px rgba(15, 23, 42, 0.04);
        }
        .compact-viewport {
          position: relative;
          width: 100%;
          height: 290px;
          border-radius: 10px;
          overflow: hidden;
          background: #0B0F19;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .compact-ambient-bg {
          position: absolute;
          inset: -20px;
          width: calc(100% + 40px);
          height: calc(100% + 40px);
          object-fit: cover;
          filter: blur(28px) brightness(0.35) saturate(1.2);
          opacity: 0.75;
          pointer-events: none;
          z-index: 1;
        }
        .compact-car-img {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          padding: 6px;
          transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .compact-viewport:hover .compact-car-img {
          transform: scale(1.025);
        }

        .compact-img-badges {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          gap: 5px;
          z-index: 3;
        }
        .img-badge.category {
          background: #FF4500;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 999px;
        }
        .img-badge.kmlimit {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .compact-img-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 5px;
          z-index: 3;
        }
        .img-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #E2E8F0;
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .img-action-btn:hover {
          background: #FF4500;
          color: #FFFFFF;
          border-color: #FF4500;
        }

        .compact-img-counter {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(15, 23, 42, 0.80);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          z-index: 3;
        }

        .compact-thumb-strip {
          display: flex;
          gap: 6px;
          margin-top: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .compact-thumb-strip::-webkit-scrollbar { display: none; }
        .compact-thumb-btn {
          width: 58px;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          padding: 0;
          border: 1.5px solid #E2E8F0;
          background: #0F172A;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .compact-thumb-btn.active {
          border-color: #FF4500;
          box-shadow: 0 0 0 1.5px rgba(255, 69, 0, 0.3);
        }
        .compact-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Compact Title Card */
        .compact-title-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 12px 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.03);
        }
        .compact-meta-pills {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .pill-rating {
          font-size: 10.5px;
          font-weight: 800;
          background: #FEF3C7;
          color: #B45309;
          padding: 2px 7px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .pill-verified {
          font-size: 10.5px;
          font-weight: 800;
          background: #EFF6FF;
          color: #1D4ED8;
          padding: 2px 7px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .pill-available {
          font-size: 10.5px;
          font-weight: 800;
          background: #DCFCE7;
          color: #15803D;
          padding: 2px 7px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .compact-vehicle-name {
          font-size: clamp(20px, 2.5vw, 24px);
          font-weight: 900;
          color: #0F172A;
          margin: 2px 0;
          line-height: 1.2;
        }
        .compact-vehicle-desc {
          font-size: 12.5px;
          color: #475569;
          margin: 2px 0 8px;
          line-height: 1.45;
          font-weight: 600;
        }
        .quick-inclusions-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-top: 8px;
          border-top: 1px solid #F1F5F9;
        }
        .q-inc-item {
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Compact Tabs Card */
        .compact-tabs-card {
          background: #FFFFFF;
          border-radius: 14px;
          padding: 12px 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.03);
        }
        .tabs-header-strip {
          display: flex;
          gap: 6px;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 8px;
          margin-bottom: 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tabs-header-strip::-webkit-scrollbar { display: none; }
        .tab-toggle-btn {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #64748B;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .tab-toggle-btn:hover {
          color: #0F172A;
          border-color: #CBD5E1;
        }
        .tab-toggle-btn.active {
          background: #FF4500;
          color: #FFFFFF;
          border-color: #FF4500;
          box-shadow: 0 2px 8px rgba(255, 69, 0, 0.3);
        }

        /* Specs Grid */
        .compact-specs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .c-spec-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .c-spec-label {
          font-size: 9.5px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          display: block;
        }
        .c-spec-val {
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
          text-transform: capitalize;
        }
        .c-spec-icon { color: #FF4500; flex-shrink: 0; }

        /* Tariff Grid */
        .compact-tariff-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .c-tariff-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .c-t-label {
          font-size: 10px;
          color: #64748B;
          font-weight: 800;
          display: block;
        }
        .c-t-val {
          font-size: 15px;
          font-weight: 900;
          color: #0F172A;
          margin: 2px 0 0;
        }
        .c-t-val .unit {
          font-size: 11px;
          color: #64748B;
          font-weight: 700;
        }
        .c-t-sub {
          font-size: 10px;
          color: #15803D;
          font-weight: 700;
          display: block;
        }

        /* Docs Grid */
        .compact-docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }
        .c-doc-item {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          background: #F8FAFC;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          font-size: 12px;
        }
        .c-doc-icon {
          color: #16A34A;
          font-size: 14px;
          margin-top: 1px;
          flex-shrink: 0;
        }
        .c-doc-item strong {
          display: block;
          color: #0F172A;
          font-weight: 800;
          font-size: 11.5px;
        }
        .c-doc-item span {
          color: #64748B;
          font-size: 11px;
        }

        /* Sticky Booking Sidebar */
        .compact-sticky-box {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 16px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .compact-price-strip {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #F1F5F9;
          padding-bottom: 10px;
        }
        .c-price-caption {
          font-size: 9.5px;
          font-weight: 900;
          color: #64748B;
          letter-spacing: 0.5px;
          display: block;
        }
        .c-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-top: 2px;
        }
        .c-price-val {
          font-size: 26px;
          font-weight: 900;
          color: #FF4500;
          line-height: 1;
        }
        .c-price-period {
          font-size: 12px;
          color: #475569;
          font-weight: 800;
        }
        .c-price-tag {
          font-size: 9.5px;
          font-weight: 800;
          background: #DCFCE7;
          color: #15803D;
          padding: 2.5px 7px;
          border-radius: 999px;
        }

        .compact-perks-list {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .c-perk {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #1E293B;
          font-weight: 800;
        }
        .c-perk-ico {
          color: #FF4500;
          flex-shrink: 0;
          font-size: 13px;
        }

        .compact-btn-primary {
          width: 100%;
          padding: 12px;
          font-size: 14px;
          font-weight: 900;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF4500 0%, #E63900 100%);
          box-shadow: 0 4px 16px rgba(255, 69, 0, 0.35);
          color: #FFFFFF;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .compact-btn-primary:hover {
          box-shadow: 0 6px 20px rgba(255, 69, 0, 0.5);
        }

        .compact-btn-whatsapp {
          width: 100%;
          padding: 9.5px 12px;
          font-size: 12.5px;
          font-weight: 800;
          border-radius: 8px;
          background: #F0FDF4;
          color: #15803D;
          border: 1px solid #BBF7D0;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.18s ease;
        }
        .compact-btn-whatsapp:hover {
          background: #DCFCE7;
        }

        .compact-btn-call {
          width: 100%;
          padding: 6px;
          font-size: 11.5px;
          font-weight: 700;
          color: #475569;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.18s ease;
        }
        .compact-btn-call:hover {
          color: #0F172A;
          text-decoration: underline;
        }

        .compact-trust-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px dashed #E2E8F0;
          padding-top: 8px;
          gap: 8px;
          font-size: 10.5px;
          color: #64748B;
          font-weight: 700;
        }

        /* Similar Fleet */
        .compact-similar-section {
          margin-top: 24px;
        }
        .similar-title-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .similar-title {
          font-size: 17px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }
        .similar-viewall {
          font-size: 12px;
          font-weight: 800;
          color: #FF4500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        /* Mobile Bottom Bar */
        .mobile-bottom-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          padding: 8px 14px;
          box-shadow: 0 -4px 18px rgba(0,0,0,0.1);
          border-top: 1px solid #E2E8F0;
          z-index: 99;
          align-items: center;
          justify-content: space-between;
        }
        .mobile-b-price {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }
        .mobile-b-price .val {
          font-size: 18px;
          font-weight: 900;
          color: #FF4500;
        }
        .mobile-b-price .unit {
          font-size: 10.5px;
          font-weight: 700;
          color: #64748B;
        }
        .mobile-b-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mobile-wa-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #25D366;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .mobile-book-btn {
          padding: 9px 15px;
          background: linear-gradient(135deg, #FF4500 0%, #E63900 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .lightbox-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255,255,255,0.15);
          border: none;
          color: #FFFFFF;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .lightbox-content {
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 10px;
        }
        .lightbox-caption {
          color: #FFFFFF;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 700;
        }

        /* Breakpoints */
        @media (max-width: 920px) {
          .car-main-layout {
            grid-template-columns: minmax(0, 1fr) 280px;
            gap: 12px;
          }
          .compact-specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .compact-viewport {
            height: 250px;
          }
        }
        @media (max-width: 768px) {
          .car-main-layout {
            grid-template-columns: 1fr;
          }
          .car-right-pane {
            position: static;
          }
          .mobile-bottom-bar {
            display: flex;
          }
          .car-detail-main {
            padding-bottom: 70px;
          }
          .compact-viewport {
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
