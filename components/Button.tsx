
import React from 'react';

interface ButtonProps {
    isLoading: boolean;
    text: string;
    loadingText: string;
    onClick?: () => void;
    disabled?: boolean;
    platform?: 'SUNO AI' | 'PRODUCER AI';
}

export const Button: React.FC<ButtonProps> = ({ isLoading, text, loadingText, onClick, disabled, platform = 'SUNO AI' }) => {
    const isSuno = platform === 'SUNO AI';
    
    return (
        <button
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`
                relative w-full py-4 px-6 rounded-xl font-black text-[11px] tracking-[0.3em] uppercase
                transition-all duration-300 overflow-hidden group
                ${isSuno 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)]'}
                disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
            `}
        >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{loadingText}</span>
                    </>
                ) : (
                    <span>{text}</span>
                )}
            </div>
        </button>
    );
};
