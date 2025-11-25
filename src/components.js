// Carregar componentes
function loadComponents() {
    loadNavbar();
    loadFooter();
}

function loadNavbar() {
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('navbar-container');
            if (container) {
                container.innerHTML = html;
                setupNavbarEvents();
                
                // ATUALIZAR NAVEGAÇÃO APÓS NAVBAR CARREGAR
                setTimeout(() => {
                    if (window.authSystem) {
                        console.log('Atualizando navegação após navbar carregar');
                        window.authSystem.updateNavigation();
                    }
                }, 100);
            }
        })
        .catch(error => console.error('Erro ao carregar navbar:', error));
}

function loadFooter() {
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('footer-container');
            if (container) container.innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar footer:', error));
}

function setupNavbarEvents() {
    // Eventos de clique na logo
    document.addEventListener('click', function(e) {
        if (e.target.id === 'logo-nav' || e.target.id === 'logo-text') {
            window.location.href = 'index.html';
        }
    });
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
    console.log('Iniciando componentes...');
    loadComponents();
    setupPageEvents();
});