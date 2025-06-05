// User types
const USER_TYPES = {
    ADMIN: 'admin',
    CLIENT: 'client'
};

// Mock database (replace with actual backend API calls)
const mockUsers = [
    {
        email: 'lylechadya139@gmail.com',
        password: 'lyle142007',
        type: USER_TYPES.ADMIN,
        name: 'Admin Lyle'
    },
    {
        email: 'lylechadya72@gmail.com',
        password: 'lyle2007',
        type: USER_TYPES.CLIENT,
        name: 'Lyle Chadya',
        phone: '1234567890',
        address: '123 Main St'
    }
];

// Session management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.checkSession();
    }

    checkSession() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.redirectBasedOnUserType();
        }
    }

    login(email, password) {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                const user = mockUsers.find(u => u.email === email && u.password === password);
                if (user) {
                    this.currentUser = {
                        email: user.email,
                        type: user.type,
                        name: user.name
                    };
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    resolve(this.currentUser);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 500);
        });
    }

    register(userData) {
        return new Promise((resolve, reject) => {
            // Simulate API call delay
            setTimeout(() => {
                if (mockUsers.some(u => u.email === userData.email)) {
                    reject(new Error('Email already registered'));
                    return;
                }

                const newUser = {
                    ...userData,
                    type: USER_TYPES.CLIENT
                };
                mockUsers.push(newUser);
                resolve(newUser);
            }, 500);
        });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = '/index.html';
    }

    redirectBasedOnUserType() {
        const currentPath = window.location.pathname;
        if (!this.currentUser) {
            if (!currentPath.includes('index.html') && !currentPath.includes('register.html')) {
                window.location.href = '/index.html';
            }
            return;
        }

        const isAdmin = this.currentUser.type === USER_TYPES.ADMIN;
        const isAdminPage = currentPath.includes('/admin/');
        const isClientPage = currentPath.includes('/client/');

        if (isAdmin && !isAdminPage) {
            window.location.href = '/admin/dashboard.html';
        } else if (!isAdmin && !isClientPage) {
            window.location.href = '/client/dashboard.html';
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const user = await authManager.login(email, password);
            authManager.redirectBasedOnUserType();
        } catch (error) {
            alert(error.message);
        }
    });
}

// Registration form handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await authManager.register(formData);
            alert('Registration successful! Please login.');
            window.location.href = '/index.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        authManager.logout();
    });
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    authManager.redirectBasedOnUserType();
}); 