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
          <h2>Car Not Found</h2>
          <p style={{ color: 'var(--color-text-2)', marginBottom: 20 }}>
            The requested car listing does not exist or has been removed.
          </p>
          <Link to="/fleet" className="btn btn-primary">
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

      <main style={{ paddingTop: 'clamp(68px, 9vw, 84px)', paddingBottom: 36, flex: 1 }}>
        <div className="container">
          {/* Back button */}
          <Link
            to="/fleet"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              fontWeight: 700,
              color: '#FF4500',
              textDecoration: 'none',
              marginBottom: 16,
              background: 'rgba(255, 69, 0, 0.08)',
              padding: '6px 14px',
              borderRadius: 99,
              border: '1px solid rgba(255, 69, 0, 0.22)',
            }}
          >
            <FiArrowLeft /> Back to Fleet
          </Link>

          <div className="car-detail-layout">
            {/* Left Column: Gallery & Vehicle Specs */}
            <div style={{ minWidth: 0 }}>
              {/* Photo Gallery Card */}
              <div style={{
                padding: 6,
                overflow: 'hidden',
                marginBottom: 20,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
              }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#F1F5F9',
                    marginBottom: 6,
                  }}
                  className="car-gallery-main"
                >
                  <img
                    src={images[selectedImageIndex]}
                    alt={car.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    className="btn-icon"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard');
                    }}
                    style={{ position: 'absolute', top: 12, right: 12, borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    title="Share"
                  >
                    <FiShare2 size={16} />
                  </button>
                </div>

                {/* Gallery Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: 68,
                          height: 48,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: selectedImageIndex === idx ? '2px solid #FF4500' : '2px solid transparent',
                          cursor: 'pointer',
                          padding: 0,
                          flexShrink: 0,
                        }}
                      >
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Status Badges */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-accent" style={{ background: '#FF4500', color: '#FFFFFF', fontWeight: 800, fontSize: 11 }}>
                    {car.category ? car.category.toUpperCase() : 'CAR'}
                  </span>
                  {car.rating && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#D97706', fontSize: 11.5, fontWeight: 800, background: '#FEF3C7', padding: '2px 8px', borderRadius: 99 }}>
                      <BsStarFill size={11} /> {car.rating} Rating
                    </span>
                  )}
                  <span style={{ fontSize: 11.5, color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 800, background: '#DCFCE7', padding: '2px 8px', borderRadius: 99 }}>
                    <FiCheckCircle size={11} /> Available Now
                  </span>
                </div>
                
                <h1 style={{ fontSize: 'clamp(20px, 3.2vw, 30px)', margin: '0 0 6px', color: '#111318', fontWeight: 900, lineHeight: 1.2 }}>
                  {car.name}
                </h1>
                <p style={{ fontSize: 13.5, color: '#64748B', margin: 0, lineHeight: 1.55 }}>
                  {car.description || 'Sanitized self-drive rental vehicle with 300 km daily limit & doorstep delivery.'}
                </p>
              </div>

              {/* Specifications Card */}
              <div style={{
                padding: '16px 18px',
                marginBottom: 20,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 14.5, marginBottom: 12, color: '#111318', fontWeight: 800 }}>
                  Vehicle Specifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: 10 }}>
                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Transmission</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiSettings style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.transmission || 'Manual'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Fuel Type</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <BsFuelPump style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.fuelType || 'Petrol'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Seating</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiUsers style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.seats || 5} Seats
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Mileage</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <FiZap style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.mileage || '18 kmpl'}
                    </strong>
                  </div>

                  <div style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 800 }}>Luggage</span>
                    <strong style={{ fontSize: 12.5, color: '#111318', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <BsLuggage style={{ color: '#FF4500', flexShrink: 0 }} size={12} /> {car.luggageCapacity || '2 Bags'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Pricing Tariff Card */}
              <div style={{
                padding: '16px 18px',
                marginBottom: 20,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              }}>
                <h3 style={{ fontSize: 14.5, marginBottom: 12, color: '#111318', fontWeight: 800 }}>Pricing Tariff & Extra Rates</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                  <div style={{ padding: 10, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.09) 0%, #FFFFFF 100%)', border: '1px solid rgba(255, 69, 0, 0.25)' }}>
                    <span style={{ fontSize: 10.5, color: '#FF4500', fontWeight: 800 }}>Daily Package (24h)</span>
                    <h4 style={{ fontSize: 17, margin: '3px 0 0', color: '#FF4500', fontWeight: 900 }}>{formatCurrency(car.pricePerDay || 2300)} / day</h4>
                  </div>
                  <div style={{ padding: 10, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Extra KM Charge</span>
                    <h4 style={{ fontSize: 15, margin: '3px 0 0', color: '#111318', fontWeight: 800 }}>
                      ₹{car.extraKmRate || (car.seats === 7 ? 7 : 6)} / km
                    </h4>
                  </div>
                  <div style={{ padding: 10, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Extra Time Charge</span>
                    <h4 style={{ fontSize: 15, margin: '3px 0 0', color: '#111318', fontWeight: 800 }}>
                      ₹{car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200)} / hr
                    </h4>
                  </div>
                  <div style={{ padding: 10, borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 700 }}>Refundable Deposit</span>
                    <h4 style={{ fontSize: 15, margin: '3px 0 0', color: '#111318', fontWeight: 800 }}>{formatCurrency(car.securityDeposit || 2000)}</h4>
                  </div>
                </div>
              </div>

              {/* Rental Terms & Conditions */}
              <div style={{ marginBottom: 20 }}>
                <TermsAndConditions expandable={true} defaultOpen={true} />
              </div>
            </div>

            {/* Right Column: Sticky Booking Card */}
            <aside className="car-detail-sidebar">
              <div style={{
                padding: 18,
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 6px 24px rgba(15, 23, 42, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}>
                <div>
                  <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Daily Rental Rate
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: '#FF4500', lineHeight: 1 }}>
                      {formatCurrency(car.pricePerDay || 2300)}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>/ day</span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155', fontWeight: 700 }}>
                    <FiTruck style={{ color: '#FF4500', flexShrink: 0 }} size={14} />
                    <span>Doorstep Delivery in 30 Mins</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155', fontWeight: 700 }}>
                    <FiKey style={{ color: '#FF4500', flexShrink: 0 }} size={14} />
                    <span>300 KM Daily Limit Included</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#334155', fontWeight: 700 }}>
                    <FiShield style={{ color: '#FF4500', flexShrink: 0 }} size={14} />
                    <span>Full Insurance Coverage</span>
                  </div>
                </div>

                {/* Book / Inquire Button */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: 14,
                    fontWeight: 800,
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 4px 18px rgba(255, 69, 0, 0.30)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <FiCalendar size={15} /> Book / Inquire Vehicle
                </button>
              </div>
            </aside>
          </div>

          {/* Similar Vehicles Grid */}
          {similarCars.length > 0 && (
            <div style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: 18, marginBottom: 14, color: '#111318', fontWeight: 800 }}>Similar Vehicles</h2>
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
          top: 84px;
        }
        .car-gallery-main {
          height: 380px;
        }
        @media (max-width: 1100px) {
          .car-detail-layout {
            grid-template-columns: minmax(0, 1fr) 280px;
            gap: 16px;
          }
          .car-gallery-main {
            height: 320px;
          }
        }
        @media (max-width: 900px) {
          .car-detail-layout {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
          .car-detail-sidebar {
            position: static !important;
          }
          .car-gallery-main {
            height: 260px;
          }
        }
        @media (max-width: 640px) {
          .car-gallery-main {
            height: 220px;
          }
        }
        @media (max-width: 400px) {
          .car-gallery-main {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
}
