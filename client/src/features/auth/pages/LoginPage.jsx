import AuthLayout from "../component/AuthLayout"
import LoginForm from "../component/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login Your Account"
      subtitle="Start managing your restaurant operations with FoodMesh."
    >
      <LoginForm />
    </AuthLayout>
  );
}