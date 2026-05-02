const ALLOWED_CHARS = /[<>"'&\\]/g;

const HTML_ENTITIES = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '&': '&amp;',
  '\\': '&#x5C;'
};

export const sanitize = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(ALLOWED_CHARS, (char) => HTML_ENTITIES[char] || char);
};

export const sanitizeObject = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitize(value) : value;
  }
  return result;
};

export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateRequired = (value) =>
  value !== null && value !== undefined && String(value).trim().length > 0;

export const validateMaxLength = (value, max) =>
  String(value).length <= max;
