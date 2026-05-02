import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { cookies } from "next/headers";
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

// Inline pre-paint script. Runs synchronously in <head> before any body paint, so
// reconciling cookie/localStorage with the actual OS preference can't cause a flash.
// The cookie holds the *resolved* theme (so SSR is exact); localStorage holds the
// user's *preference* (light | dark | system) for offline / pre-auth.
const themeInitScript = `(function(){try{
var pref=localStorage.getItem('wispoke-theme-pref');
if(pref!=='light'&&pref!=='dark'&&pref!=='system'){pref='system';}
var resolved;
if(pref==='light'||pref==='dark'){resolved=pref;}
else{resolved=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
var html=document.documentElement;
var hasDark=html.classList.contains('dark');
if(resolved==='dark'&&!hasDark)html.classList.add('dark');
else if(resolved==='light'&&hasDark)html.classList.remove('dark');
document.cookie='wispoke-theme='+resolved+'; path=/; max-age=31536000; samesite=lax';
}catch(e){document.documentElement.classList.add('dark');}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SSR: read the cookie (set by previous client paint or login response) so the
  // server-rendered HTML already has the right theme class. No flash for returning
  // sessions. First-ever visit defaults to dark (platform default) and the inline
  // script corrects pre-paint if the user's preference differs.
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("wispoke-theme")?.value;
  const initialResolved: "light" | "dark" = cookieTheme === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      className={`${dmSans.variable}${initialResolved === "dark" ? " dark" : ""}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={dmSans.className}>
        <ThemeProvider initialResolved={initialResolved}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
