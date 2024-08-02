import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/context/them-provider'
import { WalletContextProvider } from '@/context/wallet-connect'
import '@rainbow-me/rainbowkit/styles.css';
import { SwapProvider } from '@/context/swap-provider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deximpli',
  description: 'Keyless, Secure Wallet via Email & ZK Proofs',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
            <body className={jakarta.className}>
            <WalletContextProvider>
              <SwapProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                disableTransitionOnChange
              >
                {children}
                <Toaster />
                <ToastContainer />
              </ThemeProvider>
              </SwapProvider>
              </WalletContextProvider>
            </body>
      </html>
  )
}
