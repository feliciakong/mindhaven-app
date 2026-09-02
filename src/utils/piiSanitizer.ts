/**
 * Zero-Trust PII Sanitizer
 * Intercepts audio transcripts and text before network dispatch.
 */
export function sanitizeText(input: string): string {
  let clean = input;

  // Mask Email Addresses
  clean = clean.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]');

  // Mask Phone Numbers (International & Local formats)
  clean = clean.replace(/(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/g, '[REDACTED_PHONE]');

  // Mask Government ID / SSN / IC patterns
  clean = clean.replace(/\b\d{6}-\d{2}-\d{4}\b|\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_ID]');

  return clean;
}
