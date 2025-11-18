let opcaoSelecionada = null;

function selecionarOpcao(el) {
    document.querySelectorAll('.opcao').forEach(op => op.classList.remove('selecionada'));
    el.classList.add('selecionada');
    opcaoSelecionada = el;
}

function responder() {
    if (!opcaoSelecionada) {
        alert("Selecione uma alternativa antes de responder!");
        return;
    }

    const acertou = opcaoSelecionada.getAttribute('data-correta') === 'true';
    const msg = acertou
        ? "Parabéns! Você acertou!"
        : "Que pena! Você errou.<br><small>A correta é <strong>DALL·E</strong>.</small>";

    document.getElementById('popup-message').innerHTML = msg;
    document.getElementById('popup').classList.add('show');

    // Desativa botão
    document.querySelector('.botao-responder').disabled = true;
}

function fecharPopup() {
    document.getElementById('popup').classList.remove('show');
    document.querySelector('.botao-responder').disabled = false;
    opcaoSelecionada = null;
    document.querySelectorAll('.opcao').forEach(op => op.classList.remove('selecionada'));
}

// Fecha com ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharPopup();
});