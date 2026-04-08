import React from 'react';

interface ToggleInputProps {
    label: string;
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    disabled?: boolean;
}

export default function ToggleInput({
    label,
    name,
    checked,
    onChange,
    description,
    disabled = false,
}: ToggleInputProps) {
    return (
        <div className="flex items-start space-x-4">
            <div className="flex items-center h-5 mt-1">
                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    disabled={disabled}
                    onClick={() => !disabled && onChange(!checked)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        checked ? 'bg-blue-600' : 'bg-gray-200'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="sr-only">{label}</span>
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>

            <div className="flex-1">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}
