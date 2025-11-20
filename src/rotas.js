document.addEventListener("DOMContentLoaded", () => {
    function irQuestao() {
        window.location.href = "quiz.html";
    }

    function irInicio() {
        window.location.href = "index.html";
    }

    // Aguardar os componentes carregarem
    function setupEventListeners() {
        const btnAction = document.querySelector("#btn-action");
        const logoNav = document.querySelector("#logo-nav");
        const logoText = document.querySelector("#logo-text");

        if (btnAction) {
            btnAction.addEventListener("click", irQuestao);
        }

        if (logoNav) {
            logoNav.addEventListener("click", irInicio);
        }

        if (logoText) {
            logoText.addEventListener("click", irInicio);
        }
    }

    // Tentar configurar imediatamente
    setupEventListeners();

    // E também configurar após um pequeno delay para garantir que os componentes carregaram
    setTimeout(setupEventListeners, 100);

    // Opcional: Observar mudanças no DOM para elementos dinâmicos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                setupEventListeners();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});