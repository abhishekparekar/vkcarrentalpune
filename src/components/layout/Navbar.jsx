import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiPhone, FiCalendar, FiChevronRight,
  FiHome, FiTruck, FiInfo, FiPhoneCall, FiFileText, FiCheckCircle, FiClock, FiShield
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';

import logoImg from '../../assets/vklogo1.png';
import { useTenant } from '../../contexts/TenantContext';

const navLinks = [
  { label: 'Home', to: '/', icon: <FiHome size={18} /> },
  { label: 'Fleet', to: '/fleet', icon: <FiTruck size={18} /> },
  { label: 'About Us', to: '/about', icon: <FiInfo size={18} /> },
  { label: 'Contact', to: '/contact', icon: <FiPhoneCall size={18} /> },
  { label: 'My Inquiries', to: '/my-inquiries', icon: <FiFileText size={18} /> },
];

export default function Navbar() {
  const { settings } = useTenant();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 20);
      if (!menuOpen) {
        if (Math.abs(cur - lastScrollY) > 10) {
          setHidden(cur > 100 && cur > lastScrollY);
          lastScrollY = cur;
        }
      } else {
        setHidden(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogoClick = (e) => {
    setMenuOpen(false);
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 9999,
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.25s ease, box-shadow 0.25s ease',
          background: scrolled || menuOpen
            ? 'rgba(10, 15, 29, 0.98)'
            : 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled ? '0 10px 35px rgba(0, 0, 0, 0.60)' : '0 4px 20px rgba(0, 0, 0, 0.35)',
        }}
      >
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
          position: 'relative',
        }}>

          {/* ── Logo Branding ── */}
          <Link
            to="/"
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <img
              src={logoImg}
              alt="VK RENTAL CARS PUNE"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="mobile-logo-img"
              style={{
                height: 58,
                maxHeight: 58,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 4px 16px rgba(255, 69, 0, 0.40))',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>

          {/* ── Desktop Executive Navigation Links ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }} className="desktop-nav">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="desktop-nav-item"
                style={({ isActive }) => ({
                  position: 'relative',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: 14.5,
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#FF5500' : '#F1F5F9',
                  background: isActive ? 'rgba(255, 69, 0, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 69, 0, 0.45)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 16px rgba(255, 69, 0, 0.25)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                })}
              >
                {({ isActive }) => (
                  <span>{link.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop Right Call & Action CTAs + Mobile Call Pill ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Desktop Call Pill */}
            <a
              href={`tel:${(settings?.phone || '+91 8381052230').replace(/\s+/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 18px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.16)',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
              }}
              className="desktop-nav"
              onMouseEnter={e => {
                e.currentTarget.style.color = '#FF5500';
                e.currentTarget.style.borderColor = '#FF4500';
                e.currentTarget.style.background = 'rgba(255, 69, 0, 0.12)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 69, 0, 0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
            >
              <FiPhone size={14} style={{ color: '#FF4500' }} />
              <span>{settings?.phone || '+91 83810 52230'}</span>
            </a>

            {/* 📱 ULTRA HIGH-END CENTERED MOBILE CALL PILL */}
            <a
              href={`tel:${(settings?.phone || '+91 8381052230').replace(/\s+/g, '')}`}
              className="mobile-call-pill"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 7,
                padding: '6.5px 14px',
                borderRadius: '9999px',
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#FFFFFF',
                border: '1.5px solid #FF4500',
                fontSize: 13.5,
                fontWeight: 900,
                letterSpacing: '0.3px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(255, 69, 0, 0.35)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}>
                <FiPhoneCall size={12} color="#FFFFFF" />
              </span>
              <span>{settings?.phone || '+91 83810 52230'}</span>
            </a>

            <button
              className="btn btn-primary btn-sm desktop-nav"
              onClick={() => navigate('/fleet')}
              style={{
                fontWeight: 900,
                letterSpacing: '0.4px',
                padding: '10px 22px',
                fontSize: 14,
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                boxShadow: '0 6px 20px rgba(255, 69, 0, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <FiCalendar size={15} /> Book Now
            </button>

            {/* 📱 MODERN MOBILE MENU TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() => { setMenuOpen(p => !p); if (hidden) setHidden(false); }}
              aria-label="Toggle Menu"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: menuOpen ? 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)' : 'rgba(255, 255, 255, 0.08)',
                border: menuOpen ? '1px solid #FF4500' : '1.5px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: menuOpen ? '0 6px 20px rgba(255, 69, 0, 0.40)' : '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
              className="mobile-only"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── 📱 EXECUTIVE MOBILE FULL-SHEET NAVIGATION DRAWER ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Dark Glass Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              className="mobile-only"
            />

            {/* Slide-Over Executive Compact Sheet Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '82%',
                maxWidth: 300,
                zIndex: 10001,
                background: '#0F172A',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                borderLeft: '1px solid rgba(255, 69, 0, 0.35)',
              }}
              className="mobile-only"
            >
              {/* Drawer Top Header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#0B0F19',
              }}>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                >
                  <img
                    src={logoImg}
                    alt="VK RENTAL CARS PUNE"
                    style={{
                      height: 44,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 2px 10px rgba(255, 69, 0, 0.35))',
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
                      VK RENTAL CARS
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#FF4500', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                      PUNE • SELF DRIVE
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Drawer Main Navigation Links */}
              <div style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 10.5, fontWeight: 900, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 2, paddingLeft: 4 }}>
                  Explore Menu
                </span>

                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      padding: '10px 12px',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: isActive ? 900 : 600,
                      color: isActive ? '#FF4500' : '#F1F5F9',
                      background: isActive ? 'rgba(255, 69, 0, 0.16)' : 'rgba(255, 255, 255, 0.04)',
                      border: isActive ? '1.5px solid rgba(255, 69, 0, 0.45)' : '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: isActive ? '0 4px 14px rgba(255, 69, 0, 0.20)' : 'none',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: isActive ? '#FF4500' : 'rgba(255, 255, 255, 0.08)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                            flexShrink: 0,
                          }}>
                            {link.icon}
                          </div>
                          <span>{link.label}</span>
                        </div>
                        {isActive ? (
                          <FiCheckCircle size={16} color="#FF4500" />
                        ) : (
                          <FiChevronRight size={16} style={{ color: '#64748B' }} />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom CTAs (Direct Call + WhatsApp + Book Now) */}
              <div style={{
                padding: '12px 10px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#0B0F19',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <a
                    href={`tel:${(settings?.phone || '+91 8381052230').replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      padding: '10px 8px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.07)',
                      border: '1.5px solid rgba(255, 255, 255, 0.14)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: 12.5,
                      textDecoration: 'none',
                    }}
                  >
                    <FiPhone size={14} color="#FF4500" /> Call
                  </a>

                  <a
                    href={`https://wa.me/${(settings?.whatsapp || settings?.phone || '918381052230').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(settings?.businessName || "VK SELF DRIVE CAR'S PUNE")},%20I%20want%20to%20book%20a%20car.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      padding: '10px 8px',
                      borderRadius: 12,
                      background: '#25D366',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: 12.5,
                      textDecoration: 'none',
                      boxShadow: '0 3px 10px rgba(37,211,102,0.3)',
                    }}
                  >
                    <BsWhatsapp size={14} /> WhatsApp
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '11px',
                    fontSize: 13.5,
                    fontWeight: 900,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                    boxShadow: '0 4px 16px rgba(255, 69, 0, 0.35)',
                  }}
                >
                  <FiCalendar size={15} /> Book Self-Drive Cars
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-only {
          display: none !important;
        }
        .desktop-nav-item:hover {
          color: #FF4500 !important;
          background: rgba(255, 69, 0, 0.06) !important;
          border-color: rgba(255, 69, 0, 0.22) !important;
        }
        @media (max-width: 980px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-only {
            display: inline-flex !important;
          }
          .mobile-call-pill {
            display: inline-flex !important;
            position: absolute !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 10;
          }
          .mobile-logo-img {
            height: 48px !important;
            max-height: 48px !important;
          }
        }
        @media (max-width: 480px) {
          .mobile-call-pill {
            padding: 5px 10px !important;
            font-size: 12.5px !important;
          }
          .mobile-logo-img {
            height: 44px !important;
            max-height: 44px !important;
          }
        }
        @media (max-width: 360px) {
          .mobile-call-pill {
            padding: 4px 8px !important;
            font-size: 11.5px !important;
          }
        }
      `}</style>
    </>
  );
}
