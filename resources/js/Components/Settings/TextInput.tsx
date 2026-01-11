import React from 'react';

interface TextInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (value: string) => void;
    description?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'number' | 'password';
    required?: boolean;
    error?: string;
    disabled?: boolean;
}

export default function TextInput({
    label,
    name,
    value,
    onChange,
    description,
    placeholder,
    type = 'text',
    required = false,
    error,
    disabled = false,
}: TextInputProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            <input
                type={type}
                id={name}
                name={name}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
