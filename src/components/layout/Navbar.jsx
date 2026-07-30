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
  { label: 'Home',         to: '/',             icon: <FiHome size={18} /> },
  { label: 'Fleet',        to: '/fleet',        icon: <FiTruck size={18} /> },
  { label: 'About Us',     to: '/about',        icon: <FiInfo size={18} /> },
  { label: 'Contact',      to: '/contact',      icon: <FiPhoneCall size={18} /> },
  { label: 'My Inquiries', to: '/my-inquiries', icon: <FiFileText size={18} /> },
];

export default function Navbar() {
  const { settings } = useTenant();
  const [scrolled,  setScrolled]  = useState(false);
  const [hidden,    setHidden]    = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
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
            ? 'rgba(255, 255, 255, 0.96)' 
            : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.9)' : '1px solid rgba(241, 245, 249, 0.8)',
          boxShadow: scrolled ? '0 8px 30px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}>

          {/* ── Logo Branding ── */}
          <Link
            to="/"
            onClick={handleLogoClick}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <img
              src={logoImg}
              alt="VK RENTAL CARS Pune"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{
                height: 52,
                maxHeight: 52,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 4px 12px rgba(255, 69, 0, 0.22))',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
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
                  fontWeight: isActive ? 800 : 700,
                  color: isActive ? '#FF4500' : '#000000',
                  background: isActive ? 'rgba(255, 69, 0, 0.09)' : 'transparent',
                  border: isActive ? '1px solid rgba(255, 69, 0, 0.32)' : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(255, 69, 0, 0.15)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                })}
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          left: '25%',
                          right: '25%',
                          height: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(90deg, #FF5500 0%, #FF4500 100%)',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop Right Call & Action CTAs ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href={`tel:${(settings?.phone || '+91 8381052230').replace(/\s+/g, '')}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 18px',
                borderRadius: '9999px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#000000',
                fontSize: 13.5,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
              }}
              className="desktop-nav"
              onMouseEnter={e => {
                e.currentTarget.style.color = '#FF4500';
                e.currentTarget.style.borderColor = '#FF4500';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 69, 0, 0.20)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
              }}
            >
              <FiPhone size={14} style={{ color: '#FF4500' }} />
              <span>{settings?.phone || '+91 8381052230'}</span>
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
                background: menuOpen ? 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)' : '#FFFFFF',
                border: menuOpen ? '1px solid #FF4500' : '1.5px solid #E2E8F0',
                color: menuOpen ? '#FFFFFF' : '#000000',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: menuOpen ? '0 6px 20px rgba(255, 69, 0, 0.40)' : '0 2px 8px rgba(0,0,0,0.06)',
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

            {/* Slide-Over Executive Sheet Drawer */}
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
                width: '88%',
                maxWidth: 360,
                zIndex: 10001,
                background: '#FFFFFF',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                borderTopLeftRadius: 24,
                borderBottomLeftRadius: 24,
              }}
              className="mobile-only"
            >
              {/* Drawer Top Header */}
              <div style={{
                padding: '12px 18px',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFFFF',
              }}>
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img
                      src={logoImg}
                      alt="VK RENTAL CARS Pune"
                      style={{ height: 38, width: 'auto', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#000000', letterSpacing: '-0.2px', lineHeight: 1.25 }}>
                      VK RENTAL CARS
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 900, color: '#FF4500', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                      PUNE • SELF DRIVE
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Quick Trust Badges Strip inside Mobile Drawer */}
              <div style={{
                padding: '10px 20px',
                background: '#F8FAFC',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                fontWeight: 800,
                color: '#475569',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiShield color="#FF4500" size={13} /> Zero Deposit
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiClock color="#FF4500" size={13} /> 24/7 Delivery
                </span>
              </div>

              {/* Drawer Main Navigation Links */}
              <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#64748B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 2, paddingLeft: 4 }}>
                  Explore Menu
                </span>

                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      padding: '14px 16px',
                      borderRadius: 16,
                      fontSize: 15.5,
                      fontWeight: isActive ? 900 : 700,
                      color: isActive ? '#FF4500' : '#000000',
                      background: isActive ? 'linear-gradient(135deg, rgba(255, 69, 0, 0.12) 0%, rgba(255, 69, 0, 0.05) 100%)' : '#FFFFFF',
                      border: isActive ? '1.5px solid rgba(255, 69, 0, 0.35)' : '1.5px solid #F1F5F9',
                      boxShadow: isActive ? '0 6px 18px rgba(255, 69, 0, 0.12)' : '0 2px 6px rgba(0,0,0,0.02)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: isActive ? '#FF4500' : '#F8FAFC',
                            color: isActive ? '#FFFFFF' : '#FF4500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isActive ? 'none' : '1px solid #E2E8F0',
                          }}>
                            {link.icon}
                          </div>
                          <span>{link.label}</span>
                        </div>
                        {isActive ? (
                          <FiCheckCircle size={18} color="#FF4500" />
                        ) : (
                          <FiChevronRight size={18} style={{ color: '#94A3B8' }} />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom CTAs (Direct Call + WhatsApp + Book Now) */}
              <div style={{
                padding: '18px 16px 24px',
                borderTop: '1px solid #F1F5F9',
                background: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <a
                    href={`tel:${(settings?.phone || '+91 8381052230').replace(/\s+/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '12px',
                      borderRadius: 14,
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      color: '#000000',
                      fontWeight: 800,
                      fontSize: 13,
                      textDecoration: 'none',
                    }}
                  >
                    <FiPhone size={15} color="#FF4500" /> Call Direct
                  </a>

                  <a
                    href={`https://wa.me/${(settings?.whatsapp || settings?.phone || '918381052230').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(settings?.businessName || "VK SELF DRIVE CAR'S PUNE")},%20I%20want%20to%20book%20a%20car.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '12px',
                      borderRadius: 14,
                      background: '#25D366',
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: 13,
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                    }}
                  >
                    <BsWhatsapp size={15} /> WhatsApp
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: 14.5,
                    fontWeight: 900,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                    boxShadow: '0 6px 20px rgba(255, 69, 0, 0.35)',
                  }}
                >
                  <FiCalendar size={17} /> Explore & Book Fleet
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
        }
      `}</style>
    </>
  );
}
