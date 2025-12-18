/**
 * Converte um objeto File para uma string Base64.
 * @param file O arquivo a ser convertido.
 * @returns Uma Promise que resolve com a string Base64 (sem o prefixo de data URI).
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove o prefixo "data:*/*;base64," para enviar apenas os dados puros
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
};
