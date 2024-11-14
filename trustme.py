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

        # Add evolvesTo and evolvedFrom fields using the evolution trees
        for tree in evolution_trees:
            def map_evolves_to(evolution, parent_name=None):
                species_name = evolution["speciesName"]

                # Skip species not in the filtered data
                if species_name not in pokemon_lookup:
                    return None

                # Add the evolvedFrom field for the current Pokémon
                pokemon = pokemon_lookup[species_name]
                if parent_name:
                    pokemon["evolvedFrom"] = {
                        "name": parent_name,
                        "file": f"{pokemon_lookup[parent_name]['order']:03d}_{parent_name}.json"
                    }
                else:
                    pokemon["evolvedFrom"] = None

                # Determine the next evolution (evolvesTo)
                next_evolves = [
                    {
                        "name": child["speciesName"],
                        "file": f"{pokemon_lookup[child['speciesName']]['order']:03d}_{child['speciesName']}.json"
                    }
                    for child in evolution["evolvesTo"]
                    if child["speciesName"] in pokemon_lookup
                ]

                # Add evolvesTo field (only a single object or None)
                pokemon["evolvesTo"] = next_evolves[0] if next_evolves else None

                # Recursively process child evolutions
                for child in evolution["evolvesTo"]:
                    map_evolves_to(child, species_name)

            # Traverse the tree starting from the root
            map_evolves_to(tree)

        # Create an output directory to store the files
        output_dir = "./src/assets/pokemon"
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
