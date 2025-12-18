
import React, { useState } from 'react';

interface StyleSuggestionsProps {
    suggestions: string[];
    isLoading: boolean;
    platform: 'SUNO AI' | 'PRODUCER AI';
}

export const StyleSuggestions: React.FC<StyleSuggestionsProps> = ({ suggestions, isLoading, platform }) => {
    const [copied, setCopied] = useState(false);
    const isSuno = platform === 'SUNO AI';

    const handleCopy = () => {
        navigator.clipboard.writeText(suggestions.join(isSuno ? ', ' : '\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) return null;

    return (
        <div className={`glass-card rounded-3xl p-6 border-l-4 ${isSuno ? 'border-l-cyan-500' : 'border-l-fuchsia-500'}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {isSuno ? 'Suggested Tags for Suno' : 'Production Prompt for Producer AI'}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">Ready to be pasted into the platform</p>
                </div>
                {suggestions.length > 0 && (
                    <button 
                        onClick={handleCopy}
                        className={`text-[10px] font-bold px-4 py-2 rounded-full transition-all uppercase ${
                            isSuno ? 'bg-cyan-500 text-white' : 'bg-fuchsia-500 text-white'
                        }`}
                    >
                        {copied ? 'SYSTEM COPIED' : 'COPY ALL'}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                {isSuno ? (
                    suggestions.map((tag, i) => (
                        <span key={i} className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-mono px-3 py-1.5 rounded-lg hover:border-cyan-500 transition-colors">
                            {tag}
                        </span>
                    ))
                ) : (
                    <div className="w-full bg-slate-950/50 p-4 rounded-xl border border-fuchsia-900/20">
                        <p className="text-sm text-fuchsia-100/80 leading-relaxed font-mono italic">
                            {suggestions[0]}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
