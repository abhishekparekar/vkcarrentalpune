import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSettings, FiUsers, FiArrowRight, FiClock } from 'react-icons/fi';
import { BsCarFront } from 'react-icons/bs';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevvCarCard({ car, onEnquire }) {
  const navigate = useNavigate();

  if (!car) return null;

  const primaryImage = car.images && car.images.length > 0
    ? car.images[0]
    : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';

  const categoryName = (car.category || 'Fleet').toUpperCase();
  const seatsNum = car.seats || 5;
  const extraKm = car.extraKmRate || (seatsNum === 7 ? 7 : 6);
  const extraTime = car.extraTimeRate || (car.name?.toLowerCase().includes('thar') ? 300 : 200);

  const handleCardClick = () => navigate(`/cars/${car.id}`);

  const handleInquireClick = (e) => {
    e.stopPropagation();
    if (onEnquire) onEnquire(car);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="vk-car-card"
        onClick={handleCardClick}
      >
        {/* Uniform Car Image Box (Fixed Aspect Ratio across all uploaded car images) */}
        <div className="vk-card-img-box">
          {car.isPopular && (
            <div className="vk-card-badge-popular">
              🔥 POPULAR
            </div>
          )}

          <img
            src={primaryImage}
            alt={car.name}
            loading="lazy"
            decoding="async"
            className="vk-card-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80';
            }}
          />

          <div className="vk-card-badge-km">
            +₹{extraKm}/km
          </div>
        </div>

        {/* Card Body */}
        <div className="vk-card-body">
          <div className="vk-card-header">
            <span className="vk-card-modelyear">
              {car.modelYear || `${car.brand || 'VK'} 2025`}
            </span>
            <span className="vk-card-category-tag">
              {categoryName}
            </span>
          </div>

          <h3 className="vk-card-title" title={car.name}>
            {car.name}
          </h3>

          <p className="vk-card-subtitle">
            {car.brand || car.name.split(' ')[0]} • {car.fuelType ? car.fuelType.toUpperCase() : 'PETROL'}
          </p>

          {/* Compact Specs Bar */}
          <div className="vk-card-specs">
            <div className="vk-spec-item">
              <BsCarFront size={12} color="#FF4500" style={{ flexShrink: 0 }} />
              <span>{categoryName}</span>
            </div>

            <div className="vk-spec-item">
              <FiSettings size={12} color="#FF4500" style={{ flexShrink: 0 }} />
              <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
            </div>

            <div className="vk-spec-item">
              <FiUsers size={12} color="#FF4500" style={{ flexShrink: 0 }} />
              <span>{seatsNum} seats</span>
            </div>

            <div className="vk-spec-item vk-spec-right">
              <FiClock size={11} color="#FF4500" style={{ flexShrink: 0 }} />
              <span>₹{extraTime}/hr</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="vk-card-footer">
          <div style={{ minWidth: 0 }}>
            <span className="vk-card-price">
              {formatCurrency(car.pricePerDay || 2300)}
            </span>
            <span className="vk-card-perday">per 24 hrs</span>
          </div>

          <button
            onClick={handleInquireClick}
            className="btn btn-primary vk-inquire-btn"
          >
            <span>Inquire</span> <FiArrowRight size={13} style={{ flexShrink: 0 }} />
          </button>
        </div>
      </motion.div>

      <style>{`
        .vk-car-card {
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          border: 1.5px solid #E2E8F0;
          display: flex;
          flexDirection: column;
          cursor: pointer;
          transition: all 0.22s ease;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        .vk-car-card:hover {
          box-shadow: 0 10px 32px rgba(255, 69, 0, 0.16);
          border-color: rgba(255, 69, 0, 0.40);
        }
        .vk-card-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          height: 170px;
          background: #F1F5F9;
          overflow: hidden;
          flex-shrink: 0;
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
          top: 8px;
          left: 8px;
          z-index: 2;
          background: linear-gradient(135deg, #FF4500 0%, #E63900 100%);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 900;
          padding: 3px 9px;
          border-radius: 999px;
          box-shadow: 0 3px 10px rgba(255, 69, 0, 0.40);
          letter-spacing: 0.5px;
        }
        .vk-card-badge-km {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(4px);
          WebkitBackdropFilter: blur(4px);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
        }
        .vk-card-body {
          padding: 12px 14px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .vk-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
          gap: 4px;
        }
        .vk-card-modelyear {
          font-size: 11px;
          color: #475569;
          font-weight: 700;
        }
        .vk-card-category-tag {
          font-size: 9.5px;
          color: #FF4500;
          font-weight: 900;
          letter-spacing: 0.6px;
          background: rgba(255, 69, 0, 0.08);
          padding: 2px 7px;
          border-radius: 6px;
          border: 1px solid rgba(255, 69, 0, 0.2);
          white-space: nowrap;
        }
        .vk-card-title {
          font-size: 15.5px;
          font-weight: 900;
          color: #111318;
          margin: 0 0 2px;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vk-card-subtitle {
          font-size: 11.5px;
          color: #64748B;
          margin: 0 0 8px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vk-card-specs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #334155;
          font-weight: 700;
          padding-top: 8px;
          padding-bottom: 8px;
          border-top: 1px solid #F1F5F9;
          flex-wrap: wrap;
        }
        .vk-spec-item {
          display: flex;
          align-items: center;
          gap: 3px;
          white-space: nowrap;
        }
        .vk-spec-right {
          margin-left: auto;
          color: #475569;
        }
        .vk-card-footer {
          padding: 10px 14px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px dashed #E2E8F0;
          background: #FAFAFA;
          gap: 6px;
        }
        .vk-card-price {
          font-size: 18px;
          font-weight: 900;
          color: #FF4500;
          display: block;
          line-height: 1;
        }
        .vk-card-perday {
          font-size: 10px;
          color: #64748B;
          font-weight: 700;
          display: block;
          margin-top: 2px;
        }
        .vk-inquire-btn {
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 900;
          border-radius: 999px;
          background: linear-gradient(135deg, #FF4500 0%, #E63900 100%);
          box-shadow: 0 4px 14px rgba(255, 69, 0, 0.35);
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .vk-inquire-btn:hover {
          transform: translateX(2px);
          box-shadow: 0 6px 18px rgba(255, 69, 0, 0.50);
        }

        @media (max-width: 640px) {
          .vk-car-card { border-radius: 14px; }
          .vk-card-img-box { height: 130px; }
          .vk-card-body { padding: 8px 10px 0; }
          .vk-card-footer { padding: 8px 10px 10px; }
          .vk-card-title { font-size: 14px !important; }
          .vk-card-subtitle { font-size: 10.5px !important; margin-bottom: 6px !important; }
          .vk-card-price { font-size: 15.5px !important; }
          .vk-inquire-btn { padding: 6px 12px !important; font-size: 11px !important; }
          .vk-card-specs { gap: 5px !important; font-size: 10px !important; padding-top: 6px !important; padding-bottom: 6px !important; }
        }
      `}</style>
    </>
  );
}
