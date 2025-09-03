// Configuration utility for managing environment variables and API keys

export interface TTSConfig {
  speechifyApiKey?: string;
  useSpeechify: boolean;
  fallbackToGemini: boolean;
}

// Get configuration from environment variables
export function getTTSConfig(): TTSConfig {
  const speechifyApiKey = process.env.SPEECHIFY_API_KEY;
  
  return {
    speechifyApiKey,
    useSpeechify: !!speechifyApiKey,
    fallbackToGemini: true // Allow fallback to Gemini if Speechify fails
  };
}

// Validate TTS configuration
export function validateTTSConfig(config: TTSConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.useSpeechify && !config.speechifyApiKey) {
    errors.push('Speechify API key is required when useSpeechify is enabled');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Get the appropriate TTS provider based on configuration
export function getTTSProviderType(): 'speechify' | 'gemini' | 'none' {
  const config = getTTSConfig();
  
  if (config.useSpeechify && config.speechifyApiKey) {
    return 'speechify';
  }
  
  // For now, always fall back to Gemini if Speechify is not configured
  return 'gemini';
} 