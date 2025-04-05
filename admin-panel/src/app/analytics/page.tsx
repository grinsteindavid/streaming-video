import AdminLayout from '../../components/layout/AdminLayout';
import AnalyticsDashboard from '../../components/features/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Analytics Dashboard</h1>
        <AnalyticsDashboard />
      </div>
    </AdminLayout>
  );
}
