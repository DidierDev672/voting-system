import RegisterBancadaForm from "./infrastructure/driver/components/RegisterBancadaForm";
import { DashboardLayout } from "@/app/shared/components/layouts/DashboardLayout";

export default function RegisterBancadaPage() {
  return (
    <DashboardLayout>
      <RegisterBancadaForm />
    </DashboardLayout>
  );
}
