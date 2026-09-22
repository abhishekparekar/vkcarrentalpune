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

import { FiSearch, FiMapPin, FiCalendar, FiChevronLeft, FiChevronRight, FiShield, FiClock, FiKey, FiTruck, FiArrowRight, FiZap, FiCheckCircle, FiStar, FiPhone } from 'react-icons/fi';
import { BsCarFront, BsStarFill, BsAward, BsCarFrontFill, BsWhatsapp } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';
import TermsAndConditions from '../../components/ui/TermsAndConditions';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars, subscribeToReviews } from '../../firebase/firestore';
import toast from 'react-hot-toast';

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
      <SEO
        title="VK RENTAL CARS PUNE | Self Drive Cars & Car Rentals Services Pune | Best Car Booking"
        description="Book top-rated self drive cars, car rentals services & online car booking in Pune & PCMC with VK RENTAL CARS. Rent Thar 4x4, Swift, Ertiga 7-Seater, Baleno with 300 km daily limit, 0 deposit & 30-min doorstep delivery. 24/7 support!"
        keywords="self drive, self drive cars, car rentals services, car booking, car rental in Pune, self drive cars Pune, self drive car rental Pune, car hire in Pune, rent a car Pune, car on rent Pune, self drive Pune, best self drive cars Pune, car booking Pune, car booking in Pune, car rental Pune contact number, Thar rental Pune, Mahindra Thar 4x4 rental Pune, Ertiga rental Pune, 7 seater car rental Pune, Swift car rental Pune, Baleno rental Pune, Creta self drive Pune, cheap self drive cars Pune, 0 deposit car rental Pune, doorstep car delivery Pune, Pune airport car rental, outstation self drive car Pune, self drive Hinjewadi, car rental Hinjewadi, self drive Wakad, car rental Baner, self drive Kothrud, car rental Viman Nagar, self drive Kharadi, car rental Hadapsar, PCMC self drive car, VK Rental Cars, VK Rental Cars Pune, कार रेंटल पुणे, सेल्फ ड्राईव्ह कार पुणे, पुण्यात कार भाड्याने, कार बुकिंग पुणे, www.vkrentalcar.com, vkrentalcar.com"
        canonicalPath="/"
      />
      <Navbar />

      {/* 1. CINEMATIC HIGH-DEFINITION HERO SECTION WITH SCENIC THAR & FLEET */}
      <section
        className="hero-bg-section"
        style={{
          position: 'relative',
          minHeight: 'clamp(520px, 62vh, 620px)',
          paddingTop: 'clamp(120px, 13vw, 150px)',
          paddingBottom: 'clamp(50px, 7vw, 75px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Crisp High-Definition Background Image with Zero Blur */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("${heroBgImg}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 42%',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />

        {/* Cinematic Vignette Overlay to ensure text & buttons pop while preserving scenic road & cars */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8, 12, 22, 0.80) 0%, rgba(8, 12, 22, 0.48) 45%, rgba(8, 12, 22, 0.85) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ margin: '0 auto', textAlign: 'center', maxWidth: 860 }}>

            {/* Premium Business Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 18 }}
            >
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 22px',
                borderRadius: '9999px',
                background: 'rgba(10, 15, 28, 0.80)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1.5px solid rgba(255, 215, 0, 0.65)',
                color: '#FFFFFF',
                fontSize: 'clamp(11.5px, 2vw, 13px)',
                fontWeight: 800,
                letterSpacing: '1.8px',
                textTransform: 'uppercase',
                boxShadow: '0 4px 18px rgba(0, 0, 0, 0.55)',
              }}>
                <FiStar color="#FFD700" size={15} />
                <span>VK RENTAL CARS PUNE</span>
              </span>
            </motion.div>

            {/* Main Title Styled with Crisp Luxury Pure White & Brilliant Solid Gold */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hero-main-title"
              style={{
                margin: '0 0 16px',
                lineHeight: 1.15,
              }}
            >
              <span style={{
                display: 'block',
                fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.95)',
                letterSpacing: '-0.3px',
              }}>
                Drive Your Car Your Way
              </span>
              <span style={{
                display: 'inline-block',
                marginTop: 6,
                fontSize: 'clamp(2.2rem, 5.8vw, 4.0rem)',
                fontWeight: 950,
                color: '#FFD700',
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 215, 0, 0.45)',
                letterSpacing: '0.5px',
              }}>
                VK SELF DRIVE CARS
              </span>
            </motion.h1>

            {/* Clear Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                color: 'rgba(255, 255, 255, 0.94)',
                fontSize: 'clamp(14px, 1.9vw, 17px)',
                fontWeight: 600,
                margin: '0 auto',
                maxWidth: 680,
                lineHeight: 1.65,
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.90)',
              }}
            >
              Verified self-drive car rentals across Pune &amp; PCMC • 300 km daily limit, 0 security deposit &amp; 30-min doorstep delivery.
            </motion.p>

            {/* 2 High-Converting Action Buttons: 1) Explore Fleet, 2) Contact */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
                marginTop: 26,
              }}
            >
              {/* Button 1: Explore Fleet */}
              <Link
                to="/fleet"
                className="hero-btn-explore"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 34px',
                  borderRadius: 9999,
                  background: 'linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%)',
                  color: '#FFFFFF',
                  fontSize: 15.5,
                  fontWeight: 900,
                  textDecoration: 'none',
                  letterSpacing: '0.4px',
                  border: '1.5px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 8px 28px rgba(184, 0, 0, 0.60), 0 3px 8px rgba(0, 0, 0, 0.40)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <BsCarFront size={18} />
                <span>Explore Fleet</span>
                <FiArrowRight size={17} />
              </Link>

              {/* Button 2: Contact */}
              <Link
                to="/contact"
                className="hero-btn-contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  padding: '14px 32px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#FFFFFF',
                  fontSize: 15.5,
                  fontWeight: 900,
                  textDecoration: 'none',
                  letterSpacing: '0.3px',
                  border: '1.5px solid rgba(255, 255, 255, 0.55)',
                  boxShadow: '0 6px 22px rgba(0, 0, 0, 0.35)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <FiPhone size={17} color="#FFD700" />
                <span>Contact Us</span>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 1.5 ATTACHED HERO DOWNSIDE TRUST & FEATURE STRIP */}
      <div className="hero-attached-feature-bar">
        <div className="hero-feature-bar-inner">
          <div className="hero-feature-pill">
            <FiTruck className="feature-icon" />
            <span>30m Doorstep Delivery</span>
          </div>
          <span className="feature-sep">•</span>
          <div className="hero-feature-pill">
            <FiKey className="feature-icon" />
            <span>300 KM Daily Quota</span>
          </div>
          <span className="feature-sep">•</span>
          <div className="hero-feature-pill">
            <FiShield className="feature-icon" />
            <span>0 Security Deposit</span>
          </div>
          <span className="feature-sep">•</span>
          <div className="hero-feature-pill">
            <FiClock className="feature-icon" />
            <span>24/7 Roadside Assist</span>
          </div>
        </div>
      </div>

      {/* 2. TOP SELLING CARS SECTION */}
      <section style={{ padding: '28px 0 20px', background: '#FFFFFF', width: '100%' }}>
        <div className="fleet-container">
          {/* Section Header with Left Title + Right Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span className="section-label">Most Popular</span>
              <h2 style={{ fontSize: 'clamp(18px, 3.5vw, 24px)', fontWeight: 900, color: '#111318', margin: 0 }}>
                Top Cars in <span style={{ color: '#B80000' }}>{city}</span>
              </h2>
            </div>
            <Link to="/fleet" className="btn btn-secondary btn-sm" style={{ fontWeight: 800 }}>
              View Popular Fleet <FiArrowRight />
            </Link>
          </div>

          {/* Clean Fleet Grid */}
          {loading ? (
            <div className="grid-fleet-catalog">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : cars.filter(c => c.isPopular !== false).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748B', fontSize: 13 }}>
              No cars currently marked as popular. Admin can toggle Popular Choice in Admin Panel.
            </div>
          ) : (
            <div className="grid-fleet-catalog">
              {cars.filter(c => c.isPopular !== false).slice(0, 8).map((car) => (
                <RevvCarCard key={car.id} car={car} onEnquire={openEnquiry} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FULL FLEET SECTION */}
      <section className="section-sm" style={{ background: '#F7F7F8', borderTop: '1px solid #E4E6EA', borderBottom: '1px solid #E4E6EA', width: '100%' }}>
        <div className="fleet-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="section-label">Full Fleet</span>
              <h2 className="section-title" style={{ margin: 0 }}>All Available <span>Self-Drive Cars</span></h2>
            </div>
            <Link to="/fleet" className="btn btn-secondary btn-sm" style={{ fontWeight: 800 }}>
              View All Fleet <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid-fleet-catalog">
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
              <CarSkeleton />
            </div>
          ) : (
            <>
              <div className="grid-fleet-catalog">
                {cars.slice(0, 12).map((car) => (
                  <RevvCarCard key={car.id} car={car} onEnquire={openEnquiry} />
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <Link to="/fleet" className="btn btn-primary btn-md" style={{ padding: '10px 28px', fontSize: 14, fontWeight: 900, borderRadius: 999 }}>
                  Explore All Fleet ({cars.length}+ Cars) <FiArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. CATEGORIES - INFINITE MARQUEE */}
      <section className="section-sm" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
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
                    border: '1.5px solid #E2E8F0',
                    boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: 14,
                    background: 'rgba(184, 0, 0, 0.08)',
                    border: '1px solid rgba(184, 0, 0, 0.22)',
                    color: '#B80000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 5, color: '#0F172A', fontWeight: 900 }}>{cat.name}</h3>
                  <p style={{ fontSize: 12.5, color: '#334155', fontWeight: 600, margin: 0, lineHeight: 1.55 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 DIRECT HOMEPAGE INQUIRY FORM SECTION */}
      <section id="inquiry-form-section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '36px 0', width: '100%' }}>
        <div className="fleet-container">
          <div className="section-header text-center" style={{ marginBottom: 20 }}>
            <span className="section-label-red">Instant Booking & Quote</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(20px, 3.5vw, 26px)', margin: '4px 0' }}>Submit Your <span>Car Rental Inquiry</span></h2>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: 18,
            padding: 'clamp(16px, 3vw, 28px)',
            border: '1px solid #E2E8F0',
            boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)',
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
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 18px rgba(15,23,42,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: 'rgba(184, 0, 0, 0.08)',
                  border: '1px solid rgba(184, 0, 0, 0.22)',
                  color: '#B80000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: 16, color: '#0F172A', fontWeight: 900, margin: 0 }}>{feat.title}</h3>
                <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, margin: 0, lineHeight: 1.55 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 TERMS & CONDITIONS SECTION */}
      <section className="section-sm" style={{ background: '#FFFFFF', borderTop: '1px solid #E4E6EA' }}>
        <div className="container">
          <TermsAndConditions expandable={true} defaultOpen={false} />
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="section-sm" style={{ background: '#F7F7F8', borderTop: '1px solid #E4E6EA', paddingBottom: 48, width: '100%' }}>
        <div className="fleet-container">
          <div className="section-header text-center" style={{ marginBottom: 28 }}>
            <span className="section-label-red">Reviews</span>
            <h2 className="section-title">Loved by <span>Drivers</span></h2>
          </div>

          <div className="reviews-grid">
            {(reviews.length > 0 ? reviews : TESTIMONIALS.slice(0, 4)).map((rev, idx) => (
              <div
                key={rev.id || idx}
                style={{
                  padding: 20,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E4E6EA',
                  boxShadow: '0 4px 18px rgba(17,19,24,0.05)',
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
                    background: 'linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%)',
                    color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800,
                    boxShadow: '0 2px 10px rgba(184, 0, 0, 0.30)',
                  }}>
                    {rev.name?.charAt(0) || 'R'}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 13.5, color: '#000000', lineHeight: 1.2 }}>{rev.name}</strong>
                    <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>{rev.city || rev.location || 'Pune'} • {rev.carUsed || rev.carName || 'Self Drive'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
