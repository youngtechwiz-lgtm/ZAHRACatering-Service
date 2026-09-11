/**
 * Normalizes a Nigerian or international phone number into standard WhatsApp wa.me format
 * Example: '09079622010' -> '2349079622010'
 */
export function normalizeWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.slice(1);
  }
  if (digits.startsWith('234')) {
    return digits;
  }
  return digits || '2349079622010';
}

/**
 * Generates a direct WhatsApp click-to-chat URL with an optional pre-filled message.
 */
export function createWhatsAppUrl(
  phone: string = '09079622010',
  message?: string
): string {
  const normalizedNumber = normalizeWhatsAppNumber(phone);
  const baseUrl = `https://wa.me/${normalizedNumber}`;

  if (!message || message.trim() === '') {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message.trim())}`;
}

/**
 * Standard WhatsApp URLs for specific customer actions
 */
export function getGeneralInquiryWhatsAppUrl(phone: string = '09079622010'): string {
  const message = `Hello ZAHRA Catering Service! 👋\nI would like to inquire about your catering services for an upcoming event.`;
  return createWhatsAppUrl(phone, message);
}

export function getBookingInquiryWhatsAppUrl(
  bookingData: {
    name: string;
    eventType: string;
    date?: string;
    guests?: number | string;
    location?: string;
  },
  phone: string = '09079622010'
): string {
  const lines = [
    `Hello ZAHRA Catering! 👋`,
    `I would like to follow up on a catering booking inquiry.`,
    `• Name: ${bookingData.name}`,
    `• Event: ${bookingData.eventType}`,
    bookingData.date ? `• Date: ${bookingData.date}` : '',
    bookingData.guests ? `• Guest Count: ${bookingData.guests}` : '',
    bookingData.location ? `• Location: ${bookingData.location}` : '',
  ].filter(Boolean);

  return createWhatsAppUrl(phone, lines.join('\n'));
}

export function getDishInquiryWhatsAppUrl(
  dishName: string,
  phone: string = '09079622010'
): string {
  const message = `Hello ZAHRA Catering Service! 🍽️\nI am interested in ordering/inquiring about your dish: "${dishName}".`;
  return createWhatsAppUrl(phone, message);
}
