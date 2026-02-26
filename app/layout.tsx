import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: {
    default: "IBlacker",
    template: "%s | IBlacker",
  },
  description: "IBlacker Master AI Platform",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
