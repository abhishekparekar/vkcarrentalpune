import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'VK RENTAL CARS PUNE | Best Self Drive Cars & Car Rental in Pune';
const DEFAULT_DESC = 'VK RENTAL CARS PUNE offers premium self drive cars and car rental in Pune & PCMC. Rent Swift, Thar 4x4, Ertiga 7-Seater, Baleno with 300 km daily limit, doorstep delivery & 24/7 support.';
const DEFAULT_KEYWORDS = 'VK Rental Cars, VK Rental Cars Pune, self drive cars Pune, car rental in Pune, rent a car Pune, self drive car rental Pune, car hire Pune, Thar 4x4 rental Pune, Ertiga 7 seater rental Pune, Swift rental Pune, PCMC self drive car';
const SITE_URL = 'https://vkcarrentalpune.com';
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
