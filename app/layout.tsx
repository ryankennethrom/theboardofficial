import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'

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
        <h1>The Board</h1>
        <iframe></iframe>
        <div className="childrenAndFrame">
          <iframe></iframe>
          {children}
        </div>
        </body>
    </html>
  )
}
