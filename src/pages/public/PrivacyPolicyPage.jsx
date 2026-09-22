import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/common/SEO';
import { useTenant } from '../../contexts/TenantContext';

export default function PrivacyPolicyPage() {
  const { settings } = useTenant();
  const bizName = settings?.businessName || "VK SELF DRIVE CAR'S PUNE";
  const email = settings?.email || 'vishalkarke184@gmail.com';
  const phone = settings?.phone || '+91 8381052230';
  const address = settings?.address || 'Pune, Maharashtra';
  const year = new Date().getFullYear();

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'When you make a booking inquiry or contact us, we collect:',
        '• Full Name and contact details (phone number, email address)',
        '• Vehicle preference and rental dates',
        '• Government-issued ID details (Aadhar / Driving License) — collected only at the time of car handover, for verification',
        '• WhatsApp or call logs related to your booking',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'We use the information collected solely to:',
        '• Process and confirm your car rental booking',
        '• Contact you regarding your inquiry or booking status',
        '• Send you important reminders or updates about your rental',
        '• Comply with legal obligations under applicable Indian laws',
        'We do NOT sell, rent, or share your personal data with third parties for marketing purposes.',
      ],
    },
    {
      title: '3. Data Storage & Security',
      content: [
        'Your data is stored securely using Google Firebase (a Google Cloud service), protected by industry-standard encryption.',
        'We retain your booking data for up to 12 months from your last interaction for customer support and legal compliance purposes.',
        'Access to personal data is strictly limited to authorized staff members of ' + bizName + '.',
      ],
    },
    {
      title: '4. Cookies',
      content: [
        'Our website may use basic browser cookies to improve your experience (e.g., remembering your filter preferences on the Fleet page).',
        'We do not use tracking or advertising cookies.',
        'You can disable cookies in your browser settings at any time without affecting core website functionality.',
      ],
    },
    {
      title: '5. Third-Party Links',
      content: [
        'Our website may contain links to external platforms such as WhatsApp, Google Maps, or social media pages.',
        'We are not responsible for the privacy practices of these external websites.',
        'Please review their individual privacy policies before sharing any information.',
      ],
    },
    {
      title: '6. Your Rights',
      content: [
        'You have the right to:',
        '• Request access to the personal data we hold about you',
        '• Request correction of any inaccurate information',
        '• Request deletion of your data (subject to legal retention requirements)',
        'To exercise any of these rights, please contact us using the details below.',
      ],
    },
    {
      title: '7. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws.',
        'Any changes will be posted on this page with an updated effective date.',
        'We encourage you to review this page periodically.',
      ],
    },
    {
      title: '8. Contact Us',
      content: [
        'If you have any questions or concerns about this Privacy Policy, please reach out to us:',
        `📍 ${address}`,
        `📞 ${phone}`,
        `📧 ${email}`,
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <SEO
        title={`Privacy Policy | ${bizName}`}
        description={`Read the Privacy Policy of ${bizName}. We are committed to protecting your personal data and ensuring transparency about how we collect and use your information.`}
        canonicalPath="/privacy-policy"
      />
      <Navbar />

      <main style={{ paddingTop: 68, paddingBottom: 40, flex: 1 }}>

        {/* Hero */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '20px 0 16px', marginBottom: 28 }}>
          <div className="pp-container">
            <span className="section-label-red" style={{ marginBottom: 6, display: 'inline-block', fontSize: 11 }}>
              Legal Document
            </span>
            <h1 style={{
              fontSize: 'clamp(20px, 4vw, 30px)',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 6px',
              lineHeight: 1.25,
            }}>
              Privacy{' '}
              <span style={{
                background: 'linear-gradient(90deg, #9E0000 0%, #D91400 60%, #B80000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Policy</span>
            </h1>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, fontWeight: 500 }}>
              Effective Date: 1 January {year} &nbsp;|&nbsp; {bizName}
            </p>
          </div>
        </div>

        <div className="pp-container">

          {/* Intro */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            padding: '20px 24px',
            marginBottom: 20,
            boxShadow: '0 2px 10px rgba(15,23,42,0.04)',
          }}>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, margin: 0 }}>
              <strong>{bizName}</strong> ("we", "us", or "our") is committed to protecting your privacy.
              This Privacy Policy explains what information we collect when you use our website{' '}
              <strong>www.vkrentalcar.com</strong>, how we use it, and your rights regarding your personal data.
              By using our website, you agree to the terms described below.
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sections.map((sec, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
                }}
              >
                {/* Section Header */}
                <div style={{
                  background: 'linear-gradient(90deg, rgba(158,0,0,0.06) 0%, rgba(248,250,252,0) 100%)',
                  padding: '12px 20px',
                  borderBottom: '1px solid #F1F5F9',
                }}>
                  <h2 style={{
                    fontSize: 15,
                    fontWeight: 900,
                    color: '#B80000',
                    margin: 0,
                  }}>
                    {sec.title}
                  </h2>
                </div>
                {/* Section Body */}
                <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {sec.content.map((line, j) => (
                    <p key={j} style={{
                      fontSize: 13.5,
                      color: line.startsWith('•') || line.startsWith('📍') || line.startsWith('📞') || line.startsWith('📧')
                        ? '#334155'
                        : '#475569',
                      margin: 0,
                      lineHeight: 1.65,
                      fontWeight: line.startsWith('•') || line.startsWith('📍') || line.startsWith('📞') || line.startsWith('📧') ? 600 : 400,
                      paddingLeft: line.startsWith('•') ? 8 : 0,
                    }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{
            marginTop: 24,
            padding: '14px 20px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(158,0,0,0.06) 0%, rgba(217,20,0,0.04) 100%)',
            border: '1px solid rgba(184,0,0,0.14)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>
              © {year} <strong style={{ color: '#0F172A' }}>{bizName}</strong>. All rights reserved. &nbsp;|&nbsp;
              This policy is governed by the laws of India.
            </p>
          </div>

        </div>
      </main>

      <Footer />

      <style>{`
        .pp-container {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          .pp-container { padding: 0 12px; }
        }
      `}</style>
    </div>
  );
}
