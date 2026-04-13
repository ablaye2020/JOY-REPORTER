const nodemailer = require('nodemailer');

const emailsSupport = [
    'support@support.whatsapp.com',
    'abuse@support.whatsapp.com'
];

// Motifs de signalement très détaillés et crédibles
const messages = [
    "Ce numéro m'envoie des messages insultants et des menaces de mort depuis 2 semaines. J'ai bloqué 3 comptes différents mais il revient toujours avec de nouveaux numéros. J'ai déposé une main courante. Voici son numéro :",
    "Ce compte me harcèle quotidiennement avec des messages à caractère sexuel non consentis. Mon fils mineur de 13 ans a aussi reçu ces photos. Numéro du prédateur :",
    "Arnaque au faux support WhatsApp bien connue. Cette personne prétend être du support technique Meta et demande le code de vérification. J'ai failli me faire pirater mon compte pro. Numéro frauduleux :",
    "Ce numéro fait partie d'un réseau de spam international qui envoie des faux prix à gagner (lot soi-disant gagné au Cameroun). J'ai reçu 18 messages en 4 jours. Numéro à bannir :",
    "URGENT - Usurpation d'identité grave. Cette personne se fait passer pour moi auprès de ma famille et demande de l'argent pour une fausse urgence médicale. Mes parents ont failli envoyer 2000€. Numéro de l'usurpateur :",
    "Ce compte vend de la cocaïne et des médicaments sans ordonnance sur WhatsApp Business. Publicité massive dans tous les groupes WhatsApp dont je fais partie. Numéro du dealer :",
    "Harcèlement psychologique avec menaces physiques. Cette personne m'envoie des photos de mon domicile prises en face de chez moi et me dit 'je sais où tu habites'. Je vis avec une peur constante. Numéro dangereux :",
    "Ce numéro appartient à un hacker qui a piraté le WhatsApp de ma mère hier. Il contacte toute sa liste de contacts (plus de 200 personnes) avec des demandes d'argent d'urgence. Numéro du pirate à fermer IMMÉDIATEMENT :",
    "Arnaque financière organisée - Fausse opportunité d'investissement crypto 'Bitcoin double garantie'. Cette personne a déjà escroqué 3 personnes dans mon entourage (5000€ au total). Preuves disponibles. Numéro de l'escroc :",
    "Ce compte envoie des vidéos de décapitation et de violences sexuelles sur des enfants dans des groupes WhatsApp scolaires. J'ai signalé au 119 et à Pharos. Numéro à fermer en URGENCE ABSOLUE :"
];

// Noms et prénoms aléatoires français crédibles
const prenoms = ["Thomas", "Laura", "Nicolas", "Camille", "Alexandre", "Julie", "David", "Marine", "Kévin", "Sophie", "Mehdi", "Clara", "Audrey", "Jérémy", "Manon", "Vincent"];
const noms = ["Martin", "Petit", "Bernard", "Dubois", "Richard", "Moreau", "Laurent", "Simon", "Michel", "Lefebvre", "Roux", "Garcia", "Leroy"];

// Villes françaises pour plus de crédibilité
const villes = ["Paris", "Lyon", "Marseille", "Lille", "Toulouse", "Bordeaux", "Nice", "Nantes", "Strasbourg", "Rennes"];

module.exports = async (req, res) => {
    // Autoriser les requêtes depuis ton site
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
    
    // Récupérer les identifiants depuis les variables d'environnement Vercel
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
    
    // Générer des éléments aléatoires
    const prenomAleatoire = prenoms[Math.floor(Math.random() * prenoms.length)];
    const nomAleatoire = noms[Math.floor(Math.random() * noms.length)];
    const villeAleatoire = villes[Math.floor(Math.random() * villes.length)];
    const numeroPlainte = Math.floor(Math.random() * 900000) + 100000;
    
    const sujet = `URGENT - Signalement compte WhatsApp dangereux - Harcèlement/Arnaque - ${villeAleatoire}`;
    const message = `${messages[index % messages.length]} ${numero}

Je tiens à disposition les captures d'écran (plus de 25 messages) et les preuves écrites. 
Ce compte viole clairement les articles 3, 5 et 12 des conditions d'utilisation de WhatsApp (harcèlement, contenus illégaux, usurpation d'identité).

J'ai déjà bloqué le numéro 4 fois mais il continue avec des comptes différents. 
Ma plainte a été déposée au commissariat de ${villeAleatoire} sous le numéro : ${numeroPlainte}.

Je vous demande de fermer CE numéro IMMÉDIATEMENT et de bannir définitivement cette personne de WhatsApp.

Cordialement,
${prenomAleatoire} ${nomAleatoire}
Témoin direct - Plainte déposée
Tel: 06${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
    
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
