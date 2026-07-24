/**
 * Security and Sanitization Utilities
 */

// Simple client-side rate limiting helper
const rateLimitStore: Record<string, { count: number; resetTime: number }> = {};

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; remainingMs: number } {
  const now = Date.now();
  const record = rateLimitStore[key];

  if (!record || now > record.resetTime) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { allowed: true, remainingMs: 0 };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remainingMs: record.resetTime - now,
    };
  }

  record.count += 1;
  return { allowed: true, remainingMs: 0 };
}

// Input sanitization to prevent XSS and HTML injection
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Strip HTML tags for clean display text
export function stripHtmlTags(input: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>?/gm, '').trim();
}

// File security validator for image uploads
export function validateImageFile(
  file: File,
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'لم يتم تحديد أي ملف' };
  }

  // Check file size
  if (file.size > maxSizeBytes) {
    const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `حجم الصورة أكبر من الحد المسموح به (${sizeMb} ميجابايت).` };
  }

  // Check MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ];

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG, PNG, WEBP, GIF أو SVG فقط.',
    };
  }

  // Check extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !allowedExtensions.includes(ext)) {
    return { valid: false, error: 'امتداد الملف غير مسموح به لأسباب أمنية.' };
  }

  return { valid: true };
}
