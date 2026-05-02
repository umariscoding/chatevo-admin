import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ui";
import { ThemeProvider } from "@/contexts/ThemeContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Wispoke",
  description: "Multi-tenant chatbot platform for businesses",
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('wispoke-theme');
    var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className={dmSans.className}>
        <ThemeProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
