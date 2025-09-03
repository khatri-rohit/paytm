import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"] });
import { StoreProvider } from '@repo/store';
import { Provider } from './provider';

export const metadata: Metadata = {
  title: "PayTM",
  description: "PayTM is a payment gateway for India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <Provider>
        <StoreProvider>
          <body className={geist.className}>
            {children}
          </body>
        </StoreProvider>
      </Provider>
    </html>
  );
}
