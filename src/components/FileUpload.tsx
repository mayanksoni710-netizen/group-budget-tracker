import { Upload } from 'lucide-react';
import { useState } from 'react';

interface FileUploadProps {
  onUploadSuccess: (data: WebhookResponse) => void;
  onUploadError: (error: string) => void;
}

export interface WebhookResponse {
  data: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  grandTotal: number;
  currency: string;
}

export function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png'];
    const validPdfType = 'application/pdf';
    const isValidFile = validImageTypes.includes(file.type) || file.type === validPdfType;

    if (!isValidFile) {
      onUploadError('Please select a valid file (.jpg, .png, or .pdf)');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://mayanksoni710.app.n8n.cloud/webhook/receive-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText.includes('binary not found')
            ? 'File format not supported. Please try a different image or PDF.'
            : `Upload failed: ${response.statusText}`
        );
      }

      const data: WebhookResponse = await response.json();
      onUploadSuccess(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to process image. Please try again.';
      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className={`inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all cursor-pointer ${
          isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        <Upload className={`w-5 h-5 ${isUploading ? 'animate-bounce' : ''}`} />
        {isUploading ? 'Processing...' : 'Upload Bill Image'}
      </label>
    </div>
  );
}
