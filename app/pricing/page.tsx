"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [status, setStatus] = useState("");

  async function upgrade() {
    setStatus("Opening checkout...");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok || !data?.success) {
        setStatus(data?.error || `Checkout failed. Status: ${res.status}`);
        return;
      }

      window.location.href = data.data.url;
    } catch (err: any) {
      setStatus(err.message || "Checkout failed");
    }
  }

  return (
    <main className="page">
      <h1>Pricing</h1>

      <section className="grid-section">
        <div className="card">
          <h2>Free</h2>
          <p className="price">€0</p>
          <p className="muted">For testing ShiftLog.</p>

          <ul>
            <li>Salary calculator</li>
            <li>Work day tracking</li>
            <li>10 reports/month</li>
          </ul>

          <Link className="btn secondary" href="/signup">
            Start Free
          </Link>
        </div>

        <div className="card">
          <h2>Worker Pro</h2>
          <p className="price">€4.99/month</p>
          <p className="muted">For workers who use reports daily.</p>

          <ul>
            <li>Unlimited reports</li>
            <li>Unlimited templates</li>
            <li>Expense tracking</li>
            <li>Export TSV</li>
          </ul>

          <button className="btn" onClick={upgrade}>
            Upgrade to Pro
          </button>

          {status && <p className="muted">{status}</p>}
        </div>
      </section>
    </main>
  );
}