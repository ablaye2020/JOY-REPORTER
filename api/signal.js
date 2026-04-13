const nodemailer = require('nodemailer');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

// MOTIFS URGENTS - Version alerte immédiate
const messages = [
    "⚠️ ALERTE PÉDOFILIE ⚠️ Ce numéro envoie des photos dénudées à ma fille de 12 ans. J'ai porté plainte au commissariat ce matin. Fermeture URGENTE requise. Numéro du prédateur :",
    "🔴 MENACE DE MORT AVEC ARMES 🔴 Cette personne m'a envoyé la photo d'une arme de poing en disant 'je vais te buter toi et ta famille'. Plainte déposée au 17. Numéro dangereux :",
    "🚨 TENTATIVE D'ENLÈVEMENT 🚨 Ce compte a contacté mon fils de 10 ans en se faisant passer pour son oncle pour le faire monter dans une voiture. La police enquête. À FERMER IMMÉDIATEMENT :",
    "💀 VIOLENCE CONJUGALE AVEC PREUVES 💀 Mon ex-conjoint utilise WhatsApp pour me menacer de mort et me dire où il va m'enterrer. J'ai un dossier au parquet. Numéro de l'agresseur :",
    "🔥 INCITATION AU TERRORISME 🔥 Ce numéro diffuse des vidéos de décapitation et des appels au djihad dans des groupes WhatsApp. J'ai contacté Pharos. À BLOQUER URGENCE :",
    "⚠️ USURPATION D'IDENTITÉ D'UN MÉDECIN ⚠️ Cette personne se fait passer pour le Dr. Martin de l'hôpital Necker et donne de faux diagnostics à des parents d'enfants malades. Danger de mort potentiel. Numéro :",
    "🔞 PROSTITUTION MINEURS 🔞 Ce compte propose des 'jeunes filles de 14 ans' sur son statut WhatsApp. J'ai prélevé les preuves. Police judiciaire saisie. Numéro du réseau :",
    "💊 VENTE DE MÉDICAMENTS FAUX 💊 Ce numéro vend du Xanax et des opiacés SANS ORDONNANCE à des lycéens. Un élève est à l'hôpital actuellement. Numéro du dealer :",
    "🎯 HARCÈLEMENT AVEC INTENTION DE SUICIDE 🎯 Cette personne pousse ma sœur de 15 ans au suicide via des messages quotidiens 'tue-toi personne t'aime'. Elle a tenté de se pendre hier. Numéro :",
    "⚡ PIRATAGE DE COMPTES POLICIERS ⚡ Ce hacker a piraté le WhatsApp d'un officier de police et contacte les victimes pour 'annuler leurs plaintes' contre rançon. Numéro dangereux :"
];

// Noms et prénoms officiels
const prenoms = ["Commandant", "Capitaine", "Major", "Lieutenant", "Brigadier", "Colonel", "Commandant", "Sergent", "Adjudant", "Officier"];
const noms = ["Martin", "Bernard", "Dubois", "Richard", "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Petit"];

// Villes françaises
const villes = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nice", "Nantes", "Toulouse", "Strasbourg", "Montpellier"];

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
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
    
    const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
    const villeAleatoire = villes[Math.floor(Math.random() * villes.length)];
    const numeroPlainte = Math.floor(Math.random() * 900000) + 100000;
    
    const sujet = `🔴 URGENCE ABSOLUE 🔴 SIGNALEMENT IMMÉDIAT - ${messages[index % messages.length].substring(0, 50)}...`;
    const message = `${messages[index % messages.length]} ${numero}

🔴 CARACTÈRE URGENT - RÉPONDRE DANS L'HEURE 🔴

Ce dossier est suivi par le procureur de la République de ${villeAleatoire} sous le numéro ${numeroPlainte}.

Je requiers la FERMETURE IMMÉDIATE de ce compte WhatsApp conformément aux articles 222-33 du Code pénal (harcèlement) et 421-1 (apologie du terrorisme).

Une réponse urgente est attendue.

Cordialement,
${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}
Officier traitant - ${villeAleatoire}
Tél: 06${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}
N° plainte: ${numeroPlainte}`;
    
    try {
        await transporter.sendMail({
            from: emailUser,
            to: emailsSupport.join(','),
            subject: sujet,
            text: message
        });
        res.json({ success: true, message: `Signalement ${index}/50 envoyé` });
    } catch(error) {
        console.error('Erreur email:', error);
        res.status(500).json({ error: error.message });
    }
};
