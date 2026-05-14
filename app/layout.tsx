import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

declare module '*.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  metadataBase: new URL('https://asmarparkiety.pl'),
  title: 'ASMAR | Studio Podłóg Kraków - Podłogi z duszą',
  description: '29 lat doświadczenia w montażu i cyklinowaniu parkietów, tarasów oraz schodów. Profesjonalne doradztwo i materiały premium w Krakowie.',
  openGraph: {
    title: 'ASMAR | Studio Podłóg Kraków',
    description: 'Eksperci od podłóg drewnianych, tarasów i schodów. Sprawdź nasze realizacje.',
    images: ['/image_3.png'], // To się wyświetli przy udostępnianiu linku
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}