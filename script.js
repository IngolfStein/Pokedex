async function loadCharacters() {
    const charactersContainer = document.getElementById('characters-container');

    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150&offset=0');
        const data = await response.json();

        for (let i = 0; i < data.results.length; i++) {
            let characterUrl = data.results[i].url;
            let characterResponse = await fetch(characterUrl);
            let characterData = await characterResponse.json();

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
            characterInfo.appendChild(characterDetails);

            characterCard.appendChild(characterInfo);
            characterCard.appendChild(characterImage);

            characterWrapper.appendChild(characterCard);

            charactersContainer.appendChild(characterWrapper);
        }
    } catch (error) {
        console.error('Fehler beim Laden der Pokémon:', error);
    }
}

window.onload = async function() {
    await loadCharacters();
};
