export const metadata = {
  title: "Tanora Mazava L1",
  description: "Plateforme numérique Tanora Mazava L1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mg">
      <body>{children}</body>
    </html>
  );
}
