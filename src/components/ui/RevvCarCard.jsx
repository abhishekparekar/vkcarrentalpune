import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevvCarCard({ car, onEnquire }) {
  const navigate = useNavigate();

  if (!car) return null;

  const primaryImage = car.images && car.images.length > 0
    ? car.images[0]
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';

  const categoryName = (car.category || 'FLEET').toUpperCase();
  const fuelName = (car.fuelType || 'Petrol').toUpperCase();
  const transmissionName = car.transmission ? car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1) : 'Manual';

  const handleCardClick = () => navigate(`/cars/${car.id}`);

  const handleActionClick = (e) => {
    e.stopPropagation();
    navigate(`/cars/${car.id}`);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="vk-car-card"
        onClick={handleCardClick}
      >
        {/* Full-Frame Car Image Box (No Cropping / Half View) */}
        <div className="vk-card-img-box">
          {car.isPopular && (
            <div className="vk-card-badge-popular">
              🔥 POPULAR
            </div>
          )}

          <div className="vk-card-badge-category">
            {categoryName}
          </div>

          <img
            src={primaryImage}
            alt={car.name}
            loading="lazy"
            decoding="async"
            className="vk-card-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Clean, Uncluttered Card Body */}
        <div className="vk-card-body">
          <h3 className="vk-card-title" title={car.name}>
            {car.name}
          </h3>

          <div className="vk-card-meta-pill">
            <span>{fuelName}</span>
            <span className="dot">•</span>
            <span>{transmissionName}</span>
            <span className="dot">•</span>
            <span>300 km/day</span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="vk-card-footer">
          <div className="vk-card-price-wrap">
            <span className="vk-card-price">
              {formatCurrency(car.pricePerDay || 2300)}
            </span>
            <span className="vk-card-perday">per 24 hrs</span>
          </div>

          <button
            type="button"
            onClick={handleActionClick}
            className="btn btn-primary vk-inquire-btn"
          >
            <span>View Details</span> <FiArrowRight size={13} />
          </button>
        </div>
      </motion.div>

      <style>{`
        .vk-car-card {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
          border: 1.5px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        .vk-car-card:hover {
          box-shadow: 0 12px 36px rgba(184, 0, 0, 0.16);
          border-color: rgba(184, 0, 0, 0.45);
          transform: translateY(-4px);
        }
        .vk-card-img-box {
          position: relative;
          width: 100%;
          height: 200px;
          background: linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%);
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .vk-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.35s ease;
        }
        .vk-car-card:hover .vk-card-img {
          transform: scale(1.05);
        }
        .vk-card-badge-popular {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 2;
          background: linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          box-shadow: 0 3px 12px rgba(184, 0, 0, 0.45);
          letter-spacing: 0.5px;
        }
        .vk-card-badge-category {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.6px;
        }
        .vk-card-body {
          padding: 14px 14px 8px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-width: 0;
        }
        .vk-card-title {
          font-size: 16px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 6px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vk-card-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #334155;
        }
        .vk-card-meta-pill .dot {
          color: #94A3B8;
          font-size: 9px;
        }
        .vk-card-footer {
          padding: 10px 14px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #F1F5F9;
          background: #FFFFFF;
          gap: 8px;
        }
        .vk-card-price-wrap {
          min-width: 0;
        }
        .vk-card-price {
          font-size: 19px;
          font-weight: 900;
          color: #B80000;
          display: block;
          line-height: 1.1;
        }
        .vk-card-perday {
          font-size: 11px;
          color: #475569;
          font-weight: 700;
          display: block;
          margin-top: 2px;
        }
        .vk-inquire-btn {
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 900;
          border-radius: 999px;
          background: linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%);
          box-shadow: 0 4px 14px rgba(184, 0, 0, 0.38);
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
          border: none;
          cursor: pointer;
        }
        .vk-inquire-btn:hover {
          transform: translateX(2px);
          box-shadow: 0 6px 20px rgba(184, 0, 0, 0.50);
        }

        @media (max-width: 640px) {
          .vk-car-card { border-radius: 12px; }
          .vk-card-img-box { height: 115px; }
          .vk-card-badge-popular { top: 6px; left: 6px; font-size: 8.5px; padding: 2px 6px; }
          .vk-card-badge-category { top: 6px; right: 6px; font-size: 8px; padding: 2px 6px; }
          .vk-card-body { padding: 7px 8px 3px; }
          .vk-card-title { font-size: 12.5px !important; margin-bottom: 2px !important; }
          .vk-card-meta-pill { font-size: 9.5px !important; gap: 4px !important; }
          .vk-card-footer { padding: 6px 8px 8px; flex-direction: column; align-items: stretch; gap: 5px; }
          .vk-card-price-wrap { display: flex; align-items: baseline; justify-content: space-between; width: 100%; }
          .vk-card-price { font-size: 14.5px !important; }
          .vk-card-perday { font-size: 9px !important; margin-top: 0; }
          .vk-inquire-btn { width: 100%; justify-content: center; padding: 5px 8px !important; font-size: 10.5px !important; border-radius: 999px; }
        }
      `}</style>
    </>
  );
}
