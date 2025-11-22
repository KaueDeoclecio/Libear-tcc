import { fetchApi } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const formMessage = document.getElementById('form-message');

    if (!loginForm) return; 

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (formMessage) {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            if (formMessage) {
                formMessage.textContent = 'Preencha todos os campos!';
                formMessage.classList.add('error');
            }
            return;
        }

        try {
            const res = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                let errorMessage = 'Erro ao fazer login';
                
                if (data.errors && data.errors.length > 0) {
                    errorMessage = data.errors[0].msg; 
                } else if (data.message) {
                    errorMessage = data.message; 
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            if (formMessage) {
                formMessage.textContent = error.message;
                formMessage.classList.add('error');
            }
            console.error('Erro no login:', error);
        }
    });
});