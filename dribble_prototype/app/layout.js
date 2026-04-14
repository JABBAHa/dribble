import "./globals.css";

export const metadata = {
  title: "Dribble Smart Home Prototype",
  description: "Gesture + voice smart home control prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
