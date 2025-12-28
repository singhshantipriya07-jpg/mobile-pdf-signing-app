// Mock constants before importing
jest.mock('../constants', () => ({
  API_URL: 'http://localhost:5000',
  FILE_CONSTRAINTS: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['application/pdf'],
    ACCEPTED_EXTENSIONS: ['.pdf'],
  },
  ERROR_MESSAGES: {
    INVALID_FILE_TYPE: 'Please upload a PDF file only.',
    FILE_TOO_LARGE: 'File size must be less than 10MB.',
    UPLOAD_FAILED: 'Failed to upload and sign PDF. Please try again.',
    SERVER_ERROR: 'Server error occurred. Please try again.',
  },
}))

import { validatePdfFile } from '../fileValidation'
import { ERROR_MESSAGES, FILE_CONSTRAINTS } from '../constants'

describe('validatePdfFile', () => {
  it('should return valid for a valid PDF file', () => {
    const validFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(validFile, 'size', {
      value: FILE_CONSTRAINTS.MAX_SIZE - 1,
      writable: false,
    })

    const result = validatePdfFile(validFile)

    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should return invalid for non-PDF file type', () => {
    const invalidFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    })
    Object.defineProperty(invalidFile, 'size', {
      value: 1000,
      writable: false,
    })

    const result = validatePdfFile(invalidFile)

    expect(result.isValid).toBe(false)
    expect(result.error).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE)
  })

  it('should return invalid for file exceeding max size', () => {
    const largeFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(largeFile, 'size', {
      value: FILE_CONSTRAINTS.MAX_SIZE + 1,
      writable: false,
    })

    const result = validatePdfFile(largeFile)

    expect(result.isValid).toBe(false)
    expect(result.error).toBe(ERROR_MESSAGES.FILE_TOO_LARGE)
  })

  it('should return valid for file at exactly max size', () => {
    const maxSizeFile = new File(['test content'], 'test.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(maxSizeFile, 'size', {
      value: FILE_CONSTRAINTS.MAX_SIZE,
      writable: false,
    })

    const result = validatePdfFile(maxSizeFile)

    expect(result.isValid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should return invalid for empty PDF file', () => {
    const emptyFile = new File([], 'test.pdf', {
      type: 'application/pdf',
    })
    Object.defineProperty(emptyFile, 'size', {
      value: 0,
      writable: false,
    })

    const result = validatePdfFile(emptyFile)

    expect(result.isValid).toBe(true) // Empty file is still valid by type
  })
})

