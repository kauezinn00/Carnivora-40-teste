"use strict";
const path=require("path"),root=path.resolve(__dirname,".."),config=require(path.join(root,"config.js")),api=require(path.join(root,"api/price.js"));
const rates={USD:1,MXN:18.25,COP:3850,PEN:3.72,CLP:920,ARS:1450,EUR:.86};
let fetchCalls=0;
global.fetch=async()=>{fetchCalls++;return{ok:true,json:async()=>({result:"success",rates,time_next_update_unix:Math.floor(Date.now()/1000)+3600})}};
function quote(country){return new Promise((resolve,reject)=>{const req={headers:{"x-vercel-ip-country":country}},headers={};const res={statusCode:0,setHeader(k,v){headers[k]=v},end(body){try{resolve({status:this.statusCode,headers,body:JSON.parse(body)})}catch(error){reject(error)}}};api(req,res)})}
(async()=>{
  const markets={MX:"MXN",CO:"COP",PE:"PEN",CL:"CLP",AR:"ARS",ES:"EUR"};
  for(const [country,currency] of Object.entries(markets)){const result=await quote(country);if(result.status!==200||result.body.currency!==currency||!result.body.formatted||result.body.amount<=0)throw new Error(`falló ${country}`)}
  if(fetchCalls!==1)throw new Error("la cotización no se reutilizó desde caché");
  api._test.resetRates();global.fetch=async()=>{throw new Error("offline")};
  const fallback=await quote("MX");if(fallback.body.currency!=="USD"||fallback.body.amount!==config.BASE_PRICE_USD||fallback.body.formatted!=="US$ 9.97")throw new Error("falló el fallback USD");
  console.log("✓ conversión, caché y fallback comprobados para seis mercados");
})().catch(error=>{console.error(error.message);process.exit(1)});
