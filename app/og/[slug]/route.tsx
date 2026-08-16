import { ImageResponse } from 'next/og'
import { projects } from '#site/content'
import { siteConfig } from '@/lib/siteConfig'

export const runtime = 'edge'

interface RouteProps {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, { params }: RouteProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  const title = project?.title ?? siteConfig.title
  const description = project?.description ?? siteConfig.description

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          color: '#FAFAFA',
          padding: '80px',
          fontFamily: 'sans-serif',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#DF6C4F' }} />
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#DF6C4F' }}>
            {siteConfig.name} / Projects
          </div>
        </div>
        <div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: '#A3A3A3', marginTop: 24, maxWidth: '85%', lineHeight: 1.4 }}>
            {description}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: 18, color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {project?.tech?.slice(0, 5).join(' · ') || 'Portfolio Project'}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
