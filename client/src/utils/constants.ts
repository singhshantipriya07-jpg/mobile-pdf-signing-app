export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['application/pdf'],
  ACCEPTED_EXTENSIONS: ['.pdf'],
} as const

export const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Please upload a PDF file only.',
  FILE_TOO_LARGE: 'File size must be less than 10MB.',
  UPLOAD_FAILED: 'Failed to upload and sign PDF. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again.',
} as const




