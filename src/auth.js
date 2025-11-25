// Sistema de Autenticação - CORRIGIDO
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('acerte_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('acerte_current_user')) || null;
        console.log('AuthSystem iniciado. Usuário atual:', this.currentUser);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateNavigation();
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

        // Logout - usando event delegation
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
        console.log('Tentando registrar:', email);
        
        // Verificar se email já existe
        if (this.users.find(user => user.email === email)) {
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
        console.log('Usuário registrado:', newUser);

        // Login automático
        return this.login(email, password);
    }

    login(email, password, rememberMe = false) {
        console.log('Tentando login:', email);
        
        const user = this.users.find(u => 
            u.email === email.toLowerCase().trim() && 
            u.password === password
        );
        
        if (!user) {
            return { success: false, message: 'E-mail ou senha incorretos!' };
        }

        this.currentUser = user;
        localStorage.setItem('acerte_current_user', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('acerte_remember_me', 'true');
        }

        console.log('Login realizado com sucesso:', user.name);
        this.updateNavigation();
        return { success: true, message: 'Login realizado com sucesso!' };
    }

    logout() {
        console.log('Fazendo logout');
        this.currentUser = null;
        localStorage.removeItem('acerte_current_user');
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateNavigation() {
        console.log('Atualizando navegação...');
        
        const loginLink = document.getElementById('login-link');
        const userDropdown = document.getElementById('user-dropdown');
        const usernameDisplay = document.getElementById('username-display');

        console.log('Elementos encontrados:', {
            loginLink: !!loginLink,
            userDropdown: !!userDropdown,
            usernameDisplay: !!usernameDisplay,
            loggedIn: this.isLoggedIn()
        });

        if (this.isLoggedIn()) {
            // USUÁRIO LOGADO - mostrar dropdown
            if (loginLink) {
                loginLink.style.display = 'none';
                console.log('Login link escondido');
            }
            if (userDropdown) {
                userDropdown.style.display = 'flex';
                console.log('User dropdown mostrado');
            }
            if (usernameDisplay) {
                usernameDisplay.textContent = this.currentUser.name.split(' ')[0];
                console.log('Nome do usuário atualizado:', this.currentUser.name.split(' ')[0]);
            }
        } else {
            // USUÁRIO NÃO LOGADO - mostrar link de login
            if (loginLink) {
                loginLink.style.display = 'block';
                console.log('Login link mostrado');
            }
            if (userDropdown) {
                userDropdown.style.display = 'none';
                console.log('User dropdown escondido');
            }
        }
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me')?.checked || false;
        const message = document.getElementById('login-message');
        const loginBtn = document.getElementById('login-btn');

        if (!email || !password) {
            this.showMessage(message, 'Por favor, preencha todos os campos!', 'error');
            return;
        }

        // Loading state
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

// Inicializar imediatamente quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - inicializando AuthSystem');
    window.authSystem = new AuthSystem();
});