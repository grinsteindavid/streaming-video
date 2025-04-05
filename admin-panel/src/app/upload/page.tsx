import AdminLayout from '../../components/layout/AdminLayout';
import UploadForm from '../../components/features/upload/UploadForm';

export default function UploadPage() {
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Upload Content</h1>
        <UploadForm />
      </div>
    </AdminLayout>
  );
}
