import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Datakaappi",
  description: "Tallenna, säilytä ja jaa tiedostoja helposti läheistesi kanssa.",
  image: "/logo.svg",
  keywords: ["pilvi", "tallenna", "tiedostot", "kuvat", "videot", "jaa"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
