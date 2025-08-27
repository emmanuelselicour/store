// /netlify/functions/getOrders.js
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const TOKEN = "ton_token_prive_netlify"; // 🔑 Remplace par ton token privé
  const FORM_ID = "68aeae82b253f900084dc5d4"; // ID du formulaire

  // Vérification mot de passe côté server
  const query = event.queryStringParameters || {};
  if(query.password !== "04004749") {
    return { statusCode: 401, body: JSON.stringify({error:"Mot de passe incorrect"}) };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/forms/${FORM_ID}/submissions`, {
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });
    const submissions = await res.json();
    const orders = submissions.map(sub => ({
      nom: sub.data.nom,
      prenom: sub.data.prenom,
      email: sub.data.email,
      numero: sub.data.numero,
      produits: sub.data.produit ? sub.data.produit.split(", ") : [],
      prix: sub.data.prix ? sub.data.prix.split(", ") : [],
      adresse: sub.data.adresse,
      paiement: sub.data.paiement,
      idpaiement: sub.data.idpaiement
    }));
    return { statusCode: 200, body: JSON.stringify(orders) };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({error: err.message}) };
  }
};
