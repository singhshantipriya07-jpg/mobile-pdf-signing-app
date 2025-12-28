import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Uploading and signing your PDF...')).toBeInTheDocument()
    expect(screen.getByText('Please wait')).toBeInTheDocument()
  })

  it('should have spinner element', () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector('.spinner')
    
    expect(spinner).toBeInTheDocument()
  })

  it('should have loading container class', () => {
    const { container } = render(<LoadingSpinner />)
    const loadingContainer = container.querySelector('.loading-container')
    
    expect(loadingContainer).toBeInTheDocument()
  })
})

