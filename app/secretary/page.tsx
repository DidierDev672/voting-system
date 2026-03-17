import RegisterSecretaryForm from "./infrastructure/driver/components/RegisterSecretaryForm";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

export default function RegisterSecretaryPage() {
  return (
    <DashboardLayout>
      <RegisterSecretaryForm />
    </DashboardLayout>
  );
}
