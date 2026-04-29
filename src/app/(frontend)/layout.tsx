import "./globals.css";
import type { Metadata } from "next";
import { I18nProvider } from "@/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "ADHDバックパッカー Furi — 死ぬ時に後悔しない人生を",
  description: "3度のうつ病・ADHD診断を経て32カ国を踏破。立ち止まる人の次の一歩を創るFuriのポートフォリオ。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@500;600;700&family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body data-screen-label="Furi LP">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
