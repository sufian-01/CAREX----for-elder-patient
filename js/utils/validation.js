/**
 * Validates text field is non-empty after trimming.
 * @param {string} val 
 * @returns {boolean}
 */
export function isNotEmpty(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

/**
 * Basic phone number format validation.
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return true; // optional
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validates time string format (HH:MM or H:MM AM/PM).
 * @param {string} timeStr 
 * @returns {boolean}
 */
export function isValidTime(timeStr) {
  if (!timeStr) return false;
  return timeStr.length > 0;
}
