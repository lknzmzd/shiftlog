"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    setStatus("Processing...");

    const result =
      mode === "login"
        ? await supabaseClient.auth.signInWithPassword({ email, password })
        : await supabaseClient.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });

    if (result.error) {
      setStatus(result.error.message);
      return;
    }

    if (mode === "signup") {
      setStatus("Account created. Check email if confirmation is required.");
      router.push("/login");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={submit} className="panel">
      <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />

      <button className="btn" type="submit">
        {mode === "login" ? "Login" : "Sign Up"}
      </button>

      {status && <p className="muted">{status}</p>}
    </form>
  );
}