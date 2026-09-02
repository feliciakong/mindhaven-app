export function sanitizePII(text: string): string {
  if (!text) return '';
  
  // Replace email addresses
  let sanitized = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED EMAIL]');
  
  // Replace phone numbers (10+ digits or formatted)
  sanitized = sanitized.replace(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g, '[REDACTED PHONE]');
  
  return sanitized;
}
