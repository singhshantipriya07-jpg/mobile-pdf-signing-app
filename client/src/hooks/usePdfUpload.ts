import { useState, useRef, useCallback } from 'react'
import { AppState } from '../types'
import { validatePdfFile } from '../utils/fileValidation'
import { uploadPdfForSigning } from '../utils/api'
import { ERROR_MESSAGES } from '../utils/constants'

export const usePdfUpload = () => {
  const [state, setState] = useState<AppState>('idle')
  const [signedPdfUrl, setSignedPdfUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file
    const validation = validatePdfFile(file)
    if (!validation.isValid) {
      setErrorMessage(validation.error || ERROR_MESSAGES.UPLOAD_FAILED)
      setState('error')
      return
    }

    setFileName(file.name)
    setErrorMessage('')
    setState('uploading')
    setSignedPdfUrl(null)

    try {
      const blob = await uploadPdfForSigning(file)
      const url = URL.createObjectURL(blob)
      setSignedPdfUrl(url)
      setState('success')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : ERROR_MESSAGES.UPLOAD_FAILED
      )
      setState('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setState('idle')
    setSignedPdfUrl(null)
    setErrorMessage('')
    setFileName('')
    if (signedPdfUrl) {
      URL.revokeObjectURL(signedPdfUrl)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [signedPdfUrl])

  const handleDownload = useCallback(() => {
    if (signedPdfUrl) {
      const link = document.createElement('a')
      link.href = signedPdfUrl
      link.download = `signed-${fileName || 'document.pdf'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [signedPdfUrl, fileName])

  return {
    state,
    signedPdfUrl,
    errorMessage,
    fileName,
    fileInputRef,
    handleFileSelect,
    handleReset,
    handleDownload,
  }
}


