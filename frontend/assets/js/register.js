import { fetchApi } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const formMessage = document.getElementById('form-message');

    if (!registerForm) return;

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        formMessage.textContent = '';
        formMessage.className = 'form-message';

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const res = await fetchApi('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                formMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
                formMessage.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                let errorMessage = 'Erro ao cadastrar';
                if (data.errors && data.errors.length > 0) {
                    errorMessage = data.errors[0].msg;
                } else if (data.message) {
                    errorMessage = data.message;
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            formMessage.textContent = error.message;
            formMessage.classList.add('error');
            console.error('Erro ao cadastrar:', error);
        }
    });
});