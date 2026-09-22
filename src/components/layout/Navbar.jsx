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
      {/* ── Full Width Luxury Premium Red Linear Gradient Navbar with Grid Overlap ── */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: 72,
          zIndex: 9999,
          backgroundColor: '#7A0000',
          backgroundImage: `
            linear-gradient(90deg, #7A0000 0%, #B80000 25%, #E61800 50%, #B80000 75%, #7A0000 100%),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0px, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 30px),
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0px, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 30px)
          `,
          borderBottom: '2px solid #570000',
          boxShadow: scrolled
            ? '0 10px 32px rgba(122, 0, 0, 0.65)'
            : '0 6px 24px rgba(184, 0, 0, 0.42)',
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
            padding: '0 20px',
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
                height: 52,
                maxHeight: 52,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.45))',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
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
                  fontWeight: isActive ? 900 : 700,
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.92)',
                  background: 'transparent',
                  border: 'none',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  letterSpacing: '0.2px',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.45)',
                  transition: 'color 0.2s ease',
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
                          height: 3,
                          borderRadius: 9999,
                          background: '#FFD700',
                          boxShadow: '0 0 12px rgba(255, 215, 0, 0.95)',
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
            {/* Book Fleet Primary Button */}
            <button
              onClick={() => navigate('/fleet')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 9999,
                background: '#FFFFFF',
                color: '#8A0000',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '0.3px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 26px rgba(0, 0, 0, 0.5)';
                e.currentTarget.style.background = '#FFF5F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.35)';
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <FiCalendar size={15} color="#8A0000" />
              <span>Book Fleet</span>
            </button>
          </div>

          {/* ── 4. Mobile Top Elements (< 980px) ── */}
          <div className="mobile-header-actions-group">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => { setMenuOpen(p => !p); if (hidden) setHidden(false); }}
              aria-label="Toggle Menu"
              style={{
                display: 'inline-flex',
                width: 42,
                height: 42,
                borderRadius: 10,
                background: menuOpen ? '#FFFFFF' : 'rgba(0, 0, 0, 0.28)',
                border: menuOpen ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.35)',
                color: menuOpen ? '#8A0000' : '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {menuOpen ? <FiX size={22} color="#8A0000" /> : <FiMenu size={22} color="#FFFFFF" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── 📱 Best-in-Class Simple & Premium Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Overlay with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: 'rgba(5, 8, 15, 0.75)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
              className="mobile-only-display"
            />

            {/* Sidebar Drawer Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '82%',
                maxWidth: 310,
                zIndex: 10001,
                backgroundColor: '#7A0000',
                backgroundImage: `
                  linear-gradient(90deg, #7A0000 0%, #B80000 25%, #E61800 50%, #B80000 75%, #7A0000 100%),
                  repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0px, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 30px),
                  repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.025) 0px, rgba(255, 255, 255, 0.025) 1px, transparent 1px, transparent 30px)
                `,
                boxShadow: '-8px 0 36px rgba(0, 0, 0, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '2px solid rgba(255, 255, 255, 0.25)',
              }}
              className="mobile-only-display"
            >
              {/* Drawer Header */}
              <div style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(0, 0, 0, 0.18)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={logoImg}
                    alt="VK RENTAL CARS"
                    style={{
                      height: 44,
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.55))',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.30)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <div style={{ flex: 1, padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 7, overflowY: 'auto' }}>
                <span style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.70)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: 8, marginBottom: 4 }}>
                  Main Navigation
                </span>

                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    style={({ isActive }) => ({
                      padding: '12px 14px',
                      borderRadius: 12,
                      fontSize: 14.5,
                      fontWeight: isActive ? 900 : 700,
                      color: '#FFFFFF',
                      background: isActive ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.20)',
                      border: isActive ? '1.5px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: isActive ? '0 4px 14px rgba(0, 0, 0, 0.30)' : 'none',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.18s ease',
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <span style={{ color: isActive ? '#FFD700' : '#FFFFFF', display: 'flex', alignItems: 'center' }}>
                          {link.icon}
                        </span>
                        <span style={{ flex: 1 }}>{link.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Drawer Bottom Quick Action Buttons */}
              <div style={{
                padding: '16px 16px 22px',
                borderTop: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); navigate('/fleet'); }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: 14,
                    fontWeight: 900,
                    borderRadius: 9999,
                    background: '#FFFFFF',
                    color: '#8A0000',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 18px rgba(0, 0, 0, 0.40)',
                  }}
                >
                  <FiCalendar size={15} color="#8A0000" />
                  <span>Book Self-Drive Car</span>
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '11px',
                    borderRadius: 9999,
                    background: 'rgba(0, 0, 0, 0.30)',
                    border: '1px solid rgba(255, 255, 255, 0.28)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 13,
                    textDecoration: 'none',
                  }}
                >
                  <FiPhone size={14} color="#FFD700" />
                  <span>Call: {phoneNumber}</span>
                </a>

                <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255, 255, 255, 0.70)', fontWeight: 600, marginTop: 2 }}>
                  Pune &amp; PCMC • 24/7 Doorstep Delivery
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Responsive CSS Rules ── */}
      <style>{`
        .desktop-nav-link:hover {
          color: #FFD700 !important;
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
          .mobile-header-actions-group {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
          }
          .mobile-header-call,
          .mobile-menu-toggle {
            display: inline-flex !important;
          }
        }
        @media (min-width: 981px) {
          .mobile-header-actions-group,
          .mobile-only-display {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-brand-logo {
            height: 40px !important;
            max-height: 40px !important;
          }
        }
      `}</style>
    </>
  );
}
