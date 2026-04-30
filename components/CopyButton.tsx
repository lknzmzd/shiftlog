"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button className="btn secondary" type="button" onClick={copy}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}