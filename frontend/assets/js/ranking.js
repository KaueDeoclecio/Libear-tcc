import { fetchApi } from './api.js';


async function loadLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    try {
        const res = await fetchApi('/leaderboard');
        if (!res.ok) {
            if (res.status === 401) window.location.href = 'login.html';
            throw new Error('Falha ao carregar o ranking');
        }
        const leaderboardData = await res.json();

        if (leaderboardData.length === 0) {
            list.innerHTML = '<p>Ainda não há jogadores no ranking.</p>';
            return;
        }
        
        list.innerHTML = ''; 

        leaderboardData.forEach((user, index) => {
            const rank = index + 1;
            const li = document.createElement('li');
            li.className = 'leaderboard-item';

            if (rank === 1) li.classList.add('gold');
            if (rank === 2) li.classList.add('silver');
            if (rank === 3) li.classList.add('bronze');

            li.innerHTML = `
                <span class="rank">${rank}</span>
                <span class="name">${user.name}</span>
                <span class="xp">${user.total_xp} XP</span>
            `;
            list.appendChild(li);
        });

    } catch (error) {
        list.innerHTML = '<p class="error-message">Não foi possível carregar o ranking.</p>';
        console.error('Erro ao carregar ranking:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadLeaderboard);