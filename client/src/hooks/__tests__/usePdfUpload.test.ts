// Mock constants before importing
jest.mock('../../utils/constants', () => ({
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

import { renderHook, act, waitFor } from '@testing-library/react'
import { usePdfUpload } from '../usePdfUpload'
import { validatePdfFile } from '../../utils/fileValidation'
import { uploadPdfForSigning } from '../../utils/api'
import { ERROR_MESSAGES } from '../../utils/constants'

// Mock dependencies
jest.mock('../../utils/fileValidation')
jest.mock('../../utils/api')

const mockValidatePdfFile = validatePdfFile as jest.MockedFunction<typeof validatePdfFile>
const mockUploadPdfForSigning = uploadPdfForSigning as jest.MockedFunction<typeof uploadPdfForSigning>

describe('usePdfUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.URL.createObjectURL as jest.Mock).mockReturnValue('mock-url')
    ;(global.URL.revokeObjectURL as jest.Mock).mockClear()
  })

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => usePdfUpload())
    
    expect(result.current.state).toBe('idle')
    expect(result.current.signedPdfUrl).toBeNull()
    expect(result.current.errorMessage).toBe('')
    expect(result.current.fileName).toBe('')
  })

  it('should handle valid file upload successfully', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' })
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    mockValidatePdfFile.mockReturnValue({ isValid: true })
    mockUploadPdfForSigning.mockResolvedValue(mockBlob)

    const { result } = renderHook(() => usePdfUpload())

    await act(async () => {
      await result.current.handleFileSelect(file)
    })

    await waitFor(() => {
      expect(result.current.state).toBe('success')
    })

    expect(result.current.fileName).toBe('test.pdf')
    expect(result.current.signedPdfUrl).toBe('mock-url')
    expect(mockValidatePdfFile).toHaveBeenCalledWith(file)
    expect(mockUploadPdfForSigning).toHaveBeenCalledWith(file)
  })

  it('should handle invalid file type', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    
    mockValidatePdfFile.mockReturnValue({
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    })

    const { result } = renderHook(() => usePdfUpload())

    await act(async () => {
      await result.current.handleFileSelect(file)
    })

    expect(result.current.state).toBe('error')
    expect(result.current.errorMessage).toBe(ERROR_MESSAGES.INVALID_FILE_TYPE)
    expect(mockUploadPdfForSigning).not.toHaveBeenCalled()
  })

  it('should handle upload error', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    const error = new Error('Upload failed')
    
    mockValidatePdfFile.mockReturnValue({ isValid: true })
    mockUploadPdfForSigning.mockRejectedValue(error)

    const { result } = renderHook(() => usePdfUpload())

    await act(async () => {
      await result.current.handleFileSelect(file)
    })

    await waitFor(() => {
      expect(result.current.state).toBe('error')
    })

    expect(result.current.errorMessage).toBe('Upload failed')
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => usePdfUpload())
    
    act(() => {
      result.current.handleReset()
    })

    expect(result.current.state).toBe('idle')
    expect(result.current.signedPdfUrl).toBeNull()
    expect(result.current.errorMessage).toBe('')
    expect(result.current.fileName).toBe('')
  })

  it('should create download link when handleDownload is called', async () => {
    const mockBlob = new Blob(['test'], { type: 'application/pdf' })
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    mockValidatePdfFile.mockReturnValue({ isValid: true })
    mockUploadPdfForSigning.mockResolvedValue(mockBlob)

    const { result } = renderHook(() => usePdfUpload())

    // Upload a file first to get a signed PDF URL
    await act(async () => {
      await result.current.handleFileSelect(file)
    })

    await waitFor(() => {
      expect(result.current.state).toBe('success')
      expect(result.current.signedPdfUrl).toBeTruthy()
    })

    const createElementSpy = jest.spyOn(document, 'createElement')
    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => ({} as Node))
    const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => ({} as Node))
    const clickSpy = jest.fn()

    const mockAnchor = {
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement

    createElementSpy.mockReturnValue(mockAnchor)

    act(() => {
      result.current.handleDownload()
    })

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(mockAnchor.href).toBe('mock-url')
    expect(mockAnchor.download).toBe('signed-test.pdf')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()
  })
})

