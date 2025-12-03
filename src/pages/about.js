import Head from "next/head";

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre Nós • Acerte!</title>
      </Head>

      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <section className="about-container">
        <div className="overlay"></div>

        <div className="about-content">
          {/* Header */}
          <div className="about-header" data-aos="fade-up">
            <h1>Sobre Nós</h1>
            <p>Conheça a equipe por trás do projeto Acerte!</p>
          </div>

          {/* Missão */}
          <div className="mission-section" data-aos="fade-up" data-aos-delay="200">
            <div className="mission-card">
              <h2>Nossa Missão</h2>
              <p>
                Transformar a preparação para concursos públicos através de uma plataforma
                inteligente e acessível, onde estudantes podem aprender de forma eficiente
                resolvendo questões todos os dias.
              </p>
            </div>
          </div>

          {/* Equipe */}
          <div className="team-section" data-aos="fade-up" data-aos-delay="400">
            <h2>Nossa Equipe</h2>

            <div className="team-grid">

              <div className="team-member" data-aos="zoom-in" data-aos-delay="600">
                <div className="member-avatar">
                  <img src="/imgs/pedro.jpg" alt="Pedro Antônio" className="member-photo" />
                </div>
                <h3>Pedro Antônio Da Silva</h3>
                <p className="member-role">Desenvolvedor Full Stack</p>
                <p className="member-bio">
                  Responsável pela arquitetura do sistema e desenvolvimento das funcionalidades principais.
                </p>
                <p className="member-email">📧 pedro.silva@acerte.com</p>
              </div>

              <div className="team-member" data-aos="zoom-in" data-aos-delay="800">
                <div className="member-avatar">
                  <img src="/imgs/nicole.jpg" alt="Diana Nicole" className="member-photo" />
                </div>
                <h3>Diana Nicole Lacerda Da Silva</h3>
                <p className="member-role">Designer UI/UX</p>
                <p className="member-bio">
                  Criadora da experiência do usuário e interface visual da plataforma.
                </p>
                <p className="member-email">📧 diana.nicole@acerte.com</p>
              </div>

              <div className="team-member" data-aos="zoom-in" data-aos-delay="1000">
                <div className="member-avatar">
                  <img src="/imgs/erika.jpg" alt="Érika Braz" className="member-photo" />
                </div>
                <h3>Érika Braz de Sousa</h3>
                <p className="member-role">Especialista em Conteúdo</p>
                <p className="member-bio">
                  Curadoria e organização do banco de questões e materiais de estudo.
                </p>
                <p className="member-email">📧 erika.sousa@acerte.com</p>
              </div>

              <div className="team-member" data-aos="zoom-in" data-aos-delay="1200">
                <div className="member-avatar">
                  <img src="/imgs/mirela.jpg" alt="Mirela Mariane" className="member-photo" />
                </div>
                <h3>Mirela Mariane Rodrigues Lima</h3>
                <p className="member-role">Analista de Qualidade</p>
                <p className="member-bio">
                  Garantia da qualidade e experiência perfeita para os usuários.
                </p>
                <p className="member-email">📧 mirela.lima@acerte.com</p>
              </div>

            </div>
          </div>

          {/* Valores */}
          <div className="values-section" data-aos="fade-up" data-aos-delay="1400">
            <h2>Nossos Valores</h2>

            <div className="values-grid">

              <div className="value-card" data-aos="flip-left" data-aos-delay="1600">
                <div className="value-icon">🎯</div>
                <h3>Foco no Aprendizado</h3>
                <p>Priorizamos a eficiência no aprendizado através da prática constante.</p>
              </div>

              <div className="value-card" data-aos="flip-left" data-aos-delay="1800">
                <div className="value-icon">💡</div>
                <h3>Inovação</h3>
                <p>Buscamos sempre novas formas de melhorar a experiência de estudo.</p>
              </div>

              <div className="value-card" data-aos="flip-left" data-aos-delay="2000">
                <div className="value-icon">🤝</div>
                <h3>Colaboração</h3>
                <p>Acreditamos no poder do trabalho em equipe e do compartilhamento.</p>
              </div>

            </div>
          </div>

          {/* Contato */}
          <div className="contact-section" data-aos="fade-up" data-aos-delay="2200">
            <div className="contact-card">
              <h2>Entre em Contato</h2>
              <p>Estamos sempre disponíveis para tirar suas dúvidas e ouvir suas sugestões</p>

              <div className="contact-info">
                <p>
                  📧 <strong>E-mail Geral:</strong> contato@acerte.com
                </p>
                <p>
                  📧 <strong>Suporte:</strong> suporte@acerte.com
                </p>
                <p>
                  📧 <strong>Parcerias:</strong> parcerias@acerte.com
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta" data-aos="fade-up" data-aos-delay="2400">
            <h2>Junte-se a Nossa Jornada</h2>
            <p>Comece sua preparação inteligente para concursos hoje mesmo</p>
            <button
              className="btn-action"
              onClick={() => (window.location.href = "/")}
            >
              Começar Agora
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
