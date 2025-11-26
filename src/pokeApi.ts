// This file can help getting the pokeapi jsons needed.
import Pokedex from "pokeapi-js-wrapper";

interface PokedexOptions {
    cache: boolean;
    cacheImages: boolean;
}

interface PokemonListItem {
    name: string;
    url: string;
}

interface PokemonListResponse {
    results: PokemonListItem[];
}

interface PokemonType {
    type: {
        name: string;
    };
}

interface PokemonCries {
    latest: string;
    legacy: string;
}

interface PokemonSprites {
    front_default: string;
}

interface PokemonDetails {
    name: string;
    order: number;
    types: PokemonType[];
    cries: PokemonCries;
    sprites: PokemonSprites;
}

interface EvolutionNode {
    species: {
        name: string;
        url: string;
    };
    evolves_to: EvolutionNode[];
}

interface EvolutionChain {
    chain: EvolutionNode;
}

interface MappedEvolutionNode {
    speciesName: string;
    speciesId: number;
    evolvesTo: MappedEvolutionNode[];
}

interface TypeListItem {
    name: string;
    url: string;
}

interface TypeListResponse {
    results: TypeListItem[];
}

interface DamageRelation {
    name: string;
    url: string;
}

interface DamageRelations {
    double_damage_from: DamageRelation[];
    double_damage_to: DamageRelation[];
    half_damage_from: DamageRelation[];
    half_damage_to: DamageRelation[];
    no_damage_from: DamageRelation[];
    no_damage_to: DamageRelation[];
}

interface TypeDetails {
    name: string;
    damage_relations: DamageRelations;
}

interface TypeRelationsMap {
    [key: string]: {
        doubleDamageFrom: string[];
        doubleDamageTo: string[];
        halfDamageFrom: string[];
        halfDamageTo: string[];
        noDamageFrom: string[];
        noDamageTo: string[];
    };
}
interface PokedexInstance {
    getPokemonsList: (options: { offset: number; limit: number }) => Promise<PokemonListResponse>;
    getPokemonByName: (name: string) => Promise<PokemonDetails>;
    getEvolutionChainById: (id: number) => Promise<EvolutionChain>;
    getTypesList: () => Promise<TypeListResponse>;
    getTypeByName: (name: string) => Promise<TypeDetails>;
}

const customOptions: PokedexOptions = {
    cache: false,
    cacheImages: false
};
const P: PokedexInstance = new (Pokedex as any)(customOptions);

const genOne = {
    offset: 0,
    limit: 151
};

// Function to fetch the Pokémon list for Generation One
export const generationOne = async (): Promise<PokemonListResponse> => {
    try {
        const response: PokemonListResponse = await P.getPokemonsList(genOne);
        return response; // Return the list of Pokémon
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        throw error;
    }
};

// Function to fetch detailed data for each Pokémon and filter specific fields
export const getAllPokemonData = async (): Promise<Partial<PokemonDetails>[]> => {
    try {
        // Get the list of Pokémon from generationOne
        const { results } = await generationOne();

        // Fetch detailed data for each Pokémon using its name
        const pokemonDataPromises = results.map(({ name }: { name: string }) =>
            P.getPokemonByName(name).then((data: PokemonDetails) => ({
                name: data.name,
                order: data.order,
                types: data.types,
                cries: data.cries,
                sprite: data.sprites.front_default
            }))
        );

        const filteredPokemonData = await Promise.all(pokemonDataPromises);

        // Save the filtered Pokémon data into a JSON file via Blob
        const fileName = "filteredGenerationOnePokemon.json";
        const jsonData = JSON.stringify(filteredPokemonData, null, 2);

        // Create a Blob and trigger download in the browser
        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        return filteredPokemonData; // Return the filtered data if needed elsewhere
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        throw error;
    }
};

export const mapEvolutionTrees = async (filteredPokemonData: Partial<PokemonDetails>[]): Promise<MappedEvolutionNode[]> => {
    try {
        const filteredNames = filteredPokemonData.map((pokemon) => pokemon.name);

        const evolutionChainPromises: Promise<EvolutionChain>[] = [];
        for (let id = 1; id <= 79; id++) {
            evolutionChainPromises.push(P.getEvolutionChainById(id));
        }

        const evolutionChains = await Promise.all(evolutionChainPromises);

        const mappedEvolutions = evolutionChains.map((chain) => {
            const mapEvolution = (evolutionNode: EvolutionNode): MappedEvolutionNode | null => {
                const speciesUrl = evolutionNode.species.url;
                const speciesId = parseInt(speciesUrl.split("/").slice(-2, -1)[0]);
                const speciesName = evolutionNode.species.name;

                // Check if the species exists in the filtered data
                if (!filteredNames.includes(speciesName)) return null;

                // Recursively map child evolutions
                const evolvesTo = evolutionNode.evolves_to.map(mapEvolution).filter(Boolean) as MappedEvolutionNode[];

                return {
                    speciesName,
                    speciesId,
                    evolvesTo
                };
            };

            return mapEvolution(chain.chain);
        });

        const cleanedEvolutions = mappedEvolutions.filter(Boolean) as MappedEvolutionNode[];

        const fileName = "mappedEvolutionTrees.json";
        const jsonData = JSON.stringify(cleanedEvolutions, null, 2);

        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        return cleanedEvolutions;
    } catch (error) {
        console.error("Error mapping evolution trees:", error);
        throw error;
    }
};

export const getTypeRelations = async (): Promise<TypeRelationsMap> => {
    try {
        // Fetch the list of Pokémon types
        const typeListResponse: TypeListResponse = await P.getTypesList();
        const types = typeListResponse.results;

        const typeRelationsPromises = types.map(async (type: TypeListItem) => {
            // Fetch detailed data for each type
            const typeDetails: TypeDetails = await P.getTypeByName(type.name);

            // Extract relevant information from damage_relations
            const damageRelations = typeDetails.damage_relations;

            return {
                name: type.name,
                damageRelations: {
                    doubleDamageFrom: damageRelations.double_damage_from.map((relation: DamageRelation) => relation.name),
                    doubleDamageTo: damageRelations.double_damage_to.map((relation: DamageRelation) => relation.name),
                    halfDamageFrom: damageRelations.half_damage_from.map((relation: DamageRelation) => relation.name),
                    halfDamageTo: damageRelations.half_damage_to.map((relation: DamageRelation) => relation.name),
                    noDamageFrom: damageRelations.no_damage_from.map((relation: DamageRelation) => relation.name),
                    noDamageTo: damageRelations.no_damage_to.map((relation: DamageRelation) => relation.name),
                }
            };
        });

        const typeRelations = await Promise.all(typeRelationsPromises);

        // Create a mapping object for better organization
        const typeRelationsMap = typeRelations.reduce((map: TypeRelationsMap, typeRelation) => {
            if (typeRelation) {
                map[typeRelation.name] = typeRelation.damageRelations;
            }
            return map;
        }, {} as TypeRelationsMap);

        const fileName = "typeRelationsMap.json";
        const jsonData = JSON.stringify(typeRelationsMap, null, 2);

        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        return typeRelationsMap;
    } catch (error) {
        console.error("Error fetching type relations:", error);
        throw error;
    }
};
