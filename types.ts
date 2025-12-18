export type Platform = 'SUNO AI' | 'PRODUCER AI';
export type Mode = 'lyrics' | 'jingle' | 'upload';

// Parâmetros para o modo "Letra de Música"
export interface GenerateLyricsParams {
  platform: Platform;
  musicGenre: string;
  customGenre?: string;
  songTitle: string;
  baseLyrics: string;
  vocalist: string;
}

// Parâmetros para o modo "Vinheta"
export interface GenerateJingleParams {
  platform: Platform;
  productName: string;
  targetAudience: string;
  keyBenefits: string;
  jingleVibe: string;
}

// Resultado da Geração (unificado)
export interface GenerationResult {
  lyrics: string;
  title: string;
}

// Resultado das Sugestões de Estilo (unificado)
export interface StyleSuggestionResult {
    styleSuggestions: string[];
}

// Resultado da Análise de Áudio Profissional
export interface AudioAnalysis {
    lyrics: string;
    musicalKey: string;
    bpm: number;
    instruments: string[];
    vocalStyle: string;
    mood: string;
    chordProgression?: string;
}