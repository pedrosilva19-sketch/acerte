// Carregar componentes
function loadComponents() {
    loadNavbar();
    loadFooter();
}

function loadNavbar() {
    fetch('components/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Navbar não encontrada');
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('navbar-container');
            if (container) {
                container.innerHTML = html;
                setupNavbarEvents();
                
                // ATUALIZAR AUTH APÓS NAVBAR CARREGAR - IMPORTANTE!
                setTimeout(() => {
                    if (window.authSystem) {
                        console.log('Navbar carregada - atualizando auth UI');
                        window.authSystem.updateUI();
                    }
                }, 200);
            }
        })
        .catch(error => console.error('Erro ao carregar navbar:', error));
}

function loadFooter() {
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer não encontrado');
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('footer-container');
            if (container) container.innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar footer:', error));
}

function setupNavbarEvents() {
    // Eventos de clique na logo
    const logoNav = document.getElementById('logo-nav');
    const logoText = document.getElementById('logo-text');
    
    if (logoNav) {
        logoNav.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    if (logoText) {
        logoText.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Configurar eventos da página
function setupPageEvents() {
    const btnAction = document.getElementById('btn-action');
    if (btnAction) {
        btnAction.addEventListener('click', function() {
            if (window.authSystem && window.authSystem.isLoggedIn()) {
                window.location.href = 'quiz.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carregando componentes...');
    loadComponents();
    setupPageEvents();
});