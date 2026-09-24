"use strict";
const fs=require("fs"),path=require("path"),vm=require("vm"),{spawnSync}=require("child_process");
const root=path.resolve(__dirname,".."),failures=[];
function check(condition,message){if(!condition)failures.push(message)}
for(const file of ["app.js","config.js","pricing.js","api/price.js","server.js"]){const result=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});check(result.status===0,`${file}: sintaxis inválida`)}
const app=fs.readFileSync(path.join(root,"app.js"),"utf8"),index=fs.readFileSync(path.join(root,"index.html"),"utf8");
const stepsBlock=app.slice(app.indexOf("const steps=["),app.indexOf("sessionStorage.setItem",app.indexOf("const steps=[")));
const ids=[...stepsBlock.matchAll(/\{id:"([^"]+)"/g)].map(match=>match[1]);
check(ids.length===35,`se esperaban 35 etapas y se encontraron ${ids.length}`);check(new Set(ids).size===35,"hay identificadores de etapa repetidos");
for(const match of app.matchAll(/["`]\/?assets\/[^"`$]+/g)){const relative=match[0].replace(/^["`]/,"").replace(/^\//,"");if(relative.endsWith("comentario_"))continue;check(fs.existsSync(path.join(root,relative)),`falta ${relative}`)}
check(index.includes('lang="es"'),"el documento no está marcado en español");
check(!/R\$|currency:"BRL"|Tú respondeu|O que terá|De jeito nenhum|Sua dieta|Seu plano/.test(app),"quedó texto o precio de la versión portuguesa");
check((fs.readFileSync(path.join(root,"config.js"),"utf8").match(/9\.97/g)||[]).length===1,"el precio base debe tener una única fuente de verdad");
const expected={MX:"MXN",CO:"COP",PE:"PEN",CL:"CLP",AR:"ARS",ES:"EUR"};
const config=require(path.join(root,"config.js"));check(config.BASE_PRICE_USD===9.97,"precio base incorrecto");
const api=require(path.join(root,"api/price.js"));for(const [country,currency] of Object.entries(expected))check(api._test.COUNTRY_CURRENCY[country]===currency,`moneda incorrecta para ${country}`);
for(const currency of Object.values(expected))check(typeof api._test.formatPrice(123.45,currency)==="string"&&api._test.formatPrice(123.45,currency).length>2,`formato inválido para ${currency}`);
check(api._test.formatPrice(9.97,"USD")==="US$ 9.97","fallback USD incorrecto");
if(failures.length){console.error(failures.map(x=>`✗ ${x}`).join("\n"));process.exit(1)}
console.log("✓ 35 etapas, sintaxis, archivos, textos, precio base y seis mercados verificados");
