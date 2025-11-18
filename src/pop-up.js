function fecharPopup() {
    document.getElementById('popup').classList.remove('show');
    document.querySelector('.botao-responder').disabled = false;
    
    // Limpa seleção
    const selecionada = document.querySelector('.opcao.selecionada');
    if (selecionada) selecionada.classList.remove('selecionada');
    opcaoSelecionada = null;
}

// Fecha com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') fecharPopup();
});