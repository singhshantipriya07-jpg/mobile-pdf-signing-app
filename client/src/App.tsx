import { usePdfUpload } from './hooks/usePdfUpload'
import {
  Header,
  UploadArea,
  LoadingSpinner,
  ErrorMessage,
  SuccessView,
} from './components'
import './App.css'

function App() {
  const {
    state,
    signedPdfUrl,
    errorMessage,
    fileInputRef,
    handleFileSelect,
    handleReset,
    handleDownload,
  } = usePdfUpload()

  return (
    <div className="app">
      <div className="container">
        <Header
          title="PDF Upload & Sign"
          subtitle="Upload a PDF to get it signed"
        />

        {state === 'idle' && (
          <UploadArea
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
          />
        )}

        {state === 'uploading' && <LoadingSpinner />}

        {state === 'error' && (
          <ErrorMessage message={errorMessage} onRetry={handleReset} />
        )}

        {state === 'success' && signedPdfUrl && (
          <SuccessView
            pdfUrl={signedPdfUrl}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}

export default App
