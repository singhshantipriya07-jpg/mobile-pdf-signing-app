import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SuccessView } from '../SuccessView'

describe('SuccessView', () => {
  const mockPdfUrl = 'blob:http://localhost:5173/test-pdf-url'
  const mockOnDownload = jest.fn()
  const mockOnReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render success message', () => {
    render(
      <SuccessView
        pdfUrl={mockPdfUrl}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    )

    expect(screen.getByText('PDF Signed Successfully!')).toBeInTheDocument()
  })

  it('should render download button', () => {
    render(
      <SuccessView
        pdfUrl={mockPdfUrl}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    )

    expect(screen.getByRole('button', { name: 'Download Signed PDF' })).toBeInTheDocument()
  })

  it('should render upload another button', () => {
    render(
      <SuccessView
        pdfUrl={mockPdfUrl}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    )

    expect(screen.getByRole('button', { name: 'Upload Another PDF' })).toBeInTheDocument()
  })

  it('should call onDownload when download button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <SuccessView
        pdfUrl={mockPdfUrl}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    )

    const downloadButton = screen.getByRole('button', { name: 'Download Signed PDF' })
    await user.click(downloadButton)

    expect(mockOnDownload).toHaveBeenCalledTimes(1)
  })

  it('should call onReset when upload another button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <SuccessView
        pdfUrl={mockPdfUrl}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    )

    const resetButton = screen.getByRole('button', { name: 'Upload Another PDF' })
    await user.click(resetButton)

    expect(mockOnReset).toHaveBeenCalledTimes(1)
  })

  it('should render PDF viewer with correct URL', () => {
    const { container } = render(
      <SuccessView
        pdfUrl={mockPdfUrl}
        onDownload={mockOnDownload}
        onReset={mockOnReset}
      />
    )

    const iframe = container.querySelector('iframe')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', expect.stringContaining('toolbar=0'))
  })
})

