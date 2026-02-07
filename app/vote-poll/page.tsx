import { DashboardLayout } from '../shared/components/layouts/DashboardLayout';
import VotePollForm from './page/VotePoll';

export default function VotePoll() {
  return (
    <DashboardLayout>
      <VotePollForm />
    </DashboardLayout>
  );
}
