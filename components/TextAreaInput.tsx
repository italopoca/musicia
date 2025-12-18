
import React from 'react';

interface TextAreaInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, value, onChange, placeholder }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                {label}
            </label>
            <textarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-700 font-mono resize-none"
            />
        </div>
    );
};
