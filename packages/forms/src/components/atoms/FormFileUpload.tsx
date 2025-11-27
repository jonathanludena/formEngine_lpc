import { forwardRef, useState, useRef, useImperativeHandle, ChangeEvent } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';

export interface FormFileUploadProps {
  /** Label for the file input */
  label: string;
  /** Optional description */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Accept specific file types */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Current value (File or File array) */
  value?: File | File[] | string | string[];
  /** On change callback */
  onChange?: (files: File | File[] | null) => void;
  /** Optional CSS class */
  className?: string;
  /** Is field disabled */
  disabled?: boolean;
}

export const FormFileUpload = forwardRef<HTMLInputElement, FormFileUploadProps>(
  (
    {
      label,
      description,
      error,
      accept = 'image/*,.pdf',
      multiple = false,
      maxSizeMB = 5,
      value,
      onChange,
      className = '',
      disabled = false,
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>(() => {
      // Initialize from value prop if it's File or File[]
      if (value instanceof File) return [value];
      if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) return value as File[];
      return [];
    });
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      
      // Validate file sizes
      const oversizedFiles = selectedFiles.filter(
        (file) => file.size > maxSizeMB * 1024 * 1024
      );
      
      if (oversizedFiles.length > 0) {
        alert(`Algunos archivos exceden el tamaño máximo de ${maxSizeMB}MB`);
        return;
      }

      // Handle single or multiple files
      if (multiple) {
        setFiles(selectedFiles);
        if (onChange) onChange(selectedFiles);
        
        // Generate previews
        const previews: string[] = [];
        selectedFiles.forEach((file) => {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
              previews.push(reader.result as string);
              if (previews.length === selectedFiles.length) {
                setPreview(previews);
              }
            };
            reader.readAsDataURL(file);
          } else {
            previews.push(''); // No preview for non-images
          }
        });
        if (previews.length === 0) setPreview([]);
      } else {
        const file = selectedFiles[0];
        setFiles([file]);
        if (onChange) onChange(file);
        
        // Generate preview for single file
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview([reader.result as string]);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview([]);
        }
      }
    };

    const handleRemove = (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = preview.filter((_, i) => i !== index);
      
      setFiles(newFiles);
      setPreview(newPreviews);
      
      if (onChange) {
        onChange(multiple ? newFiles : null);
      }
      
      // Clear input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      } else if (file.type === 'application/pdf') {
        return <FileText className="h-8 w-8 text-red-500" />;
      }
      return <FileText className="h-8 w-8 text-gray-500" />;
    };

    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {description && (
            <span className="block text-xs font-normal text-gray-500 mt-1">
              {description}
            </span>
          )}
        </label>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {files.length === 0 ? (
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`
              w-full border-2 border-dashed rounded-lg p-6
              flex flex-col items-center justify-center gap-2
              transition-colors duration-200
              ${disabled
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 cursor-pointer'
              }
            `}
          >
            <Upload className={`h-8 w-8 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className="text-sm text-gray-600">
              {multiple ? 'Click para subir archivos' : 'Click para subir archivo'}
            </span>
            <span className="text-xs text-gray-500">
              {accept.includes('image') && 'Imágenes'}{accept.includes('.pdf') && ' y PDFs'} (máx. {maxSizeMB}MB)
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg bg-white"
              >
                {preview[index] ? (
                  <img
                    src={preview[index]}
                    alt={file.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  getFileIcon(file)
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {multiple && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={disabled}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Agregar más archivos
              </Button>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormFileUpload.displayName = 'FormFileUpload';
