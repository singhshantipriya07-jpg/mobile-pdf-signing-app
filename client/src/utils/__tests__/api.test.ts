// Mock constants before importing
jest.mock('../constants', () => ({
  API_URL: 'http://localhost:5000',
  FILE_CONSTRAINTS: {
    MAX_SIZE: 10 * 1024 * 1024,
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

import { uploadPdfForSigning } from '../api'
import { ERROR_MESSAGES } from '../constants'

// Mock fetch globally
global.fetch = jest.fn()

describe('uploadPdfForSigning', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully upload a PDF file', async () => {
    const mockBlob = new Blob(['test pdf content'], { type: 'application/pdf' })
    const mockResponse = {
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const result = await uploadPdfForSigning(file)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
    expect(fetchCall[0]).toContain('/sign')
    expect(fetchCall[1]).toMatchObject({
      method: 'POST',
    })
    // FormData is mocked in setupTests, so check it has append method instead
    expect(fetchCall[1].body).toBeDefined()
    expect(typeof fetchCall[1].body.append).toBe('function')
    expect(result).toBe(mockBlob)
  })

  it('should throw error for server error (500+)', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

    await expect(uploadPdfForSigning(file)).rejects.toThrow(
      ERROR_MESSAGES.SERVER_ERROR
    )
  })

  it('should throw error for client error (400-499)', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })

    await expect(uploadPdfForSigning(file)).rejects.toThrow(
      'Server error: Bad Request'
    )
  })

  it('should append file to FormData correctly', async () => {
    const mockBlob = new Blob(['test pdf content'], { type: 'application/pdf' })
    const mockResponse = {
      ok: true,
      blob: jest.fn().mockResolvedValue(mockBlob),
    }
    const mockFormData = {
      append: jest.fn(),
    }

    ;(global.FormData as jest.Mock).mockImplementation(() => mockFormData)
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    await uploadPdfForSigning(file)

    expect(mockFormData.append).toHaveBeenCalledWith('pdf', file)
  })
})

