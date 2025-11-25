// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('acerte_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('acerte_current_user')) || null;
    }

    // Registrar novo usuário
    register(name, email, password) {
        // Verificar se email já existe
        if (this.users.find(user => user.email === email)) {
            return { success: false, message: 'Este e-mail já está cadastrado.' };
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('acerte_users', JSON.stringify(this.users));

        // Login automático após registro
        return this.login(email, password);
    }

    // Login do usuário
    login(email, password, rememberMe = false) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return { success: false, message: 'E-mail ou senha incorretos.' };
        }

        this.currentUser = user;
        localStorage.setItem('acerte_current_user', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('acerte_remember_me', 'true');
        }

        this.updateUI();
        return { success: true, message: 'Login realizado com sucesso!' };
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('acerte_current_user');
        this.updateUI();
        window.location.href = 'index.html';
    }

    // Verificar se usuário está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Atualizar interface baseada no estado de login
    updateUI() {
        const authItem = document.getElementById('auth-item');
        const loginLink = document.getElementById('login-link');
        const userDropdown = document.getElementById('user-dropdown');
        const usernameDisplay = document.getElementById('username-display');

        if (authItem && loginLink && userDropdown) {
            if (this.isLoggedIn()) {
                loginLink.style.display = 'none';
                userDropdown.style.display = 'flex';
                if (usernameDisplay) {
                    usernameDisplay.textContent = this.currentUser.name.split(' ')[0];
                }
            } else {
                loginLink.style.display = 'block';
                userDropdown.style.display = 'none';
            }
        }
    }

    // Manipular login
    handleLogin() {
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;
        const rememberMe = document.getElementById('remember-me')?.checked;
        const loginBtn = document.getElementById('login-btn');
        const message = document.getElementById('login-message');

        if (!email || !password) {
            this.showMessage(message, 'Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Desabilitar botão
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Entrando...';
        }

        // Simular delay de rede
        setTimeout(() => {
            const result = this.login(email, password, rememberMe);
            
            if (result.success) {
                this.showMessage(message, result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'quiz.html';
                }, 1000);
            } else {
                this.showMessage(message, result.message, 'error');
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Entrar';
                }
            }
        }, 1000);
    }

    // Manipular registro
    handleRegister() {
        const name = document.getElementById('register-name')?.value;
        const email = document.getElementById('register-email')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm-password')?.value;
        const acceptTerms = document.getElementById('accept-terms')?.checked;
        const registerBtn = document.getElementById('register-btn');
        const message = document.getElementById('register-message');

        // Validações
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage(message, 'Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(message, 'A senha deve ter pelo menos 6 caracteres.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(message, 'As senhas não coincidem.', 'error');
            return;
        }

        if (!acceptTerms) {
            this.showMessage(message, 'Você deve aceitar os termos de uso.', 'error');
            return;
        }

        // Desabilitar botão
        if (registerBtn) {
            registerBtn.disabled = true;
            registerBtn.textContent = 'Criando conta...';
        }

        // Simular delay de rede
        setTimeout(() => {
            const result = this.register(name, email, password);
            
            if (result.success) {
                this.showMessage(message, result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'quiz.html';
                }, 1000);
            } else {
                this.showMessage(message, result.message, 'error');
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.textContent = 'Criar Conta';
                }
            }
        }, 1000);
    }

    // Mostrar mensagens
    showMessage(element, text, type) {
        if (!element) return;
        
        element.textContent = text;
        element.className = 'form-message ' + type;
        element.style.opacity = '1';

        // Auto-esconder após 5 segundos
        setTimeout(() => {
            element.style.opacity = '0';
        }, 5000);
    }
}

// Função global para alternar visibilidade da senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
    }
}

// Inicializar sistema de autenticação
function initializeAuthSystem() {
    window.authSystem = new AuthSystem();
    
    // Configurar eventos de formulário
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.authSystem.handleLogin();
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.authSystem.handleRegister();
        });
    }

    // Configurar logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.authSystem.logout();
        });
    }

    // Atualizar UI inicial
    window.authSystem.updateUI();
}

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    initializeAuthSystem();
});