import RegisterPresidentForm from "./infrastructure/driver/components/RegisterPresidentForm";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

export default function RegisterPresidentPage() {
  return (
    <DashboardLayout>
      <RegisterPresidentForm />
    </DashboardLayout>
  );
}
