
import React from 'react';

interface SelectInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

export const SelectInput: React.FC<SelectInputProps> = ({ id, label, value, onChange, options }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all appearance-none font-mono cursor-pointer"
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
