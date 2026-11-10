import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Archivo_Black } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Confuse Coder",
  description: "DSA aur dev concepts, Hinglish mein. Notes, projects aur interactive explainers from @confuse__coder and @confuse__coder.dev.",
};

// Runs before paint so a returning .dev visitor never sees a dark flash.
const themeScript = `try{var t=localStorage.getItem('cc-theme');if(t==='dev'||t==='cc')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="cc"
      suppressHydrationWarning
      className={`${grotesk.variable} ${mono.variable} ${archivo.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
