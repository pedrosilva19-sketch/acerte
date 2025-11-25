// Sistema de Autenticação - COMPLETO E FUNCIONAL
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('acerte_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('acerte_current_user')) || null;
        console.log('AuthSystem iniciado. Usuário atual:', this.currentUser);
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Atualizar UI imediatamente
        setTimeout(() => this.updateUI(), 100);
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                e.preventDefault();
                this.logout();
            }
        });

        // Botão de ação na página inicial
        const btnAction = document.getElementById('btn-action');
        if (btnAction) {
            btnAction.addEventListener('click', () => {
                if (this.isLoggedIn()) {
                    window.location.href = 'quiz.html';
                } else {
                    window.location.href = 'login.html';
                }
            });
        }
    }

    register(name, email, password) {
        console.log('Registrando usuário:', email);
        
        // Verificar se email já existe
        if (this.users.find(user => user.email === email.toLowerCase())) {
            return { success: false, message: 'Este e-mail já está cadastrado!' };
        }

        const newUser = {
            id: Date.now().toString(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('acerte_users', JSON.stringify(this.users));
        
        console.log('Usuário registrado com sucesso:', newUser.name);
        
        // Fazer login automaticamente
        return this.login(email, password);
    }

    login(email, password) {
        console.log('Fazendo login:', email);
        
        const user = this.users.find(u => 
            u.email === email.toLowerCase() && 
            u.password === password
        );
        
        if (!user) {
            return { success: false, message: 'E-mail ou senha incorretos!' };
        }

        this.currentUser = user;
        localStorage.setItem('acerte_current_user', JSON.stringify(user));
        
        console.log('Login realizado com sucesso:', user.name);
        this.updateUI();
        return { success: true, message: 'Login realizado com sucesso!' };
    }

    logout() {
        console.log('Fazendo logout');
        this.currentUser = null;
        localStorage.removeItem('acerte_current_user');
        this.updateUI();
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateUI() {
        console.log('Atualizando UI...');
        
        const loginLink = document.getElementById('login-link');
        const userDropdown = document.getElementById('user-dropdown');
        const usernameDisplay = document.getElementById('username-display');

        console.log('Elementos encontrados:', {
            loginLink: !!loginLink,
            userDropdown: !!userDropdown,
            usernameDisplay: !!usernameDisplay,
            loggedIn: this.isLoggedIn()
        });

        if (this.isLoggedIn() && this.currentUser) {
            // USUÁRIO LOGADO - mostrar dropdown com nome
            if (loginLink) loginLink.style.display = 'none';
            if (userDropdown) userDropdown.style.display = 'flex';
            if (usernameDisplay) {
                usernameDisplay.textContent = this.currentUser.name.split(' ')[0];
                console.log('Nome definido:', this.currentUser.name.split(' ')[0]);
            }
        } else {
            // USUÁRIO NÃO LOGADO - mostrar link de login
            if (loginLink) loginLink.style.display = 'block';
            if (userDropdown) userDropdown.style.display = 'none';
        }
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const message = document.getElementById('login-message');
        const loginBtn = document.getElementById('login-btn');

        if (!email || !password) {
            this.showMessage(message, 'Por favor, preencha todos os campos!', 'error');
            return;
        }

        // Loading state
        loginBtn.disabled = true;
        loginBtn.textContent = 'Entrando...';

        setTimeout(() => {
            const result = this.login(email, password);
            
            if (result.success) {
                this.showMessage(message, result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'quiz.html';
                }, 1000);
            } else {
                this.showMessage(message, result.message, 'error');
                loginBtn.disabled = false;
                loginBtn.textContent = 'Entrar';
            }
        }, 1000);
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const acceptTerms = document.getElementById('accept-terms').checked;
        const message = document.getElementById('register-message');
        const registerBtn = document.getElementById('register-btn');

        // Validações
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage(message, 'Por favor, preencha todos os campos!', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(message, 'A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(message, 'As senhas não coincidem!', 'error');
            return;
        }

        if (!acceptTerms) {
            this.showMessage(message, 'Você deve aceitar os termos de uso!', 'error');
            return;
        }

        // Loading state
        registerBtn.disabled = true;
        registerBtn.textContent = 'Criando conta...';

        setTimeout(() => {
            const result = this.register(name, email, password);
            
            if (result.success) {
                this.showMessage(message, result.message, 'success');
                setTimeout(() => {
                    window.location.href = 'quiz.html';
                }, 1000);
            } else {
                this.showMessage(message, result.message, 'error');
                registerBtn.disabled = false;
                registerBtn.textContent = 'Criar Conta';
            }
        }, 1000);
    }

    showMessage(element, text, type) {
        if (!element) return;
        
        element.textContent = text;
        element.className = 'form-message ' + type;
        element.style.opacity = '1';

        setTimeout(() => {
            element.style.opacity = '0';
        }, 5000);
    }
}

// Função global para mostrar/ocultar senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Inicializar sistema quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - inicializando AuthSystem');
    window.authSystem = new AuthSystem();
});

// Função global para forçar atualização da UI
function updateAuthUI() {
    if (window.authSystem) {
        window.authSystem.updateUI();
    }
}