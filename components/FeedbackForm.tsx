"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Sending...");

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/feedback/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: String(form.get("message") || ""),
        page: String(form.get("page") || ""),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed. Login first.");
      return;
    }

    e.currentTarget.reset();
    setStatus("Feedback sent");
  }

  return (
    <form onSubmit={submit} className="panel">
      <h2>Send Feedback</h2>

      <input name="page" placeholder="Page, example: dashboard" />
      <textarea name="message" placeholder="What feels bad or missing?" required />

      <button className="btn" type="submit">Send Feedback</button>

      {status && <p className="muted">{status}</p>}
    </form>
  );
}