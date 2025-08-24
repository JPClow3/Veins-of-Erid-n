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

## Core Concept: Magic as "Flow"

**The System**: The body contains a latent bio-energetic current called **Flow**. When awakened, it manifests as glowing, lightning-like patterns on the skin called **Flow Veins**.
- **Source**: Innate. Can be awakened by training, specific rituals, or intense trauma.
- **Affinities**: Every mage possesses two affinities. One is 'Awakened' at the start of their journey. The second is 'Dormant' and is typically revealed later through a moment of crisis or great emotional stress.
- **Cost**: Using Flow drains stamina. Overuse leads to exhaustion, internal damage, and eventually death. It is a powerful but physically taxing ability.
- **Visibility**: Flow Veins flare with use, making magic highly visible. This has massive social consequences. In some nations, it's a sign of divinity; in others, it's a mark of a heretic or a weapon to be controlled. Unsanctioned mages are often hunted.

### List of Flow Affinities
- **Common Affinities**: Familiar and understood powers, often seen as tools or common threats.
  - **Emberflow (Fire)**: Passionate, destructive, and volatile.
  - **Stoneflow (Earth)**: Enduring, defensive, and resolute.
  - **Tideflow (Water)**: Fluid, adaptable, and cleansing.
  - **Zephyrflow (Air)**: Swift, elusive, and insightful.
- **Uncommon Affinities**: Respected or feared powers that mark the user as particularly talented or dangerous.
  - **Bloomflow (Growth)**: Nurturing, subtle, and regenerative.
  - **Stormflow (Lightning)**: Volatile, quick, and intimidating.
  - **Shadeflow (Shadow)**: Elusive, secretive, and feared.
  - **Crystalflow (Crystal)**: Focused, sharp, and resonant.
- **Rare Affinities**: Met with awe, terror, or intense scholarly/political interest. A user of a Rare affinity would be a figure of prophecy or a target for powerful factions.
  - **Aetherflow (Void)**: Mysterious, consuming, and spatial.
  - **Chronoflow (Time)**: Inevitable, patient, and reality-bending.
  - **Soulflow (Spirit)**: Empathic, commanding, and ethereal.

---
## Main Narrative Arcs & The Central Conflict
The core story of Eridûn revolves around the **"Flow Schism,"** a growing ideological and magical conflict that threatens to plunge the continent into a devastating war.
- **The Central Question**: Is Flow a natural part of humanity to be understood and integrated, or is it a corrupting, dangerous force to be controlled and purged?

${factionsSection}

- **The Player's Role**: The player character, as a newly and potent Awakened, is a natural fulcrum in this conflict. Their actions will be interpreted by both sides, and they will be courted, hunted, and manipulated by agents of the Schism. Their unique combination of affinities may hold the key to a new understanding of Flow, making them a figure of immense importance.
- **Inciting Incidents & Plot Hooks**: The story can begin with the player witnessing or being caught in a local manifestation of the Schism: an Ardelanese Guildguard raid on a suspected Harmonist safehouse, a Thalrek agent attempting to "recruit" a newly Awakened child, a Sanctuary priest delivering a fiery sermon against the "Flow-corrupted," or a chance meeting with a Harmonist agent seeking to smuggle a text of forbidden lore.

---
${nationsSection}
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

*Notation: 'YR' (Years since the First Vein). 'pYR' (years before the First Vein).*

### Deep Prehistory & Mythic Time
- **Prehistoric Eridûn (pYR 12,000 - pYR 500): The Long Silence**
  - **Overview**: Before the First Vein myth, human groups were hunter-gatherers, semi-nomadic pastoralists, and early riverine villages. Archaeological evidence suggests seasonal camps, rock-art with Flow-like iconography, and ritual burial mounds containing polished 'stormstone' shards.
  - **Cultures**: The River-Groth Tribes (pYR 8500–6000) were early adopters of seasonal flood agriculture. The Saltring Foragers (pYR 5400–3200) were coastal communities that harvested brine-flowers (proto-stormstones) and developed ritual diving practices.
  - **Technology**: Early smelting of bronze-like alloys emerges late in this period (pYR 2900).
  - **Archaeology**: A submerged causeway with carved veins and ossuary pits dating pYR 4200 suggests ritualized contact with Flow phenomena.

- **Mythic Age & The First Vein (pYR 500 - YR 0)**
  - **Mythic Account**: A luminous fissure, a 'vein' of light, opened in a riverbed, altering living tissue and awakening resonant lines in the land.
  - **Contested Interpretations**: The Synod reads it as a divine touch. The Conservatory hints at a rare natural reagent exposure coupled with a geomagnetic anomaly. Scholars suspect a proto-stormstone eruption or meteoric event.
  - **Aftermath**: Rapid consolidation of river clans under Alen the Riverfounder (YR 0 - YR 28), solidifying early dynastic rites and the first 'Founding Chronicle'.

### Ancient Polities & Lost Cities (YR 1 - YR 320)
- **The Floodbar Principalities**: A loose confederation of city-states along the central river, each controlling a grain-barge fleet. Their archaeological remains show a shared iconography of tri-vein glyphs.
- **Proto-Keth Enclaves**: Emergent merchant towns on the coast that would later become Keth's urban core. Evidence of long-distance trade artifacts exists.

### Major Historical Ages (High-Level Overview)
- **Age of Rivers (YR 0 - 320)**: Founding of the Veyran dynasty after the First Vein appears; consolidation of river clans into a single realm. Major projects: canal-building, flood management, first granary systems.
- **Age of Commerce (YR 321 - 580)**: Rise of coastal and canal cities; Ardelane's merchant houses form the nucleus of proto-oligarchic governance. Keth emerges as a seafaring power and develops early reagent-harvest techniques.
- **Age of Faith (YR 581 - 830)**: The Synod (later Sanctuary of Edrath) consolidates religious authority; pilgrimage economies grow. The Conservatory is founded in Veyra as a royal response to Flow incidents.
- **Age of Iron & Expansion (YR 831 - 1200)**: Thalrek centralizes and militarizes, developing early augmentation practices and forging a durable war-industrial base. Free Marches solidify as networks of mercenaries.
- **Age of Breeding & Secrecy (YR 1201 - 1380)**: Thalrek's systematic breeding programs and reagents research escalate. Patent wars and smuggling intensify. Keth refines storm-claim harvesting.
- **Age of Fracture / Present Era (YR 1381 - Present)**: A century of smaller wars, diplomatic pacts, skirmishes, and leaked research culminate in the current brittle equilibrium.

### Expanded Chronology (Selective Events)
- **YR -300 to YR 0 (late prehistory to mythic dawn)**: Minor reagent flares, meteor showers, small cult formations.
- **YR 12 - 120 (consolidation)**: Alen's campaigns, formalization of toll rites, creation of the first royal granary ledger.
- **YR 121 - 275 (river stabilization)**: Canal-building; early legal codes forbidding private seizure of granary stores.
- **YR 276 - 312 (Toll Wars - detailed)**: 276: The Fork Blockade—merchant coalition halts river traffic at Three-Forks. 279: Burning of the Tall-Barges—pirate conflagration blamed on a rival house. 283: Toll Compact negotiated at Meroshall. 296: The Quiet Accord—temporary peace enforced by inter-house marriages.
- **YR 410 (Climate Pulse)**: The Silver Drought—two years of low floods reduce yields by 40%, leading to the Granary Wars.
- **YR 622-626 (Climate Pulse)**: The Great Rains—excessive flooding destroys harvests and prompts Sanctuary intervention.
- **YR 581 - 830 (Age of Faith)**: Sanctuary consolidates pilgrim routes; early miracle-claims associated with preserved Flow marks.
- **YR 831 - 1200 (Iron & Expansion)**: 872: Thalrek unifies border clans under an iron caste. 909: Introduction of early conditioning workshops.
- **YR 1201 - 1380 (Breeding & Secrecy)**: 1218: Keth develops proprietary storm-claiming patents. 1247: The Silt Sabotages disrupt supply chains. 1299-1303: The Patent Wars flare into coastal skirmishes.
- **YR 1365 - 1384 (Breeding Revolts & Present Crack)**: 1365: First whistleblower pamphlets smuggled to Free Marches. 1371: Mass protests. 1379: Eirn Vrex-style escape sequence. 1384: The Present Freeze—current brittle peace.

### Major Wars & Conflicts (Expanded)
- **The Toll Wars (YR 275 - YR 312)**: Early merchant coalitions (proto-Ardelane houses) vs the emergent Veyran crown over river toll sovereignty. Led to the 'Toll Compact' and created the Riverwardens.
- **The Granary Wars (YR 642 - YR 648)**: Famine-driven conflict where House Meros (Veyra) attempted to restrict granary access. Increased Sanctuary influence as mediators. Made granary access a central political weapon.
- **The Schism of the Synod (YR 790 - YR 805)**: Conservative Matrons vs a Reformist Brotherhood over the empirical study of Flow. Led to consolidation of Synod orthodoxy and an exodus of reformist scholars.
- **The Thalrek Campaigns (YR 1120 - YR 1155)**: Thalrek expansion into borderlands for resources. Led to long-lasting fear of Thalrek's methods.
- **The Patent & Storm Wars (YR 1290 - YR 1325)**: Keth & Ardelane vs privateers & Thalrek proxies over patented reagent-harvest tech. Made patent law a political tool and created a tech black market.
- **The Breeding Revolts & Present Crack (YR 1365 - YR 1384)**: Mass escapes and whistleblower leaks (e.g., Eirn Vrex) exposed Thalrek's breeding programs, sparking international condemnation but no decisive intervention. Shaped the modern political landscape.

### Expanded Biographies: Ancient & Ambiguous Figures
1.  **Alen the Riverfounder (YR 0 - YR 28)**: Of unclear origin, legendary accounts say he united flood-wardens and led building of the First Dyke. Instituted the Founding Council and the 'Rite of the Vein' for royal succession. Some marginalia suggest he sanctioned 'selective drowning' to clear land, a controversy debated by historians.
2.  **Talen of the Ring (pYR 220 - pYR 180)**: City-founder turned ritual tyrant. Founded Talen's Ring, which centralized a storm-pool cult. Later inscriptions hint at human sacrifice practices. His fall is linked to a sudden sink of the storm-pool; survivors fled and the city collapsed into ruin.
3.  **High Seeker Alora (YR 610 - YR 654)**: A Synod reformist martyr. Advocated for empirical study of Flow within Synod frameworks. Accused of heresy, later rehabilitated. Her fragmentary writings, 'On Flow and Mercy', argue for limited testing and hospital-centered research.
4.  **Maris Voss, the 'Ledger-King' (YR 1220 - YR 1265)**: Acted as a shadow arbiter, coordinating cross-border payments and clandestine rescue networks in times of famine. His ledgers included 'blank entries'—a euphemism for covert aid that sometimes financed coups to prevent worse catastrophes.
5.  **Sokra the Binder (YR 1250 - YR 1298)**: An innovator in reagents. Her laboratory sites show early use of 'ash-calc' reagents and proto-conditioning vats. Skeletal remains near her tower show anomalies consistent with early reagent exposure. It is debated whether she knowingly induced mutations or was experimenting to save a loved one.

### Legendary Artifacts & Lost Sites
- **The Vein Reliquary**: A political and mythical trove at the center of Veyran legitimacy; possibly empty or holding a terrible secret.
- **Floodbarns of Meros**: Ancient granaries in Veyra, rumored to hold hidden ledgers and seeds.
- **Sokra's Lab**: A lost reagent tower with forgotten conditioning recipes.
- **The Storm-Pool**: A seasonal stormstone field off the coast of Keth.
- **The Breeding Pits**: Secret Thalrek complexes holding evidence of their programs.
- **Talen's Ring**: A circular city (ruins at pYR 210) built around a dried storm-pool. Stone inscriptions reference 'the deep baths' and 'the binding of streams'. Subterranean vaults may hold preserved ritual codices, but are dangerous to unseal due to residual reagent traces.

### Primary-Source Excerpts & In-Game Documents
- **A) 'Fragment of the First Vein' (poem, anonymous)**: "When silver ran like root beneath the mud / the mothers bore the seam of light / we tied our children with rope of song."
- **B) 'Riverwarden's Log, YR 279' (entry)**: "Three-Forks silent this dawn. The merchants have taken to the water like ghosts. Count the banners; the Tall-Barge lies charred."
- **C) 'Letter from Matron Edris to the Queen, YR 646' (excerpt)**: "Our infirmaries overflow; grant the granary access we pleaded in mercy—God will judge those who hoard bread."
- **D) 'Sokra's Marginalia' (burn-blurred)**: "Trial 7 failed. Ashen-gore reacted at threshold three; note sediment sample delta-4 for containment."
- **E) 'Vera Thorn's Testimony' (smuggled pamphlet)**: "We carried them at night, soft-machined children with lines like lightning. We spoke to the world; some turned away. Others pointed guns."

### Deep Hooks & Alternate Histories for Story Generation
- **What-If Scenarios**: What if Alen had failed to unite the river clans? What if Sokra's experiments had been perfected early? These alternate histories can inspire AI-generated plots.
- **Vendetta Threads**: The curse on the House of Balreth (dating to YR 298) can manifest as unexplained assassinations or political misfortunes.
- **Deep Conspiracies**: A secret network of 'Ledger-Kings' might have manipulated royal successions for centuries to preserve trade access. Proofs are scattered across disparate, ancient ledgers.
- **Archaeological Mechanics**: Tell stories of discovery. Layer 1 (Surface ruins & local lore) is easy. Layer 2 (Subterranean vaults) is harder. Layer 3 (Deep labs & storm-pools) is most dangerous. Introduce risks like contamination from ancient reagents.

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

**Princess Mira Valoryn (Veyra)**
- **Public role**: Popular, reform-minded princess.
- **Inner conflict**: Wants to help commoners but loves family and fears destroying them.
- **Two competing goods**: Restore justice and aid for the poor vs. Protect kin and preserve stability of the dynasty.
- **Soft secret**: Once sheltered a Thalrek escapee who later killed an officer during a raid; Mira concealed their identity to protect the refugee who saved her childhood.
- **Cost of leverage**: Revealing the refuge -> patriot backlash and possible crackdown. Hiding it -> innocent blood remains unavenged and her moral authority is compromised.
- **Ambiguous motives**: Her humanitarianism is genuine but also bound to personal loyalties and childhood debts.
- **Allies & relationships**: Young Reformists, tavern-keepers; secret sympathies among palace staff.

**Master Goren the Scribe (Veyra)**
- **Public role**: Archivist, guardian of genealogies and records.
- **Inner conflict**: Reverence for truth vs fear of being the spark that topples everything.
- **Two competing goods**: Preserve truthful history and archival integrity vs. Prevent bloodshed by keeping dangerous records secret.
- **Soft secret**: Holds a ledger entry that could delegitimize the prince; the entry was written by a forger under duress—Goren suspects forgery but lacks proof.
- **Cost of leverage**: Publish with doubts -> erode trust in records and cause political instability. Hide -> live as the one who concealed a possible truth.
- **Ambiguous motives**: Values continuity and the stability it affords ordinary people; avoids martyrdom of truth if it would cost lives.
- **Allies & relationships**: Clerks, minor nobles who fear upheaval.

**Lord Caren, House Scales (Ardelane)**
- **Public role**: First Merchant; pragmatic oligarch.
- **Inner conflict**: Wants wealth but truly believes that commerce prevents war and famine.
- **Two competing goods**: Maximize trade to keep cities fed and stable vs. Avoid empowering warmongers (e.g., Thalrek) through arms sales and credit.
- **Soft secret**: Secretly financed an early Thalrek arms contractor to insure merchant ships against piracy—an insurance play that now fuels Thalrek's military capability.
- **Cost of leverage**: Expose funding -> curtail Thalrek arms but blow House Scales' credit network and cause economic collapse. Conceal -> maintain trade and avoid immediate famine but contribute to future aggression.
- **Ambiguous motives**: Sees himself as a utilitarian merchant trying to offset local chaos; rationalizes morally dubious deals as necessary.
- **Allies & relationships**: Keth merchants, Flow Brokerage heads; tense relation with Ardelane reformists.

**Madam Lyre Vossa (Ardelane - Flow Brokerage)**
- **Public role**: Architect of Flow indentures and legal instruments.
- **Inner conflict**: Sees indenture both as protective shelter for vulnerable mages and as a system of enslavement when manipulated.
- **Two competing goods**: Regulate Flow to keep mages sheltered and legally protected vs. Maintain firm solvency and legal certainty for merchants (profit motive).
- **Soft secret**: Maintains a “compassion fund" used to free selected bonded mages; funded by hidden fees on nominally "clean" contracts—the fund is moral but illegal.
- **Cost of leverage**: Publicize the fund -> spark reform and free some mages but bankrupt her firm. Keep secret -> preserve an efficient market but continue systemic harm.
- **Ambiguous motives**: She genuinely saves some mages while enabling a larger, harmful machine.
- **Allies & relationships**: House Guildguard, certain dockmasters, secret allies among artisan leagues.

**High Matron Ilyssa (Sanctuary)**
- **Public role**: Supreme doctrinal leader of the Synod.
- **Inner conflict**: Conviction in faith vs mercy for the suffering in her flock.
- **Two competing goods**: Preserve doctrine to avoid schism and maintain social order vs. Allow doctrinal reinterpretation to enable life-saving research.
- **Soft secret**: Came from a minor house that survived plague with Flow-derived healing; she privately knows many Synod “miracles” have secular elements (reagents, training).
- **Cost of leverage**: Reveal the secular basis -> erode Synod power, create social instability but open therapeutic science. Conceal -> preserve cohesion while perpetuating doctrinal hypocrisy.
- **Ambiguous motives**: Believes the myth binds social fabric; fears the vacuum left by revelation would be worse than the lie.
- **Allies & relationships**: Queen Maereth (mutual legitimizing), conservative matrons, hidden reformist sympathizers.

**Sister Mava (Sanctuary - Licensed Healer)**
- **Public role**: Visible healer, skilled and beloved by pilgrims.
- **Inner conflict**: Scientific curiosity vs loyalty to Synod training and doctrine.
- **Two competing goods**: Pursue knowledge to ease human suffering vs. Protect spiritual cohesion provided by sanctioned Synod ritual and authority.
- **Soft secret**: Her notes suggest reagents and conditioning can reproduce Flow-like effects; releasing them democratizes healing but risks commercial exploitation and loss of Synod control.
- **Cost of leverage**: Leak notes -> democratize treatment (good) but empower merchants and erode Synod revenue and influence (bad). Hide them -> preserve Synod power but let disease worsen.
- **Ambiguous motives**: Wants to cure but fears that a marketized solution will harm the poor she serves.
- **Allies & relationships**: Temple Healers, reformist scholars, some sympathetic nobles.

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

**Mira of the Caravan (Free Marches)**
- **Public role**: Charismatic protector and folk hero (also secret Flow-wielder).
- **Inner conflict**: Sanctuary for the hunted vs maintaining the neutral trade that sustains the Marches.
- **Two competing goods**: Harbor persecuted people and uphold moral sanctuary vs. Maintain a fragile trading neutrality to keep caravans moving and towns alive.
- **Soft secret**: Sheltered a fugitive who later committed an atrocity against a neighboring village; she concealed it to protect the fugitive who saved her life earlier.
- **Cost of leverage**: Reveal the fugitive's identity -> justify crackdowns and lose caravan clients. Conceal -> hang over her a moral stain and fuel cycles of vengeance.
- **Ambiguous motives**: Acts of mercy are mixed with loyalty and survivalism in a brutal world.
- **Allies & relationships**: Caravan guilds, mercenary captains, local tribunes.

**Archon Vek (Keth - Conclave of Sparks)**
- **Public role**: Head of Conclave controlling Flow tech and export policy.
- **Inner conflict**: Scientific stewardship vs sale of tech to fund the republic and preserve independence.
- **Two competing goods**: Control research to prevent misuse and global imbalance vs. Sell limited tech to fund the republic and defend Keth's sovereignty.
- **Soft secret**: Conclave prototype reduces stamina cost notably; selling it would save many lives but give war-making advantage to buyers like Thalrek.
- **Cost of leverage**: Release/sell device -> geopolitical imbalance and potential war. Hide it -> continued human suffering and moral cost.
- **Ambiguous motives**: Feels responsibility for Keth's survival and the safety of their people more than abstract global ethics.
- **Allies & relationships**: Consul Riah (political cover), Ira Stormhand (ship design), secret contacts in Ardelane.

---
## Full Cast Reference (Expanded)
*Use this list to generate minor characters. You can turn any of these compact entries into a full nuanced character using the Playbook rules.*

**VEYRA — Royal Dominion (18 NPCs)**
1. Queen Maereth Valoryn (60) — The Aging Sovereign. Keeper of a suspected Flow relic.
2. Crown Prince Edrin Valoryn (28) — Heir; frail; seeks to prove strength; secret illness.
3. Regent Lord Thalen (52) — Chief regent; holds bribe ledgers.
4. Lady Sera Balreth (34) — Head of House Balreth; ambitious; son forged a Flow mark.
5. Lord Davin Meros (40) — Riverlord & Toll-magnate; secret canal for smuggling.
6. Sir Jorlan Vaun (47) — Master of the Royal Conservatory.
7. Princess Mira Valoryn (22) — Beloved princess; sheltered a runaway Flow-child.
8. Master Goren the Scribe (61) — Keeper of Records; ledger showing disputed adoption.
9. Captain Ilyra Stone (43) — Commander of Palace Guard; sold protection to smugglers.
10. Lady Rhoswen Dee (50) — High Matron of Noblewomen; arranges marriages for leverage.
11. Duke Haltan Verras (58) — Old General; resents mages.
12. Synn Glass (34) — Riverwardens' Spymaster; holds compromising letters.
13. Brother Calen (48) — Royal Confessor; smuggles relics to Ardelane.
14. Young Lord Jasen Balreth (18) — Hot-headed heir-apparent.
15. Halmir Rook (36) — Merchant-bridge to Ardelane; double-books ledgers.
16. Edda of the Wells (50) — Popular midwife with low-tier Flow knowledge.
17. Magus Ryel (65) — Senior retired Royal Conservatory mage; once used forbidden Flow.
18. Petra Vaun (30) — Conservatory adept; sympathetic to reform; secret Free Marches contact.

**ARDELANE — Guild Compact (14 NPCs)**
1. Lord Caren House-Scales (54) — First Merchant; secretly financed Thalrek's early contractor.
2. Madam Lyre Vossa (46) — Head of Flow Brokerage; runs a 'compassion fund'.
3. Marin "The Quill" Sarto (35) — Chief Comptroller pushing Open Ledger reforms.
4. Torren Hale (29) — Dockworker Council Head; agitator with secret payoff ties.
5. Lady Evra of House Sile (51) — Patroness of Bank of Twelve; holds secret lien vs Crown.
6. Pavel the Broker (40) — Black Market Syndicate Foreman; sells reagents and info.
7. Mori the Forger (33) — Ledger Forger; can ruin rivals.
8. Captain Edda "Stormhand" Keth (40) — Privateer; secret deals with Keth.
9. Nera Tal (26) — Flow Indenture Representative; once freed a bonded adept.
10. Old Jannik (68) — Reagent Diver with map to storm-pool.
11. Vossan Cartographer Hel (44) — Maps secret trade routes.
12. Brother Joren (38) — Sanctuary Liaison & pious broker; takes bribes for licenses.
13. Talia Merr (31) — Shipwright Union Forewoman; trains freecasters secretly.
14. Serric Dov (55) — Retired Merchant Lord; launders funds for Thalrek.

**SANCTUARY OF EDRATH — Theocracy (12 NPCs)**
1. High Matron Ilyssa (56) — Head of Synod; knows secular basis of some miracles.
2. Arch-Confessor Brother Calien (48) — Inquisitor; uses Flow notes to save a child.
3. Sister Mava (34) — Licensed Temple Healer; notes about reagents.
4. Brother Hest (62) — Archivist; marginalia hints at non-divine Flow origins.
5. Matron Avara (49) — Temple Infirmary head; siphons tithes for reagent stores.
6. Brother Jarin (39) — Public Preacher & populist voice.
7. Inquisitor Loras (45) — Penance Courts head; stages trials to eliminate rivals.
8. Scribe Merek (33) — Painter of ritual texts; smuggled reagent illustration.
9. Sister Itta (27) — Young Scholar; secret lab notes proving Flow physiology.
10. Pilgrim Master Sil (60) — Head of Pilgrim Guilds; skims tithes.
11. Brother Fen (41) — Temple Spy; sells intelligence to Veyra.
12. Elder Shan (70) — Rural conservative; burned a manuscript that could absolve a dynasty.

**THALREK IMPERIUM — Militarist (12 NPCs)**
1. General Torkan Vrax (58) — Director of Flow Arms; ordered mercy culls.
2. Lady Serae Ironmark (46) — Governor; uses conscripted Flow-bond servants.
3. Magister Dorn (50) — Lead Researcher; destroys sentient samples.
4. Tala of the Ironholds (33) — Captain of Flow cohort; has an illegitimate experimental son.
5. Sok the Breeder (62) — Keeper of Breeding Pits; sabotages litters secretly.
6. Eirn Vrex (28) — Escapee icon with stolen reagent notes.
7. Minister Haleq (49) — War Industry manager; embezzles.
8. Old Vet Karr (67) — Veteran critical of breeding; haunted past.
9. Lady Vessa Mourn (37) — Widow funding aid for escapees.
10. Marshal Reth (54) — Border Warden; sells passes illicitly.
11. Young Engineer Lorn (29) — Flow-tech developer; works secretly with Keth.
12. Raya of the Ash (31) — Revolutionary organiser; ex-director defect.

**FREE MARCHES — Confederation (10 NPCs)**
1. Mira of the Caravan (33) — Folk leader; sheltered fugitive with violent past.
2. Captain Bram "Coin" Harrow (45) — Mercenary lord; troops for sale.
3. Anya Reed (28) — Popular Tribune.
4. Wyn the Mapmaker (49) — Knows reagent cache near Veyra border.
5. Ser Zol (41) — Charter City head; secret deals with Ardelane.
6. Kora the Blind (57) — Seer & judge; keeps a coded ledger of secrets.
7. Garr "Two-Taxes" Marn (36) — Caravan taxman; siphons to Thalrek.
8. Old Jessa (63) — Healer & storyteller; knows ritual to boost Flow temporarily.
9. High Captain Rill (47) — Mercenary order leader; once bribed to stand down.
10. Merrin Joss (30) — Smuggler & Flow facilitator; ledger of payments.

**ISLES OF KETH — Island Republic (9 NPCs)**
1. Consul Riah Keth (50) — Head consul; shields Conclave research.
2. Archon Vek (58) — Head of Conclave; prototype reducing stamina cost.
3. Ira Stormhand (40) — Head Shipwright; sells augmentations to Thalrek.
4. Lysa the Light (29) — Conclave Adept; public face; lover of an Ardelane broker.
5. Merek "Silt" (62) — Harvester chief; sells stormstones to Thalrek.
6. Gina of the Gulls (35) — Smuggling matron; keeps list of Consul's clients.
7. Old Tal (70) — Dockyard elder; has codebook to hide reagent moves.
8. Hana Kess (31) — Patent prosecutor; accepts bribes.
9. Rook the Tinker (27) — Rogue inventor; crude prototype of Conclave device.

**GLASS STEPPES — Nomads & Shamans (9 NPCs)**
1. Khan Orin Tallmane (49) — Confed leader; once sold reagent access.
2. Shaman Mother Yera (63) — Elder shaman; visions of Flow contamination.
3. Rav Khaz (38) — Clan raider-chief; bribes city-states for weapons.
4. Elder Sura (55) — Keeper of migration laws; broke an agreement causing famine.
5. Mek "Stonehand" (41) — Forager leader; map of reagent grove inside Veyra.
6. Lira of Sails (29) — Caravan broker; sells recon to Keth.
7. Old Harn (70) — Archivist & talekeeper; knows oath that can null treaties.
8. Reyka (34) — Maverick shaman; traded reagent to Free Marches surgeons.
9. Garn the Fence (47) — Middleman; keeps incriminating ledger.

**CROSS-NATIONAL & SHADOW CAST (10 NPCs)**
1. Pavel "Ledger" Voss (48) — International broker; secret accounts for heads of state.
2. Sera the Ash (39) — Freelance spy; ex-Directorate operative.
3. Brother-Markus (56) — Rosary merchant; coded rosaries double as reagent caches.
4. Greta the Midwife (45) — Underground healer; can ID forged Flow marks.
5. "Two-Fingers" Lom (33) — Keth smuggler; sells to Thalrek officers.
6. Eilwen Caro (51) — Chronicler/playwright; journals of nobles' private talks.
7. Kethan Envoy Rohl (42) — Diplomat; secret love with a Veyran princess.
8. Mina the Ledger-witch (29) — Forgery expert.
9. Alder the Cross-Signer (60) — Retired admiral; broker of merc alliances.
10. Raya the Courier (36) — Revolutionary runner with safe-houses in five nations.
`;