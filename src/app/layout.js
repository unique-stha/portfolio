import { Inter } from 'next/font/google';
import '../../src/styles/index.css';
import '../../src/styles/main.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Unique Shrestha - Portfolio',
  description: 'Developer portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}