import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from 'sonner';
import VisitTracker from '@/components/VisitTracker';

const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600","700","800"] });

export const metadata: Metadata = {
  title: "Yanko Acuña Villaseca | Ingeniero Civil en Computación",
  description: "Ingeniero Civil en Computación y Desarrollador Full Stack en Talca, Chile. Especialista en IA, Ciencia de Datos y Digitalización Industrial.",
  keywords: "Yanko Acuña Villaseca, Yanko Acuña, Ingeniero Civil en Computación, Ingeniero Civil Informático Talca, Desarrollador de Software Talca, Full Stack Developer Chile, Data Science Talca",
  authors: [{ name: "Yanko Acuña Villaseca" }],
  metadataBase: new URL("https://yankoacuna.cl"),
  alternates: {
    canonical: "https://yankoacuna.cl/",
  },
  openGraph: {
    type: "website",
    url: "https://yankoacuna.cl/",
    title: "Yanko Acuña Villaseca | Ingeniería y Software",
    description: "Portafolio profesional de Yanko Acuña, Ingeniero Civil en Computación especializado en IA y Full Stack.",
    images: [
      {
        url: "https://yankoacuna.cl/imagenes/preview.webp",
        width: 1200,
        height: 630,
        alt: "Yanko Acuña Villaseca - Portafolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yanko Acuña | Ingeniero Civil en Computación",
    images: ["https://yankoacuna.cl/imagenes/preview.webp"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='80' fill='%234f8ef7' font-family='Inter, sans-serif' font-weight='bold'>YA</text></svg>",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#0d1117',
  appleWebApp: {
    title: "Yanko Acuña",
    statusBarStyle: "default",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://yankoacuna.cl/#person",
      "name": "Yanko Acuña Villaseca",
      "jobTitle": "Ingeniero Civil en Computación",
      "url": "https://yankoacuna.cl",
      "sameAs": [
        "https://www.linkedin.com/in/yanko-acuna-villaseca",
        "https://github.com/yankoacuna"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Talca",
        "addressRegion": "Maule",
        "addressCountry": "CL"
      },
      "knowsAbout": ["Software Engineering", "Full Stack Development", "Data Science", "Artificial Intelligence"]
    },
    {
      "@type": "WebSite",
      "@id": "https://yankoacuna.cl/#website",
      "url": "https://yankoacuna.cl",
      "name": "Yanko Acuña Villaseca | Portafolio Profesional",
      "publisher": { "@id": "https://yankoacuna.cl/#person" }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <VisitTracker />
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" closeButton richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
