// pages/register.js
import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" ou "error"
    const router = useRouter();

    useEffect(() => {
        // Função para alternar visibilidade da senha
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
        setMessage("");

        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirm = document.getElementById("register-confirm-password").value;
        const acceptTerms = document.getElementById("accept-terms").checked;

        // Validações
        if (!acceptTerms) {
            setMessage("Você precisa aceitar os termos de uso.");
            setMessageType("error");
            setLoading(false);
            return;
        }

        if (password !== confirm) {
            setMessage("As senhas não coincidem!");
            setMessageType("error");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setMessage("A senha deve ter no mínimo 6 caracteres.");
            setMessageType("error");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            
            if (data.success) {
                setMessage("Conta criada com sucesso! Redirecionando para login...");
                setMessageType("success");

                // Opcional: Login automático após registro
                if (data.token && data.user) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", data.user.name);
                    
                    setTimeout(() => {
                        router.push("/");
                    }, 1500);
                } else {
                    // Se não houver login automático, vai para página de login
                    setTimeout(() => {
                        router.push("/login");
                    }, 1500);
                }
            } else {
                setMessage(data.message || "Erro ao criar conta.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setMessage("Erro de conexão. Tente novamente.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
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
                            {message && (
                                <div 
                                    className="form-message" 
                                    id="register-message"
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
                                <label htmlFor="register-name">Nome Completo</label>
                                <input 
                                    type="text" 
                                    id="register-name" 
                                    className="form-control" 
                                    required 
                                    placeholder="Seu nome completo"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-email">E-mail</label>
                                <input 
                                    type="email" 
                                    id="register-email" 
                                    className="form-control" 
                                    required 
                                    placeholder="seu@email.com"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-password">Senha</label>
                                <div className="password-input-container">
                                    <input 
                                        type="password" 
                                        id="register-password" 
                                        className="form-control" 
                                        required 
                                        minLength={6} 
                                        placeholder="Mínimo 6 caracteres"
                                        disabled={loading}
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={() => window.togglePassword("register-password")}
                                        disabled={loading}
                                    >
                                        <svg className="toggle-icon" viewBox="0 0 24 24">
                                            <path className="eye-closed" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            <path 
                                                className="eye-open" 
                                                style={{ display: "none" }} 
                                                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-confirm-password">Confirmar Senha</label>
                                <div className="password-input-container">
                                    <input 
                                        type="password" 
                                        id="register-confirm-password" 
                                        className="form-control" 
                                        required 
                                        placeholder="Digite a senha novamente"
                                        disabled={loading}
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={() => window.togglePassword("register-confirm-password")}
                                        disabled={loading}
                                    >
                                        <svg className="toggle-icon" viewBox="0 0 24 24">
                                            <path className="eye-closed" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            <path 
                                                className="eye-open" 
                                                style={{ display: "none" }} 
                                                d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input 
                                        type="checkbox" 
                                        id="accept-terms" 
                                        required
                                        disabled={loading}
                                    />
                                    Aceito os <a href="#" style={{ color: "var(--primary)" }}>termos de uso</a>
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                className="btn-login" 
                                id="register-btn"
                                disabled={loading}
                                style={{
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{ marginRight: '8px' }}>🔄</span>
                                        Criando conta...
                                    </>
                                ) : "Criar Conta"}
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