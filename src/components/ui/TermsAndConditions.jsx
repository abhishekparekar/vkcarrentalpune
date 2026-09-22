import { useState } from 'react';
import { FiShield, FiAlertTriangle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export const REQUIRED_DOCUMENTS = [
  { id: 1, name: 'Aadhaar Card',     icon: '🪪', req: 'Original Required' },
  { id: 2, name: 'Driving Licence',  icon: '🚗', req: 'Valid Original' },
  { id: 3, name: 'PAN Card',         icon: '💳', req: 'Original Required' },
  { id: 4, name: 'Rent Agreement',   icon: '🏠', req: 'Current Address Proof' },
  { id: 5, name: 'Job ID Card',      icon: '🆔', req: 'Employment Proof' },
];

export const CATEGORIZED_TERMS = [
  {
    category: 'Km & Overtime Rates',
    icon: '⚡',
    items: [
      { highlight: '300 km Limit',    text: '300 km limit per 24 hours package.' },
      { highlight: 'Extra KM Rates',  text: '₹6/km (5 Seater) • ₹7/km (7 Seater / SUV).' },
      { highlight: 'Overtime Fees',   text: '₹200/hr (Swift, Ertiga, i20, Dzire, Punch, Venue, Baleno) • ₹300/hr (Thar 4x4).' },
    ],
  },
  {
    category: 'Deposit & Insurance',
    icon: '🔑',
    items: [
      { highlight: 'Security Deposit', text: "Customer's own bike is acceptable OR ₹10,000 cash deposit." },
      { highlight: 'Advance Fee',       text: 'Booking advance payment is strictly Non-Refundable.' },
      { highlight: 'Damage Policy',     text: 'Minor scratches & dents not covered by insurance. Service center downtime fee + processing fee applies.' },
    ],
  },
  {
    category: 'Rules & Fuel Policy',
    icon: '🚫',
    items: [
      { highlight: 'Strict Policy',    text: "DON'T DRINK AND DRIVE. 100% customer liability for damages if alcohol is involved." },
      { highlight: 'Fuel & FASTag',    text: 'Maintain given fuel level (extra fuel non-refundable). FASTag server issues not under our control.' },
      { highlight: 'Pickup Payment',   text: 'Full rent + deposit must be paid at the time of car pickup.' },
    ],
  },
];

export const HIGHLIGHT_CHIPS = [
  { text: '300 KM / 24h',         icon: '📏' },
  { text: 'Bike / ₹10k Deposit',  icon: '🔑' },
  { text: '5 Documents',          icon: '📄' },
  { text: 'No Drink & Drive',     icon: '🚫' },
  { text: 'Non-Refundable Adv.',  icon: '💳' },
  { text: 'Rent at Pickup',       icon: '🛻' },
];

export default function TermsAndConditions({ expandable = true, defaultOpen = false, compact = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="tnc-root">
      {/* ── Header ── */}
      <div
        className={`tnc-header${expandable ? ' tnc-header--clickable' : ''}`}
        onClick={() => expandable && setIsOpen(prev => !prev)}
      >
        <div className="tnc-header-left">
          <div className="tnc-shield-icon">
            <FiShield size={18} />
          </div>
          <div>
            <span className="tnc-tag">VK RENTAL CARS PUNE • OFFICIAL POLICY</span>
            <h4 className="tnc-title">Rental Policy & Mandatory Documents</h4>
          </div>
        </div>

        {expandable && (
          <div className="tnc-toggle-btn">
            <span>{isOpen ? 'Collapse' : 'View Policy'}</span>
            {isOpen ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      {(!expandable || isOpen) && (
        <div className="tnc-body">

          {/* Highlight chips scroll */}
          <div className="tnc-chips-bar">
            {HIGHLIGHT_CHIPS.map((chip, idx) => (
              <div key={idx} className="tnc-chip">
                <span>{chip.icon}</span>
                <span>{chip.text}</span>
              </div>
            ))}
          </div>

          {/* Alert */}
          <div className="tnc-alert">
            <FiAlertTriangle size={15} style={{ flexShrink: 0, color: '#FF4500' }} />
            <span>⭕ PLEASE READ ALL TERMS & MANDATORY DOCUMENTATION CAREFULLY BEFORE BOOKING ⭕</span>
          </div>

          {/* Documents */}
          <div className="tnc-docs-card">
            <div className="tnc-docs-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>📄</span>
                <strong className="tnc-docs-title">5 Mandatory Documents at Pickup:</strong>
              </div>
              <span className="tnc-docs-badge">Original Verified</span>
            </div>
            <div className="tnc-docs-grid">
              {REQUIRED_DOCUMENTS.map(doc => (
                <div key={doc.id} className="tnc-doc-item">
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{doc.icon}</span>
                  <div>
                    <strong className="tnc-doc-name">{doc.id}. {doc.name}</strong>
                    <span className="tnc-doc-req">{doc.req}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Grid */}
          <div className="tnc-policy-grid">
            {CATEGORIZED_TERMS.map((cat, idx) => (
              <div key={idx} className="tnc-policy-card">
                <div className="tnc-policy-cat">
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <strong className="tnc-policy-cat-name">{cat.category}</strong>
                </div>
                <div className="tnc-policy-items">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="tnc-policy-item">
                      <strong className="tnc-item-hl">• {item.highlight}: </strong>
                      <span className="tnc-item-txt">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="tnc-footer-note">
            <span>🛻</span>
            <span>
              <strong>Full Rent + Deposit (Customer Bike OR ₹10,000 Cash)</strong> collected at car pickup.
            </span>
          </div>
        </div>
      )}

      <style>{`
        .tnc-root {
          background: #FFFFFF;
          border-radius: 14px;
          border: 1.5px solid rgba(184,0,0,0.22);
          box-shadow: 0 3px 16px rgba(15,23,42,0.05);
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .tnc-header {
          padding: 14px 16px;
          background: linear-gradient(135deg, rgba(184,0,0,0.07) 0%, #FFFFFF 100%);
          border-bottom: 1px solid rgba(184,0,0,0.14);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          user-select: none;
        }
        .tnc-header--clickable { cursor: pointer; }
        .tnc-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .tnc-shield-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #9E0000 0%, #D91400 50%, #7A0000 100%);
          color: #FFF;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(184,0,0,0.35);
          flex-shrink: 0;
        }
        .tnc-tag {
          font-size: 9.5px;
          color: #B80000;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          display: block;
          margin-bottom: 2px;
        }
        .tnc-title {
          font-size: 14px;
          font-weight: 900;
          color: #111318;
          margin: 0;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tnc-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 800;
          color: #B80000;
          background: rgba(184,0,0,0.08);
          padding: 5px 11px;
          border-radius: 99px;
          border: 1px solid rgba(184,0,0,0.22);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tnc-body {
          padding: 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Chips */
        .tnc-chips-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          flex-wrap: wrap;
        }
        .tnc-chips-bar::-webkit-scrollbar { display: none; }
        .tnc-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 99px;
          background: rgba(255,69,0,0.06);
          border: 1px solid rgba(255,69,0,0.18);
          font-size: 11px;
          font-weight: 800;
          color: #FF4500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Alert */
        .tnc-alert {
          padding: 9px 12px;
          border-radius: 9px;
          background: #FEF2F2;
          border: 1px solid #FCA5A5;
          font-size: 11.5px;
          color: #991B1B;
          font-weight: 700;
          display: flex;
          align-items: flex-start;
          gap: 7px;
          line-height: 1.5;
        }

        /* Documents */
        .tnc-docs-card {
          background: linear-gradient(135deg, rgba(255,69,0,0.04) 0%, #FFFFFF 100%);
          border: 1.5px solid rgba(255,69,0,0.18);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .tnc-docs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .tnc-docs-title {
          font-size: 12.5px;
          color: #FF4500;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .tnc-docs-badge {
          font-size: 10.5px;
          background: rgba(255,69,0,0.1);
          color: #FF4500;
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 800;
        }
        .tnc-docs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .tnc-doc-item {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 11px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 1px 4px rgba(15,23,42,0.03);
        }
        .tnc-doc-name {
          display: block;
          font-size: 12px;
          color: #111318;
          font-weight: 800;
          line-height: 1.25;
        }
        .tnc-doc-req {
          font-size: 10.5px;
          color: #FF4500;
          font-weight: 700;
        }

        /* Policy Grid */
        .tnc-policy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .tnc-policy-card {
          background: #FFFFFF;
          border-radius: 12px;
          padding: 12px 13px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 6px rgba(15,23,42,0.03);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tnc-policy-cat {
          display: flex;
          align-items: center;
          gap: 7px;
          padding-bottom: 7px;
          border-bottom: 1.5px solid #F1F5F9;
        }
        .tnc-policy-cat-name {
          font-size: 12.5px;
          color: #111318;
          font-weight: 900;
        }
        .tnc-policy-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tnc-policy-item {
          font-size: 11.5px;
          line-height: 1.5;
          color: #111318;
        }
        .tnc-item-hl { color: #FF4500; font-weight: 800; }
        .tnc-item-txt { font-weight: 600; color: #1E293B; }

        /* Footer note */
        .tnc-footer-note {
          padding: 9px 12px;
          border-radius: 9px;
          background: linear-gradient(135deg, rgba(255,69,0,0.06) 0%, #FFFFFF 100%);
          border: 1px dashed rgba(255,69,0,0.32);
          font-size: 12px;
          color: #111318;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-align: center;
          flex-wrap: wrap;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .tnc-policy-grid { grid-template-columns: 1fr; gap: 8px; }
        }
        @media (max-width: 560px) {
          .tnc-body { padding: 12px 10px; gap: 10px; }
          .tnc-title { font-size: 13px; }
          .tnc-chip { font-size: 10.5px; padding: 3px 8px; }
          .tnc-docs-grid { grid-template-columns: 1fr 1fr; gap: 7px; }
          .tnc-doc-item { padding: 8px 9px; }
          .tnc-doc-name { font-size: 11px; }
          .tnc-policy-item { font-size: 11px; }
        }
        @media (max-width: 380px) {
          .tnc-docs-grid { grid-template-columns: 1fr; }
          .tnc-toggle-btn { padding: 4px 8px; font-size: 10.5px; }
        }
      `}</style>
    </div>
  );
}
