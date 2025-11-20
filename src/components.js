// Carregar componentes reutilizáveis
function loadComponents() {
    // Carregar navbar
    fetch('components/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Navbar não encontrada');
            return response.text();
        })
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
                setupNavbarEvents(); // Configurar eventos após carregar
            }
        })
        .catch(error => console.error('Erro ao carregar navbar:', error));

    // Carregar footer
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer não encontrado');
            return response.text();
        })
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) footerContainer.innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar footer:', error));
}

// Configurar eventos da navbar
function setupNavbarEvents() {
    function irInicio() {
        window.location.href = "index.html";
    }

    const logoNav = document.querySelector("#logo-nav");
    const logoText = document.querySelector("#logo-text");

    if (logoNav) {
        logoNav.addEventListener("click", irInicio);
    }

    if (logoText) {
        logoText.addEventListener("click", irInicio);
    }
}

// Configurar eventos específicos da página
function setupPageEvents() {
    function irQuestao() {
        window.location.href = "quiz.html";
    }

    const btnAction = document.querySelector("#btn-action");
    
    if (btnAction) {
        btnAction.addEventListener("click", irQuestao);
    }
}

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    setupPageEvents();
});