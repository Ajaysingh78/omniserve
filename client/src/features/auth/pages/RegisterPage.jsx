import AuthLayout from "../component/AuthLayout";
import RegisterForm from "../component/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Account"
    >
      <RegisterForm />
    </AuthLayout>
  );
}