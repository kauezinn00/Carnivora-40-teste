"use strict";
const http=require("http"),fs=require("fs"),path=require("path"),priceHandler=require("./api/price.js");
const root=__dirname,args=process.argv.slice(2),port=Number(args[args.indexOf("--port")+1])||4173;
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".webp":"image/webp",".jpeg":"image/jpeg",".jpg":"image/jpeg",".png":"image/png"};
http.createServer((req,res)=>{
  const url=new URL(req.url,"http://terminal.local");
  if(url.pathname==="/api/price"){
    if(url.searchParams.get("country"))req.headers["x-vercel-ip-country"]=url.searchParams.get("country").toUpperCase();
    return priceHandler(req,res);
  }
  let relative=decodeURIComponent(url.pathname).replace(/^\/+/,"");
  if(!relative||!path.extname(relative))relative="index.html";
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end("Not found")}
  res.setHeader("Content-Type",types[path.extname(file).toLowerCase()]||"application/octet-stream");
  fs.createReadStream(file).pipe(res);
}).listen(port,"0.0.0.0",()=>console.log(`Preview available on port ${port}`));
