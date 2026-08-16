import { ImageResponse } from 'next/og'

export const runtime = 'edge'

/** Apple touch icon — 180×180 terracotta monogram. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 72,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: '#DF6C4F',
        }}
      >
        {'</>'}
      </div>
    ),
    {
      width: 180,
      height: 180,
    }
  )
}
