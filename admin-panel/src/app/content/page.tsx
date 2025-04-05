import AdminLayout from '../../components/layout/AdminLayout';
import ContentLibrary from '../../components/features/content/ContentLibrary';

export default function ContentPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Content Library</h1>
        <ContentLibrary />
      </div>
    </AdminLayout>
  );
}
