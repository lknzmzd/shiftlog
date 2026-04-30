"use client";

import { useState } from "react";

export default function NewReport() {
  const [result, setResult] = useState("");

  function build(e: any) {
    e.preventDefault();

    const form = new FormData(e.target);

    let text = `
Device: ${form.get("device")}
Issue: ${form.get("issue")}
Note: ${form.get("note")}
    `;

    setResult(text);
  }

  function copy() {
    navigator.clipboard.writeText(result);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>New Report</h1>

      <form onSubmit={build}>
        <input name="device" placeholder="Device" /><br />
        <input name="issue" placeholder="Issue" /><br />
        <textarea name="note" placeholder="Note" /><br />
        <button>Generate</button>
      </form>

      {result && (
        <>
          <pre>{result}</pre>
          <button onClick={copy}>Copy</button>
        </>
      )}
    </main>
  );
}