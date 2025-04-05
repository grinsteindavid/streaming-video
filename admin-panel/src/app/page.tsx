import AdminLayout from '../components/layout/AdminLayout';
import DashboardSummary from '../components/features/dashboard/DashboardSummary';
import RecentUploads from '../components/features/dashboard/RecentUploads';
import TopPerforming from '../components/features/dashboard/TopPerforming';

export default function Home() {
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        <DashboardSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentUploads />
          <TopPerforming />
        </div>
      </div>
    </AdminLayout>
  );
}
