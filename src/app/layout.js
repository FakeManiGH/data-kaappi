import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Data-Kaappi",
  description: "Tallenna, säilytä ja jaa tiedostoja helposti kaikilla laitteillasi.",
  image: "/logo.svg",
  keywords: ["tiedostot", "tallennus", "jako", "data", "kaappi"],
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
