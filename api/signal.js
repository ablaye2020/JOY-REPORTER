const fetch = require('node-fetch');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com',
    'safety@whatsapp.com'
];

const messagesSignal = [
    "🔴 HARCELEMENT HOMOPHOBE - Cette personne m'envoie des insultes 'pd', 'tarlouze', 'dégénéré' tous les jours depuis 2 mois. Numéro du harceleur :",
    "🔴 MENACES HOMOPHOBES - Ce numéro m'a dit 'je vais te cramer ta mère la pédale' et 'on va te trouver'. J'ai peur chez moi. Numéro :",
    "🔴 INSULTES HOMOPHOBES QUOTIDIENNES - Je reçois des messages 't'es une folle', 'suicide-toi pédale' depuis 3 semaines. Numéro :",
    "🔴 HARCELEMENT EN GROUPE - Cette personne a créé un groupe WhatsApp 'les pd de [ville]' avec ma photo en fond. Numéro :",
    "🔴 DOXING HOMOPHOBE - Ce numéro a publié mon adresse en disant 'venez tabasser le pd'. Je ne sors plus de chez moi. Numéro :",
    "🔴 MENACE DE MORT HOMOPHOBE - 'Je vais te planter comme le pd que t'es' - message reçu hier. Numéro dangereux :",
    "🔴 HARCELEMENT SUR LIEU DE TRAVAIL - Mon collègue m'envoie des messages homophobes sur WhatsApp. Je n'ose plus aller au travail. Numéro :"
];

const messagesDeban = [
    "📢 BANNI PAR ERREUR - J'AI PORTÉ PLAINTE POUR HARCELEMENT HOMOPHOBE ET MON HARCELEUR M'A SIGNALÉ EN REPRÉSAILLES 📢 Numéro victime :",
    "⚡ FAUX POSITIF - VICTIME D'HARCELEMENT HOMOPHOBE, C'EST MOI QUI AI ÉTÉ BANNI ⚡ Numéro :",
    "🔓 HARCELEMENT INVERSE - J'ai signalé des insultes homophobes, l'auteur a signalé mon compte par vengeance. Numéro :"
];

const prenoms = ["Commandant", "Capitaine", "Major", "Lieutenant"];
const noms = ["Martin", "Bernard", "Dubois", "Richard"];
const villes = ["Paris", "Lyon", "Marseille", "Lille"];

function getDateTime() {
    const now = new Date();
    const jour = now.getDate().toString().padStart(2, '0');
    const mois = (now.getMonth() + 1).toString().padStart(2, '0');
    const annee = now.getFullYear();
    const heures = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const secondes = now.getSeconds().toString().padStart(2, '0');
    return `${jour}/${mois}/${annee} à ${heures}:${minutes}:${secondes}`;
}

async function envoyerMailCat(destinataire, sujet, message) {
    const creation = await fetch("https://api.mailcat.ai/mailboxes", { method: "POST" });
    const boite = await creation.json();
    
    await fetch("https://api.mailcat.ai/messages", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${boite.data.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            to: destinataire,
            from: boite.data.email,
            subject: sujet,
            text: message
        })
    });
    return true;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
    
    const { numero, index, action } = req.body;
    
    const messages = action === 'deban' ? messagesDeban : messagesSignal;
    const titre = action === 'deban' ? "RECOURS - BAN PAR ERREUR" : "HARCELEMENT HOMOPHOBE - URGENCE";
    
    const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
    const ville = villes[Math.floor(Math.random() * villes.length)];
    const dateHeure = getDateTime();
    
    const sujet = `🔴 ${titre} - ${dateHeure} 🔴`;
    const message = `${messages[index % messages.length]} ${numero}

📅 Signalement : ${dateHeure}
📍 Commissariat : ${ville}

${action === 'deban' ? 'RECOURS - COMPTE BANNI PAR ERREUR' : 'URGENCE - HARCELEMENT HOMOPHOBE'}

Cordialement,
${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}
Officier traitant - ${ville}`;
    
    try {
        for (const dest of emailsSupport) {
            await envoyerMailCat(dest, sujet, message);
        }
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
};
