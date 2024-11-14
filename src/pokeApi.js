// This file can help getting the pokeapi jsons needed.
const Pokedex = require("pokeapi-js-wrapper");

const customOptions = {
    cache: false,
    cacheImages: false
};
const P = new Pokedex.Pokedex(customOptions);

const genOne = {
    offset: 0,
    limit: 151
};

// Function to fetch the Pokémon list for Generation One
export const generationOne = async () => {
    try {
        const response = await P.getPokemonsList(genOne);
        console.log("Fetched Pokémon List:", response);
        return response; // Return the list of Pokémon
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
        throw error;
    }
};

// Function to fetch detailed data for each Pokémon and filter specific fields
export const getAllPokemonData = async () => {
    try {
        // Get the list of Pokémon from generationOne
        const { results } = await generationOne();

        // Fetch detailed data for each Pokémon using its name
        const pokemonDataPromises = results.map(({ name }) =>
            P.getPokemonByName(name).then((data) => ({
                name: data.name,
                order: data.order,
                types: data.types,
                cries: data.cries,
                sprite: data.sprites.front_default
            }))
        );

        const filteredPokemonData = await Promise.all(pokemonDataPromises);

        console.log("Filtered Pokémon Details:", filteredPokemonData);

        // Save the filtered Pokémon data into a JSON file via Blob
        const fileName = "filteredGenerationOnePokemon.json";
        const jsonData = JSON.stringify(filteredPokemonData, null, 2);

        // Create a Blob and trigger download in the browser
        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        console.log("Filtered Pokémon data saved as a JSON file in the browser");

        return filteredPokemonData; // Return the filtered data if needed elsewhere
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        throw error;
    }
};

export const mapEvolutionTrees = async (filteredPokemonData) => {
    try {
        const filteredNames = filteredPokemonData.map((pokemon) => pokemon.name);

        const evolutionChainPromises = [];
        for (let id = 1; id <= 79; id++) {
            evolutionChainPromises.push(P.getEvolutionChainById(id));
        }

        const evolutionChains = await Promise.all(evolutionChainPromises);

        const mappedEvolutions = evolutionChains.map((chain) => {
            const mapEvolution = (evolutionNode) => {
                const speciesUrl = evolutionNode.species.url;
                const speciesId = parseInt(speciesUrl.split("/").slice(-2, -1)[0]);
                const speciesName = evolutionNode.species.name;

                // Check if the species exists in the filtered data
                if (!filteredNames.includes(speciesName)) return null;

                // Recursively map child evolutions
                const evolvesTo = evolutionNode.evolves_to.map(mapEvolution).filter(Boolean);

                return {
                    speciesName,
                    speciesId,
                    evolvesTo
                };
            };

            return mapEvolution(chain.chain);
        });

        // Filter out empty evolution trees
        const cleanedEvolutions = mappedEvolutions.filter(Boolean);

        console.log("Mapped Evolution Trees:", cleanedEvolutions);

        // Save the evolution tree as a Blob
        const fileName = "mappedEvolutionTrees.json";
        const jsonData = JSON.stringify(cleanedEvolutions, null, 2);

        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        console.log(`Evolution trees saved to ${fileName}`);
        return cleanedEvolutions;
    } catch (error) {
        console.error("Error mapping evolution trees:", error);
        throw error;
    }
};

