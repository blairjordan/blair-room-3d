import { Layout } from '@/components/dom/Layout'
import '@/global.css'

export const metadata = {
  title: 'Virtual Blair',
  description: 'A 3D interview simulator using ThreeJS, Google Speech-to-Text, and OpenAI (ChatGPT)',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en' className='antialiased'>
      <head />
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
