import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "빌려봄 | 구매 전 체험 대여 마켓",
  description: "고민되는 구매 전 대여하고 필요한 날 물건을 빌리는 개인·업체 대여 마켓"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
