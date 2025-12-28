import './LoadingSpinner.css'

export const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Uploading and signing your PDF...</p>
      <p className="loading-subtitle">Please wait</p>
    </div>
  )
}



