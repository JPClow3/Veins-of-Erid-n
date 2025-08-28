import { Type, FunctionCall } from "@google/genai";
import { systemInstruction } from '../../lore/systemInstruction';
import logger from '../../utils/logger';
import type { CharacterProfile } from "../../types/character";
import type { GeminiSceneResponse, CreationStep, GeminiCreationResponse, Journal, FactionReputation, DramatisPersonae, ItemUpdate, NpcProfile, ReputationUpdate, JournalUpdate, LocationUpdate, CharacterStatsUpdate } from "../../types/game";
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

// --- Function Calling Tool Definitions ---

const gameplayTools = {
    functionDeclarations: [
        {
            name: 'presentScene',
            description: 'Presents the main scene details to the player. MUST be called once as the final step of your response.',
            parameters: {
                type: Type.OBJECT,
                properties: {
                    imagePrompt: {
                        type: Type.STRING,
                        description: "A concise, descriptive prompt for an AI image generator. The prompt should reflect the current scene and incorporate relevant details about the player character's appearance from their profile."
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
                    gameOver: { type: Type.BOOLEAN, description: "Set to true only if the story reaches a definitive conclusion." },
                    endingDescription: { type: Type.STRING, description: "If gameOver is true, a concluding paragraph. Otherwise, an empty string." },
                    allowCustomAction: { type: Type.BOOLEAN, description: "Set to true if a custom text action is appropriate for this scene. Set to false for critical moments where only the provided choices are valid." },
                    allowExamineAction: { type: Type.BOOLEAN, description: "Set to true if the scene contains hidden details or points of interest that the player can investigate further with an 'Examine' action." }
                },
                required: ["imagePrompt", "choices", "gameOver", "endingDescription", "allowCustomAction", "allowExamineAction"]
            }
        },
        {
            name: 'updateJournal',
            description: "Updates the player's journal. Create new threads for major plot points or add entries to existing ones.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    thread: { type: Type.STRING, description: "The title of the journal thread (e.g., 'An Unwelcome Awakening', 'Reputation & Factions')." },
                    entry: { type: Type.STRING, description: "The new journal entry text, written from the character's first-person perspective." },
                    status: { type: Type.STRING, description: "The status of the thread: 'new', 'updated', or 'completed'." },
                },
                required: ["thread", "entry", "status"]
            }
        },
        {
            name: 'updateLocation',
            description: "Updates the world log with a new major location discovered by the player. Use the conceptual map provided in your instructions to place it.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the location." },
                    description: { type: Type.STRING, description: "A brief, evocative description of the location for a world log." },
                    x: { type: Type.NUMBER, description: "The location's horizontal position on the map, as a percentage from 0 (west) to 100 (east)." },
                    y: { type: Type.NUMBER, description: "The location's vertical position on the map, as a percentage from 0 (north) to 100 (south)." },
                },
                required: ["name", "description", "x", "y"]
            }
        },
        {
            name: 'transitionToNewAct',
            description: "Signals that the story has reached a major turning point and should progress to the next narrative act.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    newAct: { type: Type.INTEGER, description: "The number of the new act the story is entering." },
                    reason: { type: Type.STRING, description: "A brief, in-world summary of why the act is changing, suitable for a journal entry (e.g., 'I have uncovered the conspiracy and can no longer remain neutral.')." },
                },
                required: ["newAct", "reason"]
            }
        },
        {
            name: 'updateReputation',
            description: "Updates the player's standing with a major faction based on their actions.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    faction: { type: Type.STRING, description: "The name of the faction whose reputation is changing." },
                    change: { type: Type.INTEGER, description: "The amount to change the reputation by (e.g., 1, -1, 2)." },
                    reason: { type: Type.STRING, description: "A brief, in-world summary of why the reputation changed." },
                },
                required: ["faction", "change", "reason"]
            }
        },
        {
            name: 'updateNpc',
            description: "Introduces a new significant NPC or updates the player's understanding of an existing one.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The full name of the NPC." },
                    description: { type: Type.STRING, description: "A brief description of the NPC from the player character's perspective." },
                    faction: { type: Type.STRING, description: "The NPC's primary faction allegiance." },
                    role: { type: Type.STRING, description: "The NPC's title or role (e.g., 'Guild Artisan', 'Thalrek Captain')." },
                    disposition: { type: Type.STRING, description: "The NPC's initial disposition towards the player (e.g., 'Wary', 'Hostile', 'Intrigued', 'Friendly')." },
                    motivation: { type: Type.STRING, description: "The NPC's primary, underlying motivation, which may not be immediately obvious." },
                    status: { type: Type.STRING, description: "Set to 'new' for a first-time encounter, or 'updated' if the PC's perception of them changes." },
                },
                required: ["name", "description", "faction", "role", "disposition", "motivation", "status"]
            }
        },
        {
            name: 'updateItem',
            description: "Adds or removes an item from the player's inventory.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    action: { type: Type.STRING, description: "Set to 'add' or 'remove'." },
                    itemName: { type: Type.STRING, description: "The name of the item." },
                    description: { type: Type.STRING, description: "A brief, evocative description for the inventory." },
                    category: { type: Type.STRING, description: "The item's category: 'Key Item', 'Consumable', or 'Document'." },
                },
                required: ["action", "itemName", "description", "category"]
            }
        },
        {
            name: 'playSoundEffect',
            description: "Plays a one-shot sound effect to enhance an impactful moment.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    soundEffect: { type: Type.STRING, description: "The name of a sound effect from this list: ['sword_clash', 'magic_chime']." },
                },
                required: ["soundEffect"]
            }
        },
        {
            name: 'setAmbientTrack',
            description: "Sets the looping ambient audio track to establish the mood for a scene.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    ambientTrack: { type: Type.STRING, description: "The name of a track from this list: ['rainstorm', 'distant_city', 'forest_ambience', 'tense_drone', 'royal_court']." },
                },
                required: ["ambientTrack"]
            }
        },
        {
            name: 'triggerMagicEffect',
            description: "Call this function whenever the player character actively and successfully uses a Flow ability to trigger a visual effect.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    intensity: {
                        type: Type.STRING,
                        description: "The intensity of the magic used. Use 'subtle' for minor acts or 'powerful' for significant weaves."
                    },
                },
                required: ["intensity"]
            }
        },
        {
            name: 'updateCharacterStats',
            description: "Updates the player character's core stats like Vein-Strain or Echo level due to their actions, especially using magic. Use small integer changes.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    veinStrainChange: {
                        type: Type.INTEGER,
                        description: "The amount to change Vein-Strain by (e.g., 2 for a powerful spell, -1 for resting)."
                    },
                    echoLevelChange: {
                        type: Type.INTEGER,
                        description: "The amount to change Echo Level by (e.g., 5 for a loud spell, -2 for time passing quietly)."
                    },
                    reason: { type: Type.STRING, description: "A brief, in-world summary of why the stats changed (e.g., 'Channeled a powerful Emberflow weave.')." },
                },
                required: ["reason"]
            }
        },
        {
            name: 'unlockLore',
            description: "Unlocks a specific piece of lore for the player to view in their Codex, such as a faction, nation, or affinity they have just learned about through interaction or discovery.",
            parameters: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "The type of lore to unlock. Must be one of: 'faction', 'nation', 'affinity'." },
                    key: { type: Type.STRING, description: "The exact name/key of the lore entry to unlock (e.g., 'The Purists', 'Veyra', 'Emberflow'). Use the canonical key from the World Bible." },
                },
                required: ["type", "key"]
            }
        },
    ]
};

// --- Service Functions ---

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
        const parsed = JSON.parse(responseText.trim()) as GeminiCreationResponse;
        // Override AI-generated choices with the canonical ones to ensure game logic consistency.
        parsed.choices = choices; 
        return parsed;
    } catch (e) {
        logger.error('Failed to parse creation JSON', { rawResponse: responseText, error: e });
        throw new Error("The AI's response was malformed. Please try again.");
    }
}

export async function getMemorySnippet(character: CharacterProfile): Promise<string> {
    const prompt = `You are a dream-like narrator. Based on the following character profile, write a single, short, evocative paragraph (3-4 sentences) representing a fragmented memory from their past, related to their background or affinity. Do not add any conversational text, just the memory itself.
    
    Player Profile:
    - Name: ${character.name}
    - Gender: ${character.gender}
    - Background: ${character.background}
    - Awakened Affinity: ${character.awakenedAffinity}`;

    logger.info('Calling generateContent for memory snippet', { model: STORY_MODEL });
    const response = await ai.models.generateContent({
        model: STORY_MODEL,
        contents: prompt,
    });
    return response.text;
}


export async function* getNextSceneStreamed(
    character: CharacterProfile, 
    history: string, 
    playerAction: string, 
    journal: Journal, 
    act: number, 
    reputation: FactionReputation, 
    dramatisPersonae: DramatisPersonae,
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
    - Vein-Strain: ${character.veinStrain}/100
    - Echo Level: ${character.echoLevel}/100

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
    Generate the next part of the story. You must follow all instructions precisely.
    1. First, stream the narrative description as plain text (2-4 sentences).
    2. After the description, call the necessary functions to update the game state.
    3. You MUST end by calling the \`presentScene\` function.
    `;

    logger.info('Calling generateContentStream with function calling', { model: STORY_MODEL });
    
    const responseStream = await ai.models.generateContentStream({
        model: STORY_MODEL,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.8,
            tools: [gameplayTools],
        }
    });

    let cumulativeDescription = '';
    const functionCalls: FunctionCall[] = [];

    for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
            cumulativeDescription += text;
            yield cumulativeDescription;
        }
        const calls = chunk.functionCalls;
        if (calls) {
            functionCalls.push(...calls);
        }
    }
    
    try {
        const sceneData: Partial<GeminiSceneResponse> = {};

        for (const call of functionCalls) {
            switch(call.name) {
                case 'presentScene':
                    Object.assign(sceneData, call.args);
                    break;
                case 'updateJournal':
                    sceneData.journalUpdate = (call.args as unknown) as JournalUpdate;
                    break;
                case 'updateLocation':
                    sceneData.locationUpdate = (call.args as unknown) as LocationUpdate;
                    break;
                case 'transitionToNewAct':
                    sceneData.actTransition = call.args as { newAct: number; reason: string; };
                    break;
                case 'updateReputation':
                    sceneData.reputationUpdate = (call.args as unknown) as ReputationUpdate;
                    break;
                case 'updateNpc':
                    sceneData.npcUpdate = (call.args as unknown) as NpcProfile;
                    break;
                case 'updateItem':
                    sceneData.itemUpdate = (call.args as unknown) as ItemUpdate;
                    break;
                case 'playSoundEffect':
                    sceneData.soundEffect = (call.args as { soundEffect: string }).soundEffect;
                    break;
                case 'setAmbientTrack':
                    sceneData.ambientTrack = (call.args as { ambientTrack: string }).ambientTrack;
                    break;
                case 'triggerMagicEffect':
                    sceneData.magicEffect = (call.args as unknown) as { intensity: 'subtle' | 'powerful' };
                    break;
                case 'updateCharacterStats':
                    sceneData.characterStatsUpdate = (call.args as unknown) as CharacterStatsUpdate;
                    break;
                case 'unlockLore':
                    sceneData.loreUnlock = (call.args as unknown) as { type: 'faction' | 'nation' | 'affinity'; key: string; };
                    break;
                default:
                    logger.warn(`Unknown function call received from model: ${call.name}`);
            }
        }
        
        if (!sceneData.choices || !sceneData.imagePrompt) {
            throw new Error("The 'presentScene' function was not called or was called with incomplete arguments.");
        }

        return sceneData as Omit<GeminiSceneResponse, 'description'>;
    } catch (e) {
        logger.error('Failed to process function calls from stream', { functionCalls, error: e });
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
            outputMimeType: 'image/jpeg',
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

   const candidate = response.candidates?.[0];
   if (!candidate) {
       throw new Error("No candidates received from TTS model.");
   }
   const part = candidate.content?.parts?.[0];
   if (!part) {
       throw new Error("No parts found in the TTS response content.");
   }
   const base64Data = part.inlineData?.data;
   if (typeof base64Data === 'string') {
      return base64Data;
   }
   
   throw new Error("No audio data found in the TTS response part.");
};