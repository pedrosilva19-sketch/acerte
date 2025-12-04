import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Página não encontrada | Acerte!</title>
      </Head>

      {/* Vídeo de fundo (igual às outras páginas) */}
      <video className="bg-video" autoPlay loop muted playsInline>
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div>

      {/* Conteúdo da página 404 */}
      <div className="notfound-container">
        <div className="notfound-content">
          <h1>4<span>0</span>4</h1>
          <h2>Página não encontrada</h2>
          <p>
            A página que você procura pode ter sido removida,<br />
            teve seu nome alterado ou está temporariamente indisponível.
          </p>
          <Link href="/" className="btn-404">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </>
  );
}