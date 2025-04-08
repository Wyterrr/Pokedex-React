import React, { useEffect, useState } from "react";
import "./pokemon.css";

function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonImages, setPokemonImages] = useState({});

  useEffect(() => {
    const fetchFirstTenPokemon = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
        if (!response.ok) {
          throw new Error("La connexion ne marche pas");
        }
        const data = await response.json();
        setPokemon(data.results);
        await fetchAllPokemonImages(data.results);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirstTenPokemon();
  }, []);

  const fetchAllPokemonImages = async (pokemonList) => {
    const images = {};
    for (const pokemon of pokemonList) {
      try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
          throw new Error("Impossible de récupérer les détails du Pokémon");
        }
        const data = await response.json();
        images[pokemon.name] = data.sprites.front_default;
      } catch (error) {
        setError(error);
      }
    }
    setPokemonImages(images);
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
      <h1>Pokemon List</h1>
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
        </div>
      )}
      <div className="pokedex">
        <div className="pokemon-images">
          {filteredPokemon.map((p, index) => (
            <img
              key={index}
              src={pokemonImages[p.name]}
              alt={p.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pokemon;
