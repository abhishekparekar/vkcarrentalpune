import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch, FiFileText, FiMapPin, FiCalendar, FiClock,
  FiCheckCircle, FiCopy, FiInfo, FiShare2, FiZap, FiTruck,
} from 'react-icons/fi';
import { BsCarFront, BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useTenant } from '../../contexts/TenantContext';
import { subscribeToInquiries, formatTimestamp } from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MyInquiriesPage() {
  const { tenantId } = useTenant();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [inquiries, setInquiries] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setLoading(true);
    setSearched(true);

    const unsub = subscribeToInquiries(tenantId, (all) => {
      const q = emailOrPhone.toLowerCase().trim();
      const userItems = all.filter(item => 
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q))
      );
      setInquiries(userItems);
      setLoading(false);
    });

    return () => unsub();
  };

  const handleCopyRef = (refId) => {
    navigator.clipboard.writeText(refId);
    toast.success(`Reference #${refId.slice(0, 8)} copied to clipboard!`);
  };

  const handleShareWhatsApp = (item) => {
    const text = `Hi! I submitted a rental inquiry for *${item.carName || 'Vehicle'}* (Ref: #${item.id.slice(0, 8)}).\nLocation: ${item.city || 'Pune'}\nDates: ${item.pickupDate || 'Flexible'} to ${item.returnDate || 'Flexible'}.\nPlease confirm vehicle availability!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/918381052230?text=${encoded}`, '_blank');
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="badge badge-warning" style={{ fontSize: 11, fontWeight: 800 }}>⏳ New Inquiry Received</span>;
      case 'contacted':
        return <span className="badge badge-blue" style={{ fontSize: 11, fontWeight: 800 }}>📞 Agent Contacted</span>;
      case 'confirmed':
        return <span className="badge badge-success" style={{ fontSize: 11, fontWeight: 800 }}>✅ Booking Confirmed</span>;
      case 'closed':
        return <span className="badge badge-error" style={{ fontSize: 11, fontWeight: 800 }}>❌ Closed / Cancelled</span>;
      default:
        return <span className="badge badge-accent" style={{ fontSize: 11, fontWeight: 800 }}>{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 'clamp(68px, 9vw, 84px)', paddingBottom: 40, flex: 1 }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          
          {/* Header */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, marginBottom: 24, padding: 'clamp(20px, 3vw, 28px)', boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)' }}>
            <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 10 }}>Track Your Request</span>
            <h1 style={{ fontSize: 'clamp(22px, 4.5vw, 36px)', fontWeight: 900, color: '#111318', margin: '0 0 8px', lineHeight: 1.25 }}>
              My{' '}
              <span style={{
                background: 'linear-gradient(90deg, #FF4500 0%, #FFA500 55%, #FFD700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 900,
              }}>RENTAL INQUIRIES</span>
            </h1>
            <p style={{ fontSize: 'clamp(12.5px, 1.8vw, 14px)', color: '#64748B', margin: 0, maxWidth: 500, lineHeight: 1.6 }}>
              Enter your email or phone number to track all your submitted rental inquiries.
            </p>
          </div>


          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            style={{
              padding: 12,
              display: 'flex',
              gap: 10,
              marginBottom: 24,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              required
              className="form-input"
              placeholder="Enter Mobile Number (+91...), Email, or Ref ID..."
              value={emailOrPhone}
              onChange={e => setEmailOrPhone(e.target.value)}
              style={{ fontSize: 13.5, flex: 1, minWidth: 220, height: 42 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #FF4500 0%, #E66E00 100%)',
                borderColor: '#FF4500',
                whiteSpace: 'nowrap',
                fontSize: 13.5,
                fontWeight: 800,
                padding: '0 20px',
                height: 42,
              }}
            >
              Search Inquiry <FiSearch />
            </button>
          </form>

          {/* Results Area */}
          {searched ? (
            <div>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#64748B', fontSize: 13, padding: '24px 0' }}>Searching records...</p>
              ) : inquiries.length === 0 ? (
                <div className="glass-card empty-state" style={{ background: '#FFFFFF', padding: '36px 20px', textAlign: 'center', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                  <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
                    <FiFileText size={42} color="#FF4500" />
                  </div>
                  <strong style={{ fontSize: 16, color: '#0F172A', display: 'block' }}>No inquiries found</strong>
                  <p style={{ fontSize: 13, color: '#64748B', marginTop: 4, maxWidth: 440, margin: '4px auto 16px' }}>
                    We couldn't find any rental inquiries matching "{emailOrPhone}". Make sure the phone or email matches what you entered during booking.
                  </p>
                  <a
                    href="https://wa.me/918381052230?text=Hi%20VK%20Rental%20Cars,%20I%20want%20to%20check%20my%20inquiry%20status."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ background: '#25D366', borderColor: '#25D366', color: '#FFFFFF', fontWeight: 800, padding: '8px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <BsWhatsapp size={14} /> Ask on WhatsApp Support
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {inquiries.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: 20,
                        background: '#FFFFFF',
                        borderRadius: 16,
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 14,
                      }}
                    >
                      {/* Top bar with vehicle name & status */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: '#64748B', fontWeight: 800 }}>
                              Ref: #{item.id.slice(0, 8)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyRef(item.id)}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FF4500', padding: 0 }}
                              title="Copy Ref ID"
                            >
                              <FiCopy size={12} />
                            </button>
                          </div>
                          <h3 style={{ fontSize: 18, margin: '2px 0 0', color: '#0F172A', fontWeight: 900 }}>
                            {item.carName || 'General Inquiry'}
                          </h3>
                        </div>
                        {statusBadge(item.status)}
                      </div>

                      {/* Details Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 12,
                        padding: 14,
                        background: '#F8FAFC',
                        borderRadius: 12,
                        border: '1px solid #F1F5F9',
                        fontSize: 12.5,
                      }}>
                        <div>
                          <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Location</span>
                          <strong style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <FiMapPin size={12} color="#FF4500" /> {item.city || 'Pune'}
                          </strong>
                        </div>

                        <div>
                          <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Pickup Type</span>
                          <strong style={{ color: '#0F172A', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <BsCarFront size={12} color="#FF4500" /> {item.pickupType || 'Doorstep Delivery'}
                          </strong>
                        </div>

                        <div>
                          <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Submitted On</span>
                          <strong style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <FiCalendar size={12} color="#FF4500" /> {formatTimestamp(item.createdAt)}
                          </strong>
                        </div>

                        {item.estimatedPrice && (
                          <div>
                            <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Est. Total</span>
                            <strong style={{ color: '#FF4500', fontSize: 14, fontWeight: 900 }}>
                              {formatCurrency(item.estimatedPrice)}
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* Customer Contact Summary */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 4 }}>
                        <div style={{ fontSize: 12.5, color: '#475569' }}>
                          Customer: <strong>{item.customerName || 'Guest'}</strong> • {item.phone || item.email}
                        </div>

                        {/* Action Buttons: WhatsApp Share & Copy */}
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(item)}
                            className="btn btn-primary btn-sm"
                            style={{
                              background: '#25D366',
                              borderColor: '#25D366',
                              color: '#FFFFFF',
                              fontSize: 12.5,
                              fontWeight: 800,
                              padding: '7px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <BsWhatsapp size={14} /> Share Inquiry on WhatsApp
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Helpful Quick Guide Cards when not yet searched */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
              marginTop: 8,
            }}>
              <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 18, border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255, 69, 0, 0.09)', color: '#FF4500', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <FiClock size={18} />
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 900, color: '#111318', margin: '0 0 4px' }}>15-Min Response</h4>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Our team confirms car availability and coordinates doorstep pickup within 15 minutes.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 18, border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 99, 235, 0.09)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <FiCheckCircle size={18} />
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 900, color: '#111318', margin: '0 0 4px' }}>Real-time Status</h4>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Track live status updates from New Inquiry → Agent Contacted → Confirmed Booking.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: 14, padding: 18, border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37, 211, 102, 0.12)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <BsWhatsapp size={18} />
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 900, color: '#111318', margin: '0 0 4px' }}>WhatsApp Direct</h4>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  Need faster assistance? Send your inquiry reference directly to our 24/7 WhatsApp manager.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
