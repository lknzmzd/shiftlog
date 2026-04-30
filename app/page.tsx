import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>ShiftLog</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/salary">Salary</Link>
        <Link href="/reports/new">New Report</Link>
        <Link href="/reports/history">Reports</Link>
      </div>
    </main>
  );
}