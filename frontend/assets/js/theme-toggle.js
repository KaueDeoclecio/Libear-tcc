document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('toggleTheme');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = 'Ativar modo escuro';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light'); 
                themeToggleBtn.textContent = 'Ativar modo escuro';
            } else {
                localStorage.setItem('theme', 'dark'); 
                themeToggleBtn.textContent = 'Ativar modo claro';
            }
        });
    }
});