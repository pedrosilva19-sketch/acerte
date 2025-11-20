document.addEventListener("DOMContentLoaded", () => {
    function irQuestao() {
        window.location.href = "quiz.html";
    }

    function irInicio() {
        window.location.href = "index.html";
    }

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
});
