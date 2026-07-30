import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitterX, BsYoutube, BsWhatsapp } from 'react-icons/bs';
import { 
  FiMail, FiPhone, FiMapPin, FiShield, FiArrowRight, FiCheckCircle, 
  FiChevronRight, FiTruck, FiClock, FiCalendar
} from 'react-icons/fi';
import logoImg from '../../assets/vklogo1.png';
import { useTenant } from '../../contexts/TenantContext';

export default function Footer() {
  const { settings } = useTenant();

  const footerLinks = {
    'Quick Navigation': [
      { label: 'Home Page',    to: '/' },
      { label: 'Our Fleet',    to: '/fleet' },
      { label: 'About Us',     to: '/about' },
      { label: 'Contact Us',   to: '/contact' },
      { label: 'My Inquiries', to: '/my-inquiries' },
    ],
    'Car Categories': [
      { label: 'Hatchback Fleet', to: '/fleet?category=hatchback' },
      { label: 'Sedan Fleet',     to: '/fleet?category=sedan' },
      { label: 'SUV & 4x4 Fleet', to: '/fleet?category=suv' },
      { label: 'Luxury Cars',    to: '/fleet?category=luxury' },
    ],
  };

  const socials = [
    { icon: <BsFacebook />,  href: settings?.facebook || '#', label: 'Facebook' },
    { icon: <BsInstagram />, href: settings?.instagram || '#', label: 'Instagram' },
    { icon: <BsTwitterX />,  href: settings?.twitter || '#', label: 'Twitter/X' },
    { icon: <BsYoutube />,   href: settings?.youtube || '#', label: 'YouTube' },
  ];

  const rawPhone = settings?.phone || '+91 8381052230';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const rawWhatsapp = settings?.whatsapp || cleanPhone || '918381052230';
  const whatsappNumber = rawWhatsapp.startsWith('91') ? rawWhatsapp : `91${rawWhatsapp}`;

  return (
    <footer
      className="footer-root"
      style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #070B14 100%)',
        position: 'relative',
        marginTop: 'auto',
        color: '#F8FAFC',
        borderTop: '1px solid rgba(255, 69, 0, 0.35)',
      }}
    >
      {/* Top Glowing Bhagwa Accent Bar */}
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, #FF5500 0%, #FF4500 50%, #D63300 100%)',
        width: '100%',
        boxShadow: '0 0 20px rgba(255, 69, 0, 0.65)',
      }} />

      <div style={{ padding: '56px 0 28px' }}>
        <div className="container">
          <div className="footer-grid">

            {/* ── 1. Brand & Business Info Column ── */}
            <div className="footer-brand-col">
              <Link to="/" style={{ display: 'inline-block', marginBottom: 16, textDecoration: 'none' }}>
                <div style={{
                  background: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: 14,
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.45)',
                  display: 'inline-block',
                }}>
                  <img
                    src={logoImg}
                    alt={settings?.businessName || "VK SELF DRIVE CAR'S PUNE"}
                    style={{
                      height: 52,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              </Link>

              <h3 style={{ fontSize: 15, fontWeight: 900, color: '#FFFFFF', marginBottom: 8, letterSpacing: '0.3px' }}>
                {settings?.businessName || "VK SELF DRIVE CAR'S PUNE"}
              </h3>

              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.65, marginBottom: 18, maxWidth: 300 }}>
                {settings?.tagline || 'Premium self-drive car rentals with unlimited daily kilometers, 24/7 doorstep delivery & zero deposit hassle in Pune.'}
              </p>



              {/* Social Media Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#CBD5E1',
                      fontSize: 15,
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#FF4500';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#FF4500';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#CBD5E1';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── 2. Link Navigation Columns (2-Column Grid on Mobile) ── */}
            <div className="footer-links-container">
              {Object.entries(footerLinks).map(([group, links]) => (
                <div key={group} className="footer-link-group">
                  <h4 style={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: '#FF4500',
                    letterSpacing: '1.4px',
                    textTransform: 'uppercase',
                    marginBottom: 18,
                  }}>{group}</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 11, listStyle: 'none', padding: 0 }}>
                    {links.map(link => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                          style={{
                            fontSize: 13.5,
                            color: '#94A3B8',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 600,
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = '#FFFFFF';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = '#94A3B8';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <FiChevronRight size={13} color="#FF4500" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* ── 3. Contact & Quick Inquiry CTAs ── */}
            <div className="footer-contact-col">
              <h4 style={{
                fontSize: 12,
                fontWeight: 900,
                color: '#FF4500',
                letterSpacing: '1.4px',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}>Contact Us</h4>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22, listStyle: 'none', padding: 0 }}>
                <li>
                  <a
                    href={`tel:${rawPhone.replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 14,
                      color: '#FFFFFF',
                      textDecoration: 'none',
                      fontWeight: 800,
                      transition: 'color 0.18s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF4500'}
                    onMouseLeave={e => e.currentTarget.style.color = '#FFFFFF'}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'rgba(255, 69, 0, 0.15)',
                      border: '1px solid rgba(255, 69, 0, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FiPhone size={15} color="#FF4500" />
                    </div>
                    <span>{rawPhone}</span>
                  </a>
                </li>

                <li>
                  <a
                    href={`mailto:${settings?.email || 'vishalkarke184@gmail.com'}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 13.5,
                      color: '#CBD5E1',
                      textDecoration: 'none',
                      transition: 'color 0.18s ease',
                      wordBreak: 'break-all',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                    onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                  >
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'rgba(255, 69, 0, 0.15)',
                      border: '1px solid rgba(255, 69, 0, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FiMail size={15} color="#FF4500" />
                    </div>
                    <span>{settings?.email || 'vishalkarke184@gmail.com'}</span>
                  </a>
                </li>

                <li>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: '#CBD5E1' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: 'rgba(255, 69, 0, 0.15)',
                      border: '1px solid rgba(255, 69, 0, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FiMapPin size={15} color="#FF4500" />
                    </div>
                    <span>{settings?.address || 'Pune, Maharashtra'}</span>
                  </div>
                </li>
              </ul>

              {/* Dynamic WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(settings?.businessName || "VK SELF DRIVE CAR'S PUNE")},%20I%20want%20to%20book%20a%20car.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #25D366 0%, #1EAA52 100%)',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 900,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <BsWhatsapp size={18} /> Book on WhatsApp
              </a>
            </div>

          </div>

          {/* ── Bottom Divider & Copyright Bar ── */}
          <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.08)', margin: '36px 0 20px' }} />

          <div className="footer-bottom-bar" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, fontWeight: 500 }}>
              © {new Date().getFullYear()} <strong style={{ color: '#FFFFFF' }}>{settings?.businessName || "VK SELF DRIVE CAR'S PUNE"}</strong>. All rights reserved.
            </p>

            <div style={{ display: 'flex', gap: 14, fontSize: 12.5, color: '#64748B', fontWeight: 600, flexWrap: 'wrap' }}>
              <Link to="/about" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} style={{ color: '#94A3B8', textDecoration: 'none' }}>About Us</Link>
              <span>•</span>
              <Link to="/contact" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} style={{ color: '#94A3B8', textDecoration: 'none' }}>Contact Support</Link>
              <span>•</span>
              <Link to="/fleet" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })} style={{ color: '#94A3B8', textDecoration: 'none' }}>Self Drive Fleet</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 3fr 1.3fr;
          gap: 36px;
        }
        .footer-links-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .footer-links-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 640px) {
          .footer-links-container {
            grid-template-columns: 1fr 1fr !important;
            gap: 22px 16px !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            justify-content: center !important;
            text-align: center !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </footer>
  );
}
