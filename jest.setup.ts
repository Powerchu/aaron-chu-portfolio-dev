import '@testing-library/jest-dom'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  disconnect = jest.fn()
  observe = jest.fn()
  takeRecords = jest.fn().mockReturnValue([])
  unobserve = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

class MockResizeObserver {
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

if (typeof window !== 'undefined' && HTMLCanvasElement.prototype.getContext === undefined) {
  // @ts-expect-error Mocking getContext for jsdom
  HTMLCanvasElement.prototype.getContext = jest.fn(() => null)
}
