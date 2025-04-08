import React, { useEffect, useState } from "react";
import "./pokemon.css";

function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonImages, setPokemonImages] = useState({});
  const [pokemonTypes, setPokemonTypes] = useState({});

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=1100"
        );
        if (!response.ok) {
          throw new Error("La connexion ne marche pas");
        }
        const data = await response.json();
        setPokemon(data.results);
        await fetchAllPokemonImagesAndTypes(data.results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const fetchAllPokemonImagesAndTypes = async (pokemonList) => {
    const images = {};
    const types = {};
    for (const pokemon of pokemonList) {
      try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error("Impossible de récupérer les détails du Pokémon");
        }
        const data = await response.json();
        images[pokemon.name] = data.sprites.front_default;
        types[pokemon.name] = data.types.map((typeInfo) => typeInfo.type.name);
      } catch (error) {
        setError(error);
      }
    }
    setPokemonImages(images);
    setPokemonTypes(types);
  };

  const fetchPokemonDetails = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Impossible de récupérer les détails du Pokémon");
      }
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>PokeWewene</h1>
      <input
        type="text"
        list="pokemon-list"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <datalist id="pokemon-list">
        {filteredPokemon.map((p, index) => (
          <option
            key={index}
            value={p.name.charAt(0).toUpperCase() + p.name.slice(1)}
          />
        ))}
      </datalist>
      <button
        onClick={() => {
          const selected = pokemon.find(
            (p) => p.name.toLowerCase() === search.toLowerCase()
          );
          if (selected) {
            fetchPokemonDetails(selected.url);
          }
        }}
      >
        Show Details
      </button>
      <button
        onClick={() => {
          setSelectedPokemon(null);
          setSearch("");
        }}
      >
        X
      </button>
      <div className="container-pokedex">
        {selectedPokemon && (
          <div className="pokemon-details">
            <h2>
              {selectedPokemon.name.charAt(0).toUpperCase() +
                selectedPokemon.name.slice(1)}
            </h2>
            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
            />
            <p>Height: {selectedPokemon.height}</p>
            <p>Weight: {selectedPokemon.weight}</p>
            <p>
              Types:{" "}
              {selectedPokemon.types.map((typeInfo) => typeInfo.type.name).join(", ")}
            </p>
          </div>
        )}
        <div className="pokedex">
          <div className="pokemon-images">
            {filteredPokemon.map((p, index) => (
              <div
                className="card-pokemon"
                key={index}
                onClick={() => fetchPokemonDetails(p.url)}
              >
                <img src={pokemonImages[p.name]} alt={p.name} />
                <h3>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
                <p>Types : {pokemonTypes[p.name]?.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
