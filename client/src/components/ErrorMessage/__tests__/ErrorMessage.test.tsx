import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage } from '../ErrorMessage'

describe('ErrorMessage', () => {
  const mockOnRetry = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render error message', () => {
    render(<ErrorMessage message="Test error message" onRetry={mockOnRetry} />)
    
    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('should call onRetry when Try Again button is clicked', async () => {
    const user = userEvent.setup()
    render(<ErrorMessage message="Test error" onRetry={mockOnRetry} />)
    
    const retryButton = screen.getByRole('button', { name: 'Try Again' })
    await user.click(retryButton)
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1)
  })

  it('should display different error messages', () => {
    const { rerender } = render(
      <ErrorMessage message="First error" onRetry={mockOnRetry} />
    )
    expect(screen.getByText('First error')).toBeInTheDocument()
    
    rerender(<ErrorMessage message="Second error" onRetry={mockOnRetry} />)
    expect(screen.getByText('Second error')).toBeInTheDocument()
  })
})

