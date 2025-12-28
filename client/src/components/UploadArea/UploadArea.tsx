import { useRef, DragEvent, ChangeEvent } from 'react'
import './UploadArea.css'

interface UploadAreaProps {
  onFileSelect: (file: File) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export const UploadArea = ({ onFileSelect, fileInputRef }: UploadAreaProps) => {
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      className="upload-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="upload-content">
        <svg
          className="upload-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <h2>Drop your PDF here</h2>
        <p>or</p>
        <label htmlFor="file-input" className="file-input-label">
          Choose File
        </label>
        <input
          id="file-input"
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="file-input"
        />
        <p className="file-hint">PDF files only, max 10MB</p>
      </div>
    </div>
  )
}



