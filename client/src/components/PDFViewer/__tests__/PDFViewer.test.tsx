import { render, screen } from '@testing-library/react'
import { PDFViewer } from '../PDFViewer'

describe('PDFViewer', () => {
  it('should render iframe with PDF URL', () => {
    const pdfUrl = 'https://example.com/test.pdf'
    render(<PDFViewer pdfUrl={pdfUrl} />)
    
    const iframe = screen.getByTitle('Signed PDF Viewer')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', expect.stringContaining(pdfUrl))
  })

  it('should add URL parameters to disable toolbar and drawing tools', () => {
    const pdfUrl = 'https://example.com/test.pdf'
    render(<PDFViewer pdfUrl={pdfUrl} />)
    
    const iframe = screen.getByTitle('Signed PDF Viewer')
    expect(iframe).toHaveAttribute('src', expect.stringContaining('toolbar=0'))
    expect(iframe).toHaveAttribute('src', expect.stringContaining('navpanes=0'))
  })

  it('should have correct iframe attributes', () => {
    const pdfUrl = 'https://example.com/test.pdf'
    render(<PDFViewer pdfUrl={pdfUrl} />)
    
    const iframe = screen.getByTitle('Signed PDF Viewer')
    expect(iframe).toHaveClass('pdf-viewer')
  })
})

