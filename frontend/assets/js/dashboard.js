import { fetchApi } from './api.js';


async function loadProgressData() {
    const lessonsCompletedEl = document.getElementById("lessons-completed");
    const totalPointsEl = document.getElementById("total-points");
    if (!lessonsCompletedEl || !totalPointsEl) return;

    try {
        const res = await fetchApi('/progress');
        if (!res.ok) {
            if (res.status === 401) window.location.href = 'login.html';
            throw new Error('Falha ao buscar progresso');
        }
        
        const data = await res.json();
        lessonsCompletedEl.textContent = data.completed || 0;
        totalPointsEl.textContent = data.points || 0;
    } catch (err) {
        console.error('Erro no dashboard:', err.message);
        lessonsCompletedEl.textContent = 0;
        totalPointsEl.textContent = 0;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    loadProgressData();
});