// pages/login.js - ATUALIZADO
import Head from "next/head";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const togglePassword = (id) => {
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            
            if (data.success) {
                setMessage("Login bem-sucedido! Redirecionando...");
                setMessageType("success");
                
                // Usar o contexto para login
                login(data.token, data.user.name);
                
                // Redirecionar
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            } else {
                setMessage(data.message || "Erro ao fazer login");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setMessage("Erro de conexão. Tente novamente.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

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

                        <form id="login-form" onSubmit={handleLogin}>
                            {message && (
                                <div 
                                    className="form-message" 
                                    style={{ 
                                        color: messageType === "success" ? "limegreen" : "red",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        marginBottom: "20px",
                                        backgroundColor: messageType === "success" ? "rgba(50, 205, 50, 0.1)" : "rgba(255, 0, 0, 0.1)",
                                        border: `1px solid ${messageType === "success" ? "limegreen" : "red"}`,
                                        textAlign: "center",
                                        fontSize: "14px"
                                    }}
                                >
                                    {message}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="login-email">E-mail</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    className="form-control"
                                    required
                                    placeholder="seu@email.com"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="login-password">Senha</label>
                                <div className="password-input-container">
                                    <input
                                        type="password"
                                        id="login-password"
                                        className="form-control"
                                        required
                                        placeholder="Sua senha"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePassword("login-password")}
                                        disabled={loading}
                                    >
                                        <svg className="toggle-icon" viewBox="0 0 24 24">
                                            <path className="eye-closed" d="M12 4.5C7 4.5..." />
                                            <path
                                                className="eye-open"
                                                style={{ display: "none" }}
                                                d="M12 7c2.76..."
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" id="remember-me" disabled={loading} />
                                    Lembrar de mim
                                </label>
                                <a href="#" className="forgot-password">
                                    Esqueci a senha
                                </a>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-login" 
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{ marginRight: '8px' }}>🔄</span>
                                        Entrando...
                                    </>
                                ) : "Entrar"}
                            </button>

                            <div className="register-link">
                                Não tem uma conta? <a href="/register">Cadastre-se</a>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}