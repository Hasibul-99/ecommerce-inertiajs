import React, { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

interface FileInputProps {
    label: string;
    name: string;
    value?: string | null;
    onChange: (file: File | null) => void;
    description?: string;
    accept?: string;
    maxSize?: number; // in MB
    required?: boolean;
    error?: string;
    preview?: boolean;
}

export default function FileInput({
    label,
    name,
    value,
    onChange,
    description,
    accept = 'image/*',
    maxSize = 2,
    required = false,
    error,
    preview = true,
}: FileInputProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }

        setSelectedFile(file);
        onChange(file);

        // Create preview URL
        if (preview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        onChange(null);
    };

    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            <div className="flex items-start space-x-4">
                {/* Preview */}
                {preview && previewUrl && (
                    <div className="relative flex-shrink-0">
                        <img
                            src={previewUrl.startsWith('data:') ? previewUrl : `/storage/${previewUrl}`}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                            <FiX size={16} />
                        </button>
                    </div>
                )}

                {/* Upload Button */}
                <div className="flex-1">
                    <label
                        htmlFor={name}
                        className={`flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            error ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'
                        } ${previewUrl ? 'bg-gray-50' : 'bg-white'}`}
                    >
                        <div className="text-center">
                            {previewUrl ? (
                                <>
                                    <FiImage className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        Click to change file
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="text-blue-600 hover:text-blue-700">Upload a file</span>
                                        {' '}or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Max size: {maxSize}MB
                                    </p>
                                </>
                            )}
                        </div>

                        <input
                            type="file"
                            id={name}
                            name={name}
                            accept={accept}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {selectedFile && (
                        <p className="text-sm text-gray-600 mt-2">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </p>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
