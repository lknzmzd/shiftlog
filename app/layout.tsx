import "../styles/globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "ShiftLog",
  description: "Salary tracker and report assistant for workers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}