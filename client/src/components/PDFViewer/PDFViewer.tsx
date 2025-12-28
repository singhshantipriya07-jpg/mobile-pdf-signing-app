import './PDFViewer.css'

interface PDFViewerProps {
  pdfUrl: string
}

export const PDFViewer = ({ pdfUrl }: PDFViewerProps) => {
  // Add URL parameters to disable toolbar and drawing tools
  const viewerUrl = `${pdfUrl}#toolbar=0&navpanes=0`
  
  return (
    <div className="pdf-viewer-container">
      <iframe
        src={viewerUrl}
        className="pdf-viewer"
        title="Signed PDF Viewer"
      />
    </div>
  )
}

