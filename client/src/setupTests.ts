import '@testing-library/jest-dom'

// Mock window.URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock fetch globally
global.fetch = jest.fn()

// Mock FormData
global.FormData = jest.fn(() => ({
  append: jest.fn(),
})) as unknown as typeof FormData

// Mock import.meta.env for Vite - this needs to be done via a transformer
// For now, we'll mock the constants module directly in tests that need it

