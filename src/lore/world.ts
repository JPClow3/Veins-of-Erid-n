import { BACKGROUNDS, VISUAL_MARKS, FACTIONS, NATIONS } from '../constants/gameConstants';

// Helper function to format objects into markdown for the AI prompt
const formatConstantsForAI = (
    constants: Record<string, any>, 
    title: string, 
    formatter: (key: string, value: any) => string
) => {
    let output = `## ${title}\n`;
    for (const [key, value] of Object.entries(constants)) {
        output += formatter(key, value);
    }
    return output;
};

// Formatters for each constant type
const backgroundFormatter = (key: string, value: typeof BACKGROUNDS[keyof typeof BACKGROUNDS]): string => `
### ${key}
- **Description**: ${value.description}
- **Skill Hint**: ${value.skillHint}
- **Initial Faction Lean**: ${value.factionLean}
`;

const visualMarkFormatter = (key: string, value: typeof VISUAL_MARKS[keyof typeof VISUAL_MARKS]): string => `
### Mark on ${key}
- **Description**: ${value.description}
- **Social Consequence**: ${value.socialConsequence}
`;

const factionFormatter = (_key: string, value: typeof FACTIONS[keyof typeof FACTIONS]): string => `
### ${value.name}
- **Symbol**: ${value.symbol}
- **Ideology**: ${value.ideology}
`;

const nationFormatter = (_key: string, value: typeof NATIONS[keyof typeof NATIONS]): string => `
### ${value.name}
${value.description}
`;


// Generate the dynamic sections of the world bible
const playerCreationDetails = `
${formatConstantsForAI(BACKGROUNDS, 'Player Backgrounds', backgroundFormatter)}
${formatConstantsForAI(VISUAL_MARKS, 'Player Visual Marks', visualMarkFormatter)}
`;

const factionsSection = formatConstantsForAI(FACTIONS, 'The Factions of the Flow Schism', factionFormatter);
const nationsSection = formatConstantsForAI(NATIONS, 'Nations & Cultures', nationFormatter);


export const worldBible = `
---
**WORLD BIBLE: VEINS OF ERIDÛN**

This document contains the complete lore, character archetypes, and narrative rules for the world of Eridûn. You MUST adhere to this information to create a coherent, deep, and politically complex story.

---
${playerCreationDetails}
---

## Core Concept: The Physics & Metaphysics of "Flow"

**The System**: Flow is not merely an internal energy; it is the latent ability within a living being to **resonate** with ambient, foundational energies that permeate the world. An "Awakened" is an individual whose body has become a living tuning fork for these energies.

- **Resonance**: The act of "casting" is called **weaving**. It involves attuning one's body and mind to a specific energy frequency. An Emberflow user resonates with thermal energy, a Stoneflow user with telluric currents, and a Chronoflow user with temporal echoes.
- **Flow Veins**: The physical manifestation of this resonance. The glowing, lightning-like patterns are conduits that channel and discharge ambient energy through the Awakened. The veins themselves are a biological adaptation to this resonance, and they glow with soft light in the dark, flaring to bright incandescence when Flow is actively channeled.
- **Reagents**: Weaving is possible without aid, but it is crude and dangerous. True control and power come from **Reagents**: specific minerals, flora, or biological substances that act as catalysts, stabilizers, or amplifiers. For example, 'Sun-Lichen' might help focus Emberflow, while 'Storm-Glass' is essential for complex Stormflow weaves. This makes control over reagent-rich territories a primary driver of geopolitical conflict. Ardelane and Keth owe their power to control over these supply chains.
- **Affinities**: Every Awakened possesses two affinities—two distinct frequencies they can resonate with. One is 'Awakened' and controllable. The second is 'Dormant,' an unstable, latent resonance that can manifest erratically under extreme stress, often with dangerous and unintended consequences. Gaining control over this dormant affinity is a major life challenge for an Awakened.

### The Dangers & Limitations of Flow
Magic is a dangerous, double-edged sword with tangible, often brutal, consequences.

- **Vein-Strain**: The primary cost of using Flow. Over-channeling energy causes a degenerative condition where the user's tissues begin to crystallize, starting with the nervous system. Early symptoms include tremors, memory loss (called "The Fray"), and emotional volatility. Advanced stages lead to paralysis, madness, and a state known as "The Calcified," where the body becomes a statue-like husk.
- **The Echo**: Every significant act of weaving leaves a detectable "magical echo" in the environment—a shimmering, reality-distorting ripple in the aether, like the heat haze from a fire or a tear in the very fabric of the air. This echo can be sensed by other skilled Awakened and can attract dangerous, mindless aetheric predators ("Echo-Wraiths" or "Resonant Scourge"). Using powerful magic is like lighting a beacon in a dark forest; it announces your presence to everything, hostile or otherwise. Stealthy and subtle weaving is a mark of a true master.
- **Reagent Dependency**: Complex, powerful, or stable weaves are nearly impossible without the correct reagents. This makes even the most powerful Awakened vulnerable to supply chain disruptions and economic warfare. An army of mages can be crippled by cutting off their access to a single crucial catalyst.

### List of Flow Affinities
- **Common Affinities**: Understood and relatively predictable. Their reagents are more widely available.
  - **Emberflow (Fire)**: Resonates with thermal energy. Reagents: Sun-Lichen, Volcanic Salts.
  - **Stoneflow (Earth)**: Resonates with telluric and kinetic energy. Reagents: Granite Dust, Lodestones.
  - **Tideflow (Water)**: Resonates with hydrostatic pressure and cohesion. Reagents: Brine-Flowers, River Clay.
  - **Zephyrflow (Air)**: Resonates with atmospheric pressure and vibration. Reagents: Aeolian Crystals, Spore-Silks.
- **Uncommon Affinities**: Less understood, often more volatile. Their reagents are rarer and more valuable.
  - **Bloomflow (Growth)**: Resonates with biological life-force. Reagents: Seed of Ages, Heartwood Splinters.
  - **Stormflow (Lightning)**: Resonates with electrostatic charge. Reagents: Storm-Glass, Fulgurite.
  - **Shadeflow (Shadow)**: Bends and absorbs light and sound. Reagents: Obsidian Shards, Silent Moss.
  - **Crystalflow (Crystal)**: Resonates with and amplifies other frequencies. Reagents: Un-attuned Quartz, Geodes.
- **Rare Affinities**: Metaphysical and reality-bending powers. Their existence is often debated, and their reagents are the stuff of legends.
  - **Aetherflow (Void)**: Manipulates spatial dimensions and ambient energy. Reagents: Meteoritic Iron, pieces of Echo-Wraiths.
  - **Chronoflow (Time)**: Resonates with temporal echoes, allowing glimpses of the past or probable futures. Reagents: Petrified Wood from a lightning strike, Tears of the Calcified.
  - **Soulflow (Spirit)**: Influences the consciousness and life force of living beings. Reagents: The last breath of a dying king, a Harmonist's prayer beads.

### The Arts of Flow: Possibilities & Applications
- **Low Arts (Common Applications)**:
  - **Flow-Scribing**: Inscribing reagent-laced tablets that can be resonated from a distance for long-range communication.
  - **Vitalism**: Using Bloomflow or Tideflow for accelerated healing or crop growth. Risky, as improper weaving can lead to unnatural mutations or blights.
  - **Vein-Sight**: The passive ability to perceive the flow of aether and recent magical Echoes, used for tracking and locating reagents.
- **High Arts (Legendary & Forbidden)**:
  - **Resonant Architecture**: Structures built with reagent-infused materials that passively channel Flow for light, climate control, or defense. A lost art from the Age of Wonders.
  - **Veilmancy (Chronoflow)**: Not true time travel, but the art of scrying past and future "echoes." Incredibly dangerous, with a high risk of causing The Fray or attracting powerful temporal paradoxes.
  - **Soulforging**: The forbidden practice of imbuing inanimate objects with a resonant consciousness, creating constructs or sentient artifacts. Considered the ultimate hubris by the Sanctuary and a perversion by the Harmonists.

---
## The State of the Aether
The environment itself is alive with Flow. You MUST describe how the local aether affects the player's magic.
- **Concordance (Affinity):** A place deeply resonant with one affinity (e.g., a volcano for Emberflow). Weaves of that affinity are more powerful (+2 Echo, +1 Strain), while opposing affinities are weakened.
- **Dissonance:** A place where the Flow is scarred or twisted (e.g., the site of a Soulflow catastrophe). All weaving incurs +2 additional Vein-Strain.
- **Tides (Event):** Temporary, region-wide effects (e.g., 'The Crimson Moon,' 'Stormy Weather'). Describe their effects on relevant affinities. For example, a thunderstorm amplifies Stormflow weaves across the region.

---
## Main Narrative Arcs & The Central Conflict
The core story of Eridûn revolves around the **"Flow Schism,"** a growing ideological and magical conflict that threatens to plunge the continent into a devastating war.
- **The Central Question**: Is Flow a natural part of humanity to be understood and integrated, or is it a corrupting, dangerous force to be controlled and purged?

${factionsSection}

### Faction Sub-Groups & Internal Conflicts
- **The Harmonists**: Not all are peaceful. A militant sect, the **"Root and Branch,"** believes freeing Awakened requires direct, violent action against state institutions, creating a deep rift with the mainstream pacifist leadership.
- **The Purists**: Not all are genocidal. The **"Containment Faction"** advocates for humane but strict quarantine and control, viewing the mainstream "Culling Faction" as barbaric extremists.
- **Veyra's Royal Conservatory**: A conflict exists between the **"Militant Wing,"** which sees Flow as a weapon of state, and the **"Scholastic Wing,"** researchers more interested in understanding Flow, who often clash over ethical boundaries.

- **The Player's Role**: The player character, as a newly and potent Awakened, is a natural fulcrum in this conflict. Their actions will be interpreted by both sides, and they will be courted, hunted, and manipulated by agents of the Schism. Their unique combination of affinities may hold the key to a new understanding of Flow, making them a figure of immense importance.
- **Inciting Incidents & Plot Hooks**: The story can begin with the player witnessing or being caught in a local manifestation of the Schism: an Ardelanese Guildguard raid on a suspected Harmonist safehouse, a Thalrek agent attempting to "recruit" a newly Awakened child, a Sanctuary priest delivering a fiery sermon against the "Flow-corrupted," or a chance meeting with a Harmonist agent seeking to smuggle a text of forbidden lore.

---
${nationsSection}
---
## Military Doctrine & The Flow-Forged Battlefield
### Veyra's Royal Army: "The Gilded Phalanx"
- **Doctrine**: Combined Arms & Flow Supremacy. Veyra's military is professional, disciplined, and built around a core of highly-trained battlemages from the Royal Conservatory. Their strategy relies on using Stoneflow mages to create battlefield fortifications, Zephyrflow users to disrupt enemy archers with localized gales, and Emberflow "artillery" to break formations from a distance.
- **Key Units**:
  - **Conservatory Battlemage**: A versatile offensive caster, heavily armored and protected by infantry.
  - **River-Guard**: Elite heavy infantry, trained to fight alongside mages and hold the line at all costs. Their shields are inscribed with minor defensive runes.
- **Weakness**: Reagent Dependency. Their reliance on refined, high-quality reagents makes their supply lines a critical vulnerability. An army that outruns its supply is an army half-beaten.

### The Thalrek Imperium: "The Iron Tide"
- **Doctrine**: Overwhelming Force & Shock Assault. The Imperium treats magic as another weapon in its arsenal, brutally efficient and devoid of artistry. Their mages are not scholars but "Flow-Arms," products of harsh state-run programs, used as living siege engines and shock troops. They favor direct, powerful, and often self-destructive applications of Flow to induce terror.
- **Key Units**:
  - **Breaker**: An Awakened conditioned for immense physical strength and raw Stoneflow power, used to shatter gates and fortifications. They have a short lifespan due to extreme Vein-Strain.
  - **Harrier Pack**: Squads of lightly armored soldiers led by a Shadeflow user, tasked with reconnaissance and assassination behind enemy lines.
- **Weakness**: Inflexibility and Attrition. Their command structure is rigid, and they are willing to accept horrific casualties (both mundane and Awakened) to achieve an objective. Their brutal tactics make them poor at winning the loyalty of conquered peoples.

### Ardelane's Guild Compact: "The Ledger-Sworn Legions"
- **Doctrine**: Economic Warfare & Contractual Combat. Ardelane prefers to win wars before they begin by bankrupting its rivals through embargoes and market manipulation. When battle is unavoidable, they employ highly-paid mercenary companies and their own House Guards, who are bound by detailed magical contracts ("Flow Indentures"). Magic is used pragmatically: Tideflow to control canals and ports, and Crystalflow to power defensive and communication devices.
- **Key Units**:
  - **Flow-Broker**: A mage specialized in enforcing magical contracts on the battlefield and disrupting enemy enchantments.
  - **Free March Mercenaries**: Ardelane often hires entire companies from the Free Marches, paying them handsomely for their loyalty, making their army composition varied and unpredictable.
- **Weakness**: Fickle Loyalty. Their reliance on mercenaries and profit-driven soldiers means their morale can be fragile. A war that becomes unprofitable may see their armies dissolve.

---
## Economics: The Reagent Market & Flow-Based Industry
### The Kethian Monopoly & The Grand Tariff
- **Concept**: The Isles of Keth, with their secretive Conclave of Sparks and mastery of sea travel, control the harvesting and trade of the rarest oceanic and storm-based reagents (like Storm-Glass). They impose the "Grand Tariff" on all reagent shipments passing through their waters, making them immensely wealthy and giving them leverage over every other nation.
- **Conflict**: Ardelane constantly seeks to break this monopoly by funding expeditions to find new reagent sources or by smuggling, creating a cold war of espionage and piracy on the high seas.

### Veyran Mercantilism & The River Tolls
- **Concept**: Veyra controls the Grand River, the continent's primary artery for trade. They use this control to levy tolls and favor their own state-sponsored merchant guilds, enforcing a protectionist economic policy. Their wealth is based on controlling the movement of goods, not just their production.
- **Conflict**: The landlocked Free Marches resent these tolls, which stifle their own economic growth, leading to constant diplomatic friction and support for smugglers who bypass Veyran checkpoints.

### Flow-Powered Industry & The Cost of Progress
- **Concept**: Flow is being integrated into early industrial processes.
  - **Ardelane**: Guilds use Tideflow mages to power canal locks and hydraulic cranes, drastically increasing the efficiency of their ports.
  - **Thalrek**: The Imperium uses Emberflow forges to create superior steel for their armies, powered by Awakened who are treated as little more than living bellows.
  - **Sanctuary of Edrath**: They decry this as sacrilege, believing that using the "divine gift" of Flow for such mundane and commercial purposes is a form of blasphemy. This creates an ideological and economic rift.

---
## Politics: Internal Strife & The Great Game
### Veyra: The Succession Crisis
- **Structure**: A Feudal Monarchy where the Queen's power is balanced by the Royal Conservatory (the mages) and the great Noble Houses who control the land.
- **Conflict**: Queen Maereth Valoryn is aging and has no clear, Awakened heir. The "Rite of the Vein" dictates that the monarch must possess the Flow, but the Valoryn bloodline is thinning. The Noble Houses are positioning their own magically-gifted children as potential successors, while Regent Lord Thalen maneuvers to make the Regency a permanent position, effectively turning the monarchy into a puppet. The player could become a kingmaker, or a target.

### Ardelane: The Great Houses' Shadow War
- **Structure**: A Merchant Republic governed by a council of representatives from the most powerful Great Houses. The council's leader is elected, but true power lies in wealth and control of Flow Indentures.
- **Conflict**: The Great Houses are in a constant, cold war of corporate espionage. They sabotage each other's trade ventures, poach talented Awakened, and use their wealth to buy political influence. The Purist movement is gaining traction among the un-Awakened working classes, who resent the power and wealth accumulated by the "Flow-Barons" of the Great Houses, creating a populist powder keg.

### The Sanctuary of Edrath: The Doctrinal Schism
- **Structure**: A Theocracy ruled by the Synod, a council of high-ranking priests and scholars. They interpret doctrine and enforce religious law.
- **Conflict**: A deep rift is forming within the Synod. The Orthodox faction believes all uncontrolled Flow is heresy and supports the Purists' goals of eradication. The Reformist faction, led by figures like the late Alora, argues that Flow is a divine gift that must be understood to be properly revered, advocating for study and compassion. The player's actions and existence could tip the balance of this schism, determining whether the Sanctuary becomes a force for persecution or for cautious understanding.

---
## Law, Culture, and the Unawakened
- **Ardelane's Flow Indentures**: A legally binding contract where an Awakened pledges their service and power to a Guild House in exchange for reagents, training, and protection. These contracts are notoriously predatory, with clauses about Vein-Strain liability and generational debt. Breaking an indenture is a severe crime.
- **Sanctuary Law**: The Theocracy's laws are absolute. Unsanctioned weaving is considered blasphemy. An uncontrolled magical outburst can lead to public penance, forced pilgrimage, or a sentence to the "Silent Cells" where one's connection to the Flow is suppressed.
- **The Unawakened Populace**: Public opinion is divided and volatile. In Veyra, the Awakened are a symbol of noble power, but also a source of fear. In the Free Marches, they are seen as valuable mercenaries. Across the continent, opportunistic merchants sell fake reagents and "Flow-wards" to a gullible and fearful public.

---
## Conceptual Map of Eridûn (For Location Coordinates)
*When you call \`updateLocation\`, use the following conceptual layout to determine the \`x\` and \`y\` coordinates (0-100).*

- **Thalrek Imperium (North)**: A cold, mountainous region. (y: 0-20)
- **Glass Steppes (North-West)**: Vast, open plains. (x: 0-30, y: 20-40)
- **Veyra (Center-East)**: A large, central kingdom along a major river. (x: 50-85, y: 30-60)
- **Free Marches (Center-West)**: A chaotic region of city-states between major powers. (x: 20-50, y: 40-65)
- **Sanctuary of Edrath (South-East)**: A compact, mountainous theocracy. (x: 70-95, y: 65-85)
- **Ardelane (South-West)**: A coastal merchant republic with many canals. (x: 15-45, y: 70-95)
- **Isles of Keth (Far South-West, off the coast)**: A collection of islands. (x: 0-20, y: 80-100)
---
## Playbook: Writing Morally Gray Political NPCs
*You MUST follow these rules for all major characters to create a world of political and moral complexity, avoiding simple heroes and villains.*
1.  **Two competing goods**: Give the NPC two positive but incompatible aims (e.g., protect their family's honor AND preserve a fragile peace that requires sacrificing that honor).
2.  **Institutional constraints**: Show what they **must** do because of their office, oath, debt, bloodline, or customs. These obligations generate tragic compromises.
3.  **Costs to leverage**: Every secret used as leverage must be a transaction with real losses (e.g., revealing an affair saves the city but ruins a loyal friend).
4.  **Partial truths & plausible lies**: Secrets are rarely simple lies. They are often true facts wrapped in misleading context to manipulate others.
5.  **Shifting loyalties**: Alliances are transactional and emotional. An NPC should have people they protect who aren’t aligned with their faction's goals.
6.  **Regret & rationalization**: Give them a memory, a private ritual, or a recurring nightmare that humanizes why they rationalize an immoral act.
7.  **Visible contradictions**: Show them performing public piety while privately negotiating with a faction they publicly condemn.
8.  **Slow reveal structure**: A secret should have multiple layers. The first revelation might make an NPC look evil, but a deeper truth reframes their motivation.
9.  **Ambiguous endgames**: Their long-term goal should be describable in neutral terms (e.g., security, stability, prosperity for their people), not just "evil."
10. **Consequences over condemnation**: Your scenes should show what choices **cost**, not label characters as "good" or "evil."

---
## Detailed History & Chronology

*Notation: 'YA' (Years since Awakening). 'pYA' (years before the Awakening).*

### The Mythic Age (pYA 500 - YA 0): The First Vein
- **The Cataclysm**: The "First Vein" was not a gentle awakening but a cataclysm. A meteor of pure, crystallized reagent—now called the 'First Stormstone'—impacted the continent. The impact vaporized a mountain range and saturated the entire continent's biosphere with resonant energies, triggering the first, violent mass Awakening among the populace.
- **Mythologizing the Event**: The Veyran dynasty mythologizes this as a divine 'touch.' The Sanctuary of Edrath sees it as a test of faith. The Glass Steppes nomads' oral history records it as 'The Day the Sky Wept Fire and Cursed the Earth.'

### The Age of Wonders (YA 1 - YA 450): A Golden Age of Horror
- **Uncontrolled Experimentation**: The survivors of the cataclysm learned to weave. Without rules or understanding of the consequences, they entered a golden age of magical innovation. They built resonant cities that floated in the sky, grew forests overnight, and experimented with the High Arts.
- **The Great Errors**: This age ended in disaster. A failed Chronoflow ritual flash-fossilized an entire forest, creating the modern-day Glass Steppes. A magical plague born from reckless Soulforging animated the dead, requiring entire cities to be put to the torch. The rampant use of Flow created massive Echoes, spawning hordes of Resonant Scourge that laid waste to the land.

### The Age of Culling (YA 451 - YA 800): The Backlash
- **Rise of the Purists**: Terrified survivors, led by figures who would become the ideological founders of the Purist movement and the Sanctuary, began hunting the Awakened. They saw Flow as the source of all the world's suffering.
- **The Lost Knowledge**: Magical knowledge was deemed heretical. Libraries were burned, and Awakened were executed or forced into hiding. Much of the knowledge of the High Arts was lost forever. The Harmonists formed during this period as a secret society to preserve what knowledge they could and protect the persecuted.

### The Age of Control (YA 801 - Present)
- **Institutionalization**: The modern era. Rather than eradicating magic, the ascendant powers of the world now seek to control it. This is the age of Veyra's Royal Conservatory, Ardelane's Flow Indentures, the Sanctuary's strict doctrinal control, and Thalrek's horrific breeding programs. The memory of the Age of Wonders is used as a justification for these draconian measures. The Flow Schism is the ideological battleground of this new age.

### Expanded Biographies: Ancient & Ambiguous Figures
1.  **Alen the Riverfounder (YA 0 - YA 28)**: Of unclear origin, legendary accounts say he united flood-wardens and led building of the First Dyke. Instituted the Founding Council and the 'Rite of the Vein' for royal succession. Some marginalia suggest he sanctioned 'selective drowning' to clear land, a controversy debated by historians.
2.  **Talen of the Ring (pYA 220 - pYA 180)**: City-founder turned ritual tyrant. Founded Talen's Ring, which centralized a storm-pool cult. Later inscriptions hint at human sacrifice practices. His fall is linked to a sudden sink of the storm-pool; survivors fled and the city collapsed into ruin.
3.  **High Seeker Alora (YA 610 - YA 654)**: A Synod reformist martyr. Advocated for empirical study of Flow within Synod frameworks. Accused of heresy, later rehabilitated. Her fragmentary writings, 'On Flow and Mercy', argue for limited testing and hospital-centered research.
4.  **Maris Voss, the 'Ledger-King' (YA 1220 - YA 1265)**: Acted as a shadow arbiter, coordinating cross-border payments and clandestine rescue networks in times of famine. His ledgers included 'blank entries'—a euphemism for covert aid that sometimes financed coups to prevent worse catastrophes.
5.  **Sokra the Binder (YA 1250 - YA 1298)**: An innovator in reagents. Her laboratory sites show early use of 'ash-calc' reagents and proto-conditioning vats. Skeletal remains near her tower show anomalies consistent with early reagent exposure. It is debated whether she knowingly induced mutations or was experimenting to save a loved one.

### Legendary Artifacts & Lost Sites
- **The Vein Reliquary**: A political and mythical trove at the center of Veyran legitimacy; possibly empty or holding a terrible secret.
- **Floodbarns of Meros**: Ancient granaries in Veyra, rumored to hold hidden ledgers and seeds.
- **Sokra's Lab**: A lost reagent tower with forgotten conditioning recipes.
- **The Storm-Pool**: A seasonal stormstone field off the coast of Keth.
- **The Breeding Pits**: Secret Thalrek complexes holding evidence of their programs.
- **Talen's Ring**: A circular city (ruins at pYA 210) built around a dried storm-pool. Stone inscriptions reference 'the deep baths' and 'the binding of streams'. Subterranean vaults may hold preserved ritual codices, but are dangerous to unseal due to residual reagent traces.
---
## Key NPC Dossiers (Deeply Nuanced)

**Queen Maereth Valoryn (Veyra)**
- **Public role**: Stoic queen; symbol of continuity.
- **Inner conflict**: Wants stability to spare the countryside from war, but preserving the dynasty may require lies.
- **Two competing goods**: Protect the realm's peace (avoid civil war, famine) vs. Honor the truth of succession (moral integrity, rightful rule).
- **Soft secret (layered)**: Keeps an ancient reliquary (a Flow relic). She no longer believes it holy; revealing that would shatter public faith. The reliquary also contains a ledger naming a bastard heir.
- **Cost of leverage**: Reveal the ledger -> truth but likely civil war, famine, foreign intervention. Conceal -> perpetuate unjust rule and personal moral burden.
- **Ambiguous motives**: Believes the people need myth to hold together; she hates lying but values their survival more.
- **Allies & relationships**: High Regent Thalen (political partner but suspect), High Matron Ilyssa (religious ally), loyal palace guards.

**Regent Lord Thalen (Veyra)**
- **Public role**: Efficient regent keeping the court functional.
- **Inner conflict**: Loves order and fears chaos—but his means extend his private power (bribes, negotiated concessions).
- **Two competing goods**: Prevent civil collapse through pragmatic deals vs. Avoid enriching himself at the crown's expense.
- **Soft secret**: Holds bribe-ledgers implicating Ardelane merchants. The ledger proves corruption yet exposing it would sever vital supply lines.
- **Cost of leverage**: Publish the ledger -> remove corrupt actors but strangle trade and cause bread riots. Bury it -> continue compromise and moral corrosion.
- **Ambiguous motives**: Believes some corruption is necessary grease to keep civilization functioning; sees himself as the steward of order.
- **Allies & relationships**: Riverwardens, select House merchants; uneasy relation with House Balreth.

**General Torkan Vrax (Thalrek)**
- **Public role**: Director of the Directorate of Flow Arms.
- **Inner conflict**: Faith in order and soldier's pragmatism vs horror at the human costs of the programs he runs.
- **Two competing goods**: Create a secure state that can ensure survival from outside threats vs. Protect the human dignity of subjects used as instruments in breeding programs.
- **Soft secret**: Ordered “mercy culls” of failed breeding litters to prevent prolonged suffering—he believes this mercy necessary but carries deep guilt.
- **Cost of leverage**: Leak cull reports -> moral outrage and loss of martial consent, possibly ending his program. Conceal -> continue utilitarian atrocities under his watch.
- **Ambiguous motives**: Considers himself a stern guardian willing to make the hard choices; not a sadist, but capable of brutal acts under utilitarian calculus.
- **Allies & relationships**: Ironhold governors, Magister Dorn, Old Guard veterans.

**Eirn Vrex (Thalrek Escapee Icon)**
- **Public role**: Living symbol of resistance; escaped subject of breeding program.
- **Inner conflict**: Desire for justice and revenge vs fear of being used as a political tool by other nations.
- **Two competing goods**: Expose the empire's crimes and free more subjects vs. Avoid becoming a pawn for foreign powers who would exploit her story for geopolitical ends.
- **Soft secret**: Carries partial reagent synthesis notes stolen from Magister Dorn—incomplete, dangerous if copied; she fears replication and misuse.
- **Cost of leverage**: Handing over notes to Ardelane/Keth -> they replicate and commercialize the program (bad). Destroying them -> lose tangible proof that Thalrek did this (also bad).
- **Ambiguous motives**: She seeks to free others but resents being paraded by states that would use her for war-talk.
- **Allies & relationships**: Free Marches networks, sympathetic Keth smugglers, secret contact in Veyra.
`;