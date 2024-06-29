document.addEventListener('DOMContentLoaded', () => {
    const charactersButton = document.querySelector('.characters');
    const searchButton = document.querySelector('.search');

    charactersButton.addEventListener('click', fetchAllCharacters);
    searchButton.addEventListener('click', fetchFilteredCharacters);

    function fetchAllCharacters() {
        fetchCharacters('https://rickandmortyapi.com/api/character');
    }

    function fetchFilteredCharacters() {
        let query = 'https://rickandmortyapi.com/api/character/?';
        const name = document.getElementById('name').value.trim();
        const status = document.getElementById('status').value.trim();
        const species = document.getElementById('species').value.trim();
        const type = document.getElementById('type').value.trim();
        const gender = document.getElementById('gender').value.trim();

        if (name) query += `name=${name}&`;
        if (status) query += `status=${status}&`;
        if (species) query += `species=${species}&`;
        if (type) query += `type=${type}&`;
        if (gender) query += `gender=${gender}&`;

        fetchCharacters(query.slice(0, -1));  // Remove trailing "&"
    }

    function fetchCharacters(url) {
        let allCharacters = [];

        function fetchPage(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    allCharacters = allCharacters.concat(data.results);
                    if (data.info.next) {
                        fetchPage(data.info.next);
                    } else {
                        renderCharacters(allCharacters);
                    }
                })
                .catch(error => showError(error));
        }

        fetchPage(url);
    }

    function renderCharacters(characters) {
        const main = document.querySelector('main');
        let resultsSection = document.querySelector('.results');

        if (resultsSection) {
            resultsSection.remove();
        }

        resultsSection = document.createElement('section');
        resultsSection.className = 'results';

        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Especie</th>
                <th>Tipo</th>
                <th>Género</th>
            </tr>
        `;

        characters.forEach(character => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${character.name}</td>
                <td>${character.status}</td>
                <td>${character.species}</td>
                <td>${character.type || 'N/A'}</td>
                <td>${character.gender}</td>
            `;
            table.appendChild(row);
        });

        resultsSection.appendChild(table);
        main.appendChild(resultsSection);
    }

    function showError(error) {
        const main = document.querySelector('main');
        let errorDiv = document.querySelector('.error');

        if (errorDiv) {
            errorDiv.remove();
        }

        errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = `Error: ${error.message}`;
        main.appendChild(errorDiv);
    }
});