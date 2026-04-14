const fetch = require('node-fetch');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

const messages = [
    "⚠️ ALERTE PÉDOFILIE ⚠️ Numéro :",
    "🔴 MENACE DE MORT AVEC ARMES 🔴 Numéro :",
    "🚨 TENTATIVE D'ENLÈVEMENT 🚨 Numéro :",
    "💀 VIOLENCE CONJUGALE 💀 Numéro :",
    "🔥 INCITATION AU TERRORISME 🔥 Numéro :"
];

const prenoms = ["Commandant", "Capitaine", "Major"];
const noms = ["Martin", "Bernard", "Dubois"];
const villes = ["Paris", "Lyon", "Marseille"];

// PhoboMail - inscription automatique
async function getPhoboMail() {
    const response = await fetch("https://mcp.phobomail.com/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "tools/call",
            params: {
                name: "register_email",
                arguments: { name: `agent_${Date.now()}` }
            }
        })
    });
    const data = await response.json();
    return {
        email: data.result.email,
        api_key: data.result.api_key
    };
}

async function envoyerPhoboMail(destinataire, sujet, message, api_key, fromEmail) {
    const response = await fetch("https://mcp.phobomail.com/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "tools/call",
            params: {
                name: "send_email",
                arguments: {
                    to: destinataire,
                    from: fromEmail,
                    subject: sujet,
                    text: message,
                    api_key: api_key
                }
            }
        })
    });
    const data = await response.json();
    return !data.error;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
    
    const { numero, index } = req.body;
    
    try {
        const phobo = await getPhoboMail();
        
        const nomOfficier = prenoms[Math.floor(Math.random() * prenoms.length)];
        const villeAleatoire = villes[Math.floor(Math.random() * villes.length)];
        
        const sujet = `URGENT - Signalement WhatsApp`;
        const message = `${messages[index % messages.length]} ${numero}

Plainte déposée à ${villeAleatoire}.

${nomOfficier} ${noms[Math.floor(Math.random() * noms.length)]}`;
        
        let tousReussis = true;
        for (const destinataire of emailsSupport) {
            const ok = await envoyerPhoboMail(destinataire, sujet, message, phobo.api_key, phobo.email);
            if (!ok) tousReussis = false;
        }
        
        res.json({ success: tousReussis });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
};
