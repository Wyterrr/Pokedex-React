import React, { useEffect, useState } from 'react';
import './pokemon.css'; // Assurez-vous d'importer le fichier CSS

function Pokemon() {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState(null); // État pour le Pokémon sélectionné

    useEffect(() => {
        const fetchAllPokemon = async () => {
            try {
                let allPokemon = [];
                let nextUrl = 'https://pokeapi.co/api/v2/pokemon/';
                
                while (nextUrl) {
                    const response = await fetch(nextUrl);
                    if (!response.ok) {
                        throw new Error('La connexion ne marche pas');
                    }
                    const data = await response.json();
                    allPokemon = [...allPokemon, ...data.results];
                    nextUrl = data.next; // URL de la page suivante
                }
    
                setPokemon(allPokemon);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAllPokemon();
    }, []);

    const fetchPokemonDetails = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Impossible de récupérer les détails du Pokémon');
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
                    <option key={index} value={p.name} />
                ))}
            </datalist>
            <button
                onClick={() => {
                    const selected = pokemon.find((p) => p.name.toLowerCase() === search.toLowerCase());
                    if (selected) {
                        fetchPokemonDetails(selected.url);
                    }
                }}
            >
                Show Details
            </button>
            {selectedPokemon && (
                <div className='pokemon-details'>
                    <h2>{selectedPokemon.name}</h2>
                    <img
                        src={selectedPokemon.sprites.front_default}
                        alt={selectedPokemon.name}
                    />
                    <p>Height: {selectedPokemon.height}</p>
                    <p>Weight: {selectedPokemon.weight}</p>
                </div>
            )}
        </div>
    );
}

export default Pokemon;