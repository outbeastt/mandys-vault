import './globals.css';

export const metadata = {
  title: "Mandy's Birthday Vault",
  description: 'A digital time capsule for Mandy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}