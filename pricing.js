(function () {
  "use strict";
  const config = window.CARNIVORA_CONFIG;
  const key = "carnivora40_international_price_v3";
  const fallback = Object.freeze({country:"US",currency:"USD",amount:config.BASE_PRICE_USD,formatted:`US$ ${config.BASE_PRICE_USD.toFixed(2)}`,localized:false,source:"fallback"});
  let quote = fallback;
  let request;
  const listeners = new Set();
  function valid(value){return value&&typeof value.formatted==="string"&&/^[A-Z]{3}$/.test(value.currency)&&Number.isFinite(Number(value.amount))&&Number(value.amount)>0}
  function read(){try{const saved=JSON.parse(sessionStorage.getItem(key)||"null");if(valid(saved)&&saved.expiresAt>Date.now())quote=Object.freeze(saved)}catch{}return quote}
  function notify(){listeners.forEach(listener=>{try{listener(quote)}catch{}})}
  function init(){
    read();
    if(request)return request;
    if(quote!==fallback&&quote.expiresAt>Date.now())return Promise.resolve(quote);
    request=fetch(config.PRICE_API_URL,{headers:{Accept:"application/json"}})
      .then(response=>{if(!response.ok)throw new Error("price unavailable");return response.json()})
      .then(value=>{if(!valid(value))throw new Error("invalid price");quote=Object.freeze(value);try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}notify();return quote})
      .catch(()=>{quote=fallback;notify();return quote});
    return request;
  }
  window.CarnivoraPricing=Object.freeze({init,current:()=>read(),subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)}});
})();
