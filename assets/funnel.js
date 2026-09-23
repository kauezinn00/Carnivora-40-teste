/* Navegação e ponto de integração. Nenhum evento de compra ou chamada de cobrança. */
(function () {
  "use strict";
  var cfg = window.OFFER_CONFIG;
  var id = document.body.dataset.offer;
  var offer = cfg.offers[id];
  var allowed = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","src"];
  var params = new URLSearchParams(location.search);
  var attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem("c40_offer_attribution") || "{}") || {}; } catch (_) {}
  if (typeof attribution !== "object" || Array.isArray(attribution)) attribution = {};
  var saved = {};
  allowed.forEach(function (key) {
    var value = params.get(key) || attribution[key];
    if (typeof value === "string" && value.length <= 1000) saved[key] = value;
  });
  try { sessionStorage.setItem("c40_offer_attribution", JSON.stringify(saved)); } catch (_) {}
  function withAttribution(path) {
    var url = new URL(path, location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:" && url.protocol !== "file:") throw new Error("Destino inválido");
    allowed.forEach(function (key) { if (saved[key] && !url.searchParams.has(key)) url.searchParams.set(key,saved[key]); });
    return url.href;
  }
  function message(text) {
    var el = document.getElementById("offer-message");
    if (el) { el.textContent = text; el.hidden = false; }
  }
  document.querySelectorAll("a[data-route]").forEach(function (a) {
    var path = offer && a.id === "decline-offer" ? offer.decline : a.getAttribute("href");
    a.href = withAttribution(path);
  });
  if (offer) document.querySelectorAll("[data-price]").forEach(function (el) {
    el.textContent = new Intl.NumberFormat("pt-BR",{style:"currency",currency:cfg.currency}).format(offer.price);
  });
  var handler = null;
  var busy = false;
  window.CarnivoraUpsell = Object.freeze({
    offerId: id || null,
    // O script oficial precisa confirmar o pagamento antes de usar nextUrl.
    nextUrl: offer ? withAttribution(offer.next) : null,
    declineUrl: offer ? withAttribution(offer.decline) : null,
    accessUrl: withAttribution("acesso.html"),
    registerAccept: function (fn) {
      if (typeof fn !== "function") throw new TypeError("Use uma função de integração.");
      handler = fn;
    },
    usePlatformButton: function () {
      var btn = document.getElementById("accept-offer");
      if (btn) btn.hidden = true;
      if (btn) btn.style.display = "none";
    }
  });
  var accept = document.getElementById("accept-offer");
  if (accept) accept.addEventListener("click", async function () {
    if (busy) return;
    if (!handler) {
      console.info("Integração de upsell pendente:", id);
      message("Esta oferta ainda não está disponível para compra nesta página. Nenhuma cobrança foi realizada.");
      return;
    }
    busy = true;
    accept.disabled = true;
    accept.setAttribute("aria-busy","true");
    try {
      // O adaptador oficial controla cobrança, confirmação e redirecionamento.
      // O retorno da função nunca é interpretado aqui como pagamento aprovado.
      await handler({ offerId:id, nextUrl:withAttribution(offer.next), declineUrl:withAttribution(offer.decline) });
    } catch (error) {
      console.error("Falha na integração de upsell", error);
      message("Não foi possível confirmar o resultado. Confira o status na plataforma antes de tentar novamente.");
    } finally {
      busy = false;
      accept.disabled = false;
      accept.removeAttribute("aria-busy");
    }
  });
  var access = document.getElementById("access-link");
  if (access && cfg.accessUrl) {
    try {
      var target = new URL(cfg.accessUrl);
      if (target.protocol !== "https:") throw new Error("Use uma URL HTTPS de acesso.");
      // Acesso não recebe UTMs nem tokens arbitrários do endereço da oferta.
      access.href = target.href;
      access.hidden = false;
      document.getElementById("access-pending").hidden = true;
    } catch (error) { console.error("URL de acesso inválida.", error); }
  }
}());
