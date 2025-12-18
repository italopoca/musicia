/**
 * Substitui palavras em um texto por equivalentes fonéticos para evitar
 * problemas com filtros de conteúdo ou síntese de voz de IA.
 * A função preserva a capitalização da palavra original.
 * @param text O texto de entrada a ser processado.
 * @returns O texto com as palavras substituídas.
 */
export const phoneticizeText = (text: string): string => {
    // O mapa de substituição. Palavras mais longas devem vir primeiro
    // para evitar substituições parciais (ex: 'fucking' antes de 'fuck').
    const phoneticMap: { [key: string]: string } = {
        'fucking': 'phucking',
        'fuck': 'phuck',
        'asshole': 'azzhole',
        'shit': 'shyt',
        'bitch': 'bytch',
        'damn': 'damm',
        'ass': 'azz',
    };

    let processedText = text;

    for (const original in phoneticMap) {
        const replacement = phoneticMap[original];
        // Regex para encontrar a palavra inteira (\b), de forma global (g) e insensível a maiúsculas (i).
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        
        processedText = processedText.replace(regex, (match) => {
            // Preserva a capitalização da palavra original na substituição.
            if (match === match.toUpperCase()) {
                // Se a original era toda em maiúsculas (FUCK)
                return replacement.toUpperCase();
            }
            if (match.charAt(0) === match.charAt(0).toUpperCase()) {
                // Se a original tinha a primeira letra maiúscula (Fuck)
                return replacement.charAt(0).toUpperCase() + replacement.slice(1);
            }
            // Se a original era toda minúscula (fuck)
            return replacement;
        });
    }

    return processedText;
};
