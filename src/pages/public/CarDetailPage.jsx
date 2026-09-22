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
  FiCheck,
  FiArrowRight,
  FiFileText,
  FiRadio,
  FiLock,
  FiNavigation,
  FiSmile
} from 'react-icons/fi';
import { BsFuelPump, BsStarFill, BsShieldCheck } from 'react-icons/bs';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';
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
  const { tenantId, settings } = useTenant();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const phoneNumber = settings?.phone || '+91 8381052230';
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  useEffect(() => {
    setLoading(true);
    setSelectedImageIndex(0);
    getCar(tenantId, carId)
      .then((data) => {
        setCar(data);
        if (data) {
          getCars(tenantId).then((all) => {
            const filtered = all.filter((c) => c.id !== carId && (c.category === data.category || c.isPopular));
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
        <main style={{ paddingTop: 90, paddingBottom: 40, flex: 1 }} className="container">
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
        <main style={{ paddingTop: 110, paddingBottom: 60, flex: 1, textAlign: 'center' }} className="container">
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}>Car Not Found</h2>
          <p style={{ color: '#64748B', marginBottom: 20, fontSize: 14 }}>
            The requested vehicle listing does not exist or has been removed from our fleet.
          </p>
          <Link to="/fleet" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 99, fontSize: 14, fontWeight: 800 }}>
            <FiArrowLeft /> Browse All Fleet
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.images && car.images.length > 0
    ? car.images
    : ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'];

  const extraKmRate = car.extraKmRate || (car.name?.toLowerCase().includes('thar') ? 14 : (car.seats === 7 ? 7 : 6));
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

  const carSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": `${car.name} - Self Drive Rental in Pune`,
    "image": images[0] || 'https://vkcarrentalpune.com/vklogo1.png',
    "description": `Rent ${car.name} (${car.transmission || 'Manual'}, ${car.fuelType || 'Petrol'}, ${car.seats || 5} Seats) in Pune with 300 km daily limit and doorstep delivery by VK RENTAL CARS PUNE.`,
    "brand": {
      "@type": "Brand",
      "name": car.brand || car.name.split(' ')[0] || "VK RENTAL CARS"
    },
    "offers": {
      "@type": "Offer",
      "price": car.pricePerDay || 2300,
      "priceCurrency": "INR",
      "availability": car.available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "AutoRental",
        "name": "VK RENTAL CARS PUNE",
        "telephone": phoneNumber
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <SEO
        title={`Rent ${car.name} in Pune | Self Drive Car Rental | VK RENTAL CARS`}
        description={`Rent ${car.name} (${car.transmission || 'Manual'}, ${car.fuelType || 'Petrol'}) for ₹${car.pricePerDay || 2300}/day in Pune. 300 km daily limit included, zero deposit options, doorstep delivery across Pune & PCMC.`}
        keywords={`${car.name} rental Pune, rent ${car.name} Pune, self drive ${car.name}, VK Rental Cars ${car.name}, car hire Pune`}
        canonicalPath={`/cars/${carId}`}
        ogImage={images[0] || 'https://vkcarrentalpune.com/vklogo1.png'}
        schemaJson={carSchema}
      />
      <Navbar />

      <main className="car-detail-page">
        <div className="car-detail-container">

          {/* 1. TOP BREADCRUMB & BACK BUTTON */}
          <div className="car-detail-nav">
            <Link to="/fleet" className="car-back-link">
              <FiArrowLeft size={14} /> Back to All Fleet
            </Link>
            <div className="car-nav-trail">
              <span>Pune Fleet</span>
              <span className="sep">/</span>
              <span className="cat-chip">{(car.category || 'FLEET').toUpperCase()}</span>
              <span className="sep">/</span>
              <span className="cur-name">{car.name}</span>
            </div>
          </div>

          {/* 2. FULL PROFESSIONAL TWO-COLUMN SPLIT LAYOUT */}
          <div className="car-main-layout">

            {/* ── LEFT COLUMN: Gallery & Vehicle Specs ── */}
            <div className="car-left-col">

              {/* 📸 Automotive Vehicle Showcase (No Awkward Zoom / Crops) */}
              <section className="car-gallery-card">
                <div className="car-showcase-stage" onClick={() => setIsLightboxOpen(true)}>
                  
                  {/* Atmospheric Backdrop Lighting */}
                  <img
                    src={images[selectedImageIndex]}
                    alt=""
                    aria-hidden="true"
                    className="car-stage-blur-bg"
                  />

                  {/* Complete, Uncropped Vehicle Image */}
                  <img
                    src={images[selectedImageIndex]}
                    alt={car.name}
                    className="car-stage-main-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />

                  {/* Floating Status Badges */}
                  <div className="stage-badges-top-left">
                    {car.isPopular && (
                      <span className="stage-badge popular">🔥 POPULAR CHOICE</span>
                    )}
                    <span className="stage-badge category">{(car.category || 'FLEET').toUpperCase()}</span>
                    <span className="stage-badge limit">⚡ {dailyKmLimit} KM/Day Included</span>
                  </div>

                  {/* Share & Zoom CTAs */}
                  <div className="stage-actions-top-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                      }}
                      className="stage-action-btn"
                      title="Share Vehicle"
                    >
                      <FiShare2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="stage-action-btn"
                      title="Full Screen View"
                    >
                      <FiMaximize2 size={15} />
                    </button>
                  </div>

                  {images.length > 1 && (
                    <div className="stage-counter">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Multi-angle Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="stage-thumbs-strip">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`stage-thumb-item ${selectedImageIndex === idx ? 'active' : ''}`}
                      >
                        <img src={img} alt={`${car.name} angle ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* 🏷️ Vehicle Identity & Compact Overview */}
              <section className="car-info-card">
                <div className="car-badges-row">
                  <span className="info-verified"><BsShieldCheck size={13} /> VK Verified Fleet</span>
                  <span className="info-rating"><BsStarFill size={11} /> 4.9 (500+ Trips)</span>
                  <span className="info-available"><FiCheckCircle size={12} /> Ready for Handover</span>
                </div>

                <h1 className="car-title-heading">{car.name}</h1>
                <p className="car-desc-text">
                  {car.description || `${car.name} with ${car.transmission || 'Manual'} transmission and ${car.fuelType || 'Petrol'} engine. 100% sanitized, commercial tourist permit, 300 KM daily limit, and 30-min doorstep delivery across Pune & PCMC.`}
                </p>

                {/* ⚙️ Compact Key Specs Grid */}
                <h3 className="section-sub-heading">Key Specifications</h3>
                <div className="car-specs-grid">
                  <div className="spec-card">
                    <div className="spec-icon-box"><FiSettings size={18} /></div>
                    <div>
                      <span className="spec-label">Transmission</span>
                      <strong className="spec-value">{car.transmission ? car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1) : 'Manual'}</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><BsFuelPump size={18} /></div>
                    <div>
                      <span className="spec-label">Fuel Type</span>
                      <strong className="spec-value">{car.fuelType ? car.fuelType.toUpperCase() : 'PETROL'}</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><FiUsers size={18} /></div>
                    <div>
                      <span className="spec-label">Seating</span>
                      <strong className="spec-value">{car.seats || 5} Passenger Seats</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><FiKey size={18} /></div>
                    <div>
                      <span className="spec-label">Daily Limit</span>
                      <strong className="spec-value">{dailyKmLimit} KM Included</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><FiClock size={18} /></div>
                    <div>
                      <span className="spec-label">Extra KM Rate</span>
                      <strong className="spec-value">₹{extraKmRate}/km</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><FiShield size={18} /></div>
                    <div>
                      <span className="spec-label">Overtime Rate</span>
                      <strong className="spec-value">₹{extraTimeRate}/hr</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><FiZap size={18} /></div>
                    <div>
                      <span className="spec-label">Security Deposit</span>
                      <strong className="spec-value">{formatCurrency(securityDeposit)}</strong>
                    </div>
                  </div>

                  <div className="spec-card">
                    <div className="spec-icon-box"><FiTruck size={18} /></div>
                    <div>
                      <span className="spec-label">Handover</span>
                      <strong className="spec-value">Doorstep Delivery</strong>
                    </div>
                  </div>
                </div>

                {/* 🌟 Included Amenities */}
                <h3 className="section-sub-heading" style={{ marginTop: 22 }}>Included Features</h3>
                <div className="car-features-pills">
                  <span className="feature-pill"><FiCheck color="#B80000" /> Air Conditioning & Heater</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> Power Steering & Windows</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> Bluetooth / Aux Audio</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> Dual Airbags & ABS</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> Fastag Enabled</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> Spare Tyre & Toolkit</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> Deep Cleaned & Sanitized</span>
                  <span className="feature-pill"><FiCheck color="#B80000" /> 24/7 Roadside Assistance</span>
                </div>
              </section>

              {/* 📄 Compact Policy & Documentation Accordion */}
              <section className="car-policy-section">
                <TermsAndConditions expandable={true} defaultOpen={false} compact={true} />
              </section>

            </div>

            {/* ── RIGHT COLUMN: Sticky Professional Tariff & Booking Card ── */}
            <div className="car-right-col">
              <aside className="sticky-booking-sidebar">
                <div className="sidebar-tariff-card">
                  
                  {/* Tariff Header */}
                  <div className="tariff-header-block">
                    <div className="tariff-badge-wrap">
                      <span className="tariff-official-tag">OFFICIAL TARIFF</span>
                      <span className="tariff-guarantee-tag"><BsShieldCheck /> Best Price Guaranteed</span>
                    </div>

                    <div className="tariff-price-display">
                      <span className="tariff-currency">₹</span>
                      <span className="tariff-amount">{car.pricePerDay || 2300}</span>
                      <span className="tariff-period">/ 24 hrs</span>
                    </div>

                    <div className="tariff-sub-note">
                      ⚡ <strong>{dailyKmLimit} KM daily limit included</strong> with every booking.
                    </div>
                  </div>

                  {/* Transparent Calculation & Inclusions */}
                  <div className="tariff-breakdown-list">
                    <div className="breakdown-item">
                      <span className="item-label"><FiKey /> Daily Limit</span>
                      <strong className="item-val">{dailyKmLimit} KM / 24 hrs</strong>
                    </div>
                    <div className="breakdown-item">
                      <span className="item-label"><FiClock /> Extra KM Charge</span>
                      <strong className="item-val">₹{extraKmRate}/km</strong>
                    </div>
                    <div className="breakdown-item">
                      <span className="item-label"><FiLock /> Refundable Deposit</span>
                      <strong className="item-val">{formatCurrency(securityDeposit)}</strong>
                    </div>
                    <div className="breakdown-item">
                      <span className="item-label"><FiTruck /> Delivery Location</span>
                      <strong className="item-val">Pune &amp; PCMC Doorstep</strong>
                    </div>
                  </div>

                  {/* Primary & Secondary Action CTAs */}
                  <div className="sidebar-action-buttons">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="btn-sidebar-book-now"
                    >
                      <FiCalendar size={18} />
                      <span>Book / Inquire Fleet</span>
                      <FiArrowRight size={16} />
                    </button>

                    <a
                      href={`https://wa.me/${cleanPhone || '918381052230'}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sidebar-whatsapp"
                    >
                      <FaWhatsapp size={19} />
                      <span>Instant WhatsApp Booking</span>
                    </a>

                    <a href={`tel:${cleanPhone || '+918381052230'}`} className="btn-sidebar-phone">
                      <FiPhoneCall size={15} />
                      <span>Direct Call: {phoneNumber}</span>
                    </a>
                  </div>

                  {/* Trust Highlights */}
                  <div className="sidebar-trust-checklist">
                    <div className="trust-check-row">
                      <FiCheckCircle size={15} color="#16A34A" />
                      <span>Zero hidden charges • Transparent booking</span>
                    </div>
                    <div className="trust-check-row">
                      <FiCheckCircle size={15} color="#16A34A" />
                      <span>30-Min doorstep delivery across Pune</span>
                    </div>
                    <div className="trust-check-row">
                      <FiCheckCircle size={15} color="#16A34A" />
                      <span>100% sanitized &amp; serviced vehicles</span>
                    </div>
                    <div className="trust-check-row">
                      <FiCheckCircle size={15} color="#16A34A" />
                      <span>Pay rental + deposit at car pickup</span>
                    </div>
                  </div>

                </div>
              </aside>
            </div>

          </div>

          {/* 3. SIMILAR RECOMMENDED VEHICLES (Full Width Below) */}
          {similarCars.length > 0 && (
            <section className="similar-vehicles-section">
              <div className="similar-header">
                <div>
                  <span className="similar-sub-badge">SIMILAR FLEET</span>
                  <h2 className="similar-main-title">Recommended Alternatives in Pune</h2>
                </div>
                <Link to="/fleet" className="similar-see-all">
                  <span>View All Fleet</span> <FiArrowRight size={14} />
                </Link>
              </div>

              <div className="similar-cars-grid">
                {similarCars.map((sCar) => (
                  <RevvCarCard
                    key={sCar.id}
                    car={sCar}
                    onEnquire={() => navigate(`/cars/${sCar.id}`)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* 📱 Mobile Sticky Bottom Booking Bar */}
      <div className="mobile-bottom-booking-bar">
        <div className="mobile-bar-price">
          <span className="bar-amt">{formatCurrency(car.pricePerDay || 2300)}</span>
          <span className="bar-sub">/ 24 hrs • {dailyKmLimit} km</span>
        </div>
        <div className="mobile-bar-ctas">
          <a
            href={`https://wa.me/${cleanPhone || '918381052230'}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-bar-whatsapp-btn"
            aria-label="WhatsApp Booking"
          >
            <FaWhatsapp size={18} />
          </a>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mobile-bar-book-btn"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Interactive Booking Form Modal */}
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

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="car-lightbox-backdrop"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setIsLightboxOpen(false)}
            >
              <FiX size={24} />
            </button>
            <div className="lightbox-image-box" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[selectedImageIndex]}
                alt={car.name}
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <strong>{car.name}</strong> • {(car.category || 'FLEET').toUpperCase()} • 300 KM/Day Included
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* ── Ultra-Professional Styling ── */}
      <style>{`
        .car-detail-page {
          padding-top: 86px;
          padding-bottom: 50px;
          flex: 1;
        }
        .car-detail-container {
          max-width: 1260px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ─── Breadcrumb Navigation ─── */
        .car-detail-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .car-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
          color: #B80000;
          text-decoration: none;
          background: rgba(184, 0, 0, 0.08);
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(184, 0, 0, 0.25);
          transition: all 0.2s ease;
        }
        .car-back-link:hover {
          background: #B80000;
          color: #FFFFFF;
        }
        .car-nav-trail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748B;
          font-weight: 700;
        }
        .car-nav-trail .sep { color: #CBD5E1; }
        .car-nav-trail .cat-chip {
          background: #E2E8F0;
          color: #0F172A;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 900;
        }
        .car-nav-trail .cur-name { color: #0F172A; font-weight: 800; }

        /* ─── Main 2-Column Grid Layout ─── */
        .car-main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) 400px;
          gap: 28px;
          align-items: start;
        }

        /* ─── LEFT COLUMN: Vehicle Stage & Specs ─── */
        .car-gallery-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 12px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          margin-bottom: 20px;
        }
        .car-showcase-stage {
          position: relative;
          width: 100%;
          height: 400px;
          background: radial-gradient(circle at center, #1E293B 0%, #0B0F19 100%);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Blurred Backdrop for atmospheric lighting without ugly borders */
        .car-stage-blur-bg {
          position: absolute;
          inset: -10%;
          width: 120%;
          height: 120%;
          object-fit: cover;
          filter: blur(28px) brightness(0.6);
          opacity: 0.45;
          pointer-events: none;
        }
        /* Foreground Main Vehicle - 100% Uncropped & Proportionate */
        .car-stage-main-img {
          position: relative;
          z-index: 1;
          max-width: 94%;
          max-height: 90%;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.65));
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .car-showcase-stage:hover .car-stage-main-img {
          transform: scale(1.03);
        }

        .stage-badges-top-left {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          z-index: 2;
        }
        .stage-badge {
          font-size: 11px;
          font-weight: 900;
          padding: 4px 12px;
          border-radius: 999px;
          letter-spacing: 0.3px;
        }
        .stage-badge.popular {
          background: linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%);
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(184, 0, 0, 0.45);
        }
        .stage-badge.category {
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          backdrop-filter: blur(6px);
        }
        .stage-badge.limit {
          background: rgba(255, 255, 255, 0.95);
          color: #B80000;
          font-weight: 800;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .stage-actions-top-right {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }
        .stage-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.25);
        }
        .stage-action-btn:hover {
          background: #B80000;
          color: #FFFFFF;
          border-color: #B80000;
          transform: scale(1.08);
        }
        .stage-counter {
          position: absolute;
          bottom: 14px;
          right: 14px;
          background: rgba(15, 23, 42, 0.8);
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 999px;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        .stage-thumbs-strip {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .stage-thumb-item {
          width: 86px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
          background: #0B0F19;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .stage-thumb-item.active {
          border-color: #B80000;
          box-shadow: 0 2px 12px rgba(184, 0, 0, 0.4);
        }
        .stage-thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ─── Vehicle Info Card ─── */
        .car-info-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 26px;
          border: 1.5px solid #E2E8F0;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          margin-bottom: 20px;
        }
        .car-badges-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .info-verified {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #EFF6FF;
          color: #2563EB;
          font-size: 11.5px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #BFDBFE;
        }
        .info-rating {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFFBEB;
          color: #D97706;
          font-size: 11.5px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #FDE68A;
        }
        .info-available {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #F0FDF4;
          color: #16A34A;
          font-size: 11.5px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid #BBF7D0;
        }
        .car-title-heading {
          font-size: clamp(24px, 3.2vw, 32px);
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 10px;
          line-height: 1.25;
        }
        .car-desc-text {
          font-size: 14.5px;
          color: #64748B;
          line-height: 1.65;
          margin: 0 0 22px;
        }
        .section-sub-heading {
          font-size: 16px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 14px;
          letter-spacing: -0.2px;
        }

        /* ─── Compact Specs Grid (4 Cols) ─── */
        .car-specs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .spec-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #F8FAFC;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
        }
        .spec-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(184, 0, 0, 0.08);
          color: #B80000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .spec-label {
          display: block;
          font-size: 10px;
          color: #64748B;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        }
        .spec-value {
          display: block;
          font-size: 13px;
          font-weight: 900;
          color: #0F172A;
        }

        /* ─── Included Features Pills ─── */
        .car-features-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 700;
          color: #1E293B;
          background: #F1F5F9;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid #E2E8F0;
        }

        /* ─── Policy Accordion ─── */
        .car-policy-section {
          margin-top: 10px;
          margin-bottom: 20px;
        }

        /* ─── RIGHT COLUMN: Sticky Tariff Sidebar ─── */
        .sticky-booking-sidebar {
          position: sticky;
          top: 92px;
        }
        .sidebar-tariff-card {
          background: linear-gradient(180deg, #0A0E18 0%, #101626 100%);
          border-radius: 24px;
          padding: 26px;
          border: 1.5px solid rgba(184, 0, 0, 0.40);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
          color: #FFFFFF;
        }
        .tariff-badge-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .tariff-official-tag {
          font-size: 10.5px;
          font-weight: 900;
          color: #E61800;
          letter-spacing: 0.8px;
        }
        .tariff-guarantee-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 800;
          color: #4ADE80;
        }
        .tariff-price-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 6px;
        }
        .tariff-currency {
          font-size: 26px;
          font-weight: 900;
          color: #E61800;
        }
        .tariff-amount {
          font-size: 44px;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1;
        }
        .tariff-period {
          font-size: 15px;
          color: #94A3B8;
          font-weight: 700;
          margin-left: 2px;
        }
        .tariff-sub-note {
          font-size: 12.5px;
          color: #CBD5E1;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .tariff-sub-note strong {
          color: #FFB800;
        }

        .tariff-breakdown-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-bottom: 22px;
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }
        .breakdown-item .item-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #94A3B8;
          font-weight: 600;
        }
        .breakdown-item .item-val {
          color: #FFFFFF;
          font-weight: 800;
        }

        .sidebar-action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 22px;
        }
        .btn-sidebar-book-now {
          background: linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 900;
          padding: 14px 20px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(184, 0, 0, 0.45);
          transition: all 0.2s ease;
          width: 100%;
        }
        .btn-sidebar-book-now:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(184, 0, 0, 0.6);
        }
        .btn-sidebar-whatsapp {
          background: #25D366;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 900;
          padding: 13px 20px;
          border-radius: 999px;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
          transition: all 0.2s ease;
          width: 100%;
        }
        .btn-sidebar-whatsapp:hover {
          background: #1EBE5D;
          transform: translateY(-2px);
        }
        .btn-sidebar-phone {
          background: rgba(255, 255, 255, 0.08);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 800;
          padding: 11px 18px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .btn-sidebar-phone:hover {
          background: rgba(255, 255, 255, 0.18);
        }

        .sidebar-trust-checklist {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .trust-check-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #CBD5E1;
          font-weight: 600;
        }

        /* ─── Similar Vehicles Grid ─── */
        .similar-vehicles-section {
          margin-top: 40px;
          margin-bottom: 20px;
        }
        .similar-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .similar-sub-badge {
          display: block;
          font-size: 11px;
          color: #B80000;
          font-weight: 900;
          letter-spacing: 0.8px;
          margin-bottom: 2px;
        }
        .similar-main-title {
          font-size: clamp(20px, 3.2vw, 26px);
          font-weight: 900;
          color: #0F172A;
          margin: 0;
        }
        .similar-see-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 800;
          color: #B80000;
          text-decoration: none;
        }
        .similar-see-all:hover {
          text-decoration: underline;
        }
        .similar-cars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* ─── Mobile Sticky Bottom Bar ─── */
        .mobile-bottom-booking-bar {
          display: none;
        }

        /* ─── Lightbox Modal ─── */
        .car-lightbox-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.94);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .lightbox-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #FFFFFF;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .lightbox-close-btn:hover {
          background: #B80000;
        }
        .lightbox-image-box {
          max-width: 90vw;
          max-height: 85vh;
          text-align: center;
        }
        .lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          border-radius: 12px;
          object-fit: contain;
        }
        .lightbox-caption {
          color: #FFFFFF;
          margin-top: 12px;
          font-size: 14px;
        }

        /* ─── Responsive Media Queries ─── */
        @media (max-width: 1024px) {
          .car-main-layout {
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 20px;
          }
          .car-specs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 880px) {
          .car-main-layout {
            grid-template-columns: 1fr;
          }
          .sticky-booking-sidebar {
            position: static;
          }
          .similar-cars-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 640px) {
          .car-detail-page {
            padding-top: 76px;
            padding-bottom: 90px; /* Space for mobile sticky bottom bar */
          }
          .car-detail-container {
            padding: 0 12px;
          }
          .car-gallery-card {
            padding: 8px;
            border-radius: 16px;
          }
          .car-showcase-stage {
            height: 250px;
            border-radius: 12px;
          }
          .stage-badges-top-left .stage-badge {
            font-size: 9.5px;
            padding: 3px 8px;
          }
          .car-info-card {
            padding: 16px;
            border-radius: 16px;
          }
          .car-title-heading {
            font-size: 20px !important;
          }
          .car-desc-text {
            font-size: 13px !important;
          }
          .car-specs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .spec-card {
            padding: 9px 10px;
            gap: 8px;
          }
          .spec-icon-box {
            width: 30px;
            height: 30px;
          }
          .spec-label {
            font-size: 9px;
          }
          .spec-value {
            font-size: 11.5px;
          }
          .feature-pill {
            font-size: 11px;
            padding: 5px 10px;
          }
          .similar-cars-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          /* Mobile Sticky Bottom Bar Display */
          .mobile-bottom-booking-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background: rgba(10, 14, 24, 0.96);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 12px 16px;
            border-top: 1.5px solid rgba(184, 0, 0, 0.4);
            box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.35);
          }
          .mobile-bar-price {
            display: flex;
            flex-direction: column;
          }
          .mobile-bar-price .bar-amt {
            font-size: 19px;
            font-weight: 900;
            color: #FFFFFF;
            line-height: 1.1;
          }
          .mobile-bar-price .bar-sub {
            font-size: 10.5px;
            color: #CBD5E1;
            font-weight: 600;
          }
          .mobile-bar-ctas {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .mobile-bar-whatsapp-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #25D366;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
          }
          .mobile-bar-book-btn {
            background: linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%);
            color: #FFFFFF;
            font-size: 13.5px;
            font-weight: 900;
            padding: 10px 18px;
            border-radius: 999px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(184, 0, 0, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
