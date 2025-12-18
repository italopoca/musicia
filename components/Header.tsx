
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tighter">
                    SONG<span className="text-cyan-500">PRO</span><span className="text-xs ml-2 bg-slate-800 px-2 py-1 rounded text-slate-400">V1.0
                </h1>
                <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">O melhor criador de letras</p>
            </div>
            <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Criado por: Italo Poça</span>
            </div>
        </header>
    );
};
