import { fetchApi } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const logoutBtn = document.getElementById('logoutBtn');
    const inputAvatar = document.getElementById('inputAvatar');
    const avatarPreview = document.getElementById('avatarPreview');
    const perfilForm = document.querySelector('.perfil-form');

    const savedAvatar = localStorage.getItem('avatarImage');
    if (savedAvatar && avatarPreview) {
        avatarPreview.style.display = 'block'; 
        avatarPreview.src = savedAvatar;
    }

    try {
        const res = await fetchApi('/auth/me');
        
        if (res.ok) {
            const user = await res.json();
            // Preenche os campos com dados do backend
            if (nomeInput) nomeInput.value = user.name;
            if (emailInput) emailInput.value = user.email;
        } else if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }

    if (perfilForm) {
        perfilForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const novoNome = nomeInput.value.trim();
            const btnSalvar = perfilForm.querySelector('.btn-salvar');
            
            if(!novoNome) return alert('O nome não pode ser vazio.');

            const textoOriginal = btnSalvar.textContent;
            btnSalvar.textContent = 'Salvando...';
            btnSalvar.disabled = true;

            try {
                const res = await fetchApi('/auth/me', {
                    method: 'PUT',
                    body: JSON.stringify({ name: novoNome })
                });

                if (res.ok) {
                    alert('Nome alterado com sucesso!');
                } else {
                    alert('Erro ao salvar alterações.');
                }
            } catch (error) {
                console.error('Erro ao salvar:', error);
                alert('Erro de conexão.');
            } finally {
                btnSalvar.textContent = textoOriginal;
                btnSalvar.disabled = false;
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }

    if (inputAvatar && avatarPreview) {
        inputAvatar.addEventListener('change', function(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const base64Image = e.target.result;
                    
                    avatarPreview.style.display = 'block';
                    avatarPreview.src = base64Image;

                    try {
                        localStorage.setItem('avatarImage', base64Image);
                    } catch (err) {
                        console.error("Imagem muito grande para o localStorage", err);
                        alert("A imagem é muito grande para ser salva no navegador. Tente uma menor.");
                    }
                }

                reader.readAsDataURL(file);
            }
        });
    }
});