
import { useState, useRef } from 'react';

interface ImageUploadProps {
  label: string;
  onChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    // const maxFileSizeKB = 3; //file size KB
    const maxFileSizeKB = 5000;
    if (file) {
      if (file.size / 1024 > maxFileSizeKB) {
        setError(`File size exceeds ${maxFileSizeKB} KB  Please upload a smaller file`);
        setPreview(null);
        onChange(null);
      } else {
        setError(null);
        setPreview(URL.createObjectURL(file));
        onChange(file);
      }
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setError(null);
    onChange(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4 relative">
      <label className="block font-medium text-black dark:text-white text-sm mb-2">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef} 
        onChange={handleFileChange}
        className="rounded p-2 w-full mb-4 border border-stroke"
      />
      {error && <p className="text-red-500 text-md">{error}</p>}
      {preview && (
        <div className="relative">
          <img src={preview} alt="Preview" className="mt-2 w-[450px] rounded" />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 text-lg hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
