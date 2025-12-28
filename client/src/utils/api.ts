import { API_URL } from './constants'
import { ERROR_MESSAGES } from './constants'

export const uploadPdfForSigning = async (file: File): Promise<Blob> => {
  const formData = new FormData()
  formData.append('pdf', file)

  const response = await fetch(`${API_URL}/sign`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(
      response.status >= 500
        ? ERROR_MESSAGES.SERVER_ERROR
        : `Server error: ${response.statusText}`
    )
  }

  return await response.blob()
}



