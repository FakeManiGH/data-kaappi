import { Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Datakaappi",
  description: "Tallenna, säilytä ja jaa tiedostoja helposti kaikilla laitteillasi.",
  image: "/logo.svg",
  keywords: ["tiedostot", "tallennus", "jako", "data", "kaappi"],
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
