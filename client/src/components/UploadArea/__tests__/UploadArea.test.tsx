import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadArea } from '../UploadArea'
import { createRef } from 'react'

describe('UploadArea', () => {
  const mockFileSelect = jest.fn()
  const fileInputRef = createRef<HTMLInputElement>()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render upload area with correct text', () => {
    render(<UploadArea onFileSelect={mockFileSelect} fileInputRef={fileInputRef} />)
    
    expect(screen.getByText('Drop your PDF here')).toBeInTheDocument()
    expect(screen.getByText('or')).toBeInTheDocument()
    expect(screen.getByText('Choose File')).toBeInTheDocument()
    expect(screen.getByText('PDF files only, max 10MB')).toBeInTheDocument()
  })

  it('should have file input with correct attributes', () => {
    render(<UploadArea onFileSelect={mockFileSelect} fileInputRef={fileInputRef} />)
    
    const fileInput = screen.getByLabelText('Choose File') as HTMLInputElement
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.pdf,application/pdf')
  })

  it('should call onFileSelect when file is selected via input', async () => {
    const user = userEvent.setup()
    render(<UploadArea onFileSelect={mockFileSelect} fileInputRef={fileInputRef} />)
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByLabelText('Choose File') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    expect(mockFileSelect).toHaveBeenCalledTimes(1)
    expect(mockFileSelect).toHaveBeenCalledWith(file)
  })

  it('should handle drag and drop', () => {
    render(<UploadArea onFileSelect={mockFileSelect} fileInputRef={fileInputRef} />)
    
    const uploadArea = screen.getByText('Drop your PDF here').closest('.upload-area')
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: 'application/pdf',
          getAsFile: () => file,
        },
      ],
      types: ['Files'],
    } as unknown as DataTransfer

    if (uploadArea) {
      // Simulate drop event
      const dropEvent = new Event('drop', { bubbles: true, cancelable: true })
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: dataTransfer,
        writable: false,
      })
      uploadArea.dispatchEvent(dropEvent)
    }
    
    expect(mockFileSelect).toHaveBeenCalledTimes(1)
    expect(mockFileSelect).toHaveBeenCalledWith(file)
  })

  it('should prevent default behavior on drag over', () => {
    render(<UploadArea onFileSelect={mockFileSelect} fileInputRef={fileInputRef} />)
    
    const uploadArea = screen.getByText('Drop your PDF here').closest('.upload-area')
    const dragOverEvent = new Event('dragover', { bubbles: true, cancelable: true })
    const preventDefaultSpy = jest.spyOn(dragOverEvent, 'preventDefault')
    
    if (uploadArea) {
      uploadArea.dispatchEvent(dragOverEvent)
    }
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})

