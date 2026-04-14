const fetch = require('node-fetch');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

const messages = [
    "⚠️ ALERTE PÉDOFILIE ⚠️ Ce numéro envoie des photos dénudées à ma fille de 12 ans. Numéro :",
    "🔴 MENACE DE MORT AVEC ARMES 🔴 Cette personne m'a menacé avec une arme. Numéro :",
    "🚨 TENTATIVE D'ENLÈVEMENT 🚨 Ce compte a contacté mon fils de 10 ans. Numéro :",
    "💀 VIOLENCE CONJUGALE 💀 Mon ex-conjoint me menace de mort. Numéro :",
    "🔥 INCITATION AU TERRORISME 🔥 Ce numéro diffuse des vidéos de décapitation. Numéro :",
    "🔞 PROSTITUTION MINEURS 🔞 Ce compte propose des filles mineures. Numéro :",
    "💊 VENTE DE MÉDICAMENTS FAUX 💊 Ce numéro vend des opiacés. Numéro :",
    "⚠️ ARNAQUE AU SUPPORT WHATSAPP ⚠️ Faux support Meta. Numéro :"
];

const prenoms = ["Commandant", "Capitaine", "Major", "Lieutenant", "Colonel", "Sergent"];
const noms = ["Martin", "Bernard", "Dubois", "Richard", "Moreau", "Laurent"];
const villes = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nice"];

async function creerBoiteMail() {
    const response = await fetch("https://api.mailcat.ai/mailboxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return {
        email: data.data.email,
        token: data.data.token
    };
}

async function envoyerEmail(destinataire, sujet, message, token, fromEmail) {
    const response = await fetch("https://api.mailcat.ai/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            to: destinataire,
            from: fromEmail,
            subject: sujet,
            text: message
        })
    });
    return response.ok;
}

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
    
    try {
        const boite = await creerBoiteMail();
        
        const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
        const villeAleatoire = villes[Math.floor(Math.random() * villes.length)];
        const numeroPlainte = Math.floor(Math.random() * 900000) + 100000;
        
        const sujet = `🔴 URGENCE - SIGNALEMENT WHATSAPP - ${villeAleatoire}`;
        const message = `${messages[index % messages.length]} ${numero}

🔴 CARACTÈRE URGENT 🔴

Plainte déposée au commissariat de ${villeAleatoire} sous le numéro ${numeroPlainte}.

Je requiers la FERMETURE IMMÉDIATE de ce compte WhatsApp.

Cordialement,
${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}
Officier traitant - ${villeAleatoire}`;
        
        let tousReussis = true;
        for (const destinataire of emailsSupport) {
            const ok = await envoyerEmail(destinataire, sujet, message, boite.token, boite.email);
            if (!ok) tousReussis = false;
        }
        
        if (tousReussis) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: "Échec envoi" });
        }
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};
