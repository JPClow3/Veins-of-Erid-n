# TTS Migration Guide: Gemini to Speechify

## Overview

This guide documents the migration from Google's Gemini TTS API to Speechify's TTS API in the Veins of Eridûn project. The migration maintains full backward compatibility while providing enhanced features and reliability.

## What Changed

### Before (Gemini TTS)
- **Provider**: Google Gemini 2.5 Flash Preview TTS
- **Voice**: Charon (prebuilt voice)
- **Format**: WAV PCM data
- **Response**: Audio data in `inlineData.data` field
- **Usage**: Narrative text with prompt wrapper

### After (Speechify TTS)
- **Provider**: Speechify API with fallback to Gemini
- **Voice**: Scott (default) with voice selection capability
- **Format**: WAV, MP3, OGG, AAC support
- **Response**: Standardized response with billing information
- **Usage**: Direct text input with enhanced options

## New Features

### 1. Multi-Provider Support
- **Primary**: Speechify API
- **Fallback**: Gemini TTS (automatic)
- **Configuration**: Environment-based provider selection

### 2. Enhanced Voice Options
- Multiple voice selection
- Language-specific models
- Gender and locale information

### 3. Audio Format Flexibility
- WAV (default, backward compatible)
- MP3 (compressed)
- OGG (open format)
- AAC (high quality)

### 4. Billing Information
- Character count tracking
- Usage monitoring
- Cost optimization

## Migration Steps

### Step 1: Environment Setup

1. **Get Speechify API Key**
   ```bash
   # Visit https://console.sws.speechify.com/signup
   # Create account and get API key
   ```

2. **Add Environment Variable**
   ```bash
   # Add to your .env file
   SPEECHIFY_API_KEY=your_speechify_api_key_here
   ```

3. **Update Vite Configuration**
   ```typescript
   // vite.config.ts (already updated)
   define: {
     'process.env.SPEECHIFY_API_KEY': JSON.stringify(env.SPEECHIFY_API_KEY)
   }
   ```

### Step 2: Code Changes

The migration is **automatic** and **backward compatible**. No code changes are required in existing components.

**Before:**
```typescript
import { generateSpeechAudio } from '../features/game/gameService';
const audio = await generateSpeechAudio('Hello world');
```

**After:**
```typescript
import { generateSpeechAudio } from '../utils/ttsService';
const audio = await generateSpeechAudio('Hello world');
// Same interface, enhanced functionality
```

### Step 3: Testing

Run the migration tests:
```bash
# Run simple tests
node -r ts-node/register src/utils/__tests__/ttsMigration.simple.test.ts

# Or run with your preferred test runner
npm test
```

## Configuration Options

### Environment Variables
```bash
SPEECHIFY_API_KEY=your_key_here  # Required for Speechify
```

### Runtime Configuration
```typescript
import { getTTSConfig } from './utils/config';

const config = getTTSConfig();
console.log(config.useSpeechify); // true if API key available
console.log(config.fallbackToGemini); // true (default)
```

### Provider Selection
```typescript
import { ttsService } from './utils/ttsService';

// Check current provider
console.log(ttsService.getProviderName()); // 'speechify' or 'gemini'

// Switch providers (for testing)
await ttsService.switchToProvider('speechify');
await ttsService.switchToProvider('gemini');
```

## Advanced Usage

### Custom Voice Selection
```typescript
import { SpeechifyTTSProvider } from './utils/speechifyClient';

const provider = new SpeechifyTTSProvider(apiKey);
const voices = await provider.getVoices();
console.log(voices); // List of available voices

const audio = await provider.synthesizeSpeech('Hello', {
  voice: 'sarah',
  format: 'mp3',
  language: 'en'
});
```

### Speech Marks (Timing Information)
```typescript
const response = await provider.synthesizeSpeech('Hello world');
console.log(response.speechMarks); // Word-level timing
console.log(response.billableCharactersCount); // Character count
```

### Multiple Audio Formats
```typescript
const wavAudio = await provider.synthesizeSpeech('Text', { format: 'wav' });
const mp3Audio = await provider.synthesizeSpeech('Text', { format: 'mp3' });
const oggAudio = await provider.synthesizeSpeech('Text', { format: 'ogg' });
```

## Error Handling

### Automatic Fallback
```typescript
// If Speechify fails, automatically falls back to Gemini
try {
  const audio = await generateSpeechAudio('Text');
} catch (error) {
  // Handles both provider failures
  console.error('TTS failed:', error);
}
```

### Manual Error Handling
```typescript
import { ttsService } from './utils/ttsService';

if (!ttsService.isAvailable()) {
  console.error('No TTS provider available');
}

try {
  const audio = await ttsService.generateSpeechAudio('Text');
} catch (error) {
  if (error.message.includes('Speechify')) {
    // Speechify-specific error
  } else if (error.message.includes('Gemini')) {
    // Gemini-specific error
  }
}
```

## Performance Considerations

### Caching
- Audio responses are cached by the browser
- Blob URLs are managed automatically
- Memory cleanup on audio completion

### Rate Limiting
- Speechify: Check API documentation for limits
- Gemini: Existing limits apply
- Automatic retry with exponential backoff

### Audio Quality
- **Speechify**: High-quality, natural-sounding voices
- **Gemini**: Good quality, consistent with previous experience
- **Format**: WAV for best quality, MP3 for smaller size

## Troubleshooting

### Common Issues

1. **"Speechify API key not found"**
   ```bash
   # Check environment variable
   echo $SPEECHIFY_API_KEY
   
   # Verify in .env file
   cat .env | grep SPEECHIFY
   ```

2. **"No TTS provider available"**
   ```typescript
   // Check configuration
   const config = getTTSConfig();
   console.log(config);
   
   // Verify API key
   console.log(!!config.speechifyApiKey);
   ```

3. **Audio playback issues**
   ```typescript
   // Check audio format compatibility
   const audio = await generateSpeechAudio('Test');
   console.log(audio.length); // Should be > 0
   ```

### Debug Mode
```typescript
import logger from './utils/logger';

// Enable debug logging
logger.setLevel('debug');
```

## Testing Checklist

- [ ] Environment variable set correctly
- [ ] Speechify API key valid
- [ ] Fallback to Gemini works
- [ ] Audio playback functional
- [ ] Voice selection working
- [ ] Error handling robust
- [ ] Performance acceptable
- [ ] Memory usage stable

## Rollback Plan

If issues arise, you can easily rollback:

1. **Remove Speechify API key**
   ```bash
   # Remove from .env file
   # SPEECHIFY_API_KEY=your_key_here
   ```

2. **Revert import**
   ```typescript
   // Change back to original import
   import { generateSpeechAudio } from '../features/game/gameService';
   ```

3. **Verify Gemini still works**
   ```typescript
   const audio = await generateSpeechAudio('Test');
   ```

## Support

- **Speechify API Documentation**: Check `@speechify/api` package docs
- **API Key Management**: https://console.sws.speechify.com/signup
- **Community Support**: Check Speechify's official channels
- **Project Issues**: Use the project's issue tracker

## Migration Status

- [x] Speechify client implementation
- [x] Unified TTS service
- [x] Backward compatibility layer
- [x] Configuration management
- [x] Error handling and fallback
- [x] Test suite
- [x] Documentation
- [ ] Production deployment
- [ ] Performance monitoring
- [ ] User feedback collection

## Next Steps

1. **Deploy to staging environment**
2. **Run comprehensive tests**
3. **Monitor performance and errors**
4. **Collect user feedback**
5. **Optimize based on usage patterns**
6. **Consider additional voice options**
7. **Implement advanced features (speech marks, etc.)** 