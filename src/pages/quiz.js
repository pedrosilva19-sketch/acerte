// pages/quiz.js
import Head from "next/head";
import { useEffect, useState } from "react";

const STORAGE_KEY = 'quiz_ia_respostas_2025';

export default function QuizPage() {
  const [todasQuestoes, setTodasQuestoes] = useState([]);
  const [questoesSorteadas, setQuestoesSorteadas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostasUsuario, setRespostasUsuario] = useState({}); // {0: 'A', 1:'C', ...}
  const [resultadoVisivel, setResultadoVisivel] = useState(false);
  const [popup, setPopup] = useState({ aberto: false, acertou: false, mensagem: '' });
  const [marcacoes, setMarcacoes] = useState({}); // {letra: 'correta'|'errada'}
  const totalQuestoes = 10;

  // carrega perguntas
  useEffect(() => {
    fetch('/data/quiz.json')
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar /data/quiz.json');
        return res.json();
      })
      .then(data => {
        setTodasQuestoes(data.questoes || []);
      })
      .catch(err => {
        console.error(err);
        alert('Não foi possível carregar as questões. Verifique /public/data/quiz.json');
      });
  }, []);

  // sorteia e inicializa quando todasQuestoes muda
  useEffect(() => {
    if (!todasQuestoes || todasQuestoes.length === 0) return;
    inicializarQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todasQuestoes]);

  function embaralhar(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function sortearNovasQuestoes(questoes, quantidade = totalQuestoes) {
    const embaralhadas = embaralhar(questoes);
    return embaralhadas.slice(0, quantidade).map((q, i) => ({
      ...q,
      id: i + 1,
      titulo: `Questão ${i + 1}`
    }));
  }

  function inicializarQuiz() {
    const sorteadas = sortearNovasQuestoes(todasQuestoes, totalQuestoes);
    setQuestoesSorteadas(sorteadas);
    setIndiceAtual(0);
    setRespostasUsuario({});
    setResultadoVisivel(false);
    setPopup({ aberto: false, acertou: false, mensagem: '' });
    setMarcacoes({});
    localStorage.removeItem(STORAGE_KEY);
  }

  // salva respostas no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(respostasUsuario));
  }, [respostasUsuario]);

  if (!questoesSorteadas || questoesSorteadas.length === 0) {
    return (
      <>
        <Head>
          <title>Acerte! • Quiz</title>
          <link rel="stylesheet" href="/css/index.css" />
        </Head>
        <div style={{ padding: 40, textAlign: 'center' }}>
          Carregando quiz...
        </div>
      </>
    );
  }

  const questao = questoesSorteadas[indiceAtual];

  function selecionarAlternativa(letra) {
    setRespostasUsuario(prev => ({ ...prev, [indiceAtual]: letra }));
  }

  function verificarResposta() {
    const resposta = respostasUsuario[indiceAtual];
    if (!resposta) {
      alert('Selecione uma alternativa!');
      return;
    }

    const alternativaEscolhida = questao.alternativas.find(a => a.letra === resposta);
    const acertou = alternativaEscolhida && (alternativaEscolhida.correta === true || alternativaEscolhida.correta === "true");

    // monta marcações para mostrar correta/errada
    const novasMarcacoes = {};
    questao.alternativas.forEach(a => {
      if (a.correta === true || a.correta === "true") {
        novasMarcacoes[a.letra] = 'correta';
      } else if (a.letra === resposta) {
        novasMarcacoes[a.letra] = 'errada';
      } else {
        novasMarcacoes[a.letra] = '';
      }
    });

    setMarcacoes(novasMarcacoes);

    setPopup({
      aberto: true,
      acertou,
      mensagem: acertou ? 'Parabéns você acertou!' : 'Ops, Resposta errada!'
    });
  }

  function fecharPopup() {
    setPopup({ aberto: false, acertou: false, mensagem: '' });

    if (indiceAtual === totalQuestoes - 1) {
      mostrarResultadoFinal();
      return;
    }
    setIndiceAtual(prev => prev + 1);
    setMarcacoes({});
  }

  function voltarQuestao() {
    if (indiceAtual === 0) return;
    setIndiceAtual(prev => prev - 1);
    setMarcacoes({});
  }

  function calcularAcertosTotais() {
    let acertos = 0;
    for (let i = 0; i < totalQuestoes; i++) {
      const resp = respostasUsuario[i];
      if (!resp) continue;
      const alt = questoesSorteadas[i].alternativas.find(a => a.letra === resp);
      if (alt && (alt.correta === true || alt.correta === "true")) acertos++;
    }
    return acertos;
  }

  function mostrarResultadoFinal() {
    setResultadoVisivel(true);
  }

  function jogarNovamente() {
    inicializarQuiz();
  }

  // helper para classe de opção
  function classeOpcao(letra) {
    let classes = 'opcao';
    if (respostasUsuario[indiceAtual] === letra) classes += ' selecionada';
    if (marcacoes[letra] === 'correta') classes += ' correta';
    if (marcacoes[letra] === 'errada') classes += ' errada';
    return classes;
  }

  // resultado
  const acertos = calcularAcertosTotais();
  const percentual = Math.round((acertos / totalQuestoes) * 100);

  return (
    <>
      <Head>
        <title>Acerte! • Quiz</title>
      </Head>

      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div>
      <div id="navbar-container"></div>

      <main className="centralizar-tudo">
        <div className="container">
          {!resultadoVisivel ? (
            <div id="questao-atual">
              <div id="progresso">
                Questão <span id="atual">{indiceAtual + 1}</span> de <span id="total">{totalQuestoes}</span>
              </div>

              <header>
                <h1 id="titulo">{questao.titulo}</h1>
              </header>

              <div className="questao">
                <p id="enunciado" dangerouslySetInnerHTML={{ __html: questao.enunciado }} />
              </div>

              <div id="opcoes" className="opcoes">
                {questao.alternativas.map((alt) => (
                  <div
                    key={alt.letra}
                    className={classeOpcao(alt.letra)}
                    onClick={() => selecionarAlternativa(alt.letra)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') selecionarAlternativa(alt.letra); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="letra">{alt.letra}</div>
                    <span>{alt.texto}</span>
                  </div>
                ))}
              </div>

              <div className="botoes-centro" style={{ marginTop: 20 }}>
                <button
                  id="btn-voltar"
                  className="botao-responder"
                  onClick={voltarQuestao}
                  style={{ display: indiceAtual === 0 ? 'none' : 'inline-block' }}
                >
                  ← Voltar
                </button>

                <button
                  id="btn-proximo"
                  className="botao-responder"
                  disabled={!respostasUsuario[indiceAtual]}
                  onClick={verificarResposta}
                  style={{ marginLeft: 10 }}
                >
                  {indiceAtual === totalQuestoes - 1 ? 'Finalizar Quiz' : 'Próxima →'}
                </button>
              </div>
            </div>
          ) : (
            <div id="tela-final" style={{ textAlign: 'center' }}>
              <h1>Quiz Finalizado!</h1>

              <div id="resultado-final" style={{ fontSize: '2.8rem', margin: '40px 0', fontWeight: 800 }}>
                <h2 style={{
                  fontSize: '3.5rem',
                  margin: '20px 0',
                  background: 'linear-gradient(90deg, #00ff99, #00ccff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{acertos} / {totalQuestoes}</h2>

                <p style={{ fontSize: '2.4rem', color: '#00ff99' }}>{percentual}% de acerto</p>

                <p style={{ fontSize: '1.8rem', margin: '30px 0' }}>
                  {acertos >= 9 ? 'GÊNIAL!' :
                    acertos >= 7 ? 'Excelente desempenho!' :
                      acertos >= 5 ? 'Muito bom, Continue assim!' :
                        'Valeu o esforço, Estude mais e volte com tudo!'}
                </p>
              </div>

              <button className="botao-responder" onClick={jogarNovamente}>Jogar Novamente</button>
            </div>
          )}
        </div>
      </main>

      <div id="footer-container"></div>

      {/* Popup */}
      {popup.aberto && (
        <div id="popup" className="popup-overlay" style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
           zIndex: 9999
        }}>
          <div className="popup-content" style={{ padding: 20, borderRadius: 10, textAlign: 'center' }}>
            <p id="popup-message" style={{ fontSize: 20, color: popup.acertou ? '#00ff99' : '#ff6666' }}>
              {popup.mensagem}
            </p>
            <button id="btn-continuar" onClick={fecharPopup}
              style={{
                marginTop: 12,
                padding: '10px 18px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                //color: popup.acertou ? '#000' : '#fff'
              }}>
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
