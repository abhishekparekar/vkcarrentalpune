import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevvCarCard({ car, onEnquire }) {
  const navigate = useNavigate();
  if (!car) return null;

  const primaryImage = car.images?.length > 0
    ? car.images[0]
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';

  const categoryName    = (car.category || 'FLEET').toUpperCase();
  const fuelName        = (car.fuelType || 'Petrol').toUpperCase();
  const transmissionName = car.transmission
    ? car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)
    : 'Manual';

  const goToDetail = () => navigate(`/cars/${car.id}`);

  const handleBtn = (e) => {
    e.stopPropagation();
    navigate(`/cars/${car.id}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.975 }}
        transition={{ duration: 0.18 }}
        className="vk-car-card"
        onClick={goToDetail}
      >
        {/* Image */}
        <div className="vk-img-box">
          {car.isPopular && (
            <div className="vk-badge vk-badge--popular">🔥 HOT</div>
          )}
          <div className="vk-badge vk-badge--cat">{categoryName}</div>
          <img
            src={primaryImage}
            alt={car.name}
            loading="lazy"
            decoding="async"
            className="vk-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Body */}
        <div className="vk-body">
          <h3 className="vk-title" title={car.name}>{car.name}</h3>
          <div className="vk-meta">
            <span>{fuelName}</span>
            <span className="vk-dot">•</span>
            <span>{transmissionName}</span>
            <span className="vk-dot">•</span>
            <span>300 km</span>
          </div>
        </div>

        {/* Footer */}
        <div className="vk-footer">
          <div>
            <span className="vk-price">{formatCurrency(car.pricePerDay || 2300)}</span>
            <span className="vk-perday">/ 24 hrs</span>
          </div>
          <button
            type="button"
            onClick={handleBtn}
            className="vk-btn"
          >
            Details <FiArrowRight size={12} />
          </button>
        </div>
      </motion.div>

      <style>{`
        .vk-car-card {
          background: #FFFFFF;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 3px 14px rgba(15,23,42,0.06);
          border: 1.5px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: box-shadow 0.22s ease, border-color 0.22s ease;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        .vk-car-card:hover {
          box-shadow: 0 10px 30px rgba(184,0,0,0.14);
          border-color: rgba(184,0,0,0.4);
        }

        /* Image */
        .vk-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%);
          overflow: hidden;
          flex-shrink: 0;
        }
        .vk-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.3s ease;
        }
        .vk-car-card:hover .vk-img {
          transform: scale(1.045);
        }

        /* Badges */
        .vk-badge {
          position: absolute;
          z-index: 2;
          font-size: 9.5px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 999px;
          letter-spacing: 0.4px;
        }
        .vk-badge--popular {
          top: 7px; left: 7px;
          background: linear-gradient(135deg, #9E0000 0%, #D91400 55%, #7A0000 100%);
          color: #FFF;
          box-shadow: 0 2px 8px rgba(184,0,0,0.4);
        }
        .vk-badge--cat {
          top: 7px; right: 7px;
          background: rgba(15,23,42,0.82);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          color: #FFF;
        }

        /* Body */
        .vk-body {
          padding: 10px 12px 6px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .vk-title {
          font-size: 14px;
          font-weight: 900;
          color: #0F172A;
          margin: 0;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vk-meta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 700;
          color: #475569;
          flex-wrap: nowrap;
          white-space: nowrap;
          overflow: hidden;
        }
        .vk-dot {
          color: #94A3B8;
          font-size: 8px;
        }

        /* Footer */
        .vk-footer {
          padding: 8px 12px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #F1F5F9;
          gap: 6px;
        }
        .vk-price {
          font-size: 17px;
          font-weight: 900;
          color: #B80000;
          display: block;
          line-height: 1.1;
        }
        .vk-perday {
          font-size: 10px;
          color: #64748B;
          font-weight: 600;
        }
        .vk-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 13px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 900;
          border: none;
          cursor: pointer;
          color: #FFF;
          background: linear-gradient(135deg, #9E0000 0%, #D91400 55%, #7A0000 100%);
          box-shadow: 0 3px 10px rgba(184,0,0,0.35);
          transition: all 0.18s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vk-btn:hover {
          box-shadow: 0 5px 16px rgba(184,0,0,0.48);
          transform: translateX(2px);
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .vk-car-card { border-radius: 11px; }
          .vk-badge { font-size: 8.5px; padding: 2px 6px; top: 5px; }
          .vk-badge--popular { left: 5px; }
          .vk-badge--cat { right: 5px; }
          .vk-body { padding: 7px 9px 4px; gap: 3px; }
          .vk-title { font-size: 12px; }
          .vk-meta { font-size: 9.5px; gap: 4px; }
          .vk-footer { padding: 6px 9px 8px; }
          .vk-price { font-size: 14px; }
          .vk-perday { font-size: 9px; }
          .vk-btn { padding: 5px 10px; font-size: 10.5px; gap: 4px; }
        }

        @media (max-width: 380px) {
          .vk-title { font-size: 11px; }
          .vk-meta { font-size: 9px; }
          .vk-price { font-size: 13px; }
          .vk-btn { padding: 4px 9px; font-size: 10px; }
        }
      `}</style>
    </>
  );
}
