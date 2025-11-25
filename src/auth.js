// src/auth.js - VERSÃO CORRIGIDA E DEFINITIVA

class UserDatabase {
    constructor() {
      this.storageKey = 'acerte_users';
      this.init();
    }
  
    init() {
      if (!localStorage.getItem(this.storageKey)) {
        localStorage.setItem(this.storageKey, JSON.stringify({ users: [], nextId: 1 }));
      }
    }
  
    getDB() {
      return JSON.parse(localStorage.getItem(this.storageKey));
    }
  
    saveDB(db) {
      localStorage.setItem(this.storageKey, JSON.stringify(db));
    }
  
    emailExists(email) {
      return this.getDB().users.some(u => u.email.toLowerCase() === email.toLowerCase());
    }
  
    createUser(userData) {
      const db = this.getDB();
      const newUser = {
        id: db.nextId++,
        ...userData,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      db.users.push(newUser);
      this.saveDB(db);
      return newUser;
    }
  
    getUserByEmail(email) {
      return this.getDB().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
  }
  
  class AuthSystem {
    constructor() {
      this.currentUser = null;
      this.db = new UserDatabase();
      this.init();
    }
  
    init() {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    }
  
    login(email, password, remember = false) {
      const user = this.db.getUserByEmail(email);
      if (!user) {
        throw new Error('E-mail não encontrado');
      }
      if (user.password !== password) {
        throw new Error('Senha incorreta');
      }
  
      // Dados do usuário logado (sem senha!)
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
  
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  
      if (remember) {
        localStorage.setItem('rememberLogin', 'true');
        localStorage.setItem('userEmail', email);
      } else {
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('userEmail');
      }
  
      this.updateUI();
      return this.currentUser;
    }
  
    register(name, email, password) {
      if (this.db.emailExists(email)) {
        throw new Error('Este e-mail já está cadastrado');
      }
  
      const newUser = this.db.createUser({ name, email, password });
      
      // Logar automaticamente após cadastro
      this.currentUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt
      };
  
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.updateUI();
      return this.currentUser;
    }
  
    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      this.updateUI();
      window.location.href = 'index.html';
    }
  
    isLoggedIn() {
      return this.currentUser !== null;
    }
  
    getCurrentUser() {
      return this.currentUser;
    }
  
    updateUI() {
      const loginLink = document.getElementById('login-link');
      const dropdown = document.getElementById('user-dropdown');
      const usernameDisplay = document.getElementById('username-display');
  
      if (!loginLink || !dropdown) {
        setTimeout(() => this.updateUI(), 300);
        return;
      }
  
      if (this.isLoggedIn()) {
        loginLink.style.display = 'none';
        dropdown.style.display = 'flex';
        if (usernameDisplay) {
          usernameDisplay.textContent = this.currentUser.name.split(' ')[0];
        }
      } else {
        loginLink.style.display = 'block';
        dropdown.style.display = 'none';
      }
    }
  
    setupGlobalEvents() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('#logout-btn, #logout-btn *')) {
          e.preventDefault();
          this.logout();
        }
      });
    }
  }
  
  // Instância global
  const authSystem = new AuthSystem();
  authSystem.setupGlobalEvents();
  
  // Atualizar UI quando tudo carregar
  window.addEventListener('load', () => {
    setTimeout(() => authSystem.updateUI(), 500);
  });
  
  window.authSystem = authSystem;