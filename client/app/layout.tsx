import './globals.css'; // agar aapki global CSS file hai toh

export const metadata = {
  title: 'AI Mock Interview Platform',
  description: 'AI-Powered Mock Interview Platform for ElevanceSkills',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}