// ======================================================================
// CONFIGURAÇÕES INICIAIS E VARIÁVEIS DO SISTEMA
// ======================================================================

const STORAGE_KEY = 'quiz_ia_respostas_2025';
let todasQuestoes = [];
let questoesSorteadas = [];
let indiceAtual = 0;
let acertos = 0;
let respostasUsuario = {};
let dadosSalvos = null;

// ======================================================================
// CARREGA DADOS SALVOS
// ======================================================================
function carregarDadosSalvos() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
        dadosSalvos = JSON.parse(salvo);
        respostasUsuario = dadosSalvos.respostas || {};
        indiceAtual = dadosSalvos.indiceAtual || 0;
        acertos = dadosSalvos.acertos || 0;
        questoesSorteadas = dadosSalvos.questoesSorteadas || [];
    }
}

function salvarDados() {
    const dados = {
        respostas: respostasUsuario,
        indiceAtual: indiceAtual,
        acertos: acertos,
        questoesSorteadas: questoesSorteadas,
        data: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

// ======================================================================
// SORTEIA 10 QUESTÕES ALEATÓRIAS
// ======================================================================
function sortearQuestoes(questoes, quantidade = 10) {
    // Embaralha o array de questões
    const embaralhadas = [...questoes].sort(() => Math.random() - 0.5);
    // Pega as primeiras 'quantidade' questões
    return embaralhadas.slice(0, quantidade);
}

// ======================================================================
// CARREGA QUESTÕES DO JSON
// ======================================================================
fetch('questoes.json')
    .then(res => res.json())
    .then(data => {
        todasQuestoes = data.questoes;
        
        carregarDadosSalvos();

        // Se não há questões sorteadas salvas, sorteia 10 novas
        if (questoesSorteadas.length === 0) {
            questoesSorteadas = sortearQuestoes(todasQuestoes, 10);
            // Renumera os IDs para 1 a 10
            questoesSorteadas = questoesSorteadas.map((questao, index) => ({
                ...questao,
                id: index + 1,
                titulo: `Questão ${index + 1}`
            }));
            indiceAtual = 0;
            acertos = 0;
            respostasUsuario = {};
            salvarDados();
        }

        document.getElementById('total').textContent = 10;

        // Mostra a tela do quiz
        document.getElementById('questao-atual').style.display = 'block';

        atualizarBotoes();
        mostrarQuestao();
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('Não foi possível carregar as questões. Verifique o arquivo questoes.json');
    });

// ======================================================================
// EXIBE A QUESTÃO ATUAL
// ======================================================================
function mostrarQuestao() {
    if (indiceAtual >= 10) {
        mostrarResultadoFinal();
        return;
    }

    const q = questoesSorteadas[indiceAtual];

    document.getElementById('atual').textContent = indiceAtual + 1;
    document.getElementById('titulo').textContent = `Questão ${indiceAtual + 1}`;
    document.getElementById('enunciado').innerHTML = q.enunciado;

    const opcoesDiv = document.getElementById('opcoes');
    opcoesDiv.innerHTML = '';

    q.alternativas.forEach(alt => {
        const div = document.createElement('div');
        div.className = 'opcao';
        div.innerHTML = `<div class="letra">${alt.letra}</div><span>${alt.texto}</span>`;

        div.onclick = function () {
            document.querySelectorAll('.opcao').forEach(op => op.classList.remove('selecionada'));
            this.classList.add('selecionada');
            respostasUsuario[indiceAtual] = alt.letra;

            document.getElementById('btn-proximo').disabled = false;
            salvarDados();
        };

        opcoesDiv.appendChild(div);
    });

    // Restaura seleção salva (se houver)
    if (respostasUsuario[indiceAtual]) {
        document.querySelectorAll('.opcao').forEach(op => {
            if (op.querySelector('.letra').textContent === respostasUsuario[indiceAtual]) {
                op.classList.add('selecionada');
            }
        });
        document.getElementById('btn-proximo').disabled = false;
    } else {
        document.getElementById('btn-proximo').disabled = true;
    }

    atualizarBotoes();
}

// ======================================================================
// ATUALIZA BOTÕES
// ======================================================================
function atualizarBotoes() {
    const btnVoltar = document.getElementById('btn-voltar');
    btnVoltar.style.display = indiceAtual === 0 ? 'none' : 'block';

    const btnProximo = document.getElementById('btn-proximo');
    btnProximo.textContent = indiceAtual === 9 ? 'Finalizar Quiz' : 'Próxima →';
}

// ======================================================================
// VERIFICA RESPOSTA E MOSTRA POPUP
// ======================================================================
function verificarResposta() {
    const resposta = respostasUsuario[indiceAtual];
    if (!resposta) {
        alert('Selecione uma alternativa!');
        return;
    }

    const q = questoesSorteadas[indiceAtual];
    const altEscolhida = q.alternativas.find(a => a.letra === resposta);
    const acertou = altEscolhida && (altEscolhida.correta === true || altEscolhida.correta === "true");

    // Marca visualmente correta/errada
    document.querySelectorAll('.opcao').forEach(op => {
        op.classList.remove('correta', 'errada');
        const letra = op.querySelector('.letra').textContent;
        const alt = q.alternativas.find(a => a.letra === letra);

        if (alt.correta === true || alt.correta === "true") {
            op.classList.add('correta');
        } else if (letra === resposta) {
            op.classList.add('errada');
        }
    });

    // Popup
    const msg = document.getElementById('popup-message');
    const popup = document.getElementById('popup');
    const btnContinuar = document.getElementById('btn-continuar');

    if (acertou) {
        msg.textContent = "Parabéns você acertou!";
        msg.style.color = '#00ff99';
        btnContinuar.style.background = 'linear-gradient(90deg, #00ff99, #00cc66)';
    } else {
        msg.textContent = "Ops, Resposta errada!";
        msg.style.color = '#ff6666';
        btnContinuar.style.background = 'linear-gradient(90deg, #ff4444, #cc0000)';
        btnContinuar.style.color = 'white';
    }

    popup.style.display = 'flex'; // mostra o popup
}

// ======================================================================
// FECHA POPUP E AVANÇA
// ======================================================================
function fecharPopup() {
    document.getElementById('popup').style.display = 'none';

    calcularAcertosTotais();

    if (indiceAtual === 9) {
        mostrarResultadoFinal();
    } else {
        indiceAtual++;
        salvarDados();
        mostrarQuestao();
    }
}

// ======================================================================
// VOLTA QUESTÃO
// ======================================================================
function voltarQuestao() {
    if (indiceAtual === 0) return;
    indiceAtual--;
    salvarDados();
    mostrarQuestao();
}

// ======================================================================
// RESULTADO FINAL
// ======================================================================
function calcularAcertosTotais() {
    acertos = 0;
    for (let i = 0; i < 10; i++) {
        const resp = respostasUsuario[i];
        if (resp) {
            const alt = questoesSorteadas[i].alternativas.find(a => a.letra === resp);
            if (alt && (alt.correta === true || alt.correta === "true")) acertos++;
        }
    }
}

function mostrarResultadoFinal() {
    calcularAcertosTotais();
    const percentual = Math.round((acertos / 10) * 100);

    document.getElementById('questao-atual').style.display = 'none';
    document.getElementById('tela-final').style.display = 'block';

    document.getElementById('resultado-final').innerHTML = `
        <h2 style="font-size:3.5rem; margin:20px 0; background: linear-gradient(90deg, #00ff99, #00ccff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${acertos} / 10
        </h2>
        <p style="font-size:2.4rem; color:#00ff99;">${percentual}% de acerto</p>
        <p style="font-size:1.8rem; margin:30px 0;">
            ${acertos >= 9 ? 'GÊNIAL!' :
              acertos >= 7 ? 'Excelente desempenho!' :
              acertos >= 5 ? 'Muito bom, Continue assim!' :
              'Valeu o esforço, Estude mais e volte com tudo!'}
        </p>
    `;
}

// ======================================================================
// REINICIAR QUIZ
// ======================================================================
function reiniciarQuiz() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}