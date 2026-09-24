"use strict";
const CONFIG = require("../config.js");

const COUNTRY_CURRENCY = Object.freeze({
  AR:"ARS",BO:"BOB",CL:"CLP",CO:"COP",CR:"CRC",CU:"CUP",DO:"DOP",EC:"USD",ES:"EUR",GQ:"XAF",
  GT:"GTQ",HN:"HNL",MX:"MXN",NI:"NIO",PA:"USD",PE:"PEN",PR:"USD",PY:"PYG",SV:"USD",UY:"UYU",VE:"VES"
});
const ZERO_DECIMAL = new Set(["CLP","COP","ARS","PYG","VES","XAF"]);
let ratesCache = null;
let ratesRequest = null;

function numeric(value,digits){return new Intl.NumberFormat("es",{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(value)}
function formatPrice(amount,currency){
  if(currency==="USD")return `US$ ${Number(amount).toFixed(2)}`;
  const digits=ZERO_DECIMAL.has(currency)?0:2,value=numeric(amount,digits);
  const formats={USD:`US$ ${value}`,MXN:`MX$ ${value}`,COP:`$ ${value} COP`,PEN:`S/ ${value}`,CLP:`$ ${value} CLP`,ARS:`$ ${value} ARS`,EUR:`€ ${value}`,UYU:`$ ${value} UYU`,PYG:`₲ ${value}`,BOB:`Bs ${value}`,CRC:`₡ ${value}`,GTQ:`Q ${value}`,DOP:`RD$ ${value}`,HNL:`L ${value}`,NIO:`C$ ${value}`,VES:`Bs ${value}`,CUP:`$ ${value} CUP`,XAF:`FCFA ${value}`};
  return formats[currency]||`${value} ${currency}`;
}
async function getRates(){
  const now=Date.now();
  if(ratesCache&&ratesCache.expiresAt>now)return ratesCache.rates;
  if(ratesRequest)return ratesRequest;
  ratesRequest=(async()=>{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),2800);
    try{
      const response=await fetch("https://open.er-api.com/v6/latest/USD",{signal:controller.signal,headers:{Accept:"application/json"}});
      if(!response.ok)throw new Error("exchange rate request failed");
      const body=await response.json();
      if(body.result!=="success"||!body.rates||typeof body.rates.USD!=="number")throw new Error("invalid exchange rate response");
      const providerExpiry=Number(body.time_next_update_unix)*1000;
      ratesCache={rates:body.rates,expiresAt:Math.min(providerExpiry||now+21600000,now+21600000)};
      return ratesCache.rates;
    } finally {clearTimeout(timer);ratesRequest=null}
  })();
  return ratesRequest;
}
function response(res,status,payload){res.statusCode=status;res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","private, max-age=0, no-store");res.end(JSON.stringify(payload))}
async function handler(req,res){
  const country=String(req.headers["x-vercel-ip-country"]||"US").toUpperCase();
  const currency=COUNTRY_CURRENCY[country]||"USD";
  try{
    const rates=currency==="USD"?{USD:1}:await getRates(),rate=Number(rates[currency]);
    if(!Number.isFinite(rate)||rate<=0)throw new Error("unsupported currency");
    const digits=ZERO_DECIMAL.has(currency)?0:2;
    const amount=Number((CONFIG.BASE_PRICE_USD*rate).toFixed(digits));
    return response(res,200,{country,currency,amount,formatted:formatPrice(amount,currency),localized:currency!=="USD",source:"live_fx",expiresAt:Date.now()+CONFIG.PRICE_CACHE_MS});
  }catch{
    const amount=CONFIG.BASE_PRICE_USD;
    return response(res,200,{country:"US",currency:"USD",amount,formatted:formatPrice(amount,"USD"),localized:false,source:"fallback",expiresAt:Date.now()+300000});
  }
}
module.exports=handler;
module.exports._test={COUNTRY_CURRENCY,formatPrice,getRates,resetRates(){ratesCache=null;ratesRequest=null}};
