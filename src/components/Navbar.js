// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img
                    id="logo-nav"
                    src="/imgs/logo.jpg"
                    alt="Acerte!"
                    className="logo-nav"
                    onClick={() => window.location.href = "/"}
                />
                <span id="logo-text" onClick={() => window.location.href = "/"}>Acerte!</span>
            </div>

            <ul className="navbar-menu">
                <li>
                    <Link href="/">Início</Link>
                </li>
                <li>
                    <Link href="/about">Sobre Nós</Link>
                </li>

                <li id="auth-item">
                    {/* Link de Login (visível quando NÃO logado) */}
                    <Link href="/login" id="login-link">
                        Login
                    </Link>

                    {/* Área do usuário logado (visível quando logado) */}
                    <div className="user-area" id="user-area">
                        <span id="username-display">Usuário</span>
                        <button id="logout-btn" className="logout-btn" title="Sair da conta">
                            <span>Sair</span>
                        </button>
                    </div>
                </li>
            </ul>
        </nav>
    );
}
