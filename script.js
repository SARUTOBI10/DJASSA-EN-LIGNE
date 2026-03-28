// ================ DONNÉES GLOBALES ================
let currentUser = null;
let currentMerchant = null;
let cart = [];
let orders = [];
let currentCategory = 'all';

// Base de données des produits
const products = [
    // CHAUSSURES
    { id: 1, name: 'Nike Air Max', category: 'Chaussures', price: 85000, emoji: '👟' },
    { id: 2, name: 'Adidas Ultra Boost', category: 'Chaussures', price: 95000, emoji: '👟' },
    { id: 3, name: 'Puma RS-X', category: 'Chaussures', price: 75000, emoji: '👟' },
    
    // COMPLET
    { id: 4, name: 'Complet Classique', category: 'Complet', price: 65000, emoji: '👔' },
    { id: 5, name: 'Complet Moderne', category: 'Complet', price: 75000, emoji: '👔' },
    { id: 6, name: 'Complet Premium', category: 'Complet', price: 120000, emoji: '👔' },
    
    // MONTRE
    { id: 7, name: 'Montre Sport', category: 'Montre', price: 35000, emoji: '⌚' },
    { id: 8, name: 'Montre Élégante', category: 'Montre', price: 55000, emoji: '⌚' },
    { id: 9, name: 'Montre Chrono', category: 'Montre', price: 45000, emoji: '⌚' },
    
    // PANTALON
    { id: 10, name: 'Pantalon Casual', category: 'Pantalon', price: 28000, emoji: '👖' },
    { id: 11, name: 'Pantalon Formel', category: 'Pantalon', price: 35000, emoji: '👖' },
    { id: 12, name: 'Pantalon Slim', category: 'Pantalon', price: 32000, emoji: '👖' },
    
    // TEE-SHIRT
    { id: 13, name: 'Tee-shirt Blanc', category: 'Tee-shirt', price: 12000, emoji: '👕' },
    { id: 14, name: 'Tee-shirt Coloré', category: 'Tee-shirt', price: 15000, emoji: '👕' },
    { id: 15, name: 'Tee-shirt Premium', category: 'Tee-shirt', price: 18000, emoji: '👕' },
];

// Données marchand (simulation) - À remplacer par un système de base de données réel
const merchantData = {
    email: 'marchand@djassa.com',
    password: 'djassa123', // À hasher en production
    nom: 'Djassa',
    prenom: 'Shop',
    role: 'admin',
    lastLogin: null,
    loginAttempts: 0,
    locked: false
};

// ================ FONCTIONS UTILITAIRES ================
function showAlert(message, type = 'info') {
    // Vérifier si on est sur une page de login avec des divs d'alerte
    const signinAlert = document.getElementById('signin-alert');
    const signupAlert = document.getElementById('signup-alert');
    
    if (signinAlert || signupAlert) {
        const alertDiv = signinAlert || signupAlert;
        alertDiv.textContent = message;
        alertDiv.className = `alert alert-${type === 'error' ? 'error' : 'success'}`;
        alertDiv.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 5000);
    } else {
        // Fallback vers alert() natif
        alert(message);
    }
}

function showNotifications() {
    if (!currentUser) {
        showAlert('Veuillez vous connecter d\'abord!', 'error');
        return;
    }
    
    const notifications = getNotificationsForEmail(currentUser.email);
    if (notifications.length === 0) {
        showAlert('Vous n\'avez pas de notifications', 'info');
        return;
    }
    
    let notifText = 'Vos notifications:\n\n';
    notifications.forEach(notif => {
        notifText += `- ${notif.message} (${notif.date})\n`;
    });
    
    showAlert(notifText);
}

// ================ INITIALISATION ================
function initializeApp() {
    // Charger les données sauvegardées
    loadData();

    // Mettre à jour l'état d'authentification en priorité
    checkAuthStatus();

    // N'exécuter renderProducts que si la grille existe (index.html)
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        renderProducts();
    }

    // Charger les credentials sauvegardés sur les pages de login
    loadSavedCredentials();

    // Initialiser le raccourci clavier pour le marchand
    initMerchantShortcut();
}

// Si le DOM est déjà prêt, initialiser tout de suite, sinon attendre l'événement.
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
} 

// Fonction pour gérer l'accès au tableau de bord marchand via raccourci clavier
function initMerchantShortcut() {
    // Raccourci clavier Alt+M pour accéder directement à la page marchand
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            window.location.href = 'merchant-login.html';
        }
    });

    // Message dans la console pour les admins
    console.log('💡 Conseil: Appuyez sur Alt+M pour accéder au tableau de bord marchand');
}

// ================ GESTION DU LOCALSTORAGE ================
function saveData() {
    localStorage.setItem('djassa_cart', JSON.stringify(cart));
    localStorage.setItem('djassa_orders', JSON.stringify(orders));
    localStorage.setItem('djassa_users', JSON.stringify(getAllUsers()));
}

function loadData() {
    const savedCart = localStorage.getItem('djassa_cart');
    const savedOrders = localStorage.getItem('djassa_orders');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedOrders) orders = JSON.parse(savedOrders);
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem('djassa_users')) || [];
}

function saveUser(user) {
    const users = getAllUsers();
    const existingIndex = users.findIndex(u => u.pseudo === user.pseudo);
    
    if (existingIndex > -1) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    
    localStorage.setItem('djassa_users', JSON.stringify(users));
}

function findUser(pseudo) {
    const users = getAllUsers();
    return users.find(u => u.pseudo === pseudo);
}

function addNotificationToClient(clientEmail, message) {
    // Stocker les notifications par email dans un stockage séparé
    const notificationsKey = 'djassa_notifications';
    const allNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '{}');
    
    if (!allNotifications[clientEmail]) {
        allNotifications[clientEmail] = [];
    }
    
    allNotifications[clientEmail].push({
        id: Date.now(),
        message: message,
        date: new Date().toLocaleString('fr-FR'),
        read: false
    });
    
    localStorage.setItem(notificationsKey, JSON.stringify(allNotifications));
    
    // Aussi ajouter à l'utilisateur connecté si c'est le cas
    const users = getAllUsers();
    const user = users.find(u => u.email === clientEmail);
    if (user) {
        if (!user.notifications) user.notifications = [];
        user.notifications.push({
            id: Date.now(),
            message: message,
            date: new Date().toLocaleString('fr-FR'),
            read: false
        });
        saveUser(user);
    }
}

function getNotificationsForEmail(email) {
    const notificationsKey = 'djassa_notifications';
    const allNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '{}');
    return allNotifications[email] || [];
}

function markNotificationAsRead(email, notificationId) {
    const notificationsKey = 'djassa_notifications';
    const allNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '{}');
    
    if (allNotifications[email]) {
        const notif = allNotifications[email].find(n => n.id == notificationId);
        if (notif) {
            notif.read = true;
            localStorage.setItem(notificationsKey, JSON.stringify(allNotifications));
        }
    }
    
    // Aussi marquer dans l'utilisateur connecté
    const users = getAllUsers();
    const user = users.find(u => u.email === email);
    if (user && user.notifications) {
        const notif = user.notifications.find(n => n.id == notificationId);
        if (notif) {
            notif.read = true;
            saveUser(user);
        }
    }
}

// ================ GESTION DU "SE SOUVENIR DE MOI" ================
function saveClientCredentials(pseudo, remember) {
    if (remember) {
        localStorage.setItem('djassa_remember_client', 'true');
        localStorage.setItem('djassa_saved_pseudo', pseudo);
    } else {
        localStorage.removeItem('djassa_remember_client');
        localStorage.removeItem('djassa_saved_pseudo');
    }
}

function saveMerchantCredentials(email, remember) {
    if (remember) {
        localStorage.setItem('djassa_remember_merchant', 'true');
        localStorage.setItem('djassa_saved_email', email);
    } else {
        localStorage.removeItem('djassa_remember_merchant');
        localStorage.removeItem('djassa_saved_email');
    }
}

function loadSavedCredentials() {
    // Charge les credentials client si la page de login client est active
    const clientPseudoInput = document.getElementById('client-pseudo');
    const clientRememberCheckbox = document.getElementById('client-remember');
    
    if (clientPseudoInput && clientRememberCheckbox) {
        const savedPseudo = localStorage.getItem('djassa_saved_pseudo');
        const rememberClient = localStorage.getItem('djassa_remember_client');
        
        if (rememberClient === 'true' && savedPseudo) {
            clientPseudoInput.value = savedPseudo;
            clientRememberCheckbox.checked = true;
        }
    }
    
    // Charge les credentials marchand si la page de login marchand est active
    const merchantEmailInput = document.getElementById('merchant-email');
    const merchantRememberCheckbox = document.getElementById('merchant-remember');
    
    if (merchantEmailInput && merchantRememberCheckbox) {
        const savedEmail = localStorage.getItem('djassa_saved_email');
        const rememberMerchant = localStorage.getItem('djassa_remember_merchant');
        
        if (rememberMerchant === 'true' && savedEmail) {
            merchantEmailInput.value = savedEmail;
            merchantRememberCheckbox.checked = true;
        }
    }
}

// ================ AFFICHAGE DES PRODUITS ================
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    const filtered = currentCategory === 'all' 
        ? products 
        : products.filter(p => p.category === currentCategory);
    
    filtered.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-category">${product.category}</div>
            <div class="product-price">${product.price.toLocaleString('fr-FR')} FCFA</div>
            <div class="product-actions">
                <input type="number" id="qty-${product.id}" min="1" value="1" max="10">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Ajouter au panier</button>
            </div>
        </div>
    `;
    
    return card;
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderProducts();
}

// ================ GESTION DU PANIER ================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value) || 1;
    
    if (quantity < 1) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            emoji: product.emoji
        });
    }
    
    saveData();
    showAlert('✓ Produit ajouté au panier!', 'success');
}

function goToCart() {
    showPage('cart-page');
    renderCart();
    
    // Si le client est connecté, pré-remplir les infos de commande
    if (currentUser) {
        const nameInput = document.getElementById('order-name');
        const emailInput = document.getElementById('order-email');
        if (nameInput) nameInput.value = currentUser.prenom || '';
        if (emailInput) emailInput.value = currentUser.email || '';
    }
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><h3>Votre panier est vide</h3><p>Commencez à ajouter des produits!</p></div>';
        cartSummary.classList.add('hidden');
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">${item.price.toLocaleString('fr-FR')} FCFA</div>
            </div>
            <div class="cart-item-qty">Qté: ${item.quantity}</div>
            <div class="cart-item-total">${itemTotal.toLocaleString('fr-FR')} FCFA</div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">Supprimer</button>
        `;
        cartItems.appendChild(cartItemEl);
    });
    
    document.getElementById('total-price').textContent = total.toLocaleString('fr-FR') + ' FCFA';
    cartSummary.classList.remove('hidden');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveData();
    renderCart();
    showAlert('Produit supprimé du panier', 'info');
}

function goHome() {
    showPage('home-page');
}

// ================ AUTHENTICATION ================
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function closeRegistrationModal() {
    document.getElementById('registration-modal').classList.add('hidden');
}

function switchTab(tab) {
    document.querySelectorAll('.login-tab').forEach(t => {
        t.classList.remove('active');
        t.classList.add('hidden');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(tab + '-tab').classList.add('active');
    document.getElementById(tab + '-tab').classList.remove('hidden');
    // Activate the corresponding button
    const button = document.querySelector(`.tab-btn[onclick*="switchTab('${tab}')"]`);
    if (button) button.classList.add('active');
}

function registerClient(event) {
    event.preventDefault();

    const numero = document.getElementById('reg-numero').value.trim();
    const prenom = document.getElementById('reg-prenom').value.trim();
    const quartier = document.getElementById('reg-quartier').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const pseudo = document.getElementById('reg-pseudo').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    // Validation des champs
    if (!numero || !prenom || !quartier || !email || !pseudo || !password) {
        showAlert('❌ Tous les champs sont obligatoires!', 'error');
        return;
    }

    // Validation du numéro de téléphone (format camerounais simple)
    const phoneRegex = /^(\+237|237)?[6-9][0-9]{7}$/;
    if (!phoneRegex.test(numero.replace(/\s/g, ''))) {
        showAlert('❌ Format de numéro invalide! (ex: 677123456)', 'error');
        return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('❌ Format d\'email invalide!', 'error');
        return;
    }

    // Validation du mot de passe
    if (password.length < 6) {
        showAlert('❌ Le mot de passe doit contenir au moins 6 caractères!', 'error');
        return;
    }

    if (password !== passwordConfirm) {
        showAlert('❌ Les mots de passe ne correspondent pas!', 'error');
        return;
    }

    // Vérifier si le pseudo existe déjà
    if (findUser(pseudo)) {
        showAlert('❌ Ce pseudo est déjà utilisé!', 'error');
        return;
    }

    // Vérifier si l'email existe déjà
    const allUsers = getAllUsers();
    if (allUsers.some(user => user.email === email)) {
        showAlert('❌ Cet email est déjà utilisé!', 'error');
        return;
    }

    const newUser = {
        numero: numero.replace(/\s/g, ''), // Nettoyer les espaces
        prenom,
        quartier,
        email,
        pseudo,
        password,
        notifications: [],
        createdAt: new Date().toISOString(),
        lastLogin: null,
        ordersCount: 0
    };

    saveUser(newUser);
    showAlert('✓ Inscription réussie! Bienvenue sur DJASSA EN LIGNE.', 'success');

    // Connexion automatique
    currentUser = newUser;
    localStorage.setItem('djassa_current_user', JSON.stringify(newUser));

    // Vider le formulaire
    event.target.reset();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function loginClient(event) {
    event.preventDefault();

    const pseudo = document.getElementById('client-pseudo').value.trim();
    const password = document.getElementById('client-password').value;
    const rememberCheckbox = document.getElementById('client-remember');
    const remember = rememberCheckbox ? rememberCheckbox.checked : false;

    // Validation des champs
    if (!pseudo || !password) {
        showAlert('❌ Veuillez saisir votre pseudo et mot de passe!', 'error');
        return;
    }

    const user = findUser(pseudo);

    if (!user) {
        showAlert('❌ Pseudo introuvable!', 'error');
        return;
    }

    if (user.password !== password) {
        showAlert('❌ Mot de passe incorrect!', 'error');
        return;
    }

    // Connexion réussie
    currentUser = user;
    currentUser.lastLogin = new Date().toISOString();
    localStorage.setItem('djassa_current_user', JSON.stringify(currentUser));

    // Sauvegarder les credentials si demandé
    saveClientCredentials(pseudo, remember);

    // Vider le formulaire
    document.getElementById('client-pseudo').value = '';
    document.getElementById('client-password').value = '';

    showAlert(`✓ Bienvenue ${user.prenom}!`, 'success');

    // Log de connexion
    console.log(`👤 Connexion client réussie: ${pseudo} à ${new Date().toLocaleString('fr-FR')}`);

    // Mettre à jour la navbar immédiatement
    checkAuthStatus();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
} 

function saveClientCredentials(pseudo, remember) {
    if (remember) {
        localStorage.setItem('djassa_saved_pseudo', pseudo);
        localStorage.setItem('djassa_remember_client', 'true');
    } else {
        localStorage.removeItem('djassa_saved_pseudo');
        localStorage.removeItem('djassa_remember_client');
    }
}

function loadClientCredentials() {
    const pseudo = localStorage.getItem('djassa_saved_pseudo');
    const remember = localStorage.getItem('djassa_remember_client') === 'true';

    if (pseudo && remember) {
        document.getElementById('client-pseudo').value = pseudo;
        document.getElementById('client-remember').checked = true;
    }
}

function loginMerchant(event) {
    event.preventDefault();

    const email = document.getElementById('merchant-email').value.trim().toLowerCase();
    const password = document.getElementById('merchant-password').value;
    const rememberCheckbox = document.getElementById('merchant-remember');
    const remember = rememberCheckbox ? rememberCheckbox.checked : false;

    // Validation des champs
    if (!email || !password) {
        showAlert('❌ Veuillez remplir tous les champs!', 'error');
        return;
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('❌ Format d\'email invalide!', 'error');
        return;
    }

    // Vérifier si le compte est verrouillé
    if (merchantData.locked) {
        showAlert('❌ Compte temporairement verrouillé. Réessayez plus tard.', 'error');
        return;
    }

    // Vérifier les credentials
    if (email === merchantData.email && password === merchantData.password) {
        // Connexion réussie
        currentMerchant = { ...merchantData };
        currentMerchant.lastLogin = new Date().toISOString();

        // Sauvegarder en localStorage
        localStorage.setItem('djassa_merchant', JSON.stringify(currentMerchant));

        // Sauvegarder les credentials si demandé
        saveMerchantCredentials(email, remember);

        // Réinitialiser les tentatives de connexion
        merchantData.loginAttempts = 0;
        merchantData.locked = false;

        // Vider le formulaire
        document.getElementById('merchant-email').value = '';
        document.getElementById('merchant-password').value = '';

        showAlert('✓ Connexion marchand réussie! Bienvenue ' + merchantData.prenom + '!', 'success');

        // Mettre à jour l'interface tout de suite
        checkAuthStatus();

        // Redirection intelligente
        if (document.getElementById('merchant-page')) {
            showMerchantDashboard();
        } else {
            window.location.href = 'index.html?m=1';
        }

        // Log de sécurité (simulation)
        console.log(`🔐 Connexion marchand réussie: ${email} à ${new Date().toLocaleString('fr-FR')}`);

    } else {
        // Échec de connexion
        merchantData.loginAttempts++;

        // Verrouiller après 3 tentatives
        if (merchantData.loginAttempts >= 3) {
            merchantData.locked = true;
            showAlert('❌ Trop de tentatives échouées. Compte verrouillé pour 15 minutes.', 'error');

            // Déverrouiller automatiquement après 15 minutes
            setTimeout(() => {
                merchantData.locked = false;
                merchantData.loginAttempts = 0;
                console.log('🔓 Compte marchand déverrouillé automatiquement');
            }, 15 * 60 * 1000); // 15 minutes
        } else {
            const remainingAttempts = 3 - merchantData.loginAttempts;
            showAlert(`❌ Email ou mot de passe incorrect! (${remainingAttempts} tentative(s) restante(s))`, 'error');
        }

        // Log de sécurité
        console.log(`🚫 Tentative de connexion échouée: ${email} (${merchantData.loginAttempts}/3)`);
    }
}

function showRegistrationModal() {
    closeModal();
    document.getElementById('registration-modal').classList.remove('hidden');
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('djassa_current_user');
    const savedMerchant = localStorage.getItem('djassa_merchant');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    if (savedMerchant) {
        // On conserve l'état du marchand, mais on ne change pas de page automatiquement.
        // Cela permet à un marchand connecté de voir le catalogue s'il le souhaite.
        currentMerchant = JSON.parse(savedMerchant);
    }

    // si on arrive avec paramètre ?m=1, forcer dashboard même si currentMerchant
    const params = new URLSearchParams(window.location.search);
    if (params.get('m') === '1' && currentMerchant) {
        showMerchantDashboard();
    }

    // Update navbar
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;

    // cleanup stray buttons except fixed ones
    Array.from(navButtons.querySelectorAll('button')).forEach(btn => {
        if (!['cart-btn','conn-btn','merchant-nav-btn','notif-btn','orders-btn'].includes(btn.id)) {
            btn.remove();
        }
    });
    // also remove old notif/orders
    const existingNotif = navButtons.querySelector('#notif-btn');
    if (existingNotif) existingNotif.remove();
    const existingOrders = navButtons.querySelector('#orders-btn');
    if (existingOrders) existingOrders.remove();

    const panierBtn = document.getElementById('cart-btn');
    const connBtn = document.getElementById('conn-btn');
    const merchantNavBtn = document.getElementById('merchant-nav-btn');

    // merchant takes precedence over client for nav buttons
    if (currentMerchant) {
        // hide cart
        if (panierBtn) panierBtn.style.display = 'none';
        // repurpose merchant button for dashboard access
        if (merchantNavBtn) {
            merchantNavBtn.textContent = '📊 Dashboard';
            merchantNavBtn.onclick = showMerchantDashboard;
            merchantNavBtn.style.display = '';
            merchantNavBtn.classList.add('revealed'); // Forcer la visibilité
        }
        // add explicit logout button if not already present
        if (!navButtons.querySelector('#logout-btn')) {
            const logoutButton = document.createElement('button');
            logoutButton.id = 'logout-btn';
            logoutButton.className = 'btn btn-danger';
            logoutButton.textContent = 'Déconnexion';
            logoutButton.onclick = logoutMerchant;
            navButtons.appendChild(logoutButton);
        }
        // hide client connexion button
        if (connBtn) connBtn.style.display = 'none';
        // no return here: ensure rest of logic can still run if needed
    }

    // client-specific logic
    if (currentUser) {
        if (connBtn) {
            connBtn.textContent = '👤 Déconnexion';
            connBtn.onclick = () => {
                currentUser = null;
                localStorage.removeItem('djassa_current_user');
                showAlert('Déconnexion réussie!', 'success');
                location.reload();
            };
        }
        
        // Ajouter icône notifications
        const notifications = getNotificationsForEmail(currentUser.email);
        const notifCount = notifications.filter(n => !n.read).length;
        const notifBtn = document.createElement('button');
        notifBtn.className = 'btn btn-outline';
        notifBtn.id = 'notif-btn';
        notifBtn.innerHTML = `🔔 Notifications ${notifCount > 0 ? `(${notifCount})` : ''}`;
        notifBtn.onclick = showNotifications;
        
        // Ajouter bouton Mes Commandes
        const ordersBtn = document.createElement('button');
        ordersBtn.className = 'btn btn-outline';
        ordersBtn.id = 'orders-btn';
        ordersBtn.textContent = '📦 Mes Commandes';
        ordersBtn.onclick = () => showClientOrders();
        
        if (panierBtn) {
            navButtons.insertBefore(ordersBtn, panierBtn);
            navButtons.insertBefore(notifBtn, panierBtn);
        } else {
            navButtons.appendChild(ordersBtn);
            navButtons.appendChild(notifBtn);
        }
    } else {
        if (connBtn) {
            connBtn.style.display = '';
            connBtn.textContent = '👤 Connexion';
            connBtn.onclick = () => window.location.href = 'client-login.html';
        }
        if (panierBtn) panierBtn.style.display = '';
        
        // Ajouter bouton Mes Commandes pour les invités aussi
        const ordersBtn = document.createElement('button');
        ordersBtn.className = 'btn btn-outline';
        ordersBtn.id = 'orders-btn';
        ordersBtn.textContent = '📦 Mes Commandes';
        ordersBtn.onclick = () => showClientOrdersModal();
        
        if (panierBtn) {
            navButtons.insertBefore(ordersBtn, panierBtn);
        } else {
            navButtons.appendChild(ordersBtn);
        }
    }
}

function logoutMerchant() {
    // Confirmation de déconnexion
    if (!confirm('Êtes-vous sûr de vouloir vous déconnecter de l\'espace marchand ?')) {
        return;
    }

    // Nettoyer les données de session
    currentMerchant = null;
    localStorage.removeItem('djassa_merchant');

    // Nettoyer les credentials sauvegardés si demandé
    const clearCredentials = confirm('Voulez-vous aussi supprimer vos identifiants sauvegardés ?');
    if (clearCredentials) {
        localStorage.removeItem('djassa_merchant_credentials');
    }

    // Revenir à la page d'accueil
    showPage('home-page');
    showAlert('✓ Déconnexion réussie. À bientôt!', 'success');

    // Mettre à jour l'interface
    checkAuthStatus();

    // Log de sécurité
    console.log('🚪 Déconnexion marchand:', new Date().toLocaleString('fr-FR'));
}

// ================ COMMANDES ================
function submitOrder(event) {
    event.preventDefault();
    
    // if user is logged in, prefill contact info
    let name = document.getElementById('order-name').value.trim();
    let email = document.getElementById('order-email').value.trim();
    const address = document.getElementById('order-address').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    
    if (currentUser) {
        // prefer stored info when available
        name = currentUser.prenom || name;
        email = currentUser.email || email;
    }
    
    if (!name || !email || !address || !phone) {
        showAlert('❌ Tous les champs sont requis!', 'error');
        return;
    }
    
    const orderId = 'CMD-' + Date.now();
    
    const order = {
        id: orderId,
        date: new Date().toLocaleDateString('fr-FR'),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        clientName: name,
        clientEmail: email,
        clientAddress: address,
        clientPhone: phone,
        status: 'pending'
    };
    
    orders.push(order);
    saveData();
    
    // Simulation: Envoyer email au marchand
    sendEmailToMerchant(order);
    
    // Vider le panier
    cart = [];
    saveData();
    
    showAlert(`✓ Commande ${orderId} créée! Un email de confirmation a été envoyé au marchand.`, 'success');
    
    // after placing order, ensure navbar buttons are updated
    checkAuthStatus();
    
    // clear form and cart
    event.target.reset();
    
    // show the client's orders shortly so they can see status
    setTimeout(() => {
        // pass email if guest
        if (currentUser) {
            showClientOrders();
        } else {
            showClientOrders(email);
        }
    }, 1000);
    
    setTimeout(() => {
        showPage('home-page');
    }, 2000);
}

function sendEmailToMerchant(order) {
    // Simulation d'envoi d'email
    console.log('📧 EMAIL ENVOYÉ AU MARCHAND:', {
        to: merchantData.email,
        subject: `Nouvelle commande: ${order.id}`,
        body: `
            Nouvelle commande reçue!
            
            Identifiant: ${order.id}
            Client: ${order.clientName}
            Email: ${order.clientEmail}
            Téléphone: ${order.clientPhone}
            Adresse: ${order.clientAddress}
            
            Articles:
            ${order.items.map(item => `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA`).join('\n')}
            
            Total: ${order.total.toLocaleString('fr-FR')} FCFA
        `
    });
}

function sendConfirmationEmailToClient(order) {
    // Simulation d'envoi d'email de confirmation
    console.log('📧 EMAIL DE CONFIRMATION ENVOYÉ AU CLIENT:', {
        to: order.clientEmail,
        subject: `Commande validée: ${order.id}`,
        body: `
            Bonjour ${order.clientName},
            
            Votre commande ${order.id} a été validée avec succès!
            
            Montant total: ${order.total.toLocaleString('fr-FR')} FCFA
            Adresse de livraison: ${order.clientAddress}
            
            Merci d'avoir choisi DJASSA EN LIGNE!
        `
    });
}

// ================ TABLEAU DE BORD MARCHAND ================
function showMerchantDashboard() {
    showPage('merchant-page');
    renderMerchantProfile();
    renderOrders();
}

// helper to show home page and re-render products
function showHomePage() {
    showPage('home-page');
    const grid = document.getElementById('products-grid');
    if (grid) renderProducts();
}



// Fonctions utilitaires pour les statistiques
function getMonthlySales() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyOrders = orders.filter(order => {
        // Parser la date (format: "dd/mm/yyyy")
        const [day, month, year] = order.date.split('/').map(Number);
        return year === currentYear && month - 1 === currentMonth; // month est 1-indexé dans la date française
    });

    return {
        count: monthlyOrders.length,
        revenue: monthlyOrders.reduce((sum, order) => sum + order.total, 0)
    };
}

function getYearlyRevenue() {
    const currentYear = new Date().getFullYear();

    return orders
        .filter(order => {
            // Parser la date (format: "dd/mm/yyyy")
            const [day, month, year] = order.date.split('/').map(Number);
            return year === currentYear;
        })
        .reduce((sum, order) => sum + order.total, 0);
}

function renderMerchantProfile() {

function renderOrders() {
    const ordersList = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: #888;">Aucune commande pour le moment</p>';
        return;
    }
    
    // Grouper les commandes par statut
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const completedOrders = orders.filter(o => o.status === 'completed');
    const refusedOrders = orders.filter(o => o.status === 'refused');
    
    ordersList.innerHTML = '';
    
    // Section Commandes en attente
    if (pendingOrders.length > 0) {
        ordersList.innerHTML += '<h4>📋 Commandes en Attente</h4>';
        pendingOrders.forEach(order => {
            ordersList.appendChild(createOrderCard(order));
        });
    }
    
    // Section Commandes Validées
    if (completedOrders.length > 0) {
        ordersList.innerHTML += '<h4>✅ Commandes Validées</h4>';
        completedOrders.forEach(order => {
            ordersList.appendChild(createOrderCard(order));
        });
    }
    
    // Section Commandes Refusées
    if (refusedOrders.length > 0) {
        ordersList.innerHTML += '<h4>❌ Commandes Refusées</h4>';
        refusedOrders.forEach(order => {
            ordersList.appendChild(createOrderCard(order));
        });
    }
}

function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    
    const itemsList = order.items.map(item => 
        `<div class="order-detail-item">
            <span class="order-detail-label">${item.emoji} ${item.name} x${item.quantity}</span>
            <span class="order-detail-value">${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
        </div>`
    ).join('');
    
    let actions = '';
    if (order.status === 'pending') {
        actions = `
            <div class="order-actions">
                <button class="btn-approve" onclick="approveOrder('${order.id}')">✓ Valider</button>
                <button class="btn-refuse" onclick="refuseOrder('${order.id}')">✗ Refuser</button>
            </div>
        `;
    }
    
    orderCard.innerHTML = `
        <div class="order-header">
            <span class="order-id">📦 ${order.id}</span>
            <span class="order-status ${order.status}">${
                order.status === 'pending' ? '⏳ En attente' : 
                order.status === 'completed' ? '✓ Validée' : 
                '❌ Refusée'
            }</span>
        </div>
        <div class="order-details">
            <div class="order-detail-item">
                <span class="order-detail-label">Client:</span>
                <span class="order-detail-value">${order.clientName}</span>
            </div>
            <div class="order-detail-item">
                <span class="order-detail-label">Email:</span>
                <span class="order-detail-value">${order.clientEmail}</span>
            </div>
            <div class="order-detail-item">
                <span class="order-detail-label">Téléphone:</span>
                <span class="order-detail-value">${order.clientPhone}</span>
            </div>
            <div class="order-detail-item">
                <span class="order-detail-label">Adresse:</span>
                <span class="order-detail-value">${order.clientAddress}</span>
            </div>
            <div class="order-detail-item">
                <span class="order-detail-label">Date:</span>
                <span class="order-detail-value">${order.date}</span>
            </div>
            <hr style="margin: 1rem 0;">
            ${itemsList}
            <hr style="margin: 1rem 0;">
            <div class="order-detail-item" style="margin-top: 1rem;">
                <span class="order-detail-label" style="font-weight: bold;">TOTAL:</span>
                <span class="order-detail-value" style="font-size: 1.2rem;">${order.total.toLocaleString('fr-FR')} FCFA</span>
            </div>
        </div>
        ${actions}
    `;
    
    return orderCard;
}

function refuseOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = 'refused';
        saveData();
        
        // Ajouter notification au client
        addNotificationToClient(order.clientEmail, `Votre commande ${order.id} a été refusée : marchandise en rupture de stock.`);
        
        showAlert(`✗ Commande ${orderId} refusée! Notification envoyée au client.`, 'warning');
        renderOrders();
    }
}

function approveOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = 'completed';
        saveData();
        
        // Envoyer email de confirmation au client
        sendConfirmationEmailToClient(order);
        
        // Ajouter notification au client
        addNotificationToClient(order.clientEmail, `Votre commande ${order.id} a été validée avec succès!`);
        
        showAlert(`✓ Commande ${orderId} validée! Email de confirmation envoyé au client.`, 'success');
        renderOrders();
    }
}

// ================ UTILITAIRES ================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden');
    });
    
    const target = document.getElementById(pageId);
    if (!target) return;
    target.classList.remove('hidden');
    target.classList.add('active');
}

function showClientOrders(email) {
    // Allow passing explicit email for guests.
    const targetEmail = email || (currentUser && currentUser.email);
    if (!targetEmail) return;
    
    const clientOrders = orders.filter(o => o.clientEmail === targetEmail);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Mes Commandes</h2>
            
            <!-- Section Notifications -->
            ${(() => {
                const notifications = getNotificationsForEmail(targetEmail);
                const unreadNotifications = notifications.filter(n => !n.read);
                if (notifications.length > 0) {
                    return `
                        <div class="notifications-section" style="margin-bottom: 2rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <h3 style="margin-top: 0; color: #333;">🔔 Notifications ${unreadNotifications.length > 0 ? `(${unreadNotifications.length} non lues)` : ''}</h3>
                            <div class="notifications-list">
                                ${notifications.map(notif => `
                                    <div class="notification-item ${notif.read ? 'read' : 'unread'}" style="padding: 0.5rem; margin: 0.5rem 0; border-left: 3px solid ${notif.read ? '#28a745' : '#ffc107'}; background: white; border-radius: 4px;">
                                        <div style="font-size: 0.9rem; color: #666;">${notif.date}</div>
                                        <div style="margin-top: 0.25rem;">${notif.message}</div>
                                        ${!notif.read ? `<button onclick="markNotificationAsRead('${targetEmail}', ${notif.id}); this.parentElement.classList.remove('unread'); this.parentElement.classList.add('read'); this.style.display='none';" style="margin-top: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.8rem;">Marquer comme lu</button>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }
                return '';
            })()}
            
            <div id="client-orders-list">
                ${clientOrders.length === 0 ? 
                    '<p>Vous n\'avez pas encore passé de commande.</p>' : 
                    clientOrders.map(order => `
                        <div class="order-card">
                            <div class="order-header">
                                <span class="order-id">📦 ${order.id}</span>
                                <span class="order-status ${order.status}">${
                                    order.status === 'pending' ? '⏳ En attente' : 
                                    order.status === 'completed' ? '✓ Validée' : 
                                    '❌ Refusée'
                                }</span>
                            </div>
                            <div class="order-details">
                                <div class="order-detail-item">
                                    <span class="order-detail-label">Date:</span>
                                    <span class="order-detail-value">${order.date}</span>
                                </div>
                                <div class="order-detail-item">
                                    <span class="order-detail-label">Adresse:</span>
                                    <span class="order-detail-value">${order.clientAddress}</span>
                                </div>
                                <hr style="margin: 1rem 0;">
                                ${order.items.map(item => `
                                    <div class="order-detail-item">
                                        <span class="order-detail-label">${item.emoji} ${item.name} x${item.quantity}</span>
                                        <span class="order-detail-value">${(item.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                `).join('')}
                                <hr style="margin: 1rem 0;">
                                <div class="order-detail-item">
                                    <span class="order-detail-label" style="font-weight: bold;">TOTAL:</span>
                                    <span class="order-detail-value" style="font-size: 1.2rem;">${order.total.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.classList.remove('hidden');
}
}

// Fonction pour afficher le modal de commandes (avec demande d'email pour les invités)
function showClientOrdersModal() {
    if (currentUser) {
        // Utilisateur connecté - afficher directement ses commandes
        showClientOrders();
        return;
    }
    
    // Invité - demander l'email
    const email = prompt('Veuillez saisir votre adresse email pour voir vos commandes :');
    if (!email || !email.trim()) {
        showAlert('Email requis pour voir vos commandes', 'error');
        return;
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Vérifier si cet email a des commandes
    const clientOrders = orders.filter(o => o.clientEmail.toLowerCase() === trimmedEmail);
    if (clientOrders.length === 0) {
        showAlert('Aucune commande trouvée pour cette adresse email', 'info');
        return;
    }
    
    // Afficher les commandes pour cet email
    showClientOrders(trimmedEmail);
}