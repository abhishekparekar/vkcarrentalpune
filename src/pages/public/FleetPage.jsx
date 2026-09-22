import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTruck, FiUsers, FiStar, FiZap } from 'react-icons/fi';
import { BsCarFront, BsCarFrontFill } from 'react-icons/bs';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';
import RevvCarCard from '../../components/ui/RevvCarCard';
import CarSkeleton from '../../components/ui/CarSkeleton';
import Modal from '../../components/ui/Modal';
import BookingForm from '../../components/ui/BookingForm';
import TermsAndConditions from '../../components/ui/TermsAndConditions';

import { useTenant } from '../../contexts/TenantContext';
import { subscribeToCars } from '../../firebase/firestore';

const CATEGORY_TABS = [
  { id: 'all',       label: 'All Fleet',      icon: <BsCarFront size={13} /> },
  { id: 'popular',   label: 'Popular',         icon: <FiZap size={13} style={{ color: '#FF4500' }} /> },
  { id: 'hatchback', label: 'Hatchback',       icon: <BsCarFront size={13} /> },
  { id: 'sedan',     label: 'Sedan / CNG',     icon: <BsCarFrontFill size={13} /> },
  { id: 'suv',       label: 'SUV / 4x4',       icon: <FiTruck size={13} /> },
  { id: 'muv',       label: '7-Seater MUV',    icon: <BsCarFront size={13} /> },
];

export default function FleetPage() {
  const { tenantId, settings } = useTenant();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const STATS = [
    { label: 'Happy Renters',      value: settings?.statsRenters  || '500+',    icon: <FiUsers size={18} /> },
    { label: 'Fleet Cars',         value: settings?.statsFleet    || '50+',     icon: <BsCarFront size={18} /> },
    { label: 'Doorstep Delivery',  value: settings?.statsDelivery || '30 Mins', icon: <FiTruck size={18} /> },
    { label: 'Customer Rating',    value: settings?.statsRating   || '4.9★',    icon: <FiStar size={18} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <SEO
        title="Self Drive Cars & Car Rentals Services Fleet Pune | VK RENTAL CARS"
        description="Browse all self drive cars for rent in Pune by VK RENTAL CARS. Book Thar 4x4, Ertiga 7-Seater, Swift, Baleno, Creta with 300 km/day limit, 0 security deposit and instant car booking across Pune."
        keywords="self drive, car rentals services, car booking, car rental in Pune, Thar rental Pune, Ertiga rental Pune, Swift car rental Pune, VK Rental Cars"
        canonicalPath="/fleet"
      />
      <Navbar />

      <main style={{ paddingTop: 68, paddingBottom: 32, flex: 1 }}>

        {/* ── Compact Hero Header ── */}
        <div className="fleet-hero">
          <div className="fleet-container">
            <span className="section-label-red" style={{ marginBottom: 6, display: 'inline-block', fontSize: 11 }}>
              VK RENTAL CARS — PUNE
            </span>
            <h1 className="fleet-hero-title">
              EXPLORE{' '}
              <span style={{
                background: 'linear-gradient(90deg, #9E0000 0%, #D91400 60%, #B80000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>PREMIUM RENTAL CARS</span>
            </h1>
            <p className="fleet-hero-sub">
              300 km/day · Doorstep delivery · Full insurance · Zero hidden charges
            </p>
          </div>
        </div>

        <div className="fleet-container">

          {/* ── Category Filter Pills ── */}
          <div className="fleet-pills-bar">
            {CATEGORY_TABS.map(tab => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`fleet-pill${isActive ? ' fleet-pill--active' : ''}`}
                >
                  <span className="pill-icon">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Car Cards Grid ── */}
          <section>
            {loading ? (
              <div className="grid-fleet-catalog">
                <CarSkeleton /><CarSkeleton /><CarSkeleton /><CarSkeleton />
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="fleet-empty">
                <BsCarFront size={32} color="#FF4500" />
                <h3>No Cars in This Category</h3>
                <p>Try selecting another category.</p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 999 }}
                >
                  Show All Cars
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

          {/* ── Stats Strip ── */}
          <div className="fleet-stats-wrap">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                className="fleet-stat-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <div className="fleet-stat-icon">{s.icon}</div>
                <div className="fleet-stat-value">{s.value}</div>
                <div className="fleet-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* ── Terms ── */}
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <TermsAndConditions expandable={true} defaultOpen={false} />
          </div>

        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCar ? `Inquire — ${selectedCar.name}` : 'Rental Inquiry'}
      >
        {selectedCar && (
          <BookingForm car={selectedCar} onSuccess={() => setIsModalOpen(false)} />
        )}
      </Modal>

      <Footer />

      <style>{`
        /* ── Container ── */
        .fleet-container {
          width: 100%;
          max-width: 1340px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }

        /* ── Hero ── */
        .fleet-hero {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 20px 0 16px;
          margin-bottom: 18px;
        }
        .fleet-hero-title {
          font-size: clamp(18px, 4vw, 30px);
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 6px;
          line-height: 1.25;
        }
        .fleet-hero-sub {
          font-size: clamp(11.5px, 1.6vw, 13.5px);
          color: #475569;
          font-weight: 600;
          margin: 0;
          line-height: 1.5;
        }

        /* ── Pills ── */
        .fleet-pills-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 16px;
        }
        .fleet-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #334155;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .fleet-pill:hover {
          border-color: rgba(184,0,0,0.35);
          color: #B80000;
        }
        .fleet-pill--active {
          background: linear-gradient(135deg, #9E0000 0%, #D91400 55%, #7A0000 100%);
          color: #FFFFFF !important;
          border-color: transparent;
          box-shadow: 0 3px 12px rgba(184,0,0,0.35);
        }
        .pill-icon {
          display: inline-flex;
          align-items: center;
        }

        /* ── Grid ── */
        .grid-fleet-catalog {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* ── Empty State ── */
        .fleet-empty {
          padding: 40px 20px;
          text-align: center;
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .fleet-empty h3 { font-size: 16px; color: #0F172A; font-weight: 800; margin: 0; }
        .fleet-empty p  { font-size: 13px; color: #64748B; margin: 0; }

        /* ── Stats ── */
        .fleet-stats-wrap {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 28px;
          margin-bottom: 16px;
        }
        .fleet-stat-card {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 14px 10px;
          text-align: center;
          border: 1px solid #E2E8F0;
          box-shadow: 0 3px 10px rgba(15,23,42,0.04);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .fleet-stat-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(255,69,0,0.09);
          border: 1px solid rgba(255,69,0,0.22);
          color: #FF4500;
          display: flex; align-items: center; justify-content: center;
        }
        .fleet-stat-value {
          font-size: clamp(16px, 2.2vw, 22px);
          font-weight: 900;
          color: #FF4500;
          line-height: 1;
        }
        .fleet-stat-label {
          font-size: 10.5px;
          color: #64748B;
          font-weight: 700;
          line-height: 1.3;
        }

        /* ── Responsive ── */
        @media (min-width: 1600px) {
          .grid-fleet-catalog { grid-template-columns: repeat(5, 1fr); gap: 18px; }
        }
        @media (max-width: 1200px) {
          .grid-fleet-catalog { grid-template-columns: repeat(3, 1fr); gap: 14px; }
        }
        @media (max-width: 860px) {
          .fleet-container { padding: 0 12px; }
          .grid-fleet-catalog { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .fleet-stats-wrap { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 560px) {
          .fleet-container { padding: 0 10px; }
          .fleet-hero { padding: 14px 0 12px; margin-bottom: 14px; }
          .fleet-pills-bar { gap: 6px; }
          .fleet-pill { padding: 5px 11px; font-size: 11px; }
          .grid-fleet-catalog { grid-template-columns: repeat(2, 1fr); gap: 9px; }
          .fleet-stats-wrap { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .fleet-stat-card { padding: 10px 8px; border-radius: 10px; }
          .fleet-stat-label { font-size: 9.5px; }
        }
        @media (max-width: 360px) {
          .fleet-pill { padding: 5px 9px; font-size: 10.5px; }
          .grid-fleet-catalog { gap: 8px; }
        }
      `}</style>
    </div>
  );
}
