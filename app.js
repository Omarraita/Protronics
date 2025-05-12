const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.OAUTH_USER,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
});

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, 'public', 'services.html')));
app.get('/portfolio', (req, res) => res.sendFile(path.join(__dirname, 'public', 'portfolio.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// Formulaire contact
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).send('Tous les champs sont obligatoires.');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).send('Email invalide.');

    const mailOptions = {
        from: process.env.OAUTH_USER,
        to: process.env.OAUTH_USER,
        subject: `Nouveau message de ${name}`,
        replyTo: email,
        text: `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('ERROR sending email:', error);      // <-- THIS WILL PRINT
        console.error('mailOptions used:', mailOptions);    // <-- ALSO PRINTS THE DATA
        return res.status(500).send('Erreur envoi mail.');
    }
    console.log('✅ Email sent successfully:', info.response); // <-- THIS PRINTS IF OK
    res.redirect('/contact?success=true');
});

});

app.listen(port, () => console.log(`Serveur en ligne sur le port ${port}`));
