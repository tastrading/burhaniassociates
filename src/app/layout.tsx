import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

export const preferredRegion = 'sin1'; // Singapore region for lower latency in India/Asia
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://burhaniassociates.com'), // Replace with actual domain when live, using localhost or vercel url for now if needed, but production URL is best practice
  title: {
    default: 'Burhani Associates | Industrial Components Hyderabad',
    template: '%s | Burhani Associates',
  },
  description: 'Authorized Dealer for Clamptek, Swiftin, and industrial machinery parts in Hyderabad. Toggle Clamps, Handwheels, Vibration Mounts, Clamping Elements.',
  keywords: ['Industrial Components', 'Toggle Clamps', 'Handwheels', 'Vibration Mounts', 'Clamptek', 'Swiftin', 'Hyderabad', 'Secunderabad', 'Ranigunj', 'Industrial Machinery Parts', 'Burhani Associates'],
  authors: [{ name: 'Burhani Associates' }],
  creator: 'Burhani Associates',
  publisher: 'Burhani Associates',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Burhani Associates | Premier Industrial Components',
    description: 'Your trusted partner for high-quality industrial machine parts, toggle clamps, and engineering solutions in Hyderabad.',
    url: 'https://burhaniassociates.com',
    siteName: 'Burhani Associates',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burhani Associates | Industrial Components',
    description: 'Top quality industrial parts in Hyderabad. Clamptek & Swiftin Authorized Dealer.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};



// ... (previous imports and fonts remain same)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${roboto.variable} antialiased font-sans`}
      >
        <NextTopLoader
          color="#FE5C00" // Accent color (Orange)
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #FE5C00,0 0 5px #FE5C00"
        />
        <Header />
        <main className="min-h-screen bg-slate-50 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
