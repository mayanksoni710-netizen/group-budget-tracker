import { useState } from 'react';
import { Receipt, TrendingDown, Users, Shield } from 'lucide-react';
import { FileUpload, WebhookResponse } from './components/FileUpload';
import { BillDetailsModal } from './components/BillDetailsModal';
import { Toast } from './components/Toast';
import { UserManagement } from './components/UserManagement';
import { saveBillToDatabase } from './services/billService';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [billData, setBillData] = useState<WebhookResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const handleUploadSuccess = (data: WebhookResponse) => {
    setBillData(data);
    setIsModalOpen(true);
  };

  const handleUploadError = (error: string) => {
    setToast({ show: true, message: error, type: 'error' });
  };

  const handleSave = async (data: WebhookResponse, userAssignments: Record<number, string[]>) => {
    try {
      await saveBillToDatabase(data, userAssignments);
      setToast({
        show: true,
        message: 'Bill saved successfully!',
        type: 'success',
      });
      setIsModalOpen(false);
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to save bill',
        type: 'error',
      });
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">BudgetSnap</h1>
          </div>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-6 py-16 space-y-20">
          <UserManagement />

          <div className="border-t border-gray-200 pt-20">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Expense Management
                <br />
                <span className="text-blue-600">Made Simple</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Upload your bill images and let AI extract every detail. Track expenses, split bills
                with friends, and stay on budget effortlessly.
              </p>
              <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Receipt className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Upload & Extract</h3>
              <p className="text-gray-600 leading-relaxed">
                Simply snap a photo of your receipt. Our AI instantly extracts items, quantities,
                and totals with high accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Split Bills</h3>
              <p className="text-gray-600 leading-relaxed">
                Assign items to different people for easy bill splitting. Perfect for group dinners
                and shared expenses.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingDown className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Track Spending</h3>
              <p className="text-gray-600 leading-relaxed">
                All expenses are saved to your personal database. Review history and identify
                spending patterns over time.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Secure & Private</h3>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Your financial data is encrypted and stored securely. We never share your
                  information with third parties.
                </p>
              </div>
              <div className="flex gap-4 text-white">
                <div className="text-center">
                  <div className="text-4xl font-bold">99.9%</div>
                  <div className="text-blue-200 text-sm">Accuracy</div>
                </div>
                <div className="w-px bg-blue-400 mx-4"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold">&lt;2s</div>
                  <div className="text-blue-200 text-sm">Processing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 text-center border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have simplified their expense tracking. Upload your first
              bill now and experience the difference.
            </p>
            <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 BudgetSnap. Built with precision and care.</p>
        </div>
      </footer>

      <BillDetailsModal
        isOpen={isModalOpen}
        data={billData}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />
      )}
    </div>
  );
}

export default App;
