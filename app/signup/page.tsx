import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="page">
      <h1>Create Account</h1>
      <AuthForm mode="signup" />
    </main>
  );
}