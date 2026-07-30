import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin, FiSend, FiClock,
  FiCheckCircle, FiZap, FiMessageSquare,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { addInquiry } from '../../firebase/firestore';

const DEFAULT_CONTACT_ITEMS = [
  {
    icon: <FiPhone size={18} />,
    label: 'Call / WhatsApp (24/7)',
    value: '+91 9764815458',
    href: 'https://wa.me/919764815458',
    color: '#FF4500',
    bg: 'rgba(255, 69, 0,0.08)',
  },
  {
    icon: <FiMail size={18} />,
    label: 'Email Support',
    value: 'vishalkarke184@gmail.com',
    href: 'mailto:vishalkarke184@gmail.com',
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
  },
  {
    icon: <FiMapPin size={18} />,
    label: 'Main Office',
    value: 'Pimpri-Chinchwad & Pune City, Maharashtra',
    href: null,
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.08)',
  },
  {
    icon: <FiClock size={18} />,
    label: 'Business Hours',
    value: '24 Hours • 365 Days Doorstep Delivery',
    href: null,
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
  },
];
const CONTACT_ITEMS = DEFAULT_CONTACT_ITEMS;

const CITIES = ['Pune', 'Mumbai', 'Pimpri-Chinchwad', 'Lonavala', 'Outstation'];

export default function ContactPage() {
  const { tenantId, settings } = useTenant();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const phone = settings?.phone || '+91 9764815458';
  const email = settings?.email || 'vishalkarke184@gmail.com';
  const address = settings?.address || 'Pimpri-Chinchwad & Pune City, Maharashtra';
  const whatsapp = settings?.whatsapp || '919764815458';
  const hours = settings?.businessHours || '24 Hours • 365 Days Doorstep Delivery';

  const contactItems = [
    {
      icon: <FiPhone size={18} />,
      label: 'Call / WhatsApp (24/7)',
      value: phone,
      href: `https://wa.me/${whatsapp.replace(/\D/g, '')}`,
      color: '#FF4500',
      bg: 'rgba(255, 69, 0,0.09)',
    },
    {
      icon: <FiMail size={18} />,
      label: 'Email Support',
      value: email,
      href: `mailto:${email}`,
      color: '#2563EB',
      bg: 'rgba(37,99,235,0.08)',
    },
    {
      icon: <FiMapPin size={18} />,
      label: 'Main Office',
      value: address,
      href: null,
      color: '#16A34A',
      bg: 'rgba(22,163,74,0.08)',
    },
    {
      icon: <FiClock size={18} />,
      label: 'Business Hours',
      value: hours,
      href: null,
      color: '#D97706',
      bg: 'rgba(217,119,6,0.08)',
    },
  ];

  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    city: 'Pune',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.message) {
      toast.error('Please fill in required name, phone, and message');
      return;
    }

    setSubmitting(true);
    try {
      await addInquiry(tenantId, {
        carId: null,
        carName: 'General Inquiry / Contact Form',
        customerName: form.customerName,
        email: form.email || 'N/A',
        phone: form.phone,
        city: form.city,
        message: form.message,
        pickupType: 'Doorstep Delivery',
      }, user?.uid || 'guest');
      setSubmitted(true);
      toast.success('Message submitted successfully! We will contact you within 15 minutes.');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to submit message. Please try WhatsApp directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <Navbar />

      <main style={{ paddingTop: 'clamp(68px, 9vw, 84px)', paddingBottom: 40, flex: 1 }}>

        {/* ─── Hero Header ─── */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', marginBottom: 24 }}>
          <div className="container" style={{ padding: '24px 16px 20px', maxWidth: 1100 }}>
            <span className="section-label-red" style={{ display: 'inline-block', marginBottom: 6 }}>Contact & Instant Quote</span>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 900, color: '#0F172A', margin: '0 0 6px', lineHeight: 1.2 }}>
              Get in Touch with <span style={{ color: '#FF4500' }}>Car Rental Support</span>
            </h1>
            <p style={{ fontSize: 'clamp(13px, 2vw, 14.5px)', color: '#475569', margin: 0, maxWidth: 580, lineHeight: 1.55 }}>
              Have questions about daily rates, doorstep delivery, or extra km charges? Fill out the quick form below or message us instantly on WhatsApp.
            </p>
          </div>
        </div>

        <div className="container" style={{ maxWidth: 1100, padding: '0 16px' }}>

          {/* ─── Contact Info Cards ─── */}
          <div className="grid-4" style={{ gap: 12, marginBottom: 24 }}>
            {contactItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  padding: '14px 14px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: item.bg,
                  border: `1px solid ${item.color}25`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{ fontSize: 13, fontWeight: 800, color: item.color, textDecoration: 'none', display: 'block', marginTop: 1, wordBreak: 'break-all' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A', display: 'block', marginTop: 1, lineHeight: 1.3 }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ─── Main Grid: Compact Form + Direct WhatsApp Banner ─── */}
          <div className="contact-main-grid">
            
            {/* Form Box */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '20px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(22,163,74,0.1)',
                    border: '1px solid rgba(22,163,74,0.3)',
                    color: '#16A34A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiCheckCircle size={26} />
                  </div>
                  <h3 style={{ fontSize: 18, color: '#0F172A', fontWeight: 900, margin: 0 }}>Message Received!</h3>
                  <p style={{ fontSize: 13, color: '#475569', maxWidth: 340, margin: 0, lineHeight: 1.5 }}>
                    Thank you! Our rental representative will review your message and reach out to you within 15 minutes.
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                      style={{ background: '#25D366', borderColor: '#25D366', color: '#FFFFFF', padding: '8px 16px', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <BsWhatsapp size={14} /> Open WhatsApp Chat
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 14px', fontSize: 13, fontWeight: 700 }}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', margin: 0 }}>Send Us a Message</h2>
                    <span style={{ fontSize: 12, color: '#64748B' }}>
                      Complete the form below for immediate rental assistance.
                    </span>
                  </div>

                  <div className="grid-2" style={{ gap: 10 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Amit Patil"
                        value={form.customerName}
                        onChange={e => setForm({ ...form, customerName: e.target.value })}
                        style={{ height: 38, fontSize: 13 }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Mobile Number (+91) *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        style={{ height: 38, fontSize: 13 }}
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: 10 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Email Address (Optional)</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        style={{ height: 38, fontSize: 13 }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">City / Delivery Location</label>
                      <select
                        className="form-select"
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        style={{ height: 38, fontSize: 13 }}
                      >
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Your Message or Booking Details *</label>
                    <textarea
                      required
                      rows={3}
                      className="form-textarea"
                      placeholder="Specify your preferred car, dates, or doorstep delivery requirements..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ fontSize: 13 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg w-full"
                    style={{ background: '#FF4500', borderColor: '#FF4500', fontSize: 14, fontWeight: 800, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    {submitting ? 'Submitting Message...' : <><FiSend size={15} /> Submit Inquiry Message</>}
                  </button>
                </form>
              )}
            </div>

            {/* Direct WhatsApp Callout Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: 16,
              padding: '22px 20px',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
              boxShadow: '0 6px 24px rgba(15, 23, 42, 0.12)',
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', padding: '4px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 800, marginBottom: 12, border: '1px solid rgba(37, 211, 102, 0.3)' }}>
                  <BsWhatsapp size={14} /> Instant 24/7 Response
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 8px', color: '#FFFFFF', lineHeight: 1.25 }}>
                  Need Urgent Car Delivery?
                </h3>
                <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                  Connect directly with our fleet manager on WhatsApp for immediate car availability, custom tariff rates, and instant doorstep delivery booking.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: 11, color: '#CBD5E1', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Direct Contact Hotline:</span>
                <strong style={{ fontSize: 18, color: '#FFFFFF', display: 'block', marginTop: 2 }}>{phone}</strong>
              </div>

              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{
                  background: '#25D366',
                  borderColor: '#25D366',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 900,
                  padding: '11px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
                }}
              >
                <BsWhatsapp size={17} /> Connect on WhatsApp Now
              </a>
            </div>

          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        .contact-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .contact-main-grid {
            grid-template-columns: 1fr !important;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
