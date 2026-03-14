import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import RegisterConsultationForm from '@/app/consultation/infrastructure/driver/components/RegisterConsultationForm';

export default function PoliticalConsultation() {
  return (
    <DashboardLayout>
      <RegisterConsultationForm />
    </DashboardLayout>
  );
}
