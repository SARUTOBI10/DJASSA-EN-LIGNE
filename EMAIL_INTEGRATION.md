# 📧 GUIDE D'INTÉGRATION DES EMAILS RÉELS

*Dernière mise à jour : 8 mars 2026*

## Vue d'ensemble

Actuellement, l'application **DJASSA EN LIGNE** simule l'envoi d'emails en affichant les logs dans la console du navigateur. Ce guide vous aide à intégrer de vrais emails.

---

## 🔧 Options d'Intégration

### Option 1: Backend Node.js avec Express + Nodemailer (⭐ Recommandé)

#### Installation
```bash
npm init
npm install express nodemailer cors dotenv
```

#### Code Backend (server.js)
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Route pour envoyer email au marchand
app.post('/api/send-order-email', async (req, res) => {
    const { order } = req.body;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'marchand@djassa.com',
        subject: `Nouvelle commande: ${order.id}`,
        html: `
            <h2>Nouvelle commande reçue!</h2>
            <p>Client: ${order.clientName}</p>
            <p>Email: ${order.clientEmail}</p>
            <p>Téléphone: ${order.clientPhone}</p>
            <p>Adresse: ${order.clientAddress}</p>
            <h3>Total: ${order.total} FCFA</h3>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur email:', error);
        res.status(500).json({ error: 'Erreur d\'envoi' });
    }
});

// Route pour envoyer confirmation au client
app.post('/api/send-confirmation-email', async (req, res) => {
    const { order } = req.body;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: order.clientEmail,
        subject: `Commande validée: ${order.id}`,
        html: `
            <h2>Votre commande a été validée!</h2>
            <p>Bonjour ${order.clientName},</p>
            <p>Montant: ${order.total} FCFA</p>
            <p>Adresse: ${order.clientAddress}</p>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Erreur d\'envoi' });
    }
});

app.listen(3000, () => console.log('Serveur démarré sur port 3000'));
```

#### Fichier .env
```
EMAIL_USER=votremail@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_app
```

#### Intégration Frontend
```javascript
// Modifier script.js pour utiliser le backend
function sendEmailToMerchant(order) {
    fetch('http://localhost:3000/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
    })
    .then(res => res.json())
    .then(data => console.log('Email envoyé!'))
    .catch(err => console.error('Erreur:', err));
}
```

---

### Option 2: SendGrid (Cloud Service)

#### Installation
```bash
npm install @sendgrid/mail
```

#### Code Backend
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
    const msg = {
        to: 'marchand@djassa.com',
        from: 'djassa@votredomaine.com',
        subject: `Nouvelle commande: ${req.body.order.id}`,
        html: req.body.htmlContent,
    };

    try {
        await sgMail.send(msg);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

#### Variables d'environnement
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
```

---

### Option 3: Firebase (Google)

#### Installation
```bash
npm install firebase-admin
```

#### Code avec Cloud Functions
```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().gmail.email,
        pass: functions.config().gmail.password
    }
});

exports.sendOrderEmail = functions.https.onRequest(async (req, res) => {
    const { order } = req.body;
    
    await transporter.sendMail({
        from: 'djassa@gmail.com',
        to: 'marchand@djassa.com',
        subject: `Nouvelle commande: ${order.id}`,
        html: `<h2>Commande reçue: ${order.id}</h2>`
    });
    
    res.json({ success: true });
});
```

---

### Option 4: Solution Africaine Wave

```javascript
const Wave = require('wave-api');

const wave = new Wave({
    apiKey: process.env.WAVE_API_KEY,
    merchantId: process.env.WAVE_MERCHANT_ID
});

app.post('/api/wave-payment', async (req, res) => {
    try {
        const payment = await wave.charge({
            amount: req.body.amount,
            phoneNumber: req.body.phoneNumber,
            description: 'Commande DJASSA'
        });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
```

---

## ⚙️ Configuration Gmail (Recommandé)

### Étapes

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail

2. **Générez un mot de passe d'application:**
   - Allez à: https://myaccount.google.com/apppasswords
   - Sélectionnez: Mail → Windows (ou votre appareil)
   - Copiez le mot de passe généré

3. **Stockez dans .env:**
   ```
   EMAIL_USER=votremail@gmail.com
   EMAIL_PASSWORD=xxxxxxxxxxxxxx
   ```

4. **N'oubliez pas de gitignore le .env:**
   ```
   .env
   node_modules/
   ```

---

## 🔐 Sécurité

### Points importants:

✅ **Ne mettez JAMAIS les mots de passe en dur**
✅ **Utilisez toujours .env pour les secrets**
✅ **Validez les emails côté serveur**
✅ **Limitez les requêtes (rate limiting)**
✅ **Utilisez HTTPS en production**
✅ **Chiffrez les données sensibles**

```javascript
// Exemple de rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite à 100 requêtes par fenêtre
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring

### Vérifiez les emails envoyés:

```javascript
// Logs avec timestamps
console.log(`[${new Date().toISOString()}] Email envoyé à ${recipientEmail}`);

// Avec base de données (MongoDB):
const EmailLog = require('./models/EmailLog');

await EmailLog.create({
    to: order.clientEmail,
    subject: 'Confirmation de commande',
    sentAt: new Date(),
    status: 'sent'
});
```

---

## 🧪 Test d'Email

### Utilisez Mailtrap ou Ethereal:

```javascript
// Configuration test (Ethereal)
const nodemailer = require('nodemailer');

let testAccount = await nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass,
    },
});

let info = await transporter.sendMail({...});
console.log('Aperçu URL:', nodemailer.getTestMessageUrl(info));
```

---

## 📈 Prochaines Étapes

1. **Mettre en place une base de données** pour persister les données
2. **Ajouter un système de paiement** (Stripe, Wave, etc.)
3. **Implémenter l'authentification JWT**
4. **Ajouter des validations côté serveur**
5. **Mettre à jour les emails avec templates HTML professionnels**
6. **Ajouter un système de factures PDF**
7. **Implémenter le tracking de commandes**

---

## 📚 Ressources

- [Nodemailer Docs](https://nodemailer.com/)
- [SendGrid Node.js](https://github.com/sendgrid/sendgrid-nodejs)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Express.js](https://expressjs.com/)

---

## ❓ Questions Courantes

**Q: Mon email ne s'envoie pas?**
R: Vérifiez le .env, activez l'authentification 2FA Gmail, et contrôlez les logs

**Q: Puis-je utiliser mon email personnel Gmail?**
R: Oui, mais créez un compte dédié pour votre application

**Q: Quel service est le meilleur?**
R: Pour débuter: Firebase ou Nodemailer. Pour la production: SendGrid ou Wave

**Q: Comment tester sans vraie API?**
R: Utilisez Mailtrap ou les logs console

---

*Bon codage! 🚀*
