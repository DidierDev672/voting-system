import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import RegisterPartyForm from '@/app/party/infrastructure/driver/components/RegisterPartyForm';

export default function Partidos() {
  return (
    <DashboardLayout>
      <RegisterPartyForm />
    </DashboardLayout>
  );
}
