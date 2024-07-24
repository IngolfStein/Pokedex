let offset = 0;
const limit = 30;
let loading = false;
let cache = [];
let renderedPokemonIds = new Set();

async function fetchPokemonData(offset, limit) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    return data.results;
}

async function fetchCharacterData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function cacheNextBatch() {
    const nextBatch = await fetchPokemonData(offset + limit, limit);
    const characterDataPromises = nextBatch.map(pokemon => fetchCharacterData(pokemon.url));
    const characterDataArray = await Promise.all(characterDataPromises);
    cache.push(...characterDataArray);
}

async function loadCharacters() {
    const charactersContainer = document.getElementById('characters-container');
    loading = true;

    try {
        let data;
        if (cache.length > 0) {
            data = cache;
            cache = [];
        } else {
            const pokemonData = await fetchPokemonData(offset, limit);
            data = await Promise.all(pokemonData.map(pokemon => fetchCharacterData(pokemon.url)));
        }

        offset += limit;

        for (let i = 0; i < data.length; i++) {
            const characterData = data[i];

           
            if (renderedPokemonIds.has(characterData.id)) {
                continue;
            }

            renderedPokemonIds.add(characterData.id);

            let characterWrapper = document.createElement('div');
            characterWrapper.classList.add('character-wrapper');

            let characterCard = document.createElement('div');
            characterCard.classList.add('character-card');

            let characterImage = document.createElement('img');
            characterImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${characterData.id}.png`;
            characterImage.alt = characterData.name;

            let characterInfo = document.createElement('div');
            characterInfo.classList.add('character-info');

            let characterName = document.createElement('h2');
            characterName.textContent = `#${characterData.id} ${characterData.name}`;

            let characterDetails = document.createElement('p');
            characterDetails.textContent = `Height: ${characterData.height}, Weight: ${characterData.weight}`;

            characterInfo.appendChild(characterName);

            characterCard.appendChild(characterInfo);
            characterCard.appendChild(characterImage);
            characterCard.appendChild(characterDetails);

            characterWrapper.appendChild(characterCard);

            charactersContainer.appendChild(characterWrapper);
        }

        if (cache.length === 0) {
            cacheNextBatch();
        }
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon:', error);
    } finally {
        loading = false;
    }
}

window.onload = async function() {
    await loadCharacters();
    await cacheNextBatch();

    window.addEventListener('scroll', async function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !loading) {
            await loadCharacters();
            await cacheNextBatch();
        }
    });
};
