const fetch = require('node-fetch');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

const messagesSignal = [
    "⚠️ ALERTE PÉDOFILIE ⚠️ Ce numéro envoie des photos dénudées. Numéro :",
    "🔴 MENACE DE MORT AVEC ARMES 🔴 Numéro :",
    "🚨 TENTATIVE D'ENLÈVEMENT 🚨 Numéro :",
    "💀 VIOLENCE CONJUGALE 💀 Numéro :",
    "🔥 INCITATION AU TERRORISME 🔥 Numéro :"
];

const messagesDeban = [
    "📢 MON COMPTE A ÉTÉ BANNI PAR ERREUR 📢 Je respecte les règles. Numéro :",
    "⚡ FAUX POSITIF - RÉACTIVATION URGENTE ⚡ Numéro :",
    "🔓 HARCÈLEMENT INVERSE - ON A SIGNALÉ MON COMPTE 🔓 Numéro :",
    "✅ COMPTE PROFESSIONNEL BLOQUÉ PAR ERREUR ✅ Numéro :",
    "🛡️ JE N'AI JAMAIS ENVOYÉ DE SPAM 🛡️ Numéro :"
];

const prenoms = ["Commandant", "Capitaine", "Major"];
const noms = ["Martin", "Bernard", "Dubois"];
const villes = ["Paris", "Lyon", "Marseille"];

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
    const titre = action === 'deban' ? "DEMANDE RÉACTIVATION" : "SIGNALEMENT URGENT";
    
    const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
    const ville = villes[Math.floor(Math.random() * villes.length)];
    
    const sujet = `${titre} - ${ville}`;
    const message = `${messages[index % messages.length]} ${numero}

${action === 'deban' ? 'Je demande la réactivation immédiate de mon compte.' : 'Je demande la fermeture immédiate de ce compte.'}

${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}`;
    
    try {
        for (const dest of emailsSupport) {
            await envoyerMailCat(dest, sujet, message);
        }
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
};
