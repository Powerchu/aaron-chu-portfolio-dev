import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
