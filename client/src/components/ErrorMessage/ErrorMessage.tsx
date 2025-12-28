import { Button } from '../Button/Button'
import './ErrorMessage.css'

interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="error-container">
      <svg
        className="error-icon"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2>Error</h2>
      <p>{message}</p>
      <Button onClick={onRetry} variant="primary">
        Try Again
      </Button>
    </div>
  )
}



