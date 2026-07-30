import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { FiSearch, FiMapPin, FiCalendar, FiChevronLeft, FiChevronRight, FiShield, FiClock, FiKey, FiTruck, FiArrowRight, FiZap, FiCheckCircle, FiStar } from 'react-icons/fi';
import { BsCarFront, BsStarFill, BsAward, BsCarFrontFill, BsWhatsapp } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';
import TermsAndConditions from '../../components/ui/TermsAndConditions';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars, subscribeToReviews } from '../../firebase/firestore';

import heroBgImg from '../../assets/vkherobg1.jpg';
import logoImg from '../../assets/vklogo1.png';

const CITIES = ['Pune', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];

const CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', desc: 'Swift, i20, Baleno — Easy city handling & peppy drive', icon: <BsCarFront size={24} /> },
  { id: 'sedan', name: 'Sedan & CNG', desc: 'Dzire CNG — Maximum fuel efficiency for long trips', icon: <BsCarFrontFill size={24} /> },
  { id: 'suv', name: 'SUV & 4x4', desc: 'Thar 4x4, Punch, Venue — Off-road power & ground clearance', icon: <FiTruck size={24} /> },
  { id: 'muv', name: '7-Seater MUV', desc: 'Ertiga Manual & Automatic — Spacious 7-seater family comfort', icon: <BsCarFront size={24} /> },
];

const FEATURES = [
  { icon: <FiTruck size={22} />, title: 'Doorstep Delivery', desc: 'Sanitized cars delivered right to your home or airport terminal.' },
  { icon: <FiKey size={22} />, title: 'Unlimited Kilometers', desc: 'Drive freely without counting kilometers or extra per-km fees.' },
  { icon: <FiShield size={22} />, title: 'Insurance Included', desc: 'Comprehensive damage coverage and All India Tourist Permit.' },
  { icon: <FiClock size={22} />, title: '24/7 Roadside Assist', desc: 'Round-the-clock emergency support and instant vehicle assistance.' },
  { icon: <FiZap size={22} />, title: 'Zero Security Deposit', desc: 'No heavy deposits blocked. Simple paperless verification.' },
  { icon: <FiCheckCircle size={22} />, title: 'Deep Sanitized Fleet', desc: '100% sanitized vehicles after every single trip completion.' },
  { icon: <BsCarFront size={22} />, title: 'Well Maintained Cars', desc: 'Brand new 2024-26 model cars serviced by official dealers.' },
  { icon: <FiStar size={22} />, title: 'Transparent Pricing', desc: 'No hidden taxes or unexpected surcharges at checkout.' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', initials: 'RS', city: 'Pune', role: 'Software Engineer', comment: 'Rented a Fronx for a trip to Lonavala. Car was delivered right at my door in Pune. Super smooth booking experience!', rating: 5, carUsed: 'Maruti Fronx 2026' },
  { name: 'Priya Verma', initials: 'PV', city: 'Bangalore', role: 'Product Manager', comment: 'The Innova Hycross gave us royal comfort for our family road trip to Coorg. 10/10 service and vehicle quality!', rating: 5, carUsed: 'Innova Hycross AT' },
  { name: 'Anish Kulkarni', initials: 'AK', city: 'Mumbai', role: 'Entrepreneur', comment: 'Extremely easy booking process. Rented the Mahindra Thar 4x4 for mountain camping. Highly recommended!', rating: 5, carUsed: 'Thar 4x4 Convertible' },
  { name: 'Sneha Deshmukh', initials: 'SD', city: 'Hyderabad', role: 'Architect', comment: 'Zero security deposit hassle and 100% clean sanitized car. NextRent is now my go-to self-drive app!', rating: 5, carUsed: 'Hyundai Creta' },
  { name: 'Deepak Patel', initials: 'DP', city: 'Delhi NCR', role: 'Business Owner', comment: 'Booked Scorpio N for a 5-day trip to Manali. Unlimited km option saved us so much money on fuel & fees!', rating: 5, carUsed: 'Scorpio N 2025' },
  { name: 'Meera Kapoor', initials: 'MK', city: 'Chennai', role: 'Design Lead', comment: 'Doorstep drop and pick up made my weekend drive completely stress-free. Premium service quality!', rating: 5, carUsed: 'Swift ZXi' },
];

export default function HomePage() {
  const { tenantId } = useTenant();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hero Search Form state
  const [city, setCity] = useState('Pune');
  const [pickupDate, setPickupDate] = useState(new Date(Date.now() + 86400000));
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 86400000 * 3));

  // Swiper Navigation refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const unsubCars = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    const unsubReviews = subscribeToReviews(tenantId, (data) => {
      setReviews(data || []);
    });
    return () => {
      unsubCars();
      unsubReviews();
    };
  }, [tenantId]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/fleet?city=${encodeURIComponent(city)}`);
  };

  const openEnquiry = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F7F7F8' }}>
      <Navbar />

      {/* 1. CINEMATIC ANIMATED HERO SECTION */}
      <section
        className="hero-bg-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.15) 50%, rgba(15, 23, 42, 0.70) 100%), url("${heroBgImg}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 38%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Bhagwa Ambient Radial Glow — top right */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.22) 0%, rgba(255, 69, 0, 0) 70%)',
          filter: 'blur(75px)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ margin: '0 auto', textAlign: 'center' }}>

            {/* Business Name Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              style={{ marginBottom: 16 }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 22px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 69, 0, 0.60)',
                color: '#FFFFFF',
                fontSize: 'clamp(11.5px, 2vw, 14px)',
                fontWeight: 900,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 22px rgba(0, 0, 0, 0.50)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}>
                <BsCarFront color="#FF4500" size={17} /> VK RENTAL CARS PUNE
              </span>
            </motion.div>

            {/* Main Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hero-main-title"
              style={{
                color: '#FFFFFF',
                fontWeight: 900,
                lineHeight: 1.15,
                textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.9)',
              }}
            >
              <span>Drive your car your way</span><br />
              <span style={{ fontWeight: 900 }}>
                {/* "Premium" — Luxury Gold Shimmer Style */}
                <span style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FFD700 55%, #FFFACD 75%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontStyle: 'italic',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  filter: 'drop-shadow(0 2px 12px rgba(255, 123, 0, 0.8))',
                  textShadow: 'none',
                }}>
                  Premium Vk Rental Cars
                </span>{' '}
              </span>
            </motion.h1>

            {/* Floating Trust Metrics Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="hero-trust-badges"
            >
              {[
                { icon: <FiCheckCircle color="#22C55E" size={15} />, text: '10,000+ Renters' },
                { icon: <FiTruck color="#FF4500" size={15} />, text: 'Doorstep Pickup' },
                { icon: <FiStar color="#F59E0B" size={15} />, text: '4.9★ Rated' },
                { icon: <FiShield color="#3B82F6" size={15} />, text: '24/7 Assist' },
              ].map((item, idx) => (
                <div key={idx} className="hero-trust-pill">
                  {item.icon} <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Hero Action Buttons (Short Compact Pills) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="hero-action-btns"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginTop: 18,
              }}
            >
              <Link
                to="/fleet"
                className="btn btn-primary hero-btn-main"
                style={{
                  padding: '9px 20px',
                  fontSize: 13.5,
                  fontWeight: 900,
                  letterSpacing: '0.2px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                  boxShadow: '0 4px 18px rgba(255, 69, 0, 0.40)',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <BsCarFront size={15} /> Explore Fleet
              </Link>
              <a
                href="https://wa.me/918381052230?text=Hi%20VK%20Self%20Drive%20Car%27s%20Pune,%20I%20want%20to%20inquire%20about%20booking%20a%20car."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary hero-btn-sub"
                style={{
                  padding: '9px 18px',
                  fontSize: 13.5,
                  fontWeight: 800,
                  borderRadius: '9999px',
                  background: '#FFFFFF',
                  color: '#000000',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                <BsWhatsapp size={15} style={{ color: '#25D366' }} /> WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TOP SELLING CARS SECTION */}
      <section style={{ padding: '18px 0 14px', background: '#FFFFFF' }}>
        <div className="container">
          {/* Section Header with Left Title + Right Carousel Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span className="section-label">Most Popular</span>
              <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: '#111318', margin: 0 }}>
                Top Cars in <span style={{ color: '#FF4500' }}>{city}</span>
              </h2>
            </div>

            {/* Custom Carousel Arrows */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                ref={prevRef}
                className="btn-icon"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
                aria-label="Previous cars"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                ref={nextRef}
                className="btn-icon"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
                aria-label="Next cars"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Swiper Carousel */}
          {loading ? (
            <div className="grid-3">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : cars.filter(c => c.isPopular !== false).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: 13 }}>
              No cars currently marked as popular. Admin can toggle Popular Choice in Admin Panel.
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={14}
              slidesPerView={1.3}
              breakpoints={{
                480: { slidesPerView: 1.6, spaceBetween: 14 },
                640: { slidesPerView: 2.1, spaceBetween: 16 },
                1024: { slidesPerView: 3.1, spaceBetween: 18 },
                1280: { slidesPerView: 3.4, spaceBetween: 20 },
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              style={{ paddingBottom: 8 }}
            >
              {cars.filter(c => c.isPopular !== false).map((car) => (
                <SwiperSlide key={car.id} style={{ height: 'auto' }}>
                  <RevvCarCard car={car} onEnquire={openEnquiry} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* 3. FULL FLEET SECTION */}
      <section className="section-sm" style={{ background: '#F7F7F8', borderTop: '1px solid #E4E6EA', borderBottom: '1px solid #E4E6EA' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="section-label">Full Fleet</span>
              <h2 className="section-title" style={{ margin: 0 }}>All Available <span>Self-Drive Cars</span></h2>
            </div>
            <Link to="/fleet" className="btn btn-secondary btn-sm">
              View All Fleet <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid-3">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : (
            <>
              <div className="grid-3">
                {cars.slice(0, 6).map((car) => (
                  <RevvCarCard key={car.id} car={car} onEnquire={openEnquiry} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <Link to="/fleet" className="btn btn-primary btn-md" style={{ padding: '10px 24px', fontSize: 14 }}>
                  Explore All Fleet ({cars.length}+ Cars) <FiArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. CATEGORIES - INFINITE MARQUEE */}
      <section className="section-sm" style={{ background: '#FFF8F3', borderTop: '1px solid rgba(255, 69, 0,0.12)', borderBottom: '1px solid rgba(255, 69, 0,0.12)' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Browse Fleet</span>
            <h2 className="section-title">Explore by <span>Category</span></h2>
          </div>
        </div>

        <div className="marquee-container">
          <div className="category-marquee-track">
            {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
              <Link
                key={idx}
                to={`/fleet?category=${cat.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 260,
                    flexShrink: 0,
                    padding: 22,
                    textAlign: 'center',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 69, 0,0.15)',
                    boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(255, 69, 0,0.12) 0%, rgba(255, 69, 0,0.05) 100%)',
                    border: '1px solid rgba(255, 69, 0,0.22)',
                    color: '#FF4500',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 4, color: '#111318', fontWeight: 800 }}>{cat.name}</h3>
                  <p style={{ fontSize: 12, color: '#6B7080', margin: 0, lineHeight: 1.5 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 DIRECT HOMEPAGE INQUIRY FORM SECTION */}
      <section id="inquiry-form-section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '32px 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 16 }}>
            <span className="section-label-red">Instant Booking & Quote</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(20px, 3.5vw, 26px)', margin: '4px 0' }}>Submit Your <span>Car Rental Inquiry</span></h2>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '16px 18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
          }}>
            <BookingForm car={null} onSuccess={() => toast.success('Rental inquiry submitted! We will reach out shortly.')} />
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="section-sm" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label">Why Choose VK RENTAL CARS PUNE</span>
            <h2 className="section-title">The Ultimate <span>Self-Drive</span> Experience</h2>
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...FEATURES, ...FEATURES].map((feat, idx) => (
              <div
                key={idx}
                style={{
                  width: 290,
                  flexShrink: 0,
                  padding: 22,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E4E6EA',
                  boxShadow: '0 4px 18px rgba(17,19,24,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'rgba(255, 69, 0,0.07)',
                  border: '1px solid rgba(255, 69, 0,0.16)',
                  color: '#FF4500',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 16, color: '#111318', fontWeight: 800, margin: 0 }}>{feat.title}</h3>
                <p style={{ fontSize: 13, color: '#5A5F6E', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 TERMS & CONDITIONS SECTION */}
      <section className="section-sm" style={{ background: '#FFFFFF', borderTop: '1px solid #E4E6EA' }}>
        <div className="container">
          <TermsAndConditions expandable={true} defaultOpen={true} />
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="section-sm" style={{ background: '#F7F7F8', borderTop: '1px solid #E4E6EA', paddingBottom: 48 }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Reviews</span>
            <h2 className="section-title">Loved by <span>Drivers</span></h2>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: 13 }}>
              No customer reviews published yet. Admin can add live customer reviews in Admin Panel Settings.
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((rev, idx) => (
                <div
                  key={rev.id || idx}
                  style={{
                    padding: 22,
                    background: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px solid #E4E6EA',
                    boxShadow: '0 4px 20px rgba(17,19,24,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 14,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', gap: 3, color: '#F59E0B' }}>
                        {[...Array(rev.rating || 5)].map((_, i) => <BsStarFill key={i} size={14} />)}
                      </div>
                      <span style={{ fontSize: 11, background: 'rgba(22,163,74,0.08)', color: '#16A34A', fontWeight: 700, padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(22,163,74,0.2)' }}>
                        Verified Customer
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontStyle: 'italic', color: '#000000', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, borderTop: '1px solid #F0F1F3' }}>
                    <div style={{
                      width: 38, height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF4500 0%, #900007 100%)',
                      color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800,
                      boxShadow: '0 2px 10px rgba(255, 69, 0,0.30)',
                    }}>
                      {rev.name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: 14, color: '#000000', lineHeight: 1.2 }}>{rev.name}</strong>
                      <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>{rev.location || 'Pune'} • {rev.carName || 'Self Drive'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ENQUIRY MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCar ? `Enquire for ${selectedCar.name}` : 'Rental Inquiry'}
      >
        <BookingForm
          car={selectedCar}
          onSuccess={() => {
            setTimeout(() => setIsModalOpen(false), 2500);
          }}
        />
      </Modal>

      <Footer />
    </div>
  );
}
