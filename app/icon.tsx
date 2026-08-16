import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/** Programmatic favicon — 32×32 terracotta monogram. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: '#DF6C4F',
          // Angled bracket monogram
        }}
      >
        {'</>'}
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  )
}
