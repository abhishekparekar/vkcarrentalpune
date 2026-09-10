// Email Notification Utility for Car Rental Inquiries & Bookings
// Target Admin Email: vishalkarke184@gmail.com

export const ADMIN_NOTIFICATION_EMAIL = 'vishalkarke184@gmail.com';

/**
 * Formats a date string into readable local text.
 */
function formatDate(isoOrDateStr) {
  if (!isoOrDateStr) return 'Flexible / Not Specified';
  try {
    const d = new Date(isoOrDateStr);
    return isNaN(d.getTime()) ? isoOrDateStr : d.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return isoOrDateStr;
  }
}

/**
 * Sends an email notification to vishalkarke184@gmail.com when a new inquiry or booking is placed.
 * Uses FormSubmit REST API (table formatted HTML email) with fallback support.
 */
export async function sendInquiryEmailNotification(inquiry) {
  const customerName = inquiry.customerName || inquiry.name || 'Valued Customer';
  const carName = inquiry.carName || 'General Inquiry / Fleet';
  const phone = inquiry.phone || inquiry.contactNumber || 'N/A';
  const email = inquiry.email || 'N/A';
  const city = inquiry.city || 'Pune';
  const pickupDate = formatDate(inquiry.pickupDate);
  const returnDate = formatDate(inquiry.returnDate);
  const pickupType = inquiry.pickupType || 'Doorstep Delivery';
  const estTotal = inquiry.estimatedPrice ? `₹${inquiry.estimatedPrice}` : 'To be confirmed';
  const days = inquiry.daysCount || 1;
  const message = inquiry.message || 'No additional notes';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const dateStr = pickupDate && returnDate && pickupDate !== returnDate 
    ? `${pickupDate} to ${returnDate} (${days} Days)` 
    : (pickupDate || timestamp);

  const subject = `🚗 [Car Rental Lead] ${customerName} | ${carName} | ${phone} | ${estTotal}`;

  const payload = {
    _subject: subject,
    _template: 'table',
    _captcha: 'false',
    'Customer Name': customerName,
    'Contact Number': phone,
    'Date': dateStr,
    'Price': estTotal,
    'Fleet Vehicle': carName,
    'Pickup City': city,
    'Delivery Preference': pickupType,
    'Customer Email': email,
    'Message / Requirements': message,
    'Submission Time': timestamp,
    'Inquiry ID': inquiry.id ? `#${inquiry.id.slice(0, 8)}` : 'Live Web Booking',
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('[EmailNotifier] Notification dispatch response:', data);
    return { success: true, data };
  } catch (err) {
    console.warn('[EmailNotifier] Background email dispatch notice:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Creates a mailto link with pre-filled subject and body for vishalkarke184@gmail.com
 */
export function getInquiryMailtoUrl(inquiry) {
  const customerName = inquiry.customerName || 'Customer';
  const carName = inquiry.carName || 'Vehicle';
  const phone = inquiry.phone || 'N/A';
  const email = inquiry.email || 'N/A';
  const city = inquiry.city || 'Pune';
  const pickupDate = formatDate(inquiry.pickupDate);
  const returnDate = formatDate(inquiry.returnDate);
  const estTotal = inquiry.estimatedPrice ? `₹${inquiry.estimatedPrice}` : 'To be quoted';
  const message = inquiry.message || 'None';

  const subject = `[Inquiry Alert] ${customerName} - ${carName} (${city})`;
  const body = 
`VK RENTAL CARS PUNE — INQUIRY & BOOKING DETAILS
==================================================

• Customer Name: ${customerName}
• Phone: ${phone}
• Email: ${email}
• Car: ${carName}
• City: ${city}
• Pickup Date: ${pickupDate}
• Return Date: ${returnDate}
• Delivery Type: ${inquiry.pickupType || 'Doorstep Delivery'}
• Estimated Total: ${estTotal}
• Customer Note: ${message}

Record synced to Admin Panel: http://localhost:5173/admin/inquiries
`;

  return `mailto:${ADMIN_NOTIFICATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
