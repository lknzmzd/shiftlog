import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="page">
      <h1>Login</h1>
      <AuthForm mode="login" />
    </main>
  );
}