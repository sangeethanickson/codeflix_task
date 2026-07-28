import './globals.css';

export const metadata = {
  title: 'HR Leave Portal',
  description: 'Codeflix TR3 – HR Leave Request Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
