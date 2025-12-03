import Head from "next/head";
import { useEffect, useState } from "react";

export default function Register() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.togglePassword = (id) => {
            const passwordField = document.getElementById(id);
            const toggleBtn = passwordField.parentElement.querySelector(".password-toggle");
            const eyeClosed = toggleBtn.querySelector(".eye-closed");
            const eyeOpen = toggleBtn.querySelector(".eye-open");

            if (passwordField.type === "password") {
                passwordField.type = "text";
                toggleBtn.classList.add("active");
                eyeClosed.style.display = "none";
                eyeOpen.style.display = "block";
            } else {
                passwordField.type = "password";
                toggleBtn.classList.remove("active");
                eyeClosed.style.display = "block";
                eyeOpen.style.display = "none";
            }
            passwordField.focus();
        };
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirm = document.getElementById("register-confirm-password").value;

        const message = document.getElementById("register-message");

        if (password !== confirm) {
            message.textContent = "As senhas não coincidem!";
            message.style.color = "red";
            setLoading(false);
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        message.textContent = data.message;

        if (data.success) {
            message.style.color = "limegreen";

            setTimeout(() => {
                window.location.href = "/login";
            }, 800);
        } else {
            message.style.color = "red";
        }

        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Cadastro • Acerte!</title>
            </Head>

            <div className="page-with-short-content">
                <video className="bg-video" autoPlay loop muted playsInline>
                    <source src="/videos/background.mp4" type="video/mp4" />
                </video>

                <section className="login-container">
                    <div className="overlay"></div>

                    <div className="login-card">
                        <div className="login-header">
                            <h1>Cadastro</h1>
                            <p>Crie sua conta para começar</p>
                        </div>

                        <form id="register-form" onSubmit={handleRegister}>
                            <div className="form-message" id="register-message"></div>

                            <div className="form-group">
                                <label htmlFor="register-name">Nome Completo</label>
                                <input type="text" id="register-name" className="form-control" required placeholder="Seu nome completo" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-email">E-mail</label>
                                <input type="email" id="register-email" className="form-control" required placeholder="seu@email.com" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-password">Senha</label>
                                <div className="password-input-container">
                                    <input type="password" id="register-password" className="form-control" required minLength={6} placeholder="Mínimo 6 caracteres" />
                                    <button type="button" className="password-toggle" onClick={() => window.togglePassword("register-password")}>
                                        <svg className="toggle-icon" viewBox="0 0 24 24">
                                            <path className="eye-closed" d="M12 4.5..." />
                                            <path className="eye-open" style={{ display: "none" }} d="M12 7..." />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-confirm-password">Confirmar Senha</label>
                                <div className="password-input-container">
                                    <input type="password" id="register-confirm-password" className="form-control" required placeholder="Digite a senha novamente" />
                                    <button type="button" className="password-toggle" onClick={() => window.togglePassword("register-confirm-password")}>
                                        <svg className="toggle-icon" viewBox="0 0 24 24">
                                            <path className="eye-closed" d="M12 4.5..." />
                                            <path className="eye-open" style={{ display: "none" }} d="M12 7..." />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" id="accept-terms" required />
                                    Aceito os <a href="#" style={{ color: "var(--primary)" }}>termos de uso</a>
                                </label>
                            </div>

                            <button type="submit" className="btn-login" id="register-btn">
                                {loading ? "Criando conta..." : "Criar Conta"}
                            </button>

                            <div className="register-link">
                                Já tem uma conta? <a href="/login">Fazer login</a>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}
