import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle, FiMapPin, FiTruck, FiKey, FiCalendar, FiClock } from 'react-icons/fi';
import { BsCarFront, BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';
import { addInquiry, subscribeToCars } from '../../firebase/firestore';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BookingForm({ car, onSuccess }) {
  const { tenantId } = useTenant();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Live fleet from admin panel
  const [fleetCars, setFleetCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(car?.id || '');

  useEffect(() => {
    if (!car) {
      const unsub = subscribeToCars(tenantId, (data) => {
        if (data && data.length > 0) {
          setFleetCars(data);
          setSelectedCarId(prev => prev || data[0].id);
        }
      });
      return () => unsub();
    }
  }, [tenantId, car]);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: car?.citiesAvailable?.[0] || 'Pune',
    pickupDate: new Date(Date.now() + 86400000),
    returnDate: new Date(Date.now() + 86400000 * 3),
    pickupType: 'delivery',
    message: '',
  });

  const cities = ['Pune', 'Mumbai', 'Pimpri-Chinchwad', 'Lonavala', 'Outstation'];

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    const diff = formData.returnDate.getTime() - formData.pickupDate.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
  };

  const activeCar = car || fleetCars.find(c => c.id === selectedCarId) || fleetCars[0] || null;
  const daysCount = calculateDays();
  const estimatedPrice = activeCar ? (Number(activeCar.pricePerDay) || 0) * daysCount : 0;

  const auth = useAuth();
  const user = auth?.user || null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      toast.error('Please fill in required contact details');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please check the Terms & Conditions box to proceed');
      return;
    }

    setSubmitting(true);
    try {
      await addInquiry(tenantId, {
        carId: activeCar?.id || null,
        carName: activeCar?.name || 'General Inquiry',
        pricePerDay: activeCar?.pricePerDay || 0,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || 'N/A',
        city: formData.city,
        pickupDate: formData.pickupDate.toISOString(),
        returnDate: formData.returnDate.toISOString(),
        pickupType: formData.pickupType,
        message: formData.message,
        estimatedPrice,
        daysCount,
      }, user?.uid || 'guest');

      setSubmitted(true);
      toast.success('Rental Inquiry submitted! Alert sent to vishalkarke184@gmail.com');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(22,163,74,0.1)',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FiCheckCircle size={28} />
        </div>

        <h3 style={{ fontSize: 19, margin: 0, color: '#0F172A', fontWeight: 900 }}>Inquiry Received!</h3>
        <p style={{ fontSize: 13, color: '#64748B', maxWidth: 380, margin: 0, lineHeight: 1.6 }}>
          Thank you, <strong>{formData.customerName}</strong>! Your inquiry for <strong>{activeCar?.name}</strong> has been logged in our system and an alert has been dispatched to <strong>vishalkarke184@gmail.com</strong>.
        </p>

        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 10,
          padding: '8px 14px',
          fontSize: 12,
          color: '#334155',
          maxWidth: 380,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>✉️</span>
          <span>Confirmation &amp; admin notification delivered to: <strong>vishalkarke184@gmail.com</strong></span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href={`https://wa.me/918381052230?text=Hi%20VK%20Rental%20Cars,%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(activeCar?.name || 'Car')}.%20Customer:%20${encodeURIComponent(formData.customerName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm"
            style={{
              background: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            <BsWhatsapp size={14} /> WhatsApp Support
          </a>

          <a
            href="/my-inquiries"
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 18px', fontSize: 13, background: '#FF4500', borderColor: '#FF4500', fontWeight: 800 }}
          >
            Track Status ➔
          </a>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700 }}
          >
            New Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Selected Vehicle Dropdown (Live from Admin Panel) */}
      {!car ? (
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 12, fontWeight: 800, color: '#1E293B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <BsCarFront size={15} color="#FF4500" /> Select Car Model *
          </label>
          <select
            className="form-select"
            value={selectedCarId}
            onChange={e => setSelectedCarId(e.target.value)}
            style={{
              fontWeight: 700,
              height: 42,
              fontSize: 13.5,
              border: '1.5px solid #CBD5E1',
              borderRadius: 10,
              background: '#FFFFFF',
              color: '#0F172A',
              padding: '0 12px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {fleetCars.length === 0 ? (
              <option value="">Loading available cars...</option>
            ) : (
              fleetCars.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {formatCurrency(c.pricePerDay)}/day ({c.fuelType || 'Petrol'})
                </option>
              ))
            )}
          </select>
        </div>
      ) : (
        <div style={{
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(255, 69, 0, 0.05)',
          border: '1.5px solid rgba(255, 69, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <div>
            <span style={{ fontSize: 10.5, color: '#FF4500', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Selected Car
            </span>
            <h4 style={{ fontSize: 15, margin: 0, color: '#0F172A', fontWeight: 900 }}>{car.name}</h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, color: '#64748B', display: 'block', fontWeight: 700 }}>Rate: {formatCurrency(car.pricePerDay)}/day</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: '#FF4500' }}>
              Est. Total: {formatCurrency(estimatedPrice)} ({daysCount}d)
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Live Rate Card */}
      {!car && activeCar && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 10,
          background: '#FFF8F3',
          border: '1px solid rgba(255, 69, 0, 0.20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <div>
            <span style={{ fontSize: 12, color: '#FF4500', fontWeight: 800, display: 'block' }}>
              Daily Rate: {formatCurrency(activeCar.pricePerDay)} / 24h
            </span>
            <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
              {daysCount} {daysCount === 1 ? 'Day' : 'Days'} Duration • 300 km/day included
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10.5, color: '#64748B', display: 'block', fontWeight: 700 }}>Estimated Total</span>
            <strong style={{ fontSize: 16, color: '#FF4500', fontWeight: 900 }}>
              {formatCurrency(estimatedPrice)}
            </strong>
          </div>
        </div>
      )}

      {/* Row 1: Contact Details */}
      <div className="grid-3" style={{ gap: 10 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, color: '#334155' }}>Full Name *</label>
          <input
            type="text"
            required
            className="form-input"
            placeholder="Enter your full name"
            value={formData.customerName}
            onChange={e => setFormData({ ...formData, customerName: e.target.value })}
            style={{ height: 42, fontSize: 13.5, borderRadius: 10, padding: '0 12px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, color: '#334155' }}>Mobile Number (+91) *</label>
          <input
            type="tel"
            required
            className="form-input"
            placeholder="Enter 10-digit mobile number"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            style={{ height: 42, fontSize: 13.5, borderRadius: 10, padding: '0 12px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, color: '#334155' }}>City / Location</label>
          <select
            className="form-select"
            value={formData.city}
            onChange={e => setFormData({ ...formData, city: e.target.value })}
            style={{ height: 42, fontSize: 13.5, borderRadius: 10, padding: '0 12px', width: '100%', boxSizing: 'border-box', fontWeight: 600 }}
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Row 2: Trip Dates & Delivery Option */}
      <div className="grid-3" style={{ gap: 10 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, color: '#334155' }}>Pickup Date & Time</label>
          <DatePicker
            selected={formData.pickupDate}
            onChange={date => setFormData({ ...formData, pickupDate: date })}
            showTimeSelect
            dateFormat="MMM d, h:mm aa"
            minDate={new Date()}
            className="form-input"
            style={{ height: 42, fontSize: 13.5, borderRadius: 10, padding: '0 12px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, color: '#334155' }}>Return Date & Time</label>
          <DatePicker
            selected={formData.returnDate}
            onChange={date => setFormData({ ...formData, returnDate: date })}
            showTimeSelect
            dateFormat="MMM d, h:mm aa"
            minDate={formData.pickupDate || new Date()}
            className="form-input"
            style={{ height: 42, fontSize: 13.5, borderRadius: 10, padding: '0 12px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 4, color: '#334155' }}>Delivery Preference</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, height: 42 }}>
            <button
              type="button"
              className={`btn ${formData.pickupType === 'delivery' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFormData({ ...formData, pickupType: 'delivery' })}
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                padding: '0 8px',
                borderRadius: 10,
                justifyContent: 'center',
                background: formData.pickupType === 'delivery' ? 'linear-gradient(135deg, #FF4500 0%, #E66E00 100%)' : '#FFFFFF',
                borderColor: formData.pickupType === 'delivery' ? '#FF4500' : '#CBD5E1',
                color: formData.pickupType === 'delivery' ? '#FFFFFF' : '#334155',
              }}
            >
              <FiTruck size={13} /> Doorstep
            </button>
            <button
              type="button"
              className={`btn ${formData.pickupType === 'self-pickup' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setFormData({ ...formData, pickupType: 'self-pickup' })}
              style={{
                fontSize: 12.5,
                fontWeight: 800,
                padding: '0 8px',
                borderRadius: 10,
                justifyContent: 'center',
                background: formData.pickupType === 'self-pickup' ? 'linear-gradient(135deg, #FF4500 0%, #E66E00 100%)' : '#FFFFFF',
                borderColor: formData.pickupType === 'self-pickup' ? '#FF4500' : '#CBD5E1',
                color: formData.pickupType === 'self-pickup' ? '#FFFFFF' : '#334155',
              }}
            >
              <BsCarFront size={13} /> Hub Pickup
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Terms Checkbox */}
      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        fontSize: 12,
        fontWeight: 600,
        color: '#1E293B',
        cursor: 'pointer',
        background: agreedToTerms ? 'rgba(255, 69, 0,0.06)' : '#F8FAFC',
        border: agreedToTerms ? '1px solid rgba(255, 69, 0,0.35)' : '1px solid #E2E8F0',
        padding: '10px 12px',
        borderRadius: 10,
        marginTop: 2,
        lineHeight: 1.45,
      }}>
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={e => setAgreedToTerms(e.target.checked)}
          style={{ width: 17, height: 17, accentColor: '#FF4500', cursor: 'pointer', marginTop: 1, flexShrink: 0 }}
        />
        <span>
          I agree to <strong>Terms & Conditions</strong> & carry <strong>5 Required Documents</strong> (Original Aadhaar, Driving Licence, PAN, Rent Agreement & Job ID).
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !agreedToTerms}
        className="btn btn-primary btn-lg w-full"
        style={{
          background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
          borderColor: '#FF4500',
          fontSize: 14.5,
          fontWeight: 900,
          padding: '11px',
          borderRadius: 12,
          boxShadow: '0 4px 18px rgba(255, 69, 0, 0.35)',
          opacity: agreedToTerms ? 1 : 0.65,
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: 46,
        }}
      >
        {submitting ? 'Submitting...' : <><FiSend size={15} /> Submit Rental Inquiry</>}
      </button>
    </form>
  );
}
