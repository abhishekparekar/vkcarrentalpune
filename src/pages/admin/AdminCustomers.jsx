import { useState, useEffect } from 'react';
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiUsers,
  FiCheckCircle, FiPhone, FiMail, FiMapPin, FiFileText, FiZap,
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import toast from 'react-hot-toast';

import AdminLayout from '../../components/layout/AdminLayout';
import Modal from '../../components/ui/Modal';

import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  subscribeToCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  subscribeToInquiries,
} from '../../firebase/firestore';

export default function AdminCustomers() {
  const { tenantId } = useTenant();
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    name: '',
    phone: '',
    email: '',
    city: 'Pune',
    dlNumber: '',
    aadhaarNumber: '',
    kycStatus: 'verified',
    totalTrips: 1,
    notes: '',
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    const unsubCust = subscribeToCustomers(tenantId, (custData) => {
      setCustomers(custData);
      setLoading(false);
    });

    const unsubInq = subscribeToInquiries(tenantId, (inqData) => {
      setInquiries(inqData);
    });

    return () => {
      unsubCust();
      unsubInq();
    };
  }, [tenantId]);

  // Combine direct customers + unique customers extracted from inquiries
  const combinedCustomers = [...customers];
  inquiries.forEach((inq) => {
    if (inq.customerName || inq.phone) {
      const exists = combinedCustomers.some(
        c => (c.phone && inq.phone && c.phone === inq.phone) || (c.email && inq.email && c.email === inq.email)
      );
      if (!exists) {
        combinedCustomers.push({
          id: `inq-cust-${inq.id}`,
          name: inq.customerName || 'Inquiry Customer',
          phone: inq.phone || 'N/A',
          email: inq.email || 'N/A',
          city: inq.city || 'Pune',
          kycStatus: 'verified',
          totalTrips: 1,
          fromInquiry: true,
          createdAt: inq.createdAt,
        });
      }
    }
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setForm({
      name: cust.name || '',
      phone: cust.phone || '',
      email: cust.email || '',
      city: cust.city || 'Pune',
      dlNumber: cust.dlNumber || '',
      aadhaarNumber: cust.aadhaarNumber || '',
      kycStatus: cust.kycStatus || 'verified',
      totalTrips: cust.totalTrips || 1,
      notes: cust.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (cust) => {
    if (!window.confirm(`Are you sure you want to delete ${cust.name}?`)) return;
    try {
      if (cust.fromInquiry) {
        toast.success('Customer removed from view');
      } else {
        await deleteCustomer(tenantId, cust.id);
        toast.success('Customer deleted from database');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete customer');
    }
  };

  const handleToggleKyc = async (cust) => {
    if (cust.fromInquiry) {
      toast.error('Converted inquiries must be added to CRM first to modify KYC');
      return;
    }
    try {
      const nextKyc = cust.kycStatus === 'verified' ? 'pending' : 'verified';
      await updateCustomer(tenantId, cust.id, { kycStatus: nextKyc }, user?.uid);
      toast.success(`${cust.name} KYC updated to ${nextKyc}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update KYC');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter customer name and phone');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCustomer && !editingCustomer.fromInquiry) {
        await updateCustomer(tenantId, editingCustomer.id, form, user?.uid);
        toast.success('Customer record updated');
      } else {
        await addCustomer(tenantId, form, user?.uid);
        toast.success('New customer registered in CRM');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save customer');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCustomers = combinedCustomers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery) ||
    c.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifiedCount = combinedCustomers.filter(c => c.kycStatus !== 'pending').length;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 22, margin: 0, color: '#0F172A', fontWeight: 900 }}>Customer Roster (CRM)</h1>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              Verified Renters, KYC Documents & Contact Records
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn btn-primary btn-sm"
            style={{ gap: 6, background: 'linear-gradient(135deg, #FF4500 0%, #E66E00 100%)', borderColor: '#FF4500', fontSize: 12.5, padding: '7px 14px', fontWeight: 800 }}
          >
            <FiPlus /> Register New Customer
          </button>
        </div>

        {/* Compact Quick Stats Bar */}
        <div className="grid-4" style={{ gap: 10 }}>
          <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Total Renters</span>
              <strong style={{ fontSize: 18, color: '#0F172A', display: 'block', lineHeight: 1.1 }}>{combinedCustomers.length}</strong>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255, 69, 0,0.09)', color: '#FF4500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUsers size={17} />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Verified KYC</span>
              <strong style={{ fontSize: 18, color: '#16A34A', display: 'block', lineHeight: 1.1 }}>{verifiedCount}</strong>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(22,163,74,0.08)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCheckCircle size={17} />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Inquiry Renters</span>
              <strong style={{ fontSize: 18, color: '#2563EB', display: 'block', lineHeight: 1.1 }}>{inquiries.length}</strong>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.08)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiFileText size={17} />
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>Location Scope</span>
              <strong style={{ fontSize: 16, color: '#D97706', display: 'block', lineHeight: 1.1 }}>Pune & MH</strong>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(217,119,6,0.08)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiMapPin size={17} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="glass-card" style={{ padding: 10, background: '#FFFFFF' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: 10, color: 'var(--color-text-3)' }} />
            <input
              type="text"
              placeholder="Search by customer name, mobile number, email, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 36, height: 36, fontSize: 12.5 }}
            />
          </div>
        </div>

        {/* Customer Roster Table */}
        <div className="glass-card" style={{ padding: 16, background: '#FFFFFF' }}>
          {loading ? (
            <p style={{ color: 'var(--color-text-2)', fontSize: 12.5 }}>Loading customer roster...</p>
          ) : filteredCustomers.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <div className="empty-state-icon">
                <FiUsers size={40} color="#FF4500" />
              </div>
              <div className="empty-state-title" style={{ marginTop: 8 }}>No customer records found</div>
              <p style={{ fontSize: 12.5, color: '#64748B', margin: '4px 0 12px' }}>
                Register your first customer record using the button above.
              </p>
              <button onClick={handleOpenAdd} className="btn btn-primary btn-sm" style={{ background: '#FF4500', borderColor: '#FF4500' }}>
                + Register New Customer
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Mobile Phone</th>
                    <th>Email</th>
                    <th>City / Location</th>
                    <th>KYC Status</th>
                    <th>Trips</th>
                    <th>Quick Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(c => {
                    const cleanPhone = (c.phone || '').replace(/\D/g, '');
                    const waNum = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                    return (
                      <tr key={c.id}>
                        <td>
                          <div>
                            <strong style={{ color: '#0F172A', display: 'block' }}>{c.name}</strong>
                            {c.fromInquiry && (
                              <span style={{ fontSize: 10, color: '#2563EB', background: 'rgba(37,99,235,0.08)', padding: '1px 6px', borderRadius: 4 }}>
                                From Inquiry
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1E293B' }}>
                            {c.phone || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: '#64748B' }}>
                            {c.email || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                            {c.city || 'Pune'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleKyc(c)}
                            style={{
                              cursor: 'pointer',
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: 99,
                              fontSize: 10.5,
                              fontWeight: 800,
                              background: c.kycStatus === 'pending' ? 'rgba(234,179,8,0.12)' : 'rgba(22,163,74,0.12)',
                              color: c.kycStatus === 'pending' ? '#D97706' : '#16A34A',
                            }}
                          >
                            {c.kycStatus === 'pending' ? '⏳ Pending KYC' : '✅ Verified KYC'}
                          </button>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>
                            {c.totalTrips || 1} Trip(s)
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <a
                              href={`https://wa.me/${waNum}`}
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
                              }}
                              title="Chat on WhatsApp"
                            >
                              <BsWhatsapp size={12} /> WhatsApp
                            </a>
                            <a
                              href={`tel:${c.phone}`}
                              className="btn btn-secondary btn-sm"
                              style={{
                                padding: '4px 8px',
                                fontSize: 11,
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                              title="Call Phone"
                            >
                              <FiPhone size={12} /> Call
                            </a>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-icon" onClick={() => handleOpenEdit(c)} title="Edit Customer">
                              <FiEdit2 size={13} />
                            </button>
                            <button className="btn-icon" onClick={() => handleDelete(c)} style={{ color: 'var(--color-error)' }} title="Delete Record">
                              <FiTrash2 size={13} />
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

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? `Edit Customer — ${editingCustomer.name}` : 'Register New Customer in CRM'}
        maxWidth={620}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="grid-2" style={{ gap: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Rahul Deshmukh"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ height: 36, fontSize: 12.5 }}
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
                style={{ height: 36, fontSize: 12.5 }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ height: 36, fontSize: 12.5 }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">City / Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="Pune (Kothrud)"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                style={{ height: 36, fontSize: 12.5 }}
              />
            </div>
          </div>

          <div className="grid-3" style={{ gap: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Driving License No.</label>
              <input
                type="text"
                className="form-input"
                placeholder="MH12 20210054321"
                value={form.dlNumber}
                onChange={e => setForm({ ...form, dlNumber: e.target.value })}
                style={{ height: 36, fontSize: 12.5 }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Aadhaar Card No.</label>
              <input
                type="text"
                className="form-input"
                placeholder="XXXX XXXX 1234"
                value={form.aadhaarNumber}
                onChange={e => setForm({ ...form, aadhaarNumber: e.target.value })}
                style={{ height: 36, fontSize: 12.5 }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">KYC Status</label>
              <select
                className="form-select"
                value={form.kycStatus}
                onChange={e => setForm({ ...form, kycStatus: e.target.value })}
                style={{ height: 36, fontSize: 12.5 }}
              >
                <option value="verified">Verified (5 Documents Complete)</option>
                <option value="pending">Pending Document Verification</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Admin Notes / Comments</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="e.g. Regular weekend renter, verified original Aadhaar & License."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              style={{ fontSize: 12 }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg w-full"
            style={{ background: '#FF4500', borderColor: '#FF4500', fontSize: 13.5, fontWeight: 800, marginTop: 4 }}
          >
            {submitting ? 'Saving Customer...' : editingCustomer ? 'Update Customer Record' : 'Save & Add Customer to CRM'}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
