export type AppState = 'idle' | 'uploading' | 'success' | 'error'

export interface PdfUploadState {
  state: AppState
  signedPdfUrl: string | null
  errorMessage: string
  fileName: string
}

export interface FileValidationResult {
  isValid: boolean
  error?: string
}



