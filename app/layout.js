import './globals.css'
 
export const metadata = {
  title: 'Star Wars: Clone Wars — Interaktivní Archiv',
  description: 'Interaktivní archiv Klonových válek. Galaxie je ve válce.',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
 