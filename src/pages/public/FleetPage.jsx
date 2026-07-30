import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiRefreshCw, FiSearch, FiSliders, FiCheck, FiZap, FiTruck } from 'react-icons/fi';
import { BsCarFront, BsCarFrontFill } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars } from '../../firebase/firestore';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Fleet', icon: <BsCarFront size={15} /> },
  { id: 'popular', label: 'Popular Choice', icon: <FiZap size={15} style={{ color: '#FF4500' }} /> },
  { id: 'hatchback', label: 'Hatchback (Swift, i20, Baleno)', icon: <BsCarFront size={15} /> },
  { id: 'sedan', label: 'Sedan & CNG (Dzire)', icon: <BsCarFrontFill size={15} /> },
  { id: 'suv', label: 'SUV & 4x4 (Thar, Punch, Venue)', icon: <FiTruck size={15} /> },
  { id: 'muv', label: '7-Seater MUV (Ertiga)', icon: <BsCarFront size={15} /> },
];

export default function FleetPage() {
  const { tenantId } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  useEffect(() => {
    const unsub = subscribeToCars(tenantId, (data) => {
      setCars(data);
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    setSearchParams(params, { replace: true });
  }, [selectedCategory]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      if (selectedCategory === 'popular') return car.isPopular !== false;
      if (selectedCategory !== 'all' && car.category !== selectedCategory) return false;
      return true;
    });
  }, [cars, selectedCategory]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 72, paddingBottom: 36, flex: 1 }}>
        
        {/* Sleek Header */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', marginBottom: 20, padding: '24px 0 18px' }}>
          <div className="fleet-container">
            <span className="section-label-red" style={{ marginBottom: 6 }}>
              VK RENTAL CARS PUNE Fleet
            </span>
            <h1 style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 900, color: '#111318', margin: '0 0 6px' }}>
              Explore Available <span>Self-Drive Cars</span>
            </h1>
            <p style={{ fontSize: 'clamp(12.5px, 1.8vw, 14px)', color: '#64748B', margin: 0, maxWidth: 540, lineHeight: 1.5 }}>
              All vehicles include 300 km daily limit, doorstep delivery, full insurance & zero hidden charges.
            </p>
          </div>
        </div>

        <div className="fleet-container" style={{ width: '100%' }}>

          {/* Touch-Friendly Category Filter Pills Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 16,
            marginBottom: 8,
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}>
            {CATEGORY_TABS.map(tab => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 99,
                    background: isActive ? 'linear-gradient(135deg, #FF4500 0%, #E66E00 100%)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: isActive ? '1px solid #FF4500' : '1px solid #E2E8F0',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 14px rgba(255, 69, 0,0.35)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.18s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Full-Width Car Cards Grid */}
          <section>
            {loading ? (
              <div className="grid-fleet-catalog">
                <CarSkeleton />
                <CarSkeleton />
                <CarSkeleton />
                <CarSkeleton />
              </div>
            ) : filteredCars.length === 0 ? (
              <div style={{
                padding: '48px 24px',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
              }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: 'rgba(255, 69, 0,0.08)',
                  border: '1px solid rgba(255, 69, 0,0.2)',
                  color: '#FF4500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <BsCarFront size={28} />
                </div>
                <h3 style={{ fontSize: 18, color: '#111318', fontWeight: 800, marginBottom: 6 }}>
                  No Cars Found in This Category
                </h3>
                <p style={{ fontSize: 13, color: '#64748B', maxWidth: 420, margin: '0 auto 16px', lineHeight: 1.5 }}>
                  Select "All Fleet" to view all available self-drive rental cars.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)' }}
                >
                  Show All Cars ➔
                </button>
              </div>
            ) : (
              <div className="grid-fleet-catalog">
                {filteredCars.map(car => (
                  <RevvCarCard
                    key={car.id}
                    car={car}
                    onEnquire={carItem => {
                      setSelectedCar(carItem);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          <style>{`
            .fleet-container {
              width: 100%;
              max-width: 1340px;
              margin: 0 auto;
              padding: 0 20px;
              box-sizing: border-box;
            }
            .grid-fleet-catalog {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
            }
            @media (min-width: 1600px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(5, 1fr);
                gap: 20px;
              }
            }
            @media (max-width: 1200px) {
              .grid-fleet-catalog {
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
              }
            }
            @media (max-width: 768px) {
              .fleet-container {
                padding: 0 14px;
              }
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
              }
            }
            @media (max-width: 480px) {
              .fleet-container {
                padding: 0 10px;
              }
              .grid-fleet-catalog {
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
              }
            }
            @media (max-width: 360px) {
              .grid-fleet-catalog {
                grid-template-columns: 1fr;
                gap: 10px;
              }
            }
          `}</style>
        </div>
      </main>

      {/* Inquiry Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCar ? `Inquire — ${selectedCar.name}` : 'Rental Inquiry'}
      >
        {selectedCar && (
          <BookingForm
            car={selectedCar}
            onSuccess={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      <Footer />
    </div>
  );
}
