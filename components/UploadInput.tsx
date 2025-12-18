import React, { useState, useCallback } from 'react';

interface UploadInputProps {
    onFileChange: (file: File) => void;
    isLoading: boolean;
    file: File | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

export const UploadInput: React.FC<UploadInputProps> = ({ onFileChange, isLoading, file }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            onFileChange(files[0]);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(!isLoading) setIsDragging(true);
    }, [isLoading]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
         if(!isLoading) setIsDragging(true);
    }, [isLoading]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (isLoading) return;
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files);
            // Redefinir o valor do input para permitir o re-upload do mesmo arquivo
            const input = document.getElementById('audio-upload') as HTMLInputElement;
            if (input) input.value = '';
        }
    }, [isLoading, onFileChange]);


    return (
        <div className="text-center">
            <label
                htmlFor="audio-upload"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors duration-300 ${
                    isLoading 
                        ? 'border-gray-600 bg-gray-900/50 cursor-not-allowed' 
                        : isDragging
                            ? 'border-cyan-500 bg-cyan-900/20'
                            : 'border-gray-600 hover:border-cyan-500 cursor-pointer bg-gray-900/50'
                }`}
            >
                <UploadIcon />
                <span className="mt-2 block text-sm font-semibold text-gray-300">
                    {isLoading 
                        ? 'Processando áudio...' 
                        : file 
                            ? `Arquivo selecionado: ${file.name}`
                            : 'Arraste e solte um arquivo de áudio ou clique para selecionar'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                     {file
                        ? 'Clique na área ou arraste outro arquivo para alterar.'
                        : 'Formatos suportados: MP3, WAV, FLAC, M4A, etc.'}
                </p>
                <input
                    id="audio-upload"
                    name="audio-upload"
                    type="file"
                    className="sr-only"
                    accept="audio/*"
                    onChange={(e) => {
                        handleFileSelect(e.target.files);
                        e.target.value = ''; // Permite re-upload do mesmo arquivo
                    }}
                    disabled={isLoading}
                />
            </label>
        </div>
    );
};