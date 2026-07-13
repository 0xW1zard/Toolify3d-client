const PHONE_PATTERN = /^\+?[0-9\s-]{7,20}$/;

export function isValidPhone(phone) {
  return PHONE_PATTERN.test(String(phone || '').trim());
}

export function hasPhoneNumber(session, profile) {
  const phone = profile?.phone || session?.user?.phone || '';
  return isValidPhone(phone);
}
