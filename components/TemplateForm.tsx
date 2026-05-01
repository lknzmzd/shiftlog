"use client";

import { useState } from "react";

export default function TemplateForm() {
  const [status, setStatus] = useState("");

  async function save(e: any) {
    e.preventDefault();
    setStatus("Saving...");

    const form = new FormData(e.target);

    const res = await fetch("/api/templates/create", {
      method: "POST",
      body: JSON.stringify({
        title: form.get("title"),
        templateText: form.get("template"),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus("Failed");
      return;
    }

    e.target.reset();
    setStatus("Template saved");
  }

  return (
    <form onSubmit={save} className="panel">
      <h2>Create Template</h2>

      <input name="title" placeholder="Template name" required />
      <textarea name="template" placeholder="Template text" required />

      <button className="btn">Save Template</button>

      {status && <p>{status}</p>}
    </form>
  );
}