// pages/register.js - ATUALIZADO
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Importe os ícones

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

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
                                        type={showPassword ? "text" : "password"}
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
                                        onClick={togglePassword}
                                        disabled={loading}
                                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff size={20} className="toggle-icon" />
                                        ) : (
                                            <FiEye size={20} className="toggle-icon" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="register-confirm-password">Confirmar Senha</label>
                                <div className="password-input-container">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="register-confirm-password" 
                                        className="form-control" 
                                        required 
                                        placeholder="Digite a senha novamente"
                                        disabled={loading}
                                    />
                                    <button 
                                        type="button" 
                                        className="password-toggle" 
                                        onClick={toggleConfirmPassword}
                                        disabled={loading}
                                        aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                                    >
                                        {showConfirmPassword ? (
                                            <FiEyeOff size={20} className="toggle-icon" />
                                        ) : (
                                            <FiEye size={20} className="toggle-icon" />
                                        )}
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