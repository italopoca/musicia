
import { GoogleGenAI, Type } from "@google/genai";
import type { GenerateLyricsParams, GenerateJingleParams, GenerationResult, StyleSuggestionResult, Platform, Mode, AudioAnalysis } from '../types';
import { CUSTOM_GENRE_OPTION } from '../constants/musicData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
const model = 'gemini-3-flash-preview';

const buildSunoLyricsPrompt = (params: GenerateLyricsParams): string => {
    const isCustomGenre = params.musicGenre === CUSTOM_GENRE_OPTION && params.customGenre;
    const genre = isCustomGenre ? params.customGenre : params.musicGenre;

    return `Você é um "Ghostwriter" de hits globais especializado em SUNO AI. 
    
    REGRA CRÍTICA DE OURO:
    - NUNCA escreva descrições entre parênteses como "(batida inicia)" ou "(instrumental)". O Suno AI canta essas partes por erro.
    - Se precisar descrever o som, coloque o detalhe DENTRO do colchete da tag. Exemplo Correto: [Intro: Funk consciente, grave seco].
    - O texto fora de colchetes deve ser APENAS a letra que deve ser cantada.
    
    DIRETRIZES DE COMPOSIÇÃO:
    - Rimas: Use rimas internas e assonâncias ricas.
    - Estrutura: Use métricas que encaixem em frases musicais reais.
    
    DADOS:
    - Gênero: ${genre}
    - Vocal: ${params.vocalist}
    - Título: ${params.songTitle}
    - Inspiração: ${params.baseLyrics || "Crie algo original sobre o título"}
    
    FORMATAÇÃO OBRIGATÓRIA (Use apenas estas tags):
    [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Guitar Solo], [Outro], [End].
    NÃO ADICIONE NADA ALÉM DA LETRA E DAS TAGS EM COLCHETES.`;
};

const buildProducerAiLyricsPrompt = (params: GenerateLyricsParams): string => {
    const isCustomGenre = params.musicGenre === CUSTOM_GENRE_OPTION && params.customGenre;
    const genre = isCustomGenre ? params.customGenre : params.musicGenre;

    return `Você é um Produtor Musical nível Grammy criando um roteiro para PRODUCER AI.
    
    REGRAS DE SEGURANÇA:
    - NÃO inclua direções de cena entre parênteses no meio da letra.
    - Use apenas tags em colchetes para mudar o estado do áudio.
    
    DADOS:
    - Título: ${params.songTitle} | Gênero: ${genre}
    - Vocal: ${params.vocalist}
    
    ESTRUTURA PRODUCER AI:
    Use [Vocal Style: Sussurrado], [Energy: High], [Beat Drop] para comandos.
    A letra deve ser limpa e direta.`;
};

const buildStyleSuggestionPrompt = (lyrics: string, platform: Platform): string => {
    if (platform === 'SUNO AI') {
        return `Baseado na letra abaixo, gere exatamente 10 TAGS DE ESTILO separadas por vírgula para SUNO AI.
        Inclua: Gênero específico, Instrumentação, Mood, Década, Estilo Vocal.
        Letra: "${lyrics}"`;
    }
    return `Baseado na letra abaixo, escreva um PROMPT DE DIREÇÃO MUSICAL curto (máximo 300 caracteres) para PRODUCER AI.
    Descreva a atmosfera e mixagem.
    Letra: "${lyrics}"`;
};

export const generateContent = async (params: GenerateLyricsParams | GenerateJingleParams, mode: Mode): Promise<GenerationResult> => {
    let prompt: string;
    if (mode === 'lyrics') {
        prompt = params.platform === 'PRODUCER AI' ? buildProducerAiLyricsPrompt(params as GenerateLyricsParams) : buildSunoLyricsPrompt(params as GenerateLyricsParams);
    } else {
        const jParams = params as GenerateJingleParams;
        prompt = `Crie um JINGLE COMERCIAL PROFISSIONAL para ${jParams.productName}. Público: ${jParams.targetAudience}. Vibe: ${jParams.jingleVibe}. NÃO inclua instruções de áudio entre parênteses.`;
    }
    
    try {
        const response = await ai.models.generateContent({ 
            model, 
            contents: prompt,
            config: { 
                temperature: 0.8, // Temperatura levemente reduzida para maior precisão estrutural
                topP: 0.9 
            }
        });
        return {
            lyrics: response.text || "",
            title: mode === 'lyrics' ? (params as GenerateLyricsParams).songTitle : (params as GenerateJingleParams).productName,
        };
    } catch (error) {
        throw new Error("Erro na rede neural. Tente novamente.");
    }
};

export const getStyleSuggestions = async (lyrics: string, platform: Platform): Promise<StyleSuggestionResult> => {
    const prompt = buildStyleSuggestionPrompt(lyrics, platform);
    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        const text = response.text?.trim() || "";
        return { styleSuggestions: platform === 'SUNO AI' ? text.split(',').map(s => s.trim()) : [text] };
    } catch {
        return { styleSuggestions: [] };
    }
};

export const analyzeAudio = async (audioBase64: string, mimeType: string): Promise<AudioAnalysis> => {
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ inlineData: { mimeType, data: audioBase64 } }, { text: "Analise este áudio. Retorne JSON: {lyrics, musicalKey, bpm, instruments, vocalStyle, mood}." }] },
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
};

export const formatLyricsFromText = async (lyrics: string, platform: Platform): Promise<Omit<GenerationResult, 'title'>> => {
    const prompt = `Formate esta letra para ${platform}, garantindo que NENHUMA instrução musical esteja entre parênteses para não ser cantada: "${lyrics}"`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    return { lyrics: response.text || "" };
};

export const getStyleSuggestionsFromAnalysis = async (analysis: AudioAnalysis, platform: Platform): Promise<StyleSuggestionResult> => {
    const prompt = `Gere sugestões de estilo para ${platform} baseadas nesta análise: ${JSON.stringify(analysis)}`;
    const response = await ai.models.generateContent({ model, contents: prompt });
    const text = response.text?.trim() || "";
    return { styleSuggestions: platform === 'SUNO AI' ? text.split(',').map(s => s.trim()) : [text] };
};
