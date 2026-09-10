import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye, FiTrash2, FiDownload, FiPhone, FiMail, FiSend, FiCheckCircle } from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';

import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeToInquiries,
  updateInquiryStatus,
  deleteInquiry,
  formatTimestamp,
} from '../../firebase/firestore';
import { formatCurrency } from '../../utils/formatCurrency';
import { ADMIN_NOTIFICATION_EMAIL, sendInquiryEmailNotification, getInquiryMailtoUrl } from '../../utils/emailNotifier';

export default function AdminInquiries() {
  const { tenantId } = useTenant();
  const { user } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [sendingMail, setSendingMail] = useState(false);

  useEffect(() => {
    const unsub = subscribeToInquiries(tenantId, (data) => {
      setInquiries(data);
      setLoading(false);
    });
    return () => unsub();
  }, [tenantId]);

  const handleResendNotification = async (item) => {
    setSendingMail(true);
    toast.loading(`Sending notification email to ${ADMIN_NOTIFICATION_EMAIL}...`, { id: 'email-alert' });
    try {
      await sendInquiryEmailNotification(item);
      toast.success(`Inquiry alert dispatched to ${ADMIN_NOTIFICATION_EMAIL}`, { id: 'email-alert' });
    } catch {
      toast.error('Failed to dispatch email alert', { id: 'email-alert' });
    } finally {
      setSendingMail(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateInquiryStatus(tenantId, id, status, user?.uid);
      toast.success(`Inquiry status updated to ${status}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      await deleteInquiry(tenantId, id);
      toast.success('Inquiry deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete inquiry');
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return toast.info('No inquiries to export');
    const headers = 'ID,Customer,Phone,Email,Car,City,PickupDate,ReturnDate,Status,Price\n';
    const rows = inquiries.map(i => 
      `"${i.id}","${i.customerName}","${i.phone}","${i.email}","${i.carName}","${i.city}","${i.pickupDate}","${i.returnDate}","${i.status}","${i.estimatedPrice || 0}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${tenantId}-${Date.now()}.csv`;
    a.click();
    toast.success('Exported inquiries to CSV');
  };

  const filteredInquiries = inquiries.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.customerName?.toLowerCase().includes(q);
      const matchPhone = item.phone?.includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchCar = item.carName?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchCar) return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0, color: 'var(--color-text)' }}>Inquiries & Bookings</h1>
            <p style={{ fontSize: 13, color: 'var(--color-text-2)', marginTop: 2 }}>
              Active Fleet Lead Center • Scope: <strong>{tenantId}</strong>
            </p>
          </div>

          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <FiDownload /> Export CSV
          </button>
        </div>

        {/* 📬 Live Email Dispatch & Sync Alert Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 14,
          padding: '14px 18px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          border: '1px solid rgba(255, 69, 0, 0.35)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(255, 69, 0, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF4500',
              fontSize: 18,
            }}>
              ✉️
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 14, color: '#FFFFFF' }}>
                  Live Booking &amp; Inquiry Notifications Active
                </strong>
                <span className="badge badge-success" style={{ fontSize: 10, padding: '2px 8px' }}>
                  ● LIVE SYNC
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                All customer inquiries &amp; bookings are automatically dispatched to: <strong style={{ color: '#FF5500' }}>{ADMIN_NOTIFICATION_EMAIL}</strong>
              </span>
            </div>
          </div>
          <a
            href={`mailto:${ADMIN_NOTIFICATION_EMAIL}`}
            className="btn btn-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 700,
              padding: '6px 14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 8,
            }}
          >
            Open Gmail Inbox ↗
          </a>
        </div>

        {/* Filter Bar */}
        <div className="glass-card" style={{ padding: 14, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', background: '#FFFFFF' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-text-3)' }} />
            <input
              type="text"
              placeholder="Search by customer, phone, email, vehicle..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 36, height: 38 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['all', 'new', 'contacted', 'confirmed', 'closed'].map(st => (
              <button
                key={st}
                className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(st)}
                style={{ textTransform: 'capitalize', padding: '5px 12px', fontSize: 12 }}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: 20, background: '#FFFFFF' }}>
          {loading ? (
            <p style={{ color: 'var(--color-text-2)', fontSize: 13 }}>Loading inquiries...</p>
          ) : filteredInquiries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-title">No inquiries match filter</div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer &amp; Contact</th>
                    <th>Fleet Vehicle</th>
                    <th>Rental Dates</th>
                    <th>Price / Total</th>
                    <th>City &amp; Type</th>
                    <th>Status</th>
                    <th>Direct Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((item) => {
                    const cleanPhone = (item.phone || '').replace(/\D/g, '');
                    const waNum = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                    const pDate = item.pickupDate ? new Date(item.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null;
                    const rDate = item.returnDate ? new Date(item.returnDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null;

                    return (
                      <tr key={item.id}>
                        <td>
                          <strong style={{ color: 'var(--color-text)', display: 'block', fontSize: 13 }}>{item.customerName}</strong>
                          <a href={`tel:${item.phone}`} style={{ fontSize: 11.5, color: '#FF4500', textDecoration: 'none', fontWeight: 700 }}>
                            📞 {item.phone}
                          </a>
                          {item.email && item.email !== 'N/A' && (
                            <span style={{ fontSize: 10.5, color: 'var(--color-text-3)', display: 'block' }}>✉️ {item.email}</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--color-accent)', fontSize: 13 }}>{item.carName || 'General Fleet'}</strong>
                          {item.pricePerDay > 0 && (
                            <span style={{ fontSize: 10.5, color: 'var(--color-text-3)', display: 'block' }}>₹{item.pricePerDay}/day</span>
                          )}
                        </td>
                        <td>
                          {pDate ? (
                            <div>
                              <strong style={{ fontSize: 12, color: 'var(--color-text)', display: 'block' }}>
                                📅 {pDate} {rDate && rDate !== pDate ? `➔ ${rDate}` : ''}
                              </strong>
                              <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>
                                {item.daysCount ? `${item.daysCount} Day(s)` : 'Flexible'}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: 11.5, color: 'var(--color-text-3)' }}>General Inquiry</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ color: '#16A34A', fontSize: 13.5, display: 'block' }}>
                            {item.estimatedPrice ? formatCurrency(item.estimatedPrice) : 'Quote Required'}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--color-text)' }}>📍 {item.city || 'Pune'}</span>
                          <span style={{ fontSize: 10.5, color: 'var(--color-text-3)', display: 'block' }}>{item.pickupType || 'Delivery'}</span>
                        </td>
                        <td>
                          <select
                            className="form-select"
                            value={item.status || 'new'}
                            onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                            style={{ padding: '2px 6px', fontSize: 11, height: 28, width: 115, fontWeight: 700 }}
                          >
                            <option value="new">🟡 New</option>
                            <option value="contacted">🔵 Contacted</option>
                            <option value="confirmed">🟢 Confirmed</option>
                            <option value="closed">🔴 Closed</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                            <a
                              href={`https://wa.me/${waNum}?text=Hi%20${encodeURIComponent(item.customerName || 'Customer')},%20regarding%20your%20inquiry%20for%20${encodeURIComponent(item.carName || 'our cars')}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary btn-sm"
                              style={{
                                padding: '4px 8px',
                                background: '#25D366',
                                borderColor: '#25D366',
                                color: '#FFFFFF',
                                fontSize: 11,
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                borderRadius: 6,
                              }}
                              title="Chat with Customer on WhatsApp"
                            >
                              <BsWhatsapp size={12} /> WhatsApp
                            </a>
                            <button
                              className="btn-icon"
                              onClick={() => {
                                setSelectedInquiry(item);
                                setIsDetailOpen(true);
                              }}
                              title="View Full Booking Details"
                              style={{ padding: 6 }}
                            >
                              <FiEye size={14} />
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleResendNotification(item)}
                              title="Dispatch Alert to vishalkarke184@gmail.com"
                              style={{ color: '#2563EB', padding: 6 }}
                            >
                              <FiSend size={14} />
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleDelete(item.id)}
                              style={{ color: 'var(--color-error)', padding: 6 }}
                              title="Delete Record"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Inquiry & Booking Detail"
      >
        {selectedInquiry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Customer Contact Box */}
            <div style={{
              padding: 14,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div>
                <strong style={{ fontSize: 17, color: 'var(--color-text)', display: 'block' }}>
                  {selectedInquiry.customerName}
                </strong>
                <span style={{ fontSize: 12.5, color: 'var(--color-text-2)' }}>
                  📞 {selectedInquiry.phone} • ✉️ {selectedInquiry.email || 'No email provided'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <a
                  href={`tel:${(selectedInquiry.phone || '').replace(/\s+/g, '')}`}
                  className="btn btn-sm"
                  style={{ background: '#FF4500', color: '#FFFFFF', padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <FiPhone size={12} /> Call
                </a>
                <a
                  href={`https://wa.me/${(selectedInquiry.phone || '').replace(/\D/g, '').startsWith('91') ? (selectedInquiry.phone || '').replace(/\D/g, '') : `91${(selectedInquiry.phone || '').replace(/\D/g, '')}`}?text=Hi%20${encodeURIComponent(selectedInquiry.customerName || 'Customer')},%20regarding%20your%20car%20rental%20inquiry%20for%20${encodeURIComponent(selectedInquiry.carName || 'our fleet')}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm"
                  style={{ background: '#25D366', color: '#FFFFFF', padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <BsWhatsapp size={12} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Vehicle & Trip Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
              background: '#FFFFFF',
              padding: 12,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Car Model</span>
                <strong style={{ color: 'var(--color-accent)', fontSize: 14 }}>{selectedInquiry.carName || 'General Inquiry'}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Pickup Location</span>
                <strong>📍 {selectedInquiry.city || 'Pune'}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Delivery Method</span>
                <strong>{selectedInquiry.pickupType || 'Doorstep Delivery'}</strong>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Estimated Total</span>
                <strong style={{ color: '#16A34A', fontSize: 15 }}>
                  {formatCurrency(selectedInquiry.estimatedPrice || 0)}
                </strong>
              </div>
            </div>

            {/* Dates & Duration */}
            {(selectedInquiry.pickupDate || selectedInquiry.returnDate) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                fontSize: 12.5,
                background: 'var(--color-bg-alt)',
                padding: 12,
                borderRadius: 'var(--radius-md)',
              }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Pickup Date</span>
                  <strong>{new Date(selectedInquiry.pickupDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block' }}>Return Date</span>
                  <strong>{new Date(selectedInquiry.returnDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
              </div>
            )}

            {/* Customer Message */}
            {selectedInquiry.message && (
              <div style={{ padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-3)', display: 'block', fontWeight: 700 }}>Customer Note:</span>
                <p style={{ fontSize: 13, color: 'var(--color-text)', margin: '4px 0 0', lineHeight: 1.5 }}>{selectedInquiry.message}</p>
              </div>
            )}

            {/* Email Dispatch Status & Action Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.04) 0%, rgba(30, 41, 59, 0.04) 100%)',
              border: '1px solid rgba(255, 69, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}>
              <div>
                <span style={{ fontSize: 11.5, color: '#64748B', display: 'block' }}>Notification Recipient:</span>
                <strong style={{ fontSize: 13, color: '#0F172A' }}>{ADMIN_NOTIFICATION_EMAIL}</strong>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => handleResendNotification(selectedInquiry)}
                  disabled={sendingMail}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 11.5, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                >
                  <FiSend size={12} /> {sendingMail ? 'Sending...' : 'Dispatch Alert'}
                </button>
                <a
                  href={getInquiryMailtoUrl(selectedInquiry)}
                  className="btn btn-sm"
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: 11.5,
                    padding: '5px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    textDecoration: 'none',
                    borderRadius: 8,
                  }}
                >
                  <FiMail size={12} /> Open in Email
                </a>
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 800, fontSize: 12.5 }}>Update Processing Status</label>
              <select
                className="form-select"
                value={selectedInquiry.status || 'new'}
                onChange={(e) => {
                  handleStatusUpdate(selectedInquiry.id, e.target.value);
                  setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                }}
              >
                <option value="new">🟡 New Lead</option>
                <option value="contacted">🔵 Contacted Customer</option>
                <option value="confirmed">🟢 Confirmed &amp; Scheduled</option>
                <option value="closed">🔴 Closed / Completed</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
