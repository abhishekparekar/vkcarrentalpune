import { useState } from 'react';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiChevronDown, FiChevronUp, FiFileText, FiClock, FiKey, FiDollarSign } from 'react-icons/fi';

export const REQUIRED_DOCUMENTS = [
  { id: 1, name: 'Aadhaar Card', icon: '🪪', req: 'Original Required' },
  { id: 2, name: 'Driving Licence', icon: '🚗', req: 'Valid Original' },
  { id: 3, name: 'PAN Card', icon: '💳', req: 'Original Required' },
  { id: 4, name: 'Rent Agreement', icon: '🏠', req: 'Current Address Proof' },
  { id: 5, name: 'Job ID Card', icon: '🆔', req: 'Employment Proof' },
];

export const CATEGORIZED_TERMS = [
  {
    category: 'Km & Overtime Rates',
    icon: '⚡',
    items: [
      { highlight: '300 km Limit', text: '300 km limit per 24 hours package.' },
      { highlight: 'Extra KM Rates', text: '₹6/km (5 Seater) • ₹7/km (7 Seater / SUV).' },
      { highlight: 'Overtime Fees', text: '₹200/hr (Swift, Ertiga, i20, Dzire, Punch, Venue, Baleno) • ₹300/hr (Thar 4x4).' },
    ],
  },
  {
    category: 'Deposit & Insurance',
    icon: '🔑',
    items: [
      { highlight: 'Security Deposit', text: "Customer's own bike is acceptable OR ₹10,000 cash deposit." },
      { highlight: 'Advance Fee', text: 'Booking advance payment is strictly Non-Refundable.' },
      { highlight: 'Damage Policy', text: 'Minor scratches & dents not covered by insurance. Service center downtime fee + processing fee applies.' },
    ],
  },
  {
    category: 'Rules & Fuel Policy',
    icon: '🚫',
    items: [
      { highlight: 'Strict Policy', text: "DON'T DRINK AND DRIVE. 100% customer liability for damages if alcohol is involved." },
      { highlight: 'Fuel & FASTag', text: 'Maintain given fuel level (extra fuel non-refundable). FASTag server issues not under our control.' },
      { highlight: 'Pickup Payment', text: 'Full rent + deposit must be paid at the time of car pickup.' },
    ],
  },
];

export const HIGHLIGHT_CHIPS = [
  { text: '300 KM / 24h Limit', icon: '📏' },
  { text: 'Bike / ₹10k Deposit', icon: '🔑' },
  { text: '5 Required Documents', icon: '📄' },
  { text: 'No Drink & Drive', icon: '🚫' },
  { text: 'Non-Refundable Advance', icon: '💳' },
  { text: 'Rent at Pickup', icon: '🛻' },
];

export default function TermsAndConditions({ expandable = false, defaultOpen = true, compact = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 16,
      border: '1px solid rgba(255, 69, 0, 0.25)',
      boxShadow: '0 4px 20px rgba(17, 19, 24, 0.05)',
      overflow: 'hidden',
      width: '100%',
    }}>
      {/* Top Banner Header */}
      <div
        onClick={() => expandable && setIsOpen(prev => !prev)}
        style={{
          padding: compact ? '12px 16px' : '14px 20px',
          background: 'linear-gradient(135deg, rgba(255, 69, 0,0.09) 0%, rgba(255,255,255,1) 100%)',
          borderBottom: (isOpen || !expandable) ? '1px solid rgba(255, 69, 0,0.20)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: expandable ? 'pointer' : 'default',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #FF4500 0%, #E66E00 100%)',
            color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(255, 69, 0,0.4)',
          }}>
            <FiShield />
          </div>
          <div>
            <span style={{ fontSize: 10, color: '#FF4500', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
              VK SELF DRIVE CAR'S PUNE
            </span>
            <h4 style={{ fontSize: compact ? 13 : 15, fontWeight: 800, color: '#111318', margin: 0 }}>
              Rental Policy & Mandatory Documents
            </h4>
          </div>
        </div>

        {expandable && (
          <div style={{
            width: 26, height: 26,
            borderRadius: '50%',
            background: 'rgba(255, 69, 0,0.10)',
            color: '#FF4500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        )}
      </div>

      {(!expandable || isOpen) && (
        <div style={{ padding: compact ? '12px 14px' : '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Quick Highlight Pills Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 4,
            scrollbarWidth: 'none',
          }}>
            {HIGHLIGHT_CHIPS.map((chip, idx) => (
              <div
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 99,
                  background: 'rgba(255, 69, 0,0.06)',
                  border: '1px solid rgba(255, 69, 0,0.18)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#FF4500',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>{chip.icon}</span>
                <span>{chip.text}</span>
              </div>
            ))}
          </div>

          {/* Notice Alert Box */}
          <div style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            fontSize: 11.5,
            color: '#991B1B',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <FiAlertTriangle size={15} style={{ flexShrink: 0, color: '#FF4500' }} />
            <span>⭕ PLEASE READ ALL TERMS AND CONDITIONS CAREFULLY BEFORE BOOKING ⭕</span>
          </div>

          {/* 📄 MANDATORY DOCUMENTS REQUIRED CARD */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
            border: '1px solid rgba(255, 69, 0, 0.22)',
            borderRadius: 12,
            padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>📄</span>
              <strong style={{ fontSize: 13, color: '#FF4500', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                5 Documents Required for Pickup:
              </strong>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: 8,
            }}>
              {REQUIRED_DOCUMENTS.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: 10,
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{doc.icon}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: 12, color: '#111318', lineHeight: 1.2 }}>
                      {doc.id}) {doc.name}
                    </strong>
                    <span style={{ fontSize: 10, color: '#6B7080' }}>{doc.req}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3-Column Policy Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 10,
          }}>
            {CATEGORIZED_TERMS.map((cat, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F9FAFB',
                  borderRadius: 12,
                  padding: '12px 14px',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 6, borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: 15 }}>{cat.icon}</span>
                  <strong style={{ fontSize: 12.5, color: '#111318', fontWeight: 800 }}>{cat.category}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} style={{ fontSize: 11.5, lineHeight: 1.45, color: '#4B5563' }}>
                      <strong style={{ color: '#FF4500', fontWeight: 700 }}>• {item.highlight}: </strong>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Security Note */}
          <div style={{
            padding: '8px 12px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255, 69, 0,0.05) 0%, rgba(255,255,255,1) 100%)',
            border: '1px dashed rgba(255, 69, 0,0.25)',
            fontSize: 11.5,
            color: '#111318',
            textAlign: 'center',
            fontWeight: 600,
          }}>
            🛻 <strong>Full rent + deposit (bike or ₹10,000)</strong> collected at car pickup.
          </div>
        </div>
      )}
    </div>
  );
}
