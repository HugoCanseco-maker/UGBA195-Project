import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bloomberg Jr. Terminal',
  description: 'Financial Terminal - UC Berkeley Haas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bloomberg-black text-white font-mono antialiased">
        {children}
      </body>
    </html>
  )
}
