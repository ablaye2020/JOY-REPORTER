const nodemailer = require('nodemailer');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

const messages = [
    "⚠️ ALERTE PÉDOFILIE ⚠️ Ce numéro envoie des photos dénudées à ma fille de 12 ans. J'ai porté plainte. Numéro du prédateur :",
    "🔴 MENACE DE MORT AVEC ARMES 🔴 Cette personne m'a menacé avec une arme. Plainte déposée. Numéro dangereux :",
    "🚨 TENTATIVE D'ENLÈVEMENT 🚨 Ce compte a contacté mon fils de 10 ans. Police enquête. Numéro :",
    "💀 VIOLENCE CONJUGALE 💀 Mon ex-conjoint me menace de mort. Dossier au parquet. Numéro :",
    "🔥 INCITATION AU TERRORISME 🔥 Ce numéro diffuse des vidéos de décapitation. J'ai contacté Pharos. Numéro :",
    "🔞 PROSTITUTION MINEURS 🔞 Ce compte propose des filles mineures. Police judiciaire saisie. Numéro :",
    "💊 VENTE DE MÉDICAMENTS FAUX 💊 Ce numéro vend des opiacés à des lycéens. Numéro :",
    "🎯 HARCÈLEMENT SUICIDE 🎯 Cette personne pousse ma sœur de 15 ans au suicide. Numéro :",
    "⚡ PIRATAGE DE COMPTES POLICIERS ⚡ Ce hacker a piraté un compte policier. Numéro :",
    "⚠️ ARNAQUE AU SUPPORT WHATSAPP ⚠️ Faux support Meta qui vole les comptes. Numéro :"
];

const prenoms = ["Commandant", "Capitaine", "Major", "Lieutenant", "Colonel", "Sergent"];
const noms = ["Martin", "Bernard", "Dubois", "Richard", "Moreau", "Laurent"];
const villes = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nice"];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
    
    const { numero, index } = req.body;
    
    if (!numero) {
        return res.status(400).json({ error: 'Numéro requis' });
    }
    
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || !emailPass) {
        return res.status(500).json({ error: 'Configuration email manquante' });
    }
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
    });
    
    const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
    const villeAleatoire = villes[Math.floor(Math.random() * villes.length)];
    const numeroPlainte = Math.floor(Math.random() * 900000) + 100000;
    
    const sujet = `🔴 URGENCE - ${messages[index % messages.length].substring(0, 40)}...`;
    const message = `${messages[index % messages.length]} ${numero}

Plainte déposée au commissariat de ${villeAleatoire} (n°${numeroPlainte}).

Je requiers la FERMETURE IMMÉDIATE de ce compte WhatsApp.

${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}
Officier traitant - ${villeAleatoire}`;
    
    try {
        await transporter.sendMail({
            from: emailUser,
            to: emailsSupport.join(','),
            subject: sujet,
            text: message
        });
        res.json({ success: true });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};
