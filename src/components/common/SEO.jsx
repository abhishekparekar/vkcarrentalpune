import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'VK RENTAL CARS PUNE | Self Drive Cars & Car Rentals Services Pune | Best Car Booking';
const DEFAULT_DESC = 'VK RENTAL CARS PUNE offers #1 self drive cars, car rentals services & online car booking in Pune & PCMC. Rent Thar 4x4, Swift, Ertiga 7-Seater, Baleno with 300 km daily limit, 0 security deposit & 30-min doorstep delivery. Best rates, 24/7 support! Call +91 8381052230.';
const DEFAULT_KEYWORDS = 'self drive, self drive cars, car rentals services, car booking, car rental in Pune, self drive cars Pune, self drive car rental Pune, car hire in Pune, rent a car Pune, car on rent Pune, self drive Pune, best self drive cars Pune, car booking Pune, car booking in Pune, car rental Pune contact number, Thar rental Pune, Mahindra Thar 4x4 rental Pune, Thar 4x4 on rent in Pune, rent Thar Pune self drive, Ertiga rental Pune, Ertiga 7 seater on rent Pune, 7 seater car rental Pune, Swift car rental Pune, Swift self drive Pune, Baleno rental Pune, Creta self drive Pune, cheap self drive cars Pune, 0 deposit car rental Pune, doorstep car delivery Pune, Pune airport car rental, outstation self drive car Pune, self drive Hinjewadi, car rental Hinjewadi, self drive Wakad, car rental Baner, self drive Kothrud, car rental Viman Nagar, self drive Kharadi, car rental Hadapsar, PCMC self drive car, VK Rental Cars, VK Rental Cars Pune, VK Rental Car, कार रेंटल पुणे, सेल्फ ड्राईव्ह कार पुणे, पुण्यात कार भाड्याने, कार बुकिंग पुणे, www.vkrentalcar.com, vkrentalcar.com';
const SITE_URL = 'https://www.vkrentalcar.com';
const DEFAULT_IMAGE = `${SITE_URL}/vklogo1.png`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '',
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schemaJson = null,
}) {
  const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const fullTitle = title.includes('VK RENTAL CARS') ? title : `${title} | VK RENTAL CARS PUNE`;

  return (
    <Helmet>
      {/* Document Title */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Social */}
      <meta property="og:site_name" content="VK RENTAL CARS PUNE" />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Optional Page-Specific JSON-LD */}
      {schemaJson && (
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      )}
    </Helmet>
  );
}
