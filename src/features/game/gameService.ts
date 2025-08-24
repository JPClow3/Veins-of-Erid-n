import { Type } from "@google/genai";
import { systemInstruction } from '../../lore/systemInstruction';
import logger from '../../utils/logger';
import type { CharacterProfile } from '../../types/character';
import type { GeminiSceneResponse, CreationStep, GeminiCreationResponse, Journal, FactionReputation, DramatisPersonae } from '../../types/game';
import { AFFINITIES, GENDERS, BACKGROUNDS, PERSONALITY_LEANS, VISUAL_MARKS, STORY_MODEL, IMAGE_MODEL, TTS_MODEL } from "../../constants/gameConstants";
import { getRandomAffinities } from "../character/characterUtils";
import { ai } from "../../utils/geminiClient";


const creationSystemInstruction = `You are a dream-like narrator guiding a player as they awaken and remember who they are. Your tone is mysterious, evocative, and personal. You will ask a single question at a time to build their character. Respond in JSON. Do not info-dump. Let the world be discovered. When asking for background, present them as fragmented memories or feelings, not job titles. The final step is the MARK; after the user chooses it, your description should be a concluding sentence about their identity solidifying before the true awakening.`;

const creationResponseSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A short, evocative, second-person description of a memory or feeling surfacing." },
        choices: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The choices for the player to define this aspect of themselves. Should be 2-4 options, unless it is the 'NAME' step." },
    },
    required: ["description", "choices"]
};


const storyResponseSchema = {
    type: Type.OBJECT,
    properties: {
        imagePrompt: {
            type: Type.STRING,
            description: "A concise, descriptive prompt for an AI image generator. Crucially, include a brief description of the player character based on their profile (gender, visual mark) in the scene. Example: 'A [gender] with glowing Flow Veins on their [visualMark] stands in a rain-slicked alley...'"
        },
        choices: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The text of the choice." },
                    lean: { type: Type.STRING, description: "The personality lean this choice aligns with (Empathy, Cunning, Resolve, Lore), or 'Neutral' if none apply." }
                },
                required: ["text", "lean"]
            },
            description: "4 distinct, interesting, action-oriented choices. Each choice must have a 'lean' property."
        },
        gameOver: {
            type: Type.BOOLEAN,
            description: "Set to true only if the story reaches a definitive conclusion."
        },
        endingDescription: {
            type: Type.STRING,
            description: "If gameOver is true, a concluding paragraph. Otherwise, an empty string."
        },
        journalUpdate: {
            type: Type.OBJECT,
            description: "An optional update to the player's journal. Create new threads for major plot points or add entries to existing ones. The entry should be from the character's first-person perspective.",
            properties: {
                thread: { type: Type.STRING, description: "The title of the journal thread (e.g., 'An Unwelcome Awakening', 'Reputation & Factions')." },
                entry: { type: Type.STRING, description: "The new journal entry text." },
                status: { type: Type.STRING, description: "The status of the thread: 'new', 'updated', or 'completed'." },
            },
        },
        allowCustomAction: {
            type: Type.BOOLEAN,
            description: "Set to true if a custom text action is appropriate for this scene. Set to false for critical moments where only the provided choices are valid."
        },
        locationUpdate: {
            type: Type.OBJECT,
            description: "An optional update for a new major location discovered by the player.",
            properties: {
                name: { type: Type.STRING, description: "The name of the location." },
                description: { type: Type.STRING, description: "A brief, evocative description of the location for a world log." },
            },
        },
        actTransition: {
            type: Type.OBJECT,
            description: "OPTIONAL. If the story has reached a major turning point that progresses it to the next narrative act, include this object. Otherwise, omit it.",
            properties: {
                newAct: { type: Type.INTEGER, description: "The number of the new act the story is entering." },
                reason: { type: Type.STRING, description: "A brief, in-world summary of why the act is changing, suitable for a journal entry (e.g., 'I have uncovered the conspiracy and can no longer remain neutral. The time for observation is over.')." },
            },
        },
        reputationUpdate: {
            type: Type.OBJECT,
            description: "OPTIONAL. If the player's action directly affects their standing with a major faction, include this. The change should be a small integer.",
            properties: {
                faction: { type: Type.STRING, description: "The name of the faction whose reputation is changing." },
                change: { type: Type.INTEGER, description: "The amount to change the reputation by (e.g., 1, -1, 2)." },
                reason: { type: Type.STRING, description: "A brief, in-world summary of why the reputation changed." },
            },
        },
        npcUpdate: {
            type: Type.OBJECT,
            description: "OPTIONAL. When a new significant NPC is introduced OR the player's understanding of an existing one changes, include this object.",
            properties: {
                name: { type: Type.STRING, description: "The full name of the NPC." },
                description: { type: Type.STRING, description: "A brief description of the NPC from the player character's perspective." },
                faction: { type: Type.STRING, description: "The NPC's primary faction allegiance." },
                status: { type: Type.STRING, description: "Set to 'new' for a first-time encounter, or 'updated' if the PC's perception of them changes." },
            },
        },
        itemUpdate: {
            type: Type.OBJECT,
            description: "OPTIONAL. If the player acquires or loses an item, include this object. Items can be used to unlock future narrative choices.",
            properties: {
                action: { type: Type.STRING, description: "Set to 'add' or 'remove'." },
                itemName: { type: Type.STRING, description: "The name of the item." },
                description: { type: Type.STRING, description: "A brief, evocative description for the inventory." },
                category: { type: Type.STRING, description: "The item's category: 'Key Item', 'Consumable', or 'Document'." },
            },
        },
        soundEffect: {
            type: Type.STRING,
            description: "OPTIONAL. The name of a ONE-SHOT sound effect to play from this list: ['sword_clash', 'magic_chime']. Omit if no sound is needed.",
        },
        ambientTrack: {
            type: Type.STRING,
            description: "OPTIONAL. The name of a looping ambient track to set the mood. Use one from this list: ['rainstorm', 'distant_city', 'forest_ambience', 'tense_drone', 'royal_court']. Omit to keep the current track."
        }
    },
    required: ["imagePrompt", "choices", "gameOver", "endingDescription", "allowCustomAction"]
};

export async function getCreationNarrative(step: CreationStep, characterSoFar: Partial<Omit<CharacterProfile, 'dormantAffinity' | 'personality'>>): Promise<GeminiCreationResponse> {
    let prompt = '';
    let choices: string[] = [];

    switch (step) {
        case 'GENDER':
            prompt = "The player is a formless consciousness beginning to coalesce. Start the story. Describe this feeling and ask them to define their gender by choosing from the provided options. Present these as internal identities, not just labels.";
            choices = [...GENDERS];
            break;
        case 'BACKGROUND':
            prompt = `The player has chosen their gender: ${characterSoFar.gender}. Now, a memory of their past life surfaces. Describe this fragmented memory and ask them to choose their origin from the options provided. Frame them as lifestyles or upbringings.`;
            choices = Object.keys(BACKGROUNDS);
            break;
        case 'NAME':
            prompt = `The player's identity is taking shape. They are a ${characterSoFar.gender} from a background as a ${characterSoFar.background}. Now, a name whispers on the edge of their memory. Describe this feeling and ask them to state their name. The choices array MUST contain only a single special string: 'PROMPT_FOR_NAME'.`;
            choices = ['PROMPT_FOR_NAME'];
            break;
        case 'AFFINITY':
            prompt = `The player's name is ${characterSoFar.name}. A new sensation awakens—a power stirring within. Describe the feeling of this latent magic and offer them a choice between two affinities. These are the powers they are just now discovering.`;
            choices = getRandomAffinities();
            break;
        case 'PERSONALITY':
            prompt = `The player, ${characterSoFar.name}, has accepted their power as a user of ${characterSoFar.awakenedAffinity}. Now, a core aspect of their personality comes into focus. Present a brief, tense scenario (like being cornered by guards) and ask how they would instinctively react, offering choices that correspond to the personality leans. This choice will give them an initial bonus in that personality trait.`;
            choices = Object.keys(PERSONALITY_LEANS);
            break;
        case 'MARK':
            prompt = `The player's initial personality is defined by ${characterSoFar.initialPersonalityLean}. The final piece of their identity falls into place: the physical manifestation of their power. Describe the sensation of the glowing Flow Veins appearing on their skin and ask them where this mark is most prominent.`;
            choices = Object.keys(VISUAL_MARKS);
            break;
    }

    const fullPrompt = `${prompt}\n\nChoices to offer: [${choices.join(', ')}]`;

    logger.info('Calling generateContent for creation narrative', { model: STORY_MODEL, step });
    const response = await ai.models.generateContent({
        model: STORY_MODEL,
        contents: fullPrompt,
        config: {
            systemInstruction: creationSystemInstruction,
            responseMimeType: "application/json",
            responseSchema: creationResponseSchema,
        }
    });

    const responseText = response.text;
    try {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        if (!jsonMatch) { throw new Error("Malformed API response: No JSON block found."); }
        const jsonString = jsonMatch[1] ?? jsonMatch[2];
        const parsed = JSON.parse(jsonString) as GeminiCreationResponse;
        // Override AI-generated choices with the canonical ones to ensure game logic consistency.
        parsed.choices = choices; 
        return parsed;
    } catch (e) {
        logger.error('Failed to parse creation JSON', { rawResponse: responseText, error: e });
        throw new Error("The AI's response was malformed. Please try again.");
    }
}


export async function* getNextSceneStreamed(
    character: CharacterProfile, 
    history: string, 
    playerAction: string, 
    journal: Journal, 
    act: number, 
    reputation: FactionReputation, 
    dramatisPersonae: DramatisPersonae,
    worldBibleCacheName: string | null
): AsyncGenerator<string, Omit<GeminiSceneResponse, 'description'>, void> {
    const prompt = `
    **PLAYER CHARACTER PROFILE:**
    - Name: ${character.name}
    - Gender: ${character.gender}
    - Background: ${character.background}
    - Awakened Flow Affinity: ${character.awakenedAffinity} (Rarity: ${AFFINITIES[character.awakenedAffinity].rarity})
    - Dormant Flow Affinity: ${character.dormantAffinity} (Rarity: ${AFFINITIES[character.dormantAffinity].rarity}) - NOTE: The player character is NOT yet aware of this second affinity. It should manifest later in the story based on their choices. Do not offer choices related to it yet, but you can subtly hint at its presence.
    - Personality Scores: ${JSON.stringify(character.personality)} - These scores evolve. Use the highest scores to determine their dominant traits and tailor NPC reactions.
    - Visual Mark: Mark on ${character.visualMark}

    **CURRENT NARRATIVE ACT:**
    Act ${act}. Your narrative focus MUST align with the goals of this act as defined in your system instructions.

    **CURRENT GAME STATE:**
    - Journal: ${JSON.stringify(journal, null, 2)}
    - Faction Reputation: ${JSON.stringify(reputation, null, 2)}
    - Known NPCs (Dramatis Personae): ${JSON.stringify(dramatisPersonae, null, 2)}

    **STORY SO FAR:**
    ${history || "The story is just beginning."}
    
    **PLAYER's ACTION:**
    ${playerAction}
    
    **YOUR TASK:**
    Generate the next part of the story. You must follow all instructions and the streaming format precisely.
    `;

    logger.info('Calling generateContentStream', { model: STORY_MODEL, useCache: !!worldBibleCacheName });

    const config: any = {
        temperature: 0.8,
    };

    if (worldBibleCacheName) {
        config.cachedContent = worldBibleCacheName;
    } else {
        logger.warn('No cache name provided. Sending full system instruction.');
        config.systemInstruction = systemInstruction;
    }
    
    const responseStream = await ai.models.generateContentStream({
        model: STORY_MODEL,
        contents: prompt,
        config: config
    });

    let buffer = '';
    const separator = '|||JSON_START|||';
    let descriptionDone = false;
    let descriptionPart = '';

    for await (const chunk of responseStream) {
        if (descriptionDone) {
            buffer += chunk.text;
        } else {
            buffer += chunk.text;
            const separatorIndex = buffer.indexOf(separator);
            if (separatorIndex !== -1) {
                descriptionPart = buffer.substring(0, separatorIndex);
                yield descriptionPart; // Yield the final description part
                buffer = buffer.substring(separatorIndex + separator.length);
                descriptionDone = true;
            }
        }
    }
    
    if (!descriptionDone) {
      // This case handles if the separator is never found. We yield the whole buffer as description.
      // This might happen if the model fails to follow instructions.
      yield buffer;
      buffer = ''; // No JSON part.
    }
    
    try {
        if (!buffer.trim()) {
           throw new Error("No JSON data received after description stream.");
        }
        const jsonMatch = buffer.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
        if (!jsonMatch) {
            logger.error('No JSON block found in the streamed response.', { rawResponse: buffer });
            throw new Error("Malformed API response: No JSON block found after separator.");
        }
        const jsonString = jsonMatch[1] ?? jsonMatch[2];
        const parsedJson = JSON.parse(jsonString) as Omit<GeminiSceneResponse, 'description'>;
        return parsedJson;
    } catch (e) {
        logger.error('Failed to parse scene JSON from stream', { rawResponse: buffer, error: e });
        throw new Error("The AI's response was malformed. Please try again.");
    }
}


export const generateImage = async (prompt: string): Promise<string> => {
    const fullPrompt = `${prompt}, grim-dark fantasy, political intrigue, digital painting, atmospheric, expressive brushstrokes`;
    
    logger.info('Calling generateImages', { model: IMAGE_MODEL, prompt: fullPrompt });
    const response = await ai.models.generateImages({
        model: IMAGE_MODEL,
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/webp',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return base64ImageBytes;
    }

    throw new Error("The magical energies failed to conjure an image.");
};

export const generateSpeechAudio = async (text: string): Promise<string> => {
    // Add a hint for the narrator voice
    const prompt = `Read the following text in a clear, narrative tone: "${text}"`;
    
    logger.info('Calling generateContent for TTS', { model: TTS_MODEL });
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Charon' }, // 'Charon' is informative and clear
               },
            },
      },
   });

   const base64Data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
   if (typeof base64Data === 'string') {
      return base64Data;
   }
   
   throw new Error("No audio data received from TTS model.");
};
