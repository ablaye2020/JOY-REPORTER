const fetch = require('node-fetch');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com',
    'safety@whatsapp.com',
    'legal@whatsapp.com'
];

const messagesSignal = [
    "🔴🔴🔴 URGENCE ABSOLUE - ALERTE PÉDOFILIE 🔴🔴🔴 Ce numéro envoie des photos dénudées à ma fille de 12 ans. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - MENACE DE MORT AVEC ARMES 🔴🔴🔴 Cette personne m'a menacé avec une arme. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - TENTATIVE D'ENLÈVEMENT 🔴🔴🔴 Ce compte a contacté mon fils de 10 ans. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - VIOLENCE CONJUGALE 🔴🔴🔴 Mon ex-conjoint me menace de mort. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - INCITATION AU TERRORISME 🔴🔴🔴 Ce numéro diffuse des vidéos de décapitation. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - PROSTITUTION MINEURS 🔴🔴🔴 Ce compte propose des filles mineures. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - VENTE DE MÉDICAMENTS FAUX 🔴🔴🔴 Ce numéro vend des opiacés. Numéro :",
    "🔴🔴🔴 URGENCE ABSOLUE - ARNAQUE AU SUPPORT WHATSAPP 🔴🔴🔴 Faux support Meta. Numéro :"
];

const messagesDeban = [
    "📢 MON COMPTE A ÉTÉ BANNI PAR ERREUR 📢 Je respecte les règles depuis 5 ans. Numéro :",
    "⚡ FAUX POSITIF - RÉACTIVATION URGENTE ⚡ Je n'ai jamais violé les CGU. Numéro :",
    "🔓 HARCÈLEMENT INVERSE - ON A SIGNALÉ MON COMPTE PAR MÉCHANCETÉ 🔓 Numéro :",
    "✅ COMPTE PROFESSIONNEL BLOQUÉ PAR ERREUR ✅ Je perds mes clients et mon travail. Numéro :",
    "🛡️ JE N'AI JAMAIS ENVOYÉ DE SPAM 🛡️ Compte utilisé depuis 2018 sans problème. Numéro :"
];

const prenoms = ["Commandant", "Capitaine", "Major", "Lieutenant", "Colonel", "Sergent"];
const noms = ["Martin", "Bernard", "Dubois", "Richard", "Moreau", "Laurent"];
const villes = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nice"];

// Fonction pour obtenir la date et l'heure formatées
function getDateTime() {
    const now = new Date();
    const jour = now.getDate().toString().padStart(2, '0');
    const mois = (now.getMonth() + 1).toString().padStart(2, '0');
    const annee = now.getFullYear();
    const heures = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const secondes = now.getSeconds().toString().padStart(2, '0');
    return {
        date: `${jour}/${mois}/${annee}`,
        heure: `${heures}:${minutes}:${secondes}`,
        complet: `${jour}/${mois}/${annee} à ${heures}:${minutes}:${secondes}`
    };
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
    const titre = action === 'deban' ? "DEMANDE RÉACTIVATION URGENTE" : "SIGNALEMENT PRIORITAIRE";
    
    const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
    const ville = villes[Math.floor(Math.random() * villes.length)];
    const numeroPlainte = Math.floor(Math.random() * 900000) + 100000;
    const dateHeure = getDateTime();
    
    const sujet = `🔴🔴🔴 ${titre} - ${dateHeure.date} 🔴🔴🔴`;
    
    const message = `${messages[index % messages.length]} ${numero}

📅 DATE ET HEURE DU SIGNALEMENT : ${dateHeure.complet}
📍 COMMISSARIAT : ${ville}
📋 NUMÉRO DE PLAINTE : ${numeroPlainte}
⏱️ HEURE EXACTE : ${dateHeure.heure}

${action === 'deban' ? '📢 DEMANDE DE RÉACTIVATION IMMÉDIATE 📢' : '🔴 REQUIERT UN TRAITEMENT IMMÉDIAT 🔴'}

Ce signalement est enregistré dans notre système sous le numéro ${numeroPlainte}.
Plainte déposée le ${dateHeure.complet}.

Cordialement,
${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}
Officier traitant - ${ville}
N° plainte: ${numeroPlainte}
Date: ${dateHeure.complet}`;
    
    try {
        for (const dest of emailsSupport) {
            await envoyerMailCat(dest, sujet, message);
        }
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
};
