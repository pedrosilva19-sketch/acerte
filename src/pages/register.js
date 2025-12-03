import Head from "next/head";
import { useState } from "react";

export default function Register() {
    const [message, setMessage] = useState("");

    const togglePassword = (id) => {
        const field = document.getElementById(id);
        const toggle = field.parentElement.querySelector(".password-toggle");
        const eyeClosed = toggle.querySelector(".eye-closed");
        const eyeOpen = toggle.querySelector(".eye-open");

        if (field.type === "password") {
            field.type = "text";
            toggle.classList.add("active");
            eyeClosed.style.display = "none";
            eyeOpen.style.display = "block";
        } else {
            field.type = "password";
            toggle.classList.remove("active");
            eyeClosed.style.display = "block";
            eyeOpen.style.display = "none";
        }
        field.focus();
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirm = e.target.confirm.value;

        if (password !== confirm) {
            setMessage("As senhas não coincidem");
            return;
        }

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        setMessage(data.message);

        if (res.ok) window.location.href = "/login";
    }

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

                        <form onSubmit={handleSubmit}>
                            <div className="form-message">{message}</div>

                            <div className="form-group">
                                <label>Nome Completo</label>
                                <input name="name" id="register-name" required />
                            </div>

                            <div className="form-group">
                                <label>E-mail</label>
                                <input name="email" id="register-email" type="email" required />
                            </div>

                            <div className="form-group">
                                <label>Senha</label>
                                <div className="password-input-container">
                                    <input name="password" id="register-password" type="password" required minLength={6} />
                                    <button type="button" className="password-toggle" onClick={() => togglePassword("register-password")}>
                                        <svg className="toggle-icon">
                                            <path className="eye-closed" d="..." />
                                            <path className="eye-open" style={{ display: "none" }} d="..." />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirmar Senha</label>
                                <div className="password-input-container">
                                    <input name="confirm" id="register-confirm-password" type="password" required />
                                    <button type="button" className="password-toggle" onClick={() => togglePassword("register-confirm-password")}>
                                        <svg className="toggle-icon">
                                            <path className="eye-closed" d="..." />
                                            <path className="eye-open" style={{ display: "none" }} d="..." />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <button className="btn-login" type="submit">Criar Conta</button>

                            <div className="register-link">
                                Já tem conta? <a href="/login">Entrar</a>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}
