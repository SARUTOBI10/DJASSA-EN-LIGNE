/*
 * DJASSA EN LIGNE - Configuration et Integration
 * 
 * Ce fichier contient les configurations pour les futures intégrations
 * avec des services externes (emails, paiements, etc.)
 */

// ============================================
// 1. CONFIGURATION DES EMAILS
// ============================================

const EMAIL_CONFIG = {
    // Mode actuel: 'console' (logs seulement) ou 'real' (emails réels via backend)
    mode: 'console',
    
    // Configuration pour les emails réels (nécessite un backend)
    provider: 'nodemailer', // 'nodemailer', 'sendgrid', 'mailgun', etc.
    
    // Service Gmail (exemple)
    gmail: {
        from: 'marchand@djassa.com',
        password: 'YOUR_APP_PASSWORD', // Pas le mot de passe Google direct
        service: 'gmail',
        port: 587,
    },
    
    // Service SendGrid (alternative)
    sendgrid: {
        apiKey: 'YOUR_SENDGRID_API_KEY',
        fromEmail: 'noreply@djassa.com',
    },
    
    // Endpoints pour appels backend
    endpoints: {
        sendEmail: '/api/send-email',
        sendOrderEmail: '/api/send-order-email',
        sendConfirmation: '/api/send-confirmation-email'
    }
};

// ============================================
// 2. CONFIGURATION DES PAIEMENTS
// ============================================

const PAYMENT_CONFIG = {
    // Mode: 'disabled', 'stripe', 'paypal', 'wave'
    mode: 'disabled',
    
    // Stripe
    stripe: {
        publicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
        secretKey: 'sk_test_YOUR_STRIPE_SECRET_KEY', // À stocker côté serveur!
    },
    
    // PayPal
    paypal: {
        clientId: 'YOUR_PAYPAL_CLIENT_ID',
        secretKey: 'YOUR_PAYPAL_SECRET_KEY', // À stocker côté serveur!
        mode: 'sandbox', // 'sandbox' ou 'production'
    },
    
    // Wave (solution africaine)
    wave: {
        merchantId: 'YOUR_WAVE_MERCHANT_ID',
        apiKey: 'YOUR_WAVE_API_KEY',
    }
};

// ============================================
// 3. CONFIGURATION DE LA BASE DE DONNÉES
// ============================================

const DATABASE_CONFIG = {
    // Type: 'localstorage', 'mongodb', 'firebase', 'postgresql'
    type: 'localstorage',
    
    // MongoDB
    mongodb: {
        connectionString: 'mongodb+srv://user:password@cluster.mongodb.net/djassa',
        database: 'djassa_db',
    },
    
    // Firebase
    firebase: {
        apiKey: 'YOUR_FIREBASE_API_KEY',
        authDomain: 'your-project.firebaseapp.com',
        projectId: 'your-project-id',
        databaseUrl: 'https://your-project.firebaseio.com',
    },
    
    // PostgreSQL
    postgresql: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'password',
        database: 'djassa',
    }
};

// ============================================
// 4. CONFIGURATION GÉNÉRALE
// ============================================

const APP_CONFIG = {
    // Nom de l'application
    appName: 'DJASSA EN LIGNE',
    appVersion: '1.0.0',
    
    // URL de base
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api',
    
    // Devise
    currency: 'FCFA',
    currencySymbol: 'FCFA',
    
    // Pays
    country: 'Côte d\'Ivoire',
    countryCode: 'CI',
    
    // Frais de livraison
    shippingFee: 2000, // FCFA
    freeShippingAbove: 50000, // FCFA
    
    // Options de livraison
    shippingMethods: [
        { id: 1, name: 'Livraison standard', cost: 2000, days: 3 },
        { id: 2, name: 'Livraison express', cost: 5000, days: 1 },
        { id: 3, name: 'Retrait en point relais', cost: 0, days: 1 },
    ],
    
    // TVA
    taxRate: 0.18, // 18%
    
    // Pagination
    itemsPerPage: 12,
    
    // Timeout
    requestTimeout: 30000, // ms
};

// ============================================
// 5. CONFIGURATION DES MARKERS DE TEXTE
// ============================================

const LANGUAGE_CONFIG = {
    lang: 'fr', // 'fr', 'en', 'es', etc.
    
    // Textes en français
    fr: {
        welcome: 'Bienvenue chez DJASSA EN LIGNE',
        addToCart: 'Ajouter au panier',
        checkout: 'Passer la commande',
        orderSuccess: 'Commande créée avec succès!',
        loginError: 'Pseudo ou mot de passe incorrect',
        registrationSuccess: 'Inscription réussie!',
    },
    
    // Textes en anglais
    en: {
        welcome: 'Welcome to DJASSA EN LIGNE',
        addToCart: 'Add to cart',
        checkout: 'Checkout',
        orderSuccess: 'Order created successfully!',
        loginError: 'Incorrect username or password',
        registrationSuccess: 'Registration successful!',
    }
};

// ============================================
// 6. CONFIGURATION DE SÉCURITÉ
// ============================================

const SECURITY_CONFIG = {
    // Chiffrement des mots de passe
    passwordEncryption: false, // À mettre en true en production!
    encryptionLibrary: 'bcrypt', // 'bcrypt', 'crypto-js', etc.
    
    // Sessions
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures en ms
    requireHttps: false, // À mettre en true en production!
    
    // CORS
    corsOrigins: ['http://localhost:3000', 'https://djassa.com'],
    
    // Rate limiting
    rateLimit: {
        enabled: false,
        maxRequests: 100,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },
    
    // JWT
    jwt: {
        secret: 'YOUR_JWT_SECRET_KEY',
        expiresIn: '24h',
    }
};

// ============================================
// 7. TEMPLATES D'EMAILS
// ============================================

const EMAIL_TEMPLATES = {
    // Email commande reçue (au marchand)
    newOrder: {
        subject: 'Nouvelle commande: {orderId}',
        template: `
            <h2>Nouvelle commande reçue!</h2>
            <p>Identifiant: {orderId}</p>
            <p>Client: {clientName}</p>
            <p>Email: {clientEmail}</p>
            <p>Téléphone: {clientPhone}</p>
            <p>Adresse: {clientAddress}</p>
            
            <h3>Articles:</h3>
            {itemsList}
            
            <h3>Total: {totalAmount} {currency}</h3>
            
            <button>Voir la commande</button>
        `
    },
    
    // Email confirmation (au client)
    orderConfirmation: {
        subject: 'Votre commande {orderId} a été validée!',
        template: `
            <h2>Merci pour votre commande!</h2>
            <p>Bonjour {clientName},</p>
            
            <p>Votre commande {orderId} a été validée avec succès!</p>
            
            <h3>Détails de la commande:</h3>
            {itemsList}
            
            <p>Total: {totalAmount} {currency}</p>
            <p>Adresse de livraison: {clientAddress}</p>
            
            <p>Vous recevrez votre colis dans 2-3 jours.</p>
            
            <p>Merci d'avoir choisi DJASSA EN LIGNE!</p>
        `
    },
    
    // Email confirmation inscription (client)
    welcomeEmail: {
        subject: 'Bienvenue chez DJASSA EN LIGNE!',
        template: `
            <h2>Bienvenue {clientName}!</h2>
            
            <p>Votre compte a été créé avec succès.</p>
            <p>Vous pouvez maintenant vous connecter et commencer vos achats.</p>
            
            <button>Aller au magasin</button>
        `
    }
};

// ============================================
// 8. ANALYTIQUES
// ============================================

const ANALYTICS_CONFIG = {
    enabled: false,
    provider: 'google', // 'google', 'mixpanel', 'amplitude', etc.
    
    // Google Analytics
    googleAnalytics: {
        trackingId: 'UA-XXXXXXXXX-X',
    },
    
    // Mixpanel
    mixpanel: {
        token: 'YOUR_MIXPANEL_TOKEN',
    }
};

// ============================================
// 9. EXPORT
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EMAIL_CONFIG,
        PAYMENT_CONFIG,
        DATABASE_CONFIG,
        APP_CONFIG,
        LANGUAGE_CONFIG,
        SECURITY_CONFIG,
        EMAIL_TEMPLATES,
        ANALYTICS_CONFIG
    };
}
