import { PDFViewer } from '../PDFViewer/PDFViewer'
import { Button } from '../Button/Button'
import './SuccessView.css'

interface SuccessViewProps {
  pdfUrl: string
  onDownload: () => void
  onReset: () => void
}

export const SuccessView = ({
  pdfUrl,
  onDownload,
  onReset,
}: SuccessViewProps) => {
  return (
    <div className="success-container">
      <div className="success-header">
        <svg
          className="success-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2>PDF Signed Successfully!</h2>
      </div>

      <PDFViewer pdfUrl={pdfUrl} />

      <div className="action-buttons">
        <Button onClick={onDownload} variant="primary">
          Download Signed PDF
        </Button>
        <Button onClick={onReset} variant="secondary">
          Upload Another PDF
        </Button>
      </div>
    </div>
  )
}




