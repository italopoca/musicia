
import React, { useState } from 'react';

interface GeneratedLyricsProps {
    lyrics: string;
    isLoading: boolean;
    title: string;
}

export const GeneratedLyrics: React.FC<GeneratedLyricsProps> = ({ lyrics, isLoading, title }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(lyrics);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card rounded-[2rem] flex-1 flex flex-col overflow-hidden border border-slate-800/50">
            {/* DAW Toolbar */}
            <div className="bg-slate-900/60 px-6 py-4 border-b border-slate-800/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    </div>
                    <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] truncate">
                        {title}
                    </span>
                </div>
                {lyrics && (
                    <button 
                        onClick={handleCopy}
                        className="text-[9px] font-black text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all uppercase tracking-[0.2em] border border-white/10"
                    >
                        {copied ? 'COPIED' : 'CLONE DATA'}
                    </button>
                )}
            </div>

            {/* Lyrics Board */}
            <div className="flex-1 bg-slate-950/40 p-6 md:p-12 overflow-y-auto">
                {isLoading ? (
                    <div className="space-y-6 animate-pulse">
                        <div className="h-4 bg-slate-800/50 rounded w-1/4"></div>
                        <div className="h-3 bg-slate-800/30 rounded w-full"></div>
                        <div className="h-3 bg-slate-800/30 rounded w-4/5"></div>
                        <div className="h-12"></div>
                        <div className="h-4 bg-slate-800/50 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-800/30 rounded w-full"></div>
                    </div>
                ) : lyrics ? (
                    <div className="font-mono text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        {lyrics.split('\n').map((line, i) => (
                            <div key={i} className="flex gap-8 group hover:bg-white/[0.02] py-0.5 px-2 rounded-md transition-colors">
                                <span className="w-8 text-slate-700 text-right select-none text-[10px] tabular-nums pt-1 shrink-0">{i + 1}</span>
                                <span className={`${line.startsWith('[') ? 'text-cyan-400 font-black tracking-tight pl-2 border-l-2 border-cyan-500/40 bg-cyan-950/10 my-2 py-1 block w-full' : 'pl-2'}`}>
                                    {line}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-700 space-y-6 opacity-30">
                        <div className="p-8 rounded-full border-2 border-dashed border-slate-800">
                             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">Awaiting Input Signal...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
