/* PREÇOS E DESTINO FINAL. Não coloque chaves secretas nestes arquivos públicos. */
window.OFFER_CONFIG = {
  accessUrl: "", // URL oficial de acesso/área de membros, a preencher após confirmar a plataforma.
  currency: "BRL",
  offers: {
  "upsell-1": {
    "name": "Firmeza 40+",
    "price": 17,
    "next": "upsell-2.html",
    "decline": "downsell-1.html"
  },
  "downsell-1": {
    "name": "Firmeza Essencial",
    "price": 9.9,
    "next": "upsell-2.html",
    "decline": "upsell-2.html"
  },
  "upsell-2": {
    "name": "Revisão de Rota",
    "price": 27,
    "next": "upsell-3.html",
    "decline": "downsell-2.html"
  },
  "downsell-2": {
    "name": "Revisão Essencial",
    "price": 17,
    "next": "upsell-3.html",
    "decline": "upsell-3.html"
  },
  "upsell-3": {
    "name": "Manutenção 40+",
    "price": 37,
    "next": "acesso.html",
    "decline": "downsell-3.html"
  },
  "downsell-3": {
    "name": "Manutenção Essencial",
    "price": 27,
    "next": "acesso.html",
    "decline": "acesso.html"
  }
}
};
