import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "맞잠 | 의자와 베개 대여 마켓",
  description: "며칠 써봐야 아는 생활용품을 동네에서 빌려보고 빌려주는 마켓"
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
