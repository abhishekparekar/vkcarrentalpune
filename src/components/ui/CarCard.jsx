import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiSettings } from 'react-icons/fi';
import { BsFuelPump, BsStarFill } from 'react-icons/bs';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CarCard({ car, onEnquire }) {
  if (!car) return null;

  const primaryImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';

  const categoryBadgeMap = {
    hatchback: 'badge-accent',
    sedan: 'badge-blue',
    suv: 'badge-warning',
    premium: 'badge-success',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Vehicle Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '58%',
        overflow: 'hidden',
        background: '#F1F5F9',
      }}>
        <img
          src={primaryImage}
          alt={car.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
        }}>
          <span className={`badge ${categoryBadgeMap[car.category] || 'badge-accent'}`}>
            {car.category ? car.category.toUpperCase() : 'CAR'}
          </span>
          {car.rating && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              background: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)',
              fontSize: 11,
              fontWeight: 700,
              color: '#D97706',
            }}>
              <BsStarFill size={10} />
              <span>{car.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {car.brand || 'PERFORMANCE'}
          </span>
          <h3 style={{ fontSize: 17, color: 'var(--color-text)', fontWeight: 700, margin: '2px 0 10px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            {car.name}
          </h3>

          {/* Quick Specs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6,
            padding: '8px 0',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-2)' }}>
              <FiSettings style={{ color: 'var(--color-accent)' }} />
              <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-2)' }}>
              <BsFuelPump style={{ color: 'var(--color-accent)' }} />
              <span style={{ textTransform: 'capitalize' }}>{car.fuelType || 'Petrol'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-text-2)' }}>
              <FiUsers style={{ color: 'var(--color-accent)' }} />
              <span>{car.seats || 5} Seats</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 10, color: 'var(--color-text-3)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Hourly
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                {formatCurrency(car.pricePerHour || 99)}/hr
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 10, color: 'var(--color-text-3)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                Daily Rate
              </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-accent)' }}>
                {formatCurrency(car.pricePerDay || 1499)}/day
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Link
              to={`/cars/${car.id}`}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Details
            </Link>
            <button
              onClick={() => onEnquire && onEnquire(car)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
