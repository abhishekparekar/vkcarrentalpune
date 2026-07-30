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
        transition={{ duration: 0.2 }}
        className="vk-car-card"
        onClick={handleCardClick}
      >
        {/* Uniform Car Image Box (Fixed Height & Aspect Ratio across all admin uploads) */}
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

        {/* Card Body with High Contrast Proper Black Typography */}
        <div className="vk-card-body">
          <div className="vk-card-header">
            <span className="vk-card-modelyear">
              {car.modelYear || `${car.brand || 'VK'} 2025`}
            </span>
            <span className="vk-card-category-tag">
              {categoryName}
            </span>
          </div>

          <h3 className="vk-card-title">
            {car.name}
          </h3>

          <p className="vk-card-subtitle">
            {car.brand || car.name.split(' ')[0]} • {car.fuelType ? car.fuelType.toUpperCase() : 'PETROL'}
          </p>

          {/* Compact 2x2 Specs Bar for Perfect Equal Card Heights */}
          <div className="vk-card-specs">
            <div className="vk-spec-item">
              <BsCarFront size={11} color="#FF4500" style={{ flexShrink: 0 }} />
              <span>{categoryName}</span>
            </div>

            <div className="vk-spec-item">
              <FiSettings size={11} color="#FF4500" style={{ flexShrink: 0 }} />
              <span style={{ textTransform: 'capitalize' }}>{car.transmission || 'Manual'}</span>
            </div>

            <div className="vk-spec-item">
              <FiUsers size={11} color="#FF4500" style={{ flexShrink: 0 }} />
              <span>{seatsNum} seats</span>
            </div>

            <div className="vk-spec-item">
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
          flex-direction: column;
          justify-content: space-between;
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
          height: 160px;
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
          top: 10px;
          left: 10px;
          z-index: 2;
          background: linear-gradient(135deg, #FF4500 0%, #E63900 100%);
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          box-shadow: 0 4px 12px rgba(255, 69, 0, 0.45);
          letter-spacing: 0.5px;
        }
        .vk-card-badge-km {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(15, 23, 42, 0.80);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .vk-card-body {
          padding: 14px 16px 0;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .vk-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .vk-card-modelyear {
          font-size: 11px;
          color: #000000;
          font-weight: 700;
          opacity: 0.7;
        }
        .vk-card-category-tag {
          font-size: 10px;
          color: #FF4500;
          font-weight: 900;
          letter-spacing: 0.8px;
          background: rgba(255, 69, 0, 0.08);
          padding: 2px 8px;
          border-radius: 6px;
          border: 1px solid rgba(255, 69, 0, 0.2);
        }
        .vk-card-title {
          font-size: 16.5px;
          font-weight: 900;
          color: #000000;
          margin: 0 0 2px;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vk-card-subtitle {
          font-size: 12px;
          color: #000000;
          margin: 0 0 8px;
          font-weight: 700;
          opacity: 0.8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .vk-card-specs {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          color: #000000;
          font-weight: 700;
          padding-top: 8px;
          padding-bottom: 10px;
          border-top: 1px solid #F1F5F9;
          flex-wrap: wrap;
        }
        .vk-spec-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #000000;
        }
        .vk-spec-right {
          margin-left: auto;
          color: #475569;
        }
        .vk-card-footer {
          padding: 10px 16px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px dashed #E2E8F0;
          background: #FAFAFA;
        }
        .vk-card-price {
          font-size: 19px;
          font-weight: 900;
          color: #FF4500;
          display: block;
          line-height: 1;
        }
        .vk-card-perday {
          font-size: 10.5px;
          color: #000000;
          font-weight: 700;
          opacity: 0.7;
        }
        .vk-inquire-btn {
          padding: 8px 18px;
          font-size: 12.5px;
          font-weight: 900;
          border-radius: 999px;
          background: linear-gradient(135deg, #FF4500 0%, #E63900 100%);
          box-shadow: 0 4px 14px rgba(255, 69, 0, 0.35);
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s ease;
        }
        .vk-inquire-btn:hover {
          transform: translateX(2px);
          box-shadow: 0 6px 18px rgba(255, 69, 0, 0.50);
        }

        @media (max-width: 640px) {
          .vk-card-img-box { height: 135px; }
          .vk-card-body { padding: 10px 12px 0; }
          .vk-card-footer { padding: 8px 12px 12px; }
          .vk-card-title { font-size: 14.5px !important; }
          .vk-card-subtitle { font-size: 11px !important; }
          .vk-card-price { font-size: 16px !important; }
          .vk-inquire-btn { padding: 6.5px 14px !important; font-size: 11.5px !important; }
          .vk-card-specs { gap: 6px !important; font-size: 10.5px !important; }
        }
      `}</style>
    </>
  );
}
