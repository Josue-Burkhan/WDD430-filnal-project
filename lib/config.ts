// Use empty string for relative API calls in Next.js (handled by same origin)
// Or use absolute URL if on different domain (e.g. Vercel backend separate from frontend, but we are unifying them)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
