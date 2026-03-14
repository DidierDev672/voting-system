import { DashboardLayout } from '@/app/shared/components/layouts/DashboardLayout';
import RegisterMemberForm from '@/app/member/infrastructure/driver/components/RegisterMemberForm';

export default function Miembros() {
  return (
    <DashboardLayout>
      <RegisterMemberForm />
    </DashboardLayout>
  );
}
