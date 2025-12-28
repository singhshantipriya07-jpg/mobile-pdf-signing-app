import { FileValidationResult } from '../types'
import { FILE_CONSTRAINTS, ERROR_MESSAGES } from './constants'

export const validatePdfFile = (file: File): FileValidationResult => {
  // Validate file type
  if (file.type !== 'application/pdf') {
    return {
      isValid: false,
      error: ERROR_MESSAGES.INVALID_FILE_TYPE,
    }
  }

  // Validate file size
  if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    }
  }

  return { isValid: true }
}


