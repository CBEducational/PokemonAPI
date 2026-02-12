const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    
    // Cargar grilla inicial
    loadPokemonGrid();

    // Manejar búsqueda
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('search-input').value.trim().toLowerCase();
        if (query) {
            await fetchAndShowPokemon(query);
        }
    });
});

// --- FUNCIONES DE LÓGICA ---

async function loadPokemonGrid() {
    const gridContainer = document.getElementById('pokemon-grid');
    gridContainer.innerHTML = ''; // Limpiar
    
    // Generar 10 IDs aleatorios o fijos
    for (let i = 1; i <= 10; i++) {
        const data = await getPokemonData(i);
        if (data) createGridCard(data);
    }
}

async function getPokemonData(query) {
    try {
        const response = await fetch(`${API_URL}${query}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Error API:", error);
        return null;
    }
}

async function fetchAndShowPokemon(nameOrId) {
    const errorContainer = document.getElementById('error-container');
    const detailContainer = document.getElementById('pokemon-detail');
    const gridSection = document.getElementById('grid-section');
    
    // Resetear vistas
    errorContainer.style.display = 'none';
    detailContainer.style.display = 'none';
    
    const data = await getPokemonData(nameOrId);

    if (!data) {
        errorContainer.textContent = `¡No se encontró el Pokémon "${nameOrId}"! Intenta de nuevo.`;
        errorContainer.style.display = 'block';
        return;
    }

    // Si encontramos el Pokémon, ocultamos la grilla y mostramos el detalle
    gridSection.style.display = 'none';
    renderDetailView(data);
    detailContainer.style.display = 'block';
}

// --- FUNCIONES DE DIBUJADO (RENDER) ---

function createGridCard(pokemon) {
    const container = document.getElementById('pokemon-grid');
    const card = document.createElement('div');
    card.className = 'pokemon-card-mini';
    
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
        <h3 class="name">${pokemon.name}</h3>
        <div class="types-mini">
            ${pokemon.types.map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`).join('')}
        </div>
    `;

    // Al hacer click, ir al detalle
    card.addEventListener('click', () => fetchAndShowPokemon(pokemon.id));
    container.appendChild(card);
}

function renderDetailView(data) {
    const container = document.getElementById('pokemon-detail');
    
    // Cálculos simples (convertir a m y kg)
    const height = data.height / 10;
    const weight = data.weight / 10;
    const image = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;

    // Generar HTML del detalle
    container.innerHTML = `
        <div class="pokemon-header">
            <h2>${data.name.toUpperCase()} <span style="color:var(--text-muted)">#${data.id}</span></h2>
            <img src="${image}" alt="${data.name}" class="pokemon-image">
        </div>

        <div class="pokemon-details">
            <div class="detail-section">
                <h3>📊 Información Básica</h3>
                <p><strong>Altura:</strong> ${height} m</p>
                <p><strong>Peso:</strong> ${weight} kg</p>
            </div>

            <div class="detail-section">
                <h3>🎯 Tipos</h3>
                <div class="types">
                    ${data.types.map(t => `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`).join('')}
                </div>
            </div>

            <div class="detail-section">
                <h3>📈 Estadísticas Base</h3>
                <div class="stats">
                    ${data.stats.map(s => `
                        <div class="stat-row">
                            <span class="stat-name">${s.stat.name.toUpperCase()}</span>
                            <span class="stat-value">${s.base_stat}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
            <button onclick="goBack()" class="btn-back">← Volver al Inicio</button>
        </div>
    `;
}

// Función global para el botón "Volver"
window.goBack = function() {
    document.getElementById('pokemon-detail').style.display = 'none';
    document.getElementById('error-container').style.display = 'none';
    document.getElementById('grid-section').style.display = 'grid'; 
    document.getElementById('search-input').value = ''; // Limpiar input
}
