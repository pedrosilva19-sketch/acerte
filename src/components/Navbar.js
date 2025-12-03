// components/Navbar.js - VERSÃO CORRIGIDA
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Evitar hidratação do React
    if (!mounted || loading) {
        return (
            <nav className="navbar">
                <div className="navbar-brand">
                    <img
                        src="/imgs/logo.jpg"
                        alt="Acerte!"
                        className="logo-nav"
                    />
                    <span>Acerte!</span>
                </div>
                <ul className="navbar-menu">
                    <li><Link href="/">Início</Link></li>
                    <li><Link href="/about">Sobre Nós</Link></li>
                    <li><Link href="/login">Login</Link></li>
                </ul>
            </nav>
        );
    }

    const handleLogoClick = () => {
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img
                    src="/imgs/logo.jpg"
                    alt="Acerte!"
                    className="logo-nav"
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                />
                <span 
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer' }}
                >
                    Acerte!
                </span>
            </div>

            <ul className="navbar-menu">
                <li><Link href="/">Início</Link></li>
                <li><Link href="/about">Sobre Nós</Link></li>
                
                <li id="auth-item">
                    {user ? (
                        <div className="user-area">
                            <span className="username-display">
                                {user.name}
                            </span>
                            <button
                                onClick={logout}
                                className="logout-btn"
                                onMouseOver={(e) => {
                                    e.target.style.background = 'var(--primary, #0070f3)';
                                    e.target.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--primary, #0070f3)';
                                }}
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <Link 
                            href="/login"
                        >
                            Login
                        </Link>
                    )}
                </li>
            </ul>
        </nav>
    );
}