import { fetchApi } from './api.js';


const lessonTitleEl = document.getElementById('lesson-title');
const mediaContainerEl = document.getElementById('question-media-container');
const questionPromptEl = document.getElementById('question-prompt');
const answerOptionsEl = document.getElementById('answer-options');
const confirmButton = document.getElementById('confirm-button');
const feedbackMessageEl = document.getElementById('feedback-message');
const lessonView = document.getElementById('lesson-view');


let currentLesson = null;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;


async function initLesson() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const lessonSlug = urlParams.get('slug');

        if (!lessonSlug) throw new Error('Nenhuma lição selecionada.');

        const res = await fetchApi(`/lessons/${lessonSlug}`);
        if (!res.ok) throw new Error('Não foi possível carregar os dados da lição.');
        
        const data = await res.json();
        
        currentLesson = data.lesson;
        questions = data.questions;

        if (questions.length === 0) throw new Error('Esta lição não possui perguntas.');

        renderCurrentQuestion();
    } catch (error) {
        lessonTitleEl.textContent = 'Erro';
        questionPromptEl.textContent = error.message;
        console.error(error);
    }
}

function renderCurrentQuestion() {
    selectedAnswer = null;
    confirmButton.disabled = true;
    feedbackMessageEl.textContent = '';
    feedbackMessageEl.className = 'feedback';
    
    const question = questions[currentQuestionIndex];

    lessonTitleEl.textContent = currentLesson.title;
    questionPromptEl.textContent = question.prompt;
    
    mediaContainerEl.innerHTML = '';
    if (question.media_url) {
        if (question.media_url.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = question.media_url;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            mediaContainerEl.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = question.media_url;
            mediaContainerEl.appendChild(img);
        }
    }
    
    answerOptionsEl.innerHTML = '';
    const options = JSON.parse(question.options);
    options.forEach(optionText => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = optionText;
        button.dataset.answer = optionText;
        button.addEventListener('click', () => handleOptionSelect(button));
        answerOptionsEl.appendChild(button);
    });
}

/**
 * @param {HTMLButtonElement} selectedButton 
 */
function handleOptionSelect(selectedButton) {
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    selectedButton.classList.add('selected');
    selectedAnswer = selectedButton.dataset.answer;
    confirmButton.disabled = false;
}


async function handleConfirm() {
    if (!selectedAnswer) return;

    confirmButton.disabled = true;
    const question = questions[currentQuestionIndex];
    const correctAnswer = JSON.parse(question.correct_answer).answer;

    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    const selectedButton = document.querySelector(`.option-btn[data-answer="${selectedAnswer}"]`);

    if (selectedAnswer === correctAnswer) {
        score += 10;
        feedbackMessageEl.textContent = 'Correto!';
        feedbackMessageEl.className = 'feedback correct';
        selectedButton.classList.add('correct');
    } else {
        feedbackMessageEl.textContent = `Incorreto! A resposta era "${correctAnswer}".`;
        feedbackMessageEl.className = 'feedback incorrect';
        selectedButton.classList.add('incorrect');
        const correctButton = document.querySelector(`.option-btn[data-answer="${correctAnswer}"]`);
        if (correctButton) correctButton.classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderCurrentQuestion();
        } else {
            finishLesson();
        }
    }, 2000);
}

async function finishLesson() {
    const totalQuestions = questions.length;
    lessonView.innerHTML = `
        <div class="lesson-summary">
            <h2>Lição Concluída!</h2>
            <p>Sua pontuação: ${score} de ${totalQuestions * 10}</p>
            <a href="dashboard.html" class="btn-confirm">Voltar ao Dashboard</a>
        </div>
    `;

    try {
        await fetchApi(`/progress/submit/${currentLesson.slug}`, {
            method: 'POST',
            body: JSON.stringify({ score, completed: true })
        });
    } catch (error) {
        console.error("Erro ao submeter o progresso:", error);
    }
}

confirmButton.addEventListener('click', handleConfirm);
document.addEventListener('DOMContentLoaded', initLesson);