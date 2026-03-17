import RegisterSessionForm from "./infrastructure/driver/components/RegisterSessionForm";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

export default function RegisterSessionPage() {
  return (
    <DashboardLayout>
      <RegisterSessionForm />
    </DashboardLayout>
  );
}
