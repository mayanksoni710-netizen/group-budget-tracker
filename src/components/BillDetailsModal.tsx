import { X, Save, User } from 'lucide-react';
import { useState } from 'react';
import { WebhookResponse } from './FileUpload';

interface BillDetailsModalProps {
  isOpen: boolean;
  data: WebhookResponse | null;
  onClose: () => void;
  onSave: (data: WebhookResponse, userAssignments: Record<number, string>) => Promise<void>;
}

export function BillDetailsModal({ isOpen, data, onClose, onSave }: BillDetailsModalProps) {
  const [userAssignments, setUserAssignments] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !data) return null;

  const handleUserAssignment = (index: number, userName: string) => {
    setUserAssignments((prev) => ({
      ...prev,
      [index]: userName,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data, userAssignments);
      setUserAssignments({});
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Bill Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Assign To
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-800 border-b">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600 border-b">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 border-b">
                      {data.currency} {item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-800 border-b">
                      {data.currency} {item.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Optional"
                          value={userAssignments[index] || ''}
                          onChange={(e) => handleUserAssignment(index, e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-800">Grand Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                {data.currency} {data.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Use the "Assign To" field to split expenses between users. This
              is optional and can be left blank.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save to Database'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
