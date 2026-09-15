import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiPhone, FiCalendar,
  FiHome, FiTruck, FiInfo, FiPhoneCall, FiFileText
} from 'react-icons/fi';

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

  const phoneNumber = settings?.phone || '+91 83810 52230';
  const cleanPhone = phoneNumber.replace(/\s+/g, '');

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
      {/* ── Full Width Edge-to-Edge Luxury Navbar ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 72,
          zIndex: 9999,
          background: '#0B0F17',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled
            ? '0 10px 30px rgba(0, 0, 0, 0.60)'
            : '0 4px 20px rgba(0, 0, 0, 0.35)',
          transform: hidden && !menuOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease',
        }}
      >
        <div
          className="navbar-inner-container"
          style={{
            maxWidth: 1280,
            height: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* ── 1. Logo (Left) ── */}
          <Link
            to="/"
            onClick={handleLogoClick}
            aria-label="VK Rental Cars Pune"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src={logoImg}
              alt="VK RENTAL CARS PUNE"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="navbar-brand-logo"
              style={{
                height: 54,
                maxHeight: 54,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </Link>

          {/* ── 2. Desktop Navigation Links (Center) ── */}
          <nav className="desktop-nav-menu" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="desktop-nav-link"
                style={({ isActive }) => ({
                  position: 'relative',
                  padding: '8px 18px',
                  fontSize: 14.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FF4500' : '#E2E8F0',
                  background: 'transparent',
                  border: 'none',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  letterSpacing: '0.2px',
                  transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                })}
              >
                {({ isActive }) => (
                  <span style={{ position: 'relative', display: 'inline-block', paddingBottom: 4 }}>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="navActiveBorder"
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          left: '8%',
                          right: '8%',
                          height: 2.5,
                          borderRadius: 9999,
                          background: '#FF4500',
                          boxShadow: '0 0 10px rgba(255, 69, 0, 0.8)',
                        }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── 3. Desktop Action CTAs (Right) ── */}
          <div className="desktop-action-ctas" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Direct Call Button */}
            <a
              href={`tel:${cleanPhone}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                borderRadius: 9999,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '0.2px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 69, 0, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(255, 69, 0, 0.45)';
                e.currentTarget.style.color = '#FF4500';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              <FiPhone size={14} color="#FF4500" />
              <span>{phoneNumber}</span>
            </a>

            {/* Book Now Button */}
            <button
              onClick={() => navigate('/fleet')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '10px 24px',
                borderRadius: 9999,
                background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 800,
                letterSpacing: '0.3px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(255, 69, 0, 0.38)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1.5px)';
                e.currentTarget.style.boxShadow = '0 6px 22px rgba(255, 69, 0, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(255, 69, 0, 0.38)';
              }}
            >
              <FiCalendar size={14} />
              <span>Book Now</span>
            </button>
          </div>

          {/* ── 4. Mobile Top Elements (< 980px) ── */}
          {/* Mobile Call Button */}
          <a
            href={`tel:${cleanPhone}`}
            className="mobile-header-call"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 69, 0, 0.45)',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            <FiPhone size={12} color="#FF4500" />
            <span>{phoneNumber}</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => { setMenuOpen(p => !p); if (hidden) setHidden(false); }}
            aria-label="Toggle Menu"
            style={{
              display: 'none',
              width: 42,
              height: 42,
              borderRadius: 10,
              background: menuOpen ? 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)' : 'rgba(255, 255, 255, 0.08)',
              border: menuOpen ? '1px solid #FF4500' : '1px solid rgba(255, 255, 255, 0.16)',
              color: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      {/* ── 📱 Minimal Clean Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay */}
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
                background: 'rgba(5, 8, 15, 0.70)',
              }}
              className="mobile-only-display"
            />

            {/* Sidebar Drawer Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '78%',
                maxWidth: 290,
                zIndex: 10001,
                background: '#0B0F17',
                boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              }}
              className="mobile-only-display"
            >
              {/* Drawer Clean Header */}
              <div style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <img
                  src={logoImg}
                  alt="VK RENTAL CARS"
                  style={{
                    height: 42,
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Clean Navigation Links List */}
              <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      padding: '12px 16px',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FF4500' : '#E2E8F0',
                      background: isActive ? 'rgba(255, 69, 0, 0.08)' : 'transparent',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.15s ease',
                    })}
                  >
                    <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom Actions */}
              <div style={{
                padding: '16px 16px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <a
                  href={`tel:${cleanPhone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    padding: '11px',
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: 'none',
                  }}
                >
                  <FiPhone size={13} color="#FF4500" />
                  <span>{phoneNumber}</span>
                </a>

                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: 13.5,
                    fontWeight: 800,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #FF4500 0%, #E63900 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: '0 4px 16px rgba(255, 69, 0, 0.35)',
                  }}
                >
                  <FiCalendar size={14} /> Book Now
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Responsive CSS Rules ── */}
      <style>{`
        .desktop-nav-link:hover {
          color: #FF4500 !important;
        }
        @media (max-width: 980px) {
          .navbar-inner-container {
            padding: 0 16px !important;
          }
          .navbar-brand-logo {
            height: 44px !important;
            max-height: 44px !important;
          }
          .desktop-nav-menu,
          .desktop-action-ctas {
            display: none !important;
          }
          .mobile-header-call,
          .mobile-menu-toggle {
            display: inline-flex !important;
          }
        }
        @media (min-width: 981px) {
          .mobile-only-display {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .mobile-header-call {
            font-size: 11.5px !important;
            padding: 5px 10px !important;
          }
          .navbar-brand-logo {
            height: 40px !important;
            max-height: 40px !important;
          }
        }
      `}</style>
    </>
  );
}
