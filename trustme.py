import json
import os

def create_individual_pokemon_files_with_evolutions(input_file, evolution_file):
    try:
        # Load the filtered Pokémon data
        with open(input_file, 'r') as file:
            pokemon_data = json.load(file)

        # Load the mapped evolution trees
        with open(evolution_file, 'r') as file:
            evolution_trees = json.load(file)

        # Create a lookup dictionary for Pokémon data
        pokemon_lookup = {pokemon['name']: pokemon for pokemon in pokemon_data}

        # Add Evolves field using the evolution trees
        for tree in evolution_trees:
            def map_evolves(evolution):
                if evolution["speciesName"] in pokemon_lookup:
                    return {
                        "name": evolution["speciesName"],
                        "file": f"{pokemon_lookup[evolution['speciesName']]['order']:03d}_{evolution['speciesName']}.json"
                    }
                return None

            def traverse_tree(node):
                if node["speciesName"] not in pokemon_lookup:
                    return
                pokemon = pokemon_lookup[node["speciesName"]]
                pokemon["Evolves"] = [
                    map_evolves(evolve) for evolve in node["evolvesTo"]
                    if map_evolves(evolve)
                ]

            traverse_tree(tree)

        # Create an output directory to store the files
        output_dir = "pokemons"
        os.makedirs(output_dir, exist_ok=True)

        # Write individual JSON files for each Pokémon
        for pokemon in pokemon_data:
            pokemon_name = pokemon["name"]
            pokemon_order = pokemon["order"]

            # Prefix the file name with the Pokémon order
            output_file = os.path.join(output_dir, f"{pokemon_order:03d}_{pokemon_name}.json")

            with open(output_file, 'w') as outfile:
                json.dump(pokemon, outfile, indent=4)

            print(f"Created file: {output_file}")

    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
if __name__ == "__main__":
    input_file = "filteredGenerationOnePokemon.json"  # Replace with the path to your Pokémon data JSON
    evolution_file = "mappedEvolutionTrees.json"  # Replace with the path to your evolution trees JSON
    create_individual_pokemon_files_with_evolutions(input_file, evolution_file)
