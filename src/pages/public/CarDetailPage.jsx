import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'react-icons/fi';
import { BsFuelPump, BsStarFill, BsLuggage } from 'react-icons/bs';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <main style={{ paddingTop: 90, flex: 1 }} className="container">
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
        <main style={{ paddingTop: 120, flex: 1, textAlign: 'center' }} className="container">
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#000000' }}>Car Not Found</h2>
          <p style={{ color: '#475569', marginBottom: 20, fontWeight: 600 }}>
            The requested car listing does not exist or has been removed.
          </p>
          <Link to="/fleet" className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 99 }}>
            Browse All Fleet
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = car.images && car.images.length > 0
    ? car.images
    : ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 78, paddingBottom: 32, flex: 1 }}>
        <div className="fleet-container">
          {/* Back button & Breadcrumb strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Link
              to="/fleet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12.5,
                fontWeight: 800,
                color: '#FF4500',
                textDecoration: 'none',
                background: 'rgba(255, 69, 0, 0.08)',
                padding: '5px 14px',
                borderRadius: 99,
                border: '1px solid rgba(255, 69, 0, 0.22)',
                transition: 'all 0.2s ease',
              }}
            >
              <FiArrowLeft size={13} /> Back to Fleet Catalog
            </Link>

            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 700 }}>
              Pune Self-Drive • <strong>{car.name}</strong>
            </span>
          </div>

          <div className="car-detail-layout">
            {/* Left Column: Compact Gallery & Specs */}
            <div style={{ minWidth: 0 }}>
              {/* Photo Gallery Card */}
              <div style={{
                padding: 6,
                overflow: 'hidden',
                marginBottom: 16,
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
              }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#0F172A',
                    marginBottom: images.length > 1 ? 6 : 0,
                  }}
                  className="car-gallery-main"
                >
                  <img
                    src={images[selectedImageIndex]}
                    alt={car.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <button
                    className="btn-icon"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard');
                    }}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Share"
                  >
                    <FiShare2 size={14} color="#0F172A" />
                  </button>
                </div>

                {/* Gallery Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: 58,
                          height: 40,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid #FF4500' : '1.5px solid #E2E8F0',
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0,
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Status Badges */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-accent" style={{ background: '#FF4500', color: '#FFFFFF', fontWeight: 900, fontSize: 10.5, padding: '3px 8px', borderRadius: 99 }}>
                    {(car.category || 'FLEET').toUpperCase()}
                  </span>
                  {car.rating && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#D97706', fontSize: 11, fontWeight: 900, background: '#FEF3C7', padding: '2.5px 8px', borderRadius: 99 }}>
                      <BsStarFill size={10} /> {car.rating} Rating
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: '#15803D', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 900, background: '#DCFCE7', padding: '2.5px 8px', borderRadius: 99 }}>
                    <FiCheckCircle size={11} /> Available Now
                  </span>
                </div>
                
                <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', margin: '0 0 4px', color: '#0F172A', fontWeight: 900, lineHeight: 1.2 }}>
                  {car.name}
                </h1>
                <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                  {car.description || 'Sanitized self-drive rental vehicle with 300 km daily limit & 24/7 doorstep delivery in Pune.'}
                </p>
              </div>

              {/* Specifications Card */}
              <div style={{
                padding: '14px 16px',
                marginBottom: 16,
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 13.5, marginBottom: 10, color: '#0F172A', fontWeight: 900 }}>
                  Vehicle Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8 }}>
                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Transmission</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <FiSettings style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.transmission || 'Manual'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Fuel Type</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <BsFuelPump style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.fuelType || 'Petrol'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Seating</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <FiUsers style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.seats || 5} Seats
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Mileage</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <FiZap style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.mileage || '18 kmpl'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 9.5, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Luggage</span>
                    <strong style={{ fontSize: 12.5, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 800 }}>
                      <BsLuggage style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.luggage || '2 Bags'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Rental Tariff Structure */}
              <div style={{
                padding: '14px 16px',
                marginBottom: 16,
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 13.5, marginBottom: 10, color: '#0F172A', fontWeight: 900 }}>
                  Rental Tariff & Overlimit Rates
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>Daily KM Limit</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#0F172A', fontWeight: 900 }}>{car.dailyKmLimit || 300} KM / 24h</h4>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>Extra KM Charge</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#0F172A', fontWeight: 900 }}>
                      ₹{car.extraKmRate || (car.name?.toLowerCase().includes('thar') ? 14 : 9)} / km
                    </h4>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>Extra Time Charge</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#0F172A', fontWeight: 900 }}>
                      ₹{car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200)} / hr
                    </h4>
                  </div>

                  <div style={{ padding: '8px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 800 }}>Refundable Deposit</span>
                    <h4 style={{ fontSize: 14, margin: '2px 0 0', color: '#0F172A', fontWeight: 900 }}>{formatCurrency(car.securityDeposit || 2000)}</h4>
                  </div>
                </div>
              </div>

              {/* Rental Terms & Conditions */}
              <div style={{ marginBottom: 16 }}>
                <TermsAndConditions expandable={true} defaultOpen={false} />
              </div>
            </div>

            {/* Right Column: Sticky Booking Card */}
            <aside className="car-detail-sidebar">
              <div style={{
                padding: 16,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div>
                  <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Rental Tariff (Live Admin Rate)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 2 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: '#FF4500', lineHeight: 1 }}>
                      {formatCurrency(car.pricePerDay || 2300)}
                    </span>
                    <span style={{ fontSize: 12.5, color: '#475569', fontWeight: 700 }}>/ 24 hrs</span>
                  </div>
                </div>

                {/* Key Benefits List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  padding: '10px 12px',
                  background: '#F8FAFC',
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#1E293B', fontWeight: 800 }}>
                    <FiTruck style={{ color: '#FF4500', flexShrink: 0 }} size={14} />
                    <span>Doorstep Delivery in 30 Mins</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#1E293B', fontWeight: 800 }}>
                    <FiKey style={{ color: '#FF4500', flexShrink: 0 }} size={14} />
                    <span>300 KM Daily Limit Included</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#1E293B', fontWeight: 800 }}>
                    <FiShield style={{ color: '#FF4500', flexShrink: 0 }} size={14} />
                    <span>Commercial Insurance Included</span>
                  </div>
                </div>

                {/* Book / Inquire Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 14,
                    fontWeight: 900,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                    boxShadow: '0 4px 16px rgba(255, 69, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    color: '#FFFFFF',
                  }}
                >
                  <FiCalendar size={15} /> Book / Inquire Vehicle
                </button>

                <a
                  href={`https://wa.me/918381052230?text=Hi%20VK%20Rental%20Cars,%20I%20want%20to%20inquire%20about%20booking%20${encodeURIComponent(car.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    fontSize: 12.5,
                    fontWeight: 800,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: '#15803D',
                    borderColor: '#BBF7D0',
                    background: '#F0FDF4',
                  }}
                >
                  💬 Inquire via WhatsApp
                </a>
              </div>
            </aside>
          </div>

          {/* Similar Vehicles Grid */}
          {similarCars.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 18, marginBottom: 14, color: '#0F172A', fontWeight: 900 }}>Similar Vehicles</h2>
              <div className="grid-3">
                {similarCars.map((sCar) => (
                  <RevvCarCard key={sCar.id} car={sCar} onEnquire={(c) => navigate(`/cars/${c.id}`)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

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

      <Footer />

      <style>{`
        .car-detail-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 20px;
        }
        .car-detail-sidebar {
          align-self: start;
          position: sticky;
          top: 88px;
        }
        .car-gallery-main {
          height: 280px;
        }
        @media (max-width: 1100px) {
          .car-detail-layout {
            grid-template-columns: minmax(0, 1fr) 280px;
            gap: 16px;
          }
          .car-gallery-main {
            height: 250px;
          }
        }
        @media (max-width: 860px) {
          .car-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
          .car-detail-sidebar {
            position: static !important;
          }
          .car-gallery-main {
            height: 230px;
          }
        }
        @media (max-width: 480px) {
          .car-gallery-main {
            height: 190px;
          }
        }
      `}</style>
    </div>
  );
}
