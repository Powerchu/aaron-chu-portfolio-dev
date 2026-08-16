import type { Application } from 'pixi.js'

export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

interface CreateAppOptions {
  width: number
  height: number
  backgroundAlpha?: number
  canvas?: HTMLCanvasElement
}

export async function createApp({ width, height, backgroundAlpha = 0, canvas }: CreateAppOptions): Promise<Application> {
  const { Application } = await import('pixi.js')
  const app = new Application()
  await app.init({
    width,
    height,
    backgroundAlpha,
    antialias: true,
    powerPreference: 'high-performance',
    preference: 'webgl2',
    resolution: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
    autoDensity: true,
    canvas,
  })
  return app
}
