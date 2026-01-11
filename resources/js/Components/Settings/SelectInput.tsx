import React from 'react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (value: string) => void;
    options: SelectOption[];
    description?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
}

export default function SelectInput({
    label,
    name,
    value,
    onChange,
    options,
    description,
    required = false,
    error,
    disabled = false,
}: SelectInputProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}

            <select
                id={name}
                name={name}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
