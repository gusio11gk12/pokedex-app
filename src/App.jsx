import React, { useEffect, useState } from 'react';

const PokemonCard = ({ pokemon }) => {
  const getStat = (name) => {
    const stat = pokemon.stats.find(s => s.stat.name === name);
    return stat ? stat.base_stat : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center gap-4">
      <img
        src={pokemon.sprites?.other['official-artwork'].front_default}
        alt={pokemon.name}
        className="w-32 h-32 object-contain"
      />
      <div className="flex-1 w-full">
        <h2 className="text-xl font-bold capitalize mb-2 text-center md:text-left">{pokemon.name}</h2>

        <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                type.name === 'fire' ? 'bg-red-600'
                : type.name === 'water' ? 'bg-blue-500'
                : type.name === 'grass' ? 'bg-green-600'
                : type.name === 'poison' ? 'bg-purple-500'
                : type.name === 'bug' ? 'bg-sky-200'
                : type.name === 'normal' ? 'bg-gray-400'
                : type.name === 'flying' ? 'bg-sky-400'
                : type.name === 'electric' ? 'bg-yellow-400 text-black'
                : type.name === 'psychic' ? 'bg-pink-500'
                : type.name === 'fighting' ? 'bg-orange-700'
                : type.name === 'rock' ? 'bg-yellow-800'
                : type.name === 'ground' ? 'bg-amber-700'
                : type.name === 'steel' ? 'bg-gray-500'
                : type.name === 'ghost' ? 'bg-indigo-700'
                : type.name === 'ice' ? 'bg-cyan-300 text-black'
                : type.name === 'fairy' ? 'bg-fuchsia-300 text-black'
                : 'bg-gray-500'
              }`}
              
            >
              {type.name}
            </span>
          ))}
        </div>

        <div className="text-sm space-y-2">
          {['hp', 'attack', 'defense', 'special-attack'].map(stat => (
            <div key={stat}>
              <span className="capitalize block mb-1">{stat.replace('-', ' ')}</span>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(getStat(stat), 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPokemons = async () => {
    setLoading(true);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
    const data = await res.json();
    const promises = data.results.map(p => fetch(p.url).then(res => res.json()));
    const results = await Promise.all(promises);

    setPokemonList(prev => {
      const newPokemons = results.filter(newPokemon =>
        !prev.some(pokemon => pokemon.id === newPokemon.id)
      );
      return [...prev, ...newPokemons];
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  // Filtrado de Pokémon por nombre
  const filteredPokemons = pokemonList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-4">Personajes pokemon :)</h1>

      {/* Barra de búsqueda */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPokemons.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          onClick={() => setOffset(offset + 20)}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Cargar más'}
        </button>
      </div>
    </div>
  );
}
