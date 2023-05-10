import Header from 'all/components/Header'
import Footer from './Footer'
import { Inter } from 'next/font/google'
import '../styles/globals.css';
import { SessionProvider } from 'all/components/SessionProvider';
import ClientProvider from 'all/components/ClientProvider';
import Head from './head';



export default function RootLayout({ children }) {
  return (
    <html className= " scroll-smooth">
      <Head/>
      <body>
        <SessionProvider>
          <Header/>
          <ClientProvider/>          
          <div >{children}</div>
        <Footer/>
        </SessionProvider>
      </body>
    </html>
  )
}