import { fetchApi } from './api.js';


function createLessonButton(lesson) {
    const lessonButton = document.createElement('a');
    lessonButton.className = 'lesson-btn';
    lessonButton.href = `lesson.html?slug=${lesson.slug}`;
    lessonButton.title = lesson.title; 
    return lessonButton;
}

async function loadLessons() {
    const beginnerContainer = document.getElementById('lessons-beginner');
    const intermediateContainer = document.getElementById('lessons-intermediate');
    const hardContainer = document.getElementById('lessons-hard');

    beginnerContainer.innerHTML = '';
    intermediateContainer.innerHTML = '';
    hardContainer.innerHTML = '';

    try {
        const res = await fetchApi('/lessons');
        
        if (!res.ok) {
            if (res.status === 401) {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return; 
            }
            throw new Error(`Falha na API: ${res.statusText}`);
        }
        
        const allLessons = await res.json();

        if (allLessons.length === 0) {
            beginnerContainer.innerHTML = '<p>Nenhuma lição disponível.</p>';
            return;
        }


        const level1Lessons = allLessons.filter(lesson => lesson.level === 1);
        const level2Lessons = allLessons.filter(lesson => lesson.level === 2);
        const level3Lessons = allLessons.filter(lesson => lesson.level === 3);

        if (level1Lessons.length > 0) {
            beginnerContainer.appendChild(createLessonButton(level1Lessons[0]));
        } else {
            beginnerContainer.innerHTML = '<p>Nenhuma lição.</p>';
        }

        if (level2Lessons.length > 0) {
            intermediateContainer.appendChild(createLessonButton(level2Lessons[0]));
        } else {
            intermediateContainer.innerHTML = '<p>Nenhuma lição.</p>';
        }

        if (level3Lessons.length > 0) {
            hardContainer.appendChild(createLessonButton(level3Lessons[0]));
        } else {
            hardContainer.innerHTML = '<p>Nenhuma lição.</p>';
        }

    } catch (error) {
        beginnerContainer.innerHTML = '<p class="error-message">Não foi possível carregar as lições.</p>';
        console.error('Erro ao carregar lições:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; 
        return;
    }
    loadLessons();
});