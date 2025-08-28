import { blobManager } from './blobManager';

// A helper function to convert a base64 string into a more memory-efficient blob URL.
export const base64ToBlobUrl = (base64: string, mimeType: string): string => {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        return blobManager.create(blob);
    } catch (e) {
        console.error("Failed to convert base64 to blob URL", e);
        // Fallback to data URI if conversion fails
        return `data:${mimeType};base64,${base64}`;
    }
};
