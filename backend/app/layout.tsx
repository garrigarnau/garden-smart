export const metadata = {
  title: 'Garden Smart Backend',
  description: 'IoT sensor data ingestion API',
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
