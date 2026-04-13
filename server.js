const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
app.use(express.static('.'));

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

const messages = [
    "Harcèlement répété sur WhatsApp",
    "Spam et contenu frauduleux",
    "Usurpation d'identité",
    "Messages insultants et menaces",
    "Pornographie non consentie"
];

app.post('/api/signal', async (req, res) => {
    const { numero, index } = req.body;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'TON_EMAIL@gmail.com', // 🔁 REMPLACE ICI
            pass: 'TON_MOT_DE_PASSE_APPLICATION' // 🔁 REMPLACE ICI
        }
    });

    const sujet = `Signalement compte frauduleux - ${Math.floor(Math.random()*10000)}`;
    const message = `Je signale le numéro ${numero} pour ${messages[index % messages.length]}. 
    Merci d'agir rapidement.`;

    try {
        await transporter.sendMail({
            from: 'TON_EMAIL@gmail.com',
            to: emailsSupport.join(','),
            subject: sujet,
            text: message
        });
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Serveur lancé sur http://localhost:3000'));
