import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/salary", label: "Salary" },
  { href: "/work-days", label: "Work Days" },
  { href: "/expenses", label: "Expenses" },
  { href: "/workplaces", label: "Workplaces" },
  { href: "/reports/new", label: "New Report" },
  { href: "/reports/history", label: "History" },
  { href: "/templates", label: "Templates" },
  { href: "/settings", label: "Settings" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/pricing", label: "Pricing" },
  { href: "/feedback", label: "Feedback" },
  { href: "/warehouse", label: "Warehouse" },
  { href: "/warehouse/history", label: "Warehouse History" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2>ShiftLog</h2>
        <p className="muted small">Worker money + report system</p>
      </div>

      <nav>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>

      <a className="export" href="/api/export/tsv">
        Export TSV
      </a>
    </aside>
  );
}