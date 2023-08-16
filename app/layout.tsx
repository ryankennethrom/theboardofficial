import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Board',
  description: 'A whiteboard for everyone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>The Board</title>
        <meta name="viewport" content='width=device-width,initial-scale=0.1,maximum-scale=0.1,user-scalable=no'></meta>
      </head>
      <body className={inter.className}>
        {children}
        </body>
    </html>
  )
}
