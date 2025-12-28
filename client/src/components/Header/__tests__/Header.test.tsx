import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('Header', () => {
  it('should render title and subtitle', () => {
    render(<Header title="Test Title" subtitle="Test Subtitle" />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('should render title as h1', () => {
    render(<Header title="My Title" subtitle="My Subtitle" />)
    
    const title = screen.getByText('My Title')
    expect(title.tagName).toBe('H1')
  })

  it('should render subtitle as paragraph', () => {
    render(<Header title="My Title" subtitle="My Subtitle" />)
    
    const subtitle = screen.getByText('My Subtitle')
    expect(subtitle.tagName).toBe('P')
  })
})

