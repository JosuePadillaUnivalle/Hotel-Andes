import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Hotel Andes · Tu refugio entre montañas",
  description: "Encuentra tu próxima escapada. Explora las habitaciones del Hotel Andes, consulta disponibilidad y reserva tu estancia. Prototipo académico.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
