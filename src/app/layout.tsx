import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
});

/** Homepage editorial serif — headlines only, per CLAUDE.md > HOMEPAGE
 *  TYPOGRAPHY SYSTEM. Geist remains the default body/UI sans everywhere. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
});

const TITLE = "Dopamind Mask Story — Mind–Skin Care | Nghi Thức 15 Phút Cho Làn Da & Tâm Trí";
const DESCRIPTION =
  "Dopamind Mask Story biến chăm sóc da thành một nghi thức 15 phút để bạn chậm lại, chăm sóc làn da và dành một khoảng thời gian cho chính mình.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "vi_VN",
    siteName: "Dopamind Mask Story",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cloud-milk text-charcoal">
        <Providers>
          <SiteChrome>
            <AnnouncementBar />
            <Header />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </SiteChrome>
          <MobileNav />
          <SearchOverlay />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
