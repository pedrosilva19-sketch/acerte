import Head from "next/head";
import { useState } from "react";

export default function LoginPage() {
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

        const email = e.target.email.value;
        const password = e.target.password.value;

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        setMessage(data.message);

        if (res.ok) {
            window.location.href = "/dashboard";
        }
    }

    return (
        <>
            <Head>
                <title>Login • Acerte!</title>
            </Head>

            <div className="page-with-short-content">
                <video className="bg-video" autoPlay loop muted playsInline>
                    <source src="/videos/background.mp4" type="video/mp4" />
                </video>

                <section className="login-container">
                    <div className="overlay"></div>

                    <div className="login-card">
                        <div className="login-header">
                            <h1>Login</h1>
                            <p>Entre na sua conta para continuar</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-message">{message}</div>

                            <div className="form-group">
                                <label>E-mail</label>
                                <input id="login-email" name="email" type="email" required />
                            </div>

                            <div className="form-group">
                                <label>Senha</label>
                                <div className="password-input-container">
                                    <input id="login-pass" name="password" type="password" required />
                                    <button type="button" className="password-toggle" onClick={() => togglePassword("login-pass")}>
                                        <svg className="toggle-icon">
                                            <path className="eye-closed" d="..." />
                                            <path className="eye-open" style={{ display: "none" }} d="..." />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <button className="btn-login" type="submit">Entrar</button>

                            <div className="register-link">
                                Não tem conta? <a href="/register">Cadastre-se</a>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}
