import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, WritableStream, TransformStream } from 'node:stream/web'
import { MessageChannel, MessagePort } from 'node:worker_threads'

// Expose web streams & encodings in global & window scope for JSDOM
const g = global as any
const w = typeof window !== 'undefined' ? (window as any) : g

g.TextEncoder = TextEncoder
g.TextDecoder = TextDecoder
g.ReadableStream = ReadableStream
g.WritableStream = WritableStream
g.TransformStream = TransformStream
g.MessageChannel = MessageChannel
g.MessagePort = MessagePort

w.TextEncoder = TextEncoder
w.TextDecoder = TextDecoder
w.ReadableStream = ReadableStream
w.WritableStream = WritableStream
w.TransformStream = TransformStream
w.MessageChannel = MessageChannel
w.MessagePort = MessagePort

// Ensure Web Fetch API standard globals
try {
  const { Request: NodeRequest, Response: NodeResponse, Headers: NodeHeaders, fetch: NodeFetch, FormData: NodeFormData } = require('undici')
  g.Request = NodeRequest
  g.Response = NodeResponse
  g.Headers = NodeHeaders
  g.fetch = NodeFetch
  g.FormData = NodeFormData
  w.Request = NodeRequest
  w.Response = NodeResponse
  w.Headers = NodeHeaders
  w.fetch = NodeFetch
  w.FormData = NodeFormData
} catch (e) {
  console.error('Failed to polyfill undici fetch globals', e)
}

// After each test, unmount all React trees so MESSAGEPORT handles close.
// Without this, React 18+'s scheduler keeps a message port open per render,
// causing the Jest worker to hang until --forceExit kills it.
afterEach(() => {
  cleanup()
})

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

if (typeof window !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(160 * 160 * 4).fill(0) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Array(160 * 160 * 4).fill(0) })),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
  }) as any)
}
