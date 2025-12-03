import Head from "next/head";
import { useEffect } from "react";

export default function Home() {
  function Quiz() {
    window.location.href = "/quiz";
  }

  return (
    <>
      <Head>
        <title>Acerte! • Preparação Inteligente para Concursos</title>
      </Head>

      {/* Vídeo de fundo */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* Hero Section */}
      <section className="hero">
        <div className="overlay"></div>

        <div
          className="hero-content"
          data-aos="fade-up"
          data-aos-duration="1200"
        >
          <h2>Preparação definitiva para concursos públicos</h2>
          <h1>
            Aprenda mais <br /> resolvendo questões todos os dias
          </h1>

          <button onClick={Quiz} className="btn-action" id="btn-action">
            Iniciar Treino Agora
          </button>
        </div>
      </section>
    </>
  );
}
