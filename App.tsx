
import React, { useState } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { TextAreaInput } from './components/TextAreaInput';
import { SelectInput } from './components/SelectInput';
import { Button } from './components/Button';
import { GeneratedLyrics } from './components/GeneratedLyrics';
import { StyleSuggestions } from './components/StyleSuggestions';
import { UploadInput } from './components/UploadInput';
import { genres, vocalists, CUSTOM_GENRE_OPTION } from './constants/musicData';
import { generateContent, getStyleSuggestions, analyzeAudio, formatLyricsFromText, getStyleSuggestionsFromAnalysis } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { Platform, Mode, GenerateLyricsParams } from './types';

const App: React.FC = () => {
    const [platform, setPlatform] = useState<Platform>('SUNO AI');
    const [mode, setMode] = useState<Mode>('lyrics');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [generatedTitle, setGeneratedTitle] = useState('');
    const [styleSuggestions, setStyleSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [lyricsForm, setLyricsForm] = useState<Omit<GenerateLyricsParams, 'platform'>>({
        musicGenre: genres[1],
        songTitle: '',
        baseLyrics: '',
        vocalist: vocalists[0],
    });

    const isSuno = platform === 'SUNO AI';

    const handleGenerate = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();
        if(!lyricsForm.songTitle && mode === 'lyrics') {
            setError("Defina um título para a sua obra.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateContent({ ...lyricsForm, platform }, mode);
            setGeneratedContent(result.lyrics);
            setGeneratedTitle(result.title);
            const suggestions = await getStyleSuggestions(result.lyrics, platform);
            setStyleSuggestions(suggestions.styleSuggestions);
        } catch (err) {
            setError("Falha na conexão neural. Verifique sua rede.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        try {
            const b64 = await fileToBase64(selectedFile);
            const analysis = await analyzeAudio(b64, selectedFile.type);
            const formatted = await formatLyricsFromText(analysis.lyrics, platform);
            setGeneratedContent(formatted.lyrics);
            const suggestions = await getStyleSuggestionsFromAnalysis(analysis, platform);
            setStyleSuggestions(suggestions.styleSuggestions);
            setGeneratedTitle(selectedFile.name);
        } catch (err) {
            setError("Erro ao analisar áudio.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#020617] p-4 md:p-8">
            <div className="max-w-[1440px] w-full mx-auto flex flex-col gap-8">
                <Header />

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* SIDEBAR - CONTROLES */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className={`glass-card rounded-[2rem] p-6 border-b-4 transition-all duration-300 ${isSuno ? 'border-b-cyan-500 neon-glow-suno' : 'border-b-fuchsia-500 neon-glow-producer'}`}>
                            {/* Seletor de Plataforma */}
                            <div className="flex bg-slate-950 p-1 rounded-2xl mb-8 border border-slate-800">
                                {['SUNO AI', 'PRODUCER AI'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPlatform(p as Platform)}
                                        className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                            platform === p 
                                            ? (p === 'SUNO AI' ? 'bg-cyan-600 text-white shadow-lg' : 'bg-fuchsia-600 text-white shadow-lg')
                                            : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            {/* Menu de Modo */}
                            <div className="flex gap-6 mb-8 border-b border-slate-800/50">
                                {['lyrics', 'upload'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m as Mode)}
                                        className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                                            mode === m ? 'text-white' : 'text-slate-500 hover:text-slate-400'
                                        }`}
                                    >
                                        {m === 'lyrics' ? 'Studio Mode' : 'Audio Input'}
                                        {mode === m && <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full"></div>}
                                    </button>
                                ))}
                            </div>

                            {mode === 'lyrics' ? (
                                <form onSubmit={handleGenerate} className="space-y-5">
                                    <TextInput 
                                        id="songTitle" 
                                        label="Track Title" 
                                        value={lyricsForm.songTitle} 
                                        onChange={(e) => setLyricsForm({...lyricsForm, songTitle: e.target.value})}
                                        placeholder="Título da música"
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <SelectInput 
                                            id="musicGenre" 
                                            label="Genre" 
                                            value={lyricsForm.musicGenre} 
                                            onChange={(e) => setLyricsForm({...lyricsForm, musicGenre: e.target.value})} 
                                            options={genres} 
                                        />
                                        <SelectInput 
                                            id="vocalist" 
                                            label="Vocal" 
                                            value={lyricsForm.vocalist} 
                                            onChange={(e) => setLyricsForm({...lyricsForm, vocalist: e.target.value})} 
                                            options={vocalists} 
                                        />
                                    </div>
                                    <TextAreaInput 
                                        id="baseLyrics" 
                                        label="Briefing / Story" 
                                        value={lyricsForm.baseLyrics} 
                                        onChange={(e) => setLyricsForm({...lyricsForm, baseLyrics: e.target.value})}
                                        placeholder="Descreva o sentimento ou história..."
                                    />
                                    <div className="pt-4">
                                        <Button 
                                            isLoading={isLoading} 
                                            text="START PRODUCTION" 
                                            loadingText="SYNCING NEURAL LINK..." 
                                            onClick={handleGenerate}
                                            platform={platform}
                                        />
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <UploadInput onFileChange={setSelectedFile} isLoading={isLoading} file={selectedFile} />
                                    <Button 
                                        isLoading={isLoading} 
                                        text="ANALYZE SIGNAL" 
                                        loadingText="DECODING..." 
                                        onClick={handleUpload}
                                        disabled={!selectedFile}
                                        platform={platform}
                                    />
                                </div>
                            )}
                            
                            {error && (
                                <div className="mt-6 p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-[11px] font-bold uppercase text-center">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ÁREA DE RESULTADOS */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="min-h-[500px] flex flex-col">
                             <GeneratedLyrics 
                                lyrics={generatedContent} 
                                isLoading={isLoading} 
                                title={generatedTitle || "SIGNAL STANDBY"} 
                            />
                        </div>
                        
                        {(isLoading || generatedContent) && (
                            <StyleSuggestions 
                                suggestions={styleSuggestions} 
                                isLoading={isLoading} 
                                platform={platform}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
