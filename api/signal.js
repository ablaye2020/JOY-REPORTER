const nodemailer = require('nodemailer');

// ⚠️ REMPLACE PAR TES EMAILS ET MOTS DE PASSE D'APPLICATION
const comptesEmail = [
    { user: "EMAIL1@gmail.com", pass: "MOT_DE_PASSE_APP_1" },
    { user: "EMAIL2@gmail.com", pass: "MOT_DE_PASSE_APP_2" }
];

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

const messages = [
    "⚠️ Harcèlement homophobe quotidien. Numéro :",
    "🔴 Menaces de mort répétées. Numéro :",
    "🚨 Insultes et création de groupes de haine. Numéro :",
    "💀 Harcèlement psychologique grave. Numéro :",
    "🔥 Appel à la violence. Numéro :"
];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
    
    const { numero, index } = req.body;
    const compte = comptesEmail[Math.floor(Math.random() * comptesEmail.length)];
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: compte.user, pass: compte.pass }
    });
    
    const sujet = `Signalement - Harcèlement - ${new Date().toLocaleString()}`;
    const message = `${messages[index % messages.length]} ${numero}`;
    
    try {
        await transporter.sendMail({
            from: compte.user,
            to: emailsSupport.join(','),
            subject: sujet,
            text: message
        });
        res.json({ success: true });
    } catch(error) {
        console.error(`Erreur avec ${compte.user}:`, error.message);
        res.status(500).json({ error: error.message });
    }
};
