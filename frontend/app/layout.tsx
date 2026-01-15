import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blog CMS Platform',
  description: 'A modern blog platform built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
