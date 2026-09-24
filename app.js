(() => {
  "use strict";
  const GLOBAL_CONFIG=window.CARNIVORA_CONFIG;
  const CONFIG={checkoutUrl:GLOBAL_CONFIG.CHECKOUT_URL,brand:GLOBAL_CONFIG.BRAND,offerMinutes:10,pixelId:GLOBAL_CONFIG.META_PIXEL_ID,utmifyScript:GLOBAL_CONFIG.UTMIFY_SCRIPT};
  const priceService=window.CarnivoraPricing;
  priceService?.init();
  /* Recursos locales autorizados incluidos en el proyecto. */
  const ASSETS={
    logo:"/assets/logo-carnivora-40.webp",
    genderWoman:"/assets/options/etapa_01_genero_mulher.webp",
    genderMan:"/assets/options/etapa_01_genero_homem.webp",
    age18:{Mujer:"/assets/options/etapa_02_idade_mulher_18_a_26_anos.webp",Hombre:"/assets/options/etapa_02_idade_homem_18_a_26_anos.webp"},
    age27:{Mujer:"/assets/options/etapa_02_idade_mulher_27_a_38_anos.webp",Hombre:"/assets/options/etapa_02_idade_homem_27_a_38_anos.webp"},
    age39:{Mujer:"/assets/options/etapa_02_idade_mulher_39_a_50_anos.webp",Hombre:"/assets/options/etapa_02_idade_homem_39_a_50_anos.webp"},
    age50:{Mujer:"/assets/options/etapa_02_idade_mulher_50_mais.webp",Hombre:"/assets/options/etapa_02_idade_homem_50_mais.webp"},
    goalAppearance:{Mujer:"/assets/options/etapa_03_objetivo_mulher_ficar_mais_bonita_e_me_sentir_bem.webp",Hombre:"/assets/options/etapa_03_objetivo_homem_ficar_mais_bonito_e_me_sentir_bem.webp"},
    goalHealth:{Mujer:"/assets/options/etapa_03_objetivo_mulher_melhorar_minha_saude.webp",Hombre:"/assets/options/etapa_03_objetivo_homem_melhorar_minha_saude.webp"},
    goalBoth:{Mujer:"/assets/options/etapa_03_objetivo_mulher_ambos.webp",Hombre:"/assets/options/etapa_03_objetivo_homem_ambos.webp"},
    comments:[1,2,3,4,5,6,7,8,9,10,11,12].map(i=>`/assets/comments/comentario_${i}.webp`),
    macroInfo:"assets/dieta-carnivora-80-20.jpeg",difference:"assets/dieta-carnivora-diferente.jpeg",goal:"/assets/meta-peso.webp",foodInfo:"/assets/mais-de-100-receitas.jpeg",mealPlan:"/assets/plano-refeicoes.webp",faceChange:{Mujer:"/assets/inchaco-rosto-mulher.webp",Hombre:"/assets/inchaco-rosto-homem.webp"},offerEvolution:{Mujer:"/assets/resultado-agora-meta-mulher.webp",Hombre:"/assets/resultado-agora-meta-homem.webp"},visibleChange:{Mujer:"/assets/antes-depois-mulher.webp",Hombre:"/assets/antes-depois-homem.webp"},socialProofPhoto:{Mujer:"/assets/social-proof-photo-mulher.jpeg",Hombre:"/assets/social-proof-photo-homem.webp"},socialProofComment:{Mujer:"/assets/social-proof-comment-mulher.jpeg",Hombre:"/assets/social-proof-comment-homem.jpeg"},guarantee:"/assets/garantia-30-dias.webp"
  };
  const KEYS=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","src"],params=new URLSearchParams(location.search),tracking=JSON.parse(sessionStorage.getItem("carnifit_tracking")||"{}");
  KEYS.forEach(k=>{if(params.get(k))tracking[k]=params.get(k)});sessionStorage.setItem("carnifit_tracking",JSON.stringify(tracking));
  const queuedPixelEvents=new Set();
  const pixel=(event,data={},custom=false)=>{
    try {
      if(typeof window.fbq!=="function")return false;
      window.fbq(custom?"trackCustom":"track",event,data);
      return true;
    } catch {return false}
  };
  const pixelOnce=(key,event,data={},custom=false)=>{
    const storageKey=`carnifit_pixel_${key}`;
    if(queuedPixelEvents.has(storageKey))return;
    try {if(sessionStorage.getItem(storageKey))return} catch {}
    if(!pixel(event,data,custom))return;
    queuedPixelEvents.add(storageKey);
    try {sessionStorage.setItem(storageKey,"1")} catch {}
  };
  // Cambia la versión si se modifica el orden o la cantidad de etapas.
  const FUNNEL_VERSION="35_steps_v1";
  let activeTrackedStep=-1,stepEnteredAt=0;
  function stepEventData(){
    const data={funnel_version:FUNNEL_VERSION,step_number:state.current+1,steps_total:steps.length};
    // Solo acepta un identificador numérico del anuncio; nunca envía respuestas ni nombres.
    if(/^\d{5,30}$/.test(tracking.utm_content||""))data.ad_id=tracking.utm_content;
    return data;
  }
  function trackStepView(){
    if(activeTrackedStep!==state.current){activeTrackedStep=state.current;stepEnteredAt=Date.now()}
    const number=String(state.current+1).padStart(2,"0");
    pixelOnce(`${FUNNEL_VERSION}_step_${number}_viewed`,`QuizStep${number}Viewed`,stepEventData(),true);
  }
  function trackStepComplete(){
    const number=String(state.current+1).padStart(2,"0"),data=stepEventData();
    if(activeTrackedStep===state.current)data.elapsed_seconds=Math.max(0,Math.round((Date.now()-stepEnteredAt)/100)/10);
    // Si el Pixel estuvo disponible después del renderizado, registra primero la entrada.
    trackStepView();
    pixelOnce(`${FUNNEL_VERSION}_step_${number}_completed`,`QuizStep${number}Completed`,data,true);
  }
  const c=(label,image="",emoji="")=>({label,image,emoji});
  const steps=[
    {id:"gender",type:"imageGrid",title:"Responde unas preguntas y descubre tu plan carnívoro en 2 minutos",subtitle:"Selecciona tu género:",options:[c("Mujer","genderWoman"),c("Hombre","genderMan")]},
    {id:"age",type:"imageGrid",title:"¿En qué rango de edad estás?",options:[c("De 18 a 26 años","age18"),c("De 27 a 38 años","age27"),c("De 39 a 50 años","age39"),c("Más de 50 años","age50")]},
    {id:"primaryGoal",type:"choice",iconOptions:true,title:"¿Cuál es tu principal objetivo con esta alimentación?",options:[c("Mejorar mi apariencia","goalAppearance"),c("Cuidar mi salud","goalHealth"),c("Ambos objetivos","goalBoth"),c("Otro objetivo")]},
    {id:"previousExperience",type:"choice",title:"¿Ya has probado la alimentación carnívora?",options:[c("Sí, ya la he probado"),c("He oído hablar de ella"),c("Todavía no la he probado"),c("La probé, pero no logré mantenerla")]},
    {id:"macroInfo",type:"info",image:"macroInfo",imageOnly:true,title:"La dieta carnívora se compone de un 80 % de grasa, un 20 % de proteína y pocos carbohidratos",body:""},
    {id:"hungerTime",type:"choice",title:"¿En qué momento del día sueles tener más hambre?",options:[c("Mañana"),c("Tarde"),c("Noche"),c("No tengo un horario fijo")]},
    {id:"favoriteMeal",type:"choice",title:"¿Cuál es tu comida favorita del día?",options:[c("Desayuno","","☕"),c("Almuerzo","","🍽️"),c("Cena","","🌙"),c("Comidas entre horas","","🥪"),c("No tengo una comida favorita","","🤷")]},
    {id:"weightHistory",type:"choice",title:"¿Has bajado de peso y después te ha costado mantenerlo?",options:[c("Sí"),c("Me pasa con frecuencia"),c("He tenido el efecto rebote"),c("Mantener el peso me cuesta más que bajarlo")]},
    {id:"difference",type:"info",image:"difference",imageOnly:true,title:"La dieta carnívora es diferente",body:""},
    {id:"height",type:"range",title:"¿Cuánto mides?",min:140,max:220,value:180,unit:"cm",altUnit:"pulg"},
    {id:"weight",type:"range",title:"¿Cuánto pesas actualmente?",min:40,max:250,value:70,unit:"kg",altUnit:"lb"},
    {id:"goalWeight",type:"range",title:"¿A qué peso quieres llegar?",min:40,max:250,value:65,unit:"kg",altUnit:"lb"},
    {id:"goalRegistered",type:"info",image:"goal",title:"Tu peso objetivo ya está definido",body:"Ahora tendremos en cuenta tu rutina y tus preferencias."},
    {id:"name",type:"input",title:"Tu nuevo comienzo está cada vez más cerca",secondaryTitle:"¿Cómo te llamas?",label:"Nombre",placeholder:"Escribe tu nombre...",inputType:"text"},
    {id:"preview",type:"result",title:"Según tus respuestas:",body:"Alcanzarás tu objetivo en 4 semanas.",testimonials:true,testimonialStart:1},
    {id:"weeklyActivity",type:"choice",title:"¿Cuánta actividad física haces a la semana?",options:[c("Poco o ningún ejercicio"),c("Actividad ligera: 1 o 2 sesiones"),c("Actividad moderada: de 3 a 5 sesiones"),c("Actividad intensa: 6 o 7 días"),c("Actividad muy intensa o trabajo físico exigente")]},
    {id:"timeAway",type:"choice",title:"¿Cuánto tiempo llevas sin estar en tu peso objetivo?",options:[c("Menos de 1 año"),c("De 1 a 3 años"),c("Más de 3 años"),c("Nunca he estado en mi peso objetivo")]},
    {id:"currentSize",type:"choice",compactGrid:true,title:"¿Qué talla de ropa usas normalmente?",options:[c("XXXL+","","👕"),c("XXXL","","👕"),c("XXL","","👕"),c("XL","","👕"),c("L","","👕"),c("M","","👕"),c("S o menos","","👕")]},
    {id:"desiredSize",type:"choice",compactGrid:true,title:"¿Qué talla de ropa te gustaría usar?",options:[c("XXXL+","","✨"),c("XXXL","","✨"),c("XXL","","✨"),c("XL","","✨"),c("L","","✨"),c("M","","✨"),c("S o menos","","✨")]},
    {id:"partialCalculation",type:"loading",title:"Preparando tu plan de alimentación",body:"Organizando tus respuestas...",testimonials:true,testimonialStart:3},
    {id:"eatingHabits",type:"choice",title:"¿Cómo describirías tus hábitos alimentarios?",options:[c("Casi siempre como lo mismo"),c("Varío las recetas con los mismos alimentos"),c("Alterno entre mis platos favoritos"),c("Como un poco de todo"),c("No estoy seguro")]},
    {id:"foodInfo",type:"info",image:"foodInfo",title:"Más de 100 recetas deliciosas",body:"Organizaremos las sugerencias según tus gustos y tu experiencia en la cocina."},
    {id:"ingredients",type:"multi",max:5,title:"Elige hasta 5 de tus ingredientes favoritos",options:[c("Carne de res","","🥩"),c("Carne de cerdo","","🥓"),c("Pollo","","🍗"),c("Pescado","","🐟"),c("Huevos","","🥚"),c("Mantequilla","","🧈"),c("Sal","","🧂"),c("Quesos curados","","🧀"),c("Vísceras","","🍖"),c("Ninguna de estas opciones","","🚫")]},
    {id:"protein",type:"multi",max:3,title:"¿Qué fuentes de proteína prefieres?",options:[c("Huevos","","🥚"),c("Lácteos","","🧀"),c("Pollo","","🍗"),c("Carne de res","","🥩"),c("Carne de cerdo","","🥓"),c("Pavo","","🍗"),c("Pescado","","🐟"),c("Cordero","","🍖"),c("Proteína vegetal","","🌱"),c("Ninguna de estas opciones","","🚫")]},
    {id:"allergies",type:"multi",title:"¿Tienes alguna alergia o intolerancia alimentaria?",options:[c("Ninguna","","✅"),c("Lactosa","","🥛"),c("Frutos secos","","🥜"),c("Mariscos","","🦐"),c("Proteína de la leche","","🥛"),c("Proteína del huevo","","🥚"),c("Miel","","🍯"),c("Cítricos","","🍊"),c("Otra","","⚠️")]},
    {id:"mealPlan",type:"info",image:"mealPlan",title:"Estamos organizando tu plan de comidas",body:"Elegiremos las recetas teniendo en cuenta los alimentos y las preferencias que seleccionaste."},
    {id:"sleep",type:"choice",title:"¿Cuántas horas sueles dormir por noche?",options:[c("Más de 8 horas"),c("7 a 8 horas"),c("5 a 6 horas"),c("Menos de 5 horas o sueño irregular")]},
    {id:"water",type:"choice",title:"¿Cuántos vasos de agua sueles beber al día?",options:[c("1 vaso o menos"),c("De 2 a 3 vasos"),c("De 4 a 5 vasos"),c("De 6 a 7 vasos"),c("8 vasos o más")]},
    {id:"dailyActivity",type:"choice",title:"¿Cómo es tu actividad diaria?",options:[c("Paso mucho tiempo sin moverme; casi no camino"),c("Combino el descanso con algunas caminatas"),c("Me mantengo en movimiento y hago esfuerzo físico con frecuencia"),c("Alterno días de poca actividad con días de mucho movimiento")]},
    {id:"medications",type:"multi",title:"¿Tomas alguno de estos medicamentos o suplementos?",options:[c("Antibióticos"),c("Medicamentos para la ansiedad"),c("Hormonas"),c("Vitaminas"),c("Otro"),c("No tomo ninguno")]},
    {id:"conditions",type:"multi",title:"¿Tienes alguna de estas condiciones de salud?",options:[c("Diabetes"),c("Reflujo"),c("Apnea del sueño"),c("Presión arterial alta"),c("Colesterol alto"),c("Problemas renales"),c("Estoy en recuperación tras una cirugía"),c("Ninguna de estas opciones")]},
    {id:"secondaryGoal",type:"multi",title:"Además de tu peso, ¿qué más te gustaría mejorar?",options:[c("Poder correr 5 km"),c("Sentirme mejor al mirarme al espejo"),c("Tener más salud y energía"),c("Dormir mejor"),c("Prepararme para un evento"),c("Sentirme bien con mi cuerpo"),c("Llevar una vida más activa"),c("Todavía no lo he pensado")]},
    {id:"faceChange",type:"info",image:"faceChange",imageOnly:true,title:"Bajar de peso no solo se nota en el cuerpo",body:""},
    {id:"motivation",type:"result",title:"¡Con motivación y constancia, puedes alcanzar tu objetivo antes de lo que imaginas!",body:"Alcanzarás tu objetivo en 4 semanas.",testimonials:true,testimonialStart:5},
    {id:"building",type:"loading",title:"Creando tu plan personalizado",body:"Preparando una propuesta a partir de tus respuestas...",testimonials:true,testimonialStart:7,testimonialSelection:[12,8]}
  ];
  sessionStorage.setItem("carnifit_step","0");
  sessionStorage.setItem("carnifit_answers","{}");
  sessionStorage.setItem("carnifit_completed","0");
  const state={current:0,answers:{}},app=document.querySelector("#app");
  const esc=(v="")=>String(v).replace(/[&<>'"]/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"})[x]);
  const persist=()=>{sessionStorage.setItem("carnifit_step",String(state.current));sessionStorage.setItem("carnifit_answers",JSON.stringify(state.answers))};
  function assetPath(slot){const value=ASSETS[slot];return typeof value==="string"?value:value?.[state.answers.gender]||""}
  const asset=(slot,label="Imagen")=>assetPath(slot)?`<img class="step-image" src="${esc(assetPath(slot))}" alt="${esc(label)}" decoding="async">`:`<div class="asset-slot" data-asset-slot="${esc(slot)}"><span>${esc(label)}</span></div>`;
  const logo=()=>ASSETS.logo?`<div class="brand-lockup"><img class="brand-image" src="${esc(ASSETS.logo)}" alt="${esc(CONFIG.brand)}" width="768" height="512" decoding="async"></div>`:`<div class="brand-word">${esc(CONFIG.brand)}</div>`;
  const top=()=>`<div class="top-area"><button class="back-button" id="back" aria-label="Volver" ${state.current===0?"hidden":""}>←</button><div class="brand-area">${logo()}</div><div class="progress-track"><span style="width:${state.current/(steps.length-1)*100}%"></span></div></div>`;
  const option=(x,i,selected,image,icon)=>`<button class="answer ${selected?"selected":""} ${image?"image-answer":""} ${icon&&x.image?"icon-answer":""} ${x.emoji?"emoji-answer":""}" data-option="${i}" aria-pressed="${selected}">${image?`<div class="answer-image">${asset(x.image,"")}</div>`:icon&&x.image?`<span class="mini-picture">${asset(x.image,"")}</span>`:x.emoji?`<span class="answer-emoji" aria-hidden="true">${esc(x.emoji)}</span>`:""}<span class="answer-label">${esc(x.label)}</span><span class="answer-check">✓</span></button>`;
  // Recorte visual hasta el borde de cada tarjeta.
  // Cada entrada contiene: ancho original, alto original, x, y, ancho y alto del recorte.
  const COMMENT_CROPS={
    "comentario_1.webp":[720,480,16,84,688,319],
    "comentario_2.webp":[720,480,15,85,690,329],
    "comentario_3.webp":[720,480,15,75,690,339],
    "comentario_4.webp":[720,480,16,77,688,334],
    "comentario_5.webp":[720,480,13,75,694,332],
    "comentario_6.webp":[720,480,15,84,690,330],
    "comentario_7.webp":[720,480,18,93,684,297],
    "comentario_8.webp":[720,480,15,106,690,272],
    "comentario_9.webp":[1200,800,26,140,1148,548],
    "comentario_10.webp":[1200,800,26,153,1148,504],
    "comentario_11.webp":[720,480,16,84,688,319],
    "comentario_12.webp":[720,480,16,83,688,319],
    "social-proof-comment-mulher.jpeg":[1536,691,28,14,1480,662],
    "social-proof-comment-homem.jpeg":[1536,691,29,20,1478,650]
  };
  // Cuestionario: 1–6, 12 y 8. Oferta: 11 y 7; 9 y 10 son los destacados de mujer y hombre.
  const OFFER_COMMENT_NUMBERS=[11,7];
  function commentImage(path,label){
    if(!path)return `<div class="asset-slot"><span>${esc(label)}</span></div>`;
    const crop=COMMENT_CROPS[path.split("/").pop()];
    if(!crop)return `<img src="${esc(path)}" alt="${esc(label)}" loading="lazy" decoding="async">`;
    const [originalWidth,originalHeight,x,y,width,height]=crop;
    const style=`aspect-ratio:${width}/${height};--comment-width:${originalWidth/width*100}%;--comment-height:${originalHeight/height*100}%;--comment-left:${-x/width*100}%;--comment-top:${-y/height*100}%`;
    return `<span class="comment-crop" style="${style}"><img src="${esc(path)}" alt="${esc(label)}" width="${originalWidth}" height="${originalHeight}" loading="lazy" decoding="async"></span>`;
  }
  const testimonials=(amount=2,start=1,selection=[])=>`<section class="testimonial-area"><h2>Lo que cuentan otras personas:</h2><div class="testimonial-grid">${Array.from({length:amount},(_,i)=>{const number=selection[i]??(start+i),path=ASSETS.comments[number-1];return `<article class="testimonial-slot" data-comment-number="${number}">${commentImage(path,`Comentario ${number} sobre la experiencia con el Plan Carnívoro 40+`)}</article>`}).join("")}</div></section>`;
  function ruler(s,v){let ticks="";for(let n=s.min;n<=s.max;n++){const major=n%10===0,medium=!major&&n%5===0;ticks+=`<span class="ruler-tick ${major?"major":medium?"medium":"minor"}"><i></i>${major?`<b>${n}</b>`:""}</span>`}return `<div class="unit-toggle"><button class="active" type="button">${s.unit}</button><button type="button">${s.altUnit}</button></div><div class="ruler-wrap"><div class="range-bubble"><strong id="rangeValue">${v}</strong>${s.unit}</div><div class="ruler-stage" id="rulerStage" tabindex="0" role="slider" aria-label="${esc(s.title)}" aria-valuemin="${s.min}" aria-valuemax="${s.max}" aria-valuenow="${v}"><div class="ruler-tape" id="rulerTape" style="--ruler-offset:${(v-s.min)*-15}px" aria-hidden="true">${ticks}</div><div class="ruler-marker" aria-hidden="true"><span></span></div><input id="range" type="range" min="${s.min}" max="${s.max}" step="1" value="${v}" aria-hidden="true" tabindex="-1"></div><div class="drag-hint" aria-hidden="true"><span class="drag-arrow drag-arrow-left">←</span><strong>Desliza hacia los lados</strong><span class="drag-arrow drag-arrow-right">→</span></div></div>`}
  function goalComparison(){const current=Number(state.answers.weight),target=Number(state.answers.goalWeight);return `<div class="goal-comparison" aria-label="Comparación entre tu peso actual y tu peso objetivo"><div><span>Peso actual</span><strong>${current?`${current} kg`:"—"}</strong></div><i>→</i><div class="goal-target"><span>Tu objetivo</span><strong>${target?`${target} kg`:"—"}</strong></div></div>`}
  const resultChart=()=>`<div class="result-promise"><span>Alcanzarás tu objetivo en</span><strong>4 semanas</strong></div><div class="result-chart"><svg viewBox="0 0 640 360" role="img" aria-label="Gráfico animado de la evolución estimada durante cuatro semanas"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d63a31"/><stop offset=".52" stop-color="#f1b83d"/><stop offset="1" stop-color="#42b96b"/></linearGradient><linearGradient id="chartFill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#df6a62" stop-opacity=".72"/><stop offset=".52" stop-color="#f6d36e" stop-opacity=".68"/><stop offset="1" stop-color="#83d892" stop-opacity=".68"/></linearGradient></defs><g class="chart-grid"><line x1="70" y1="55" x2="570" y2="55"/><line x1="70" y1="116" x2="570" y2="116"/><line x1="70" y1="177" x2="570" y2="177"/><line x1="70" y1="238" x2="570" y2="238"/><line x1="70" y1="300" x2="570" y2="300"/><line x1="70" y1="55" x2="70" y2="300"/><line x1="320" y1="55" x2="320" y2="300"/><line x1="570" y1="55" x2="570" y2="300"/></g><g class="chart-labels"><text x="58" y="61">100</text><text x="58" y="122">75</text><text x="58" y="183">50</text><text x="58" y="244">25</text><text x="58" y="306">0</text><text class="chart-x" x="70" y="338">Hoy</text><text class="chart-x" x="320" y="338">2 semanas</text><text class="chart-x" x="570" y="338">4 semanas</text></g><path class="chart-area" d="M70 55 C180 88 245 133 320 177 C410 235 475 281 570 300 L570 300 L70 300 Z"/><path class="chart-line" d="M70 55 C180 88 245 133 320 177 C410 235 475 281 570 300"/><g class="chart-points"><circle class="chart-halo point-one" cx="70" cy="55" r="22"/><circle class="chart-dot point-one" cx="70" cy="55" r="10"/><circle class="chart-halo point-two" cx="320" cy="177" r="22"/><circle class="chart-dot point-two" cx="320" cy="177" r="11"/><circle class="chart-halo point-three" cx="570" cy="300" r="22"/><circle class="chart-dot point-three" cx="570" cy="300" r="10"/></g><g class="chart-you"><rect x="277" y="122" width="86" height="40" rx="10"/><text x="320" y="149">Tú</text></g></svg></div>`;
  let stepLoadingId,stepLoadingAdvanceId;
  function startStepLoading(){const ring=document.querySelector("#loadingRing"),ringValue=document.querySelector("#loadingRingValue"),bar=document.querySelector("#loadingBar"),percent=document.querySelector("#loadingPercent"),status=document.querySelector("#loadingStatus");if(!ring||!ringValue||!bar||!percent||!status)return;const loadingStepId=steps[state.current].id,phases=["Analizando tus respuestas...","Combinando tus preferencias...","Diseñando tu plan personalizado...","Preparando los últimos detalles..."];const started=Date.now(),duration=3200;clearInterval(stepLoadingId);clearTimeout(stepLoadingAdvanceId);const update=()=>{const progress=Math.min(100,Math.round((Date.now()-started)/duration*100));ring.style.setProperty("--progress",progress);ring.setAttribute("aria-valuenow",String(progress));ringValue.textContent=`${progress}%`;bar.style.width=`${progress}%`;percent.textContent=`${progress}%`;status.textContent=phases[Math.min(phases.length-1,Math.floor(progress/26))];if(progress>=100){clearInterval(stepLoadingId);ring.classList.add("done");status.textContent="¡Tu plan personalizado está listo!";stepLoadingAdvanceId=setTimeout(()=>{if(steps[state.current]?.id===loadingStepId)next()},650)}};update();stepLoadingId=setInterval(update,40)}
  function renderStep(animate=true){animate=animate&&activeTrackedStep!==state.current;clearInterval(stepLoadingId);clearTimeout(stepLoadingAdvanceId);const s=steps[state.current];let h=`<h1>${esc(s.title)}</h1>${s.secondaryTitle?`<h2 class="secondary-title">${esc(s.secondaryTitle)}</h2>`:""}${s.subtitle?`<p class="lead">${esc(s.subtitle)}</p>`:""}`;
    if(["choice","multi","imageGrid"].includes(s.type)){const saved=new Set(Array.isArray(state.answers[s.id])?state.answers[s.id]:state.answers[s.id]?[state.answers[s.id]]:[]),image=s.type==="imageGrid";h+=`<div class="answers ${image?"image-grid":""} ${s.compactGrid?"compact-grid":""}">${s.options.map((x,i)=>option(x,i,saved.has(x.label),image,s.iconOptions)).join("")}</div>${s.type==="multi"?`<button class="continue-button" id="continue" ${saved.size?"":"disabled"}>Continúa</button>`:""}`}
    else if(s.type==="range")h+=ruler(s,state.answers[s.id]??s.value)+`<button class="continue-button" id="continue">Continúa</button>`;
    else if(s.type==="input")h+=`<label class="field-label" for="field">${esc(s.label)}</label><input class="field" id="field" type="${s.inputType}" value="${esc(state.answers[s.id]||"")}" placeholder="${esc(s.placeholder)}">${s.privacy?`<p class="privacy"><strong>Tus datos están protegidos.</strong><br>Usaremos tu correo solo para enviarte información relacionada con el acceso.</p>`:""}<button class="continue-button" id="continue" disabled>Continúa</button>`;
    else if(s.type==="info")h=s.imageOnly?`<div class="info-image info-image-only">${asset(s.image,s.title)}</div><button class="continue-button" id="continue">Continúa</button>`:`${assetPath(s.image)?`<div class="info-image">${asset(s.image,s.title)}</div>`:""}<h1>${esc(s.title)}</h1><p class="info-copy">${esc(s.body)}</p>${s.id==="goalRegistered"?goalComparison():""}<button class="continue-button" id="continue">Continúa</button>`;
    else if(s.type==="result")h+=`${resultChart()}${testimonials(2,s.testimonialStart)}<button class="continue-button" id="continue">Continúa</button>`;
    else if(s.type==="loading")h=`<div class="loading-ring" id="loadingRing" style="--progress:0" role="progressbar" aria-label="Progreso de la creación del plan" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="loadingRingValue">0%</span></div><h1>${esc(s.title)}</h1><div class="calculation"><div><span id="loadingBar" style="width:0%"></span></div><strong id="loadingPercent">0%</strong><p id="loadingStatus" aria-live="polite">${esc(s.body)}</p></div>${s.testimonials?testimonials(2,s.testimonialStart,s.testimonialSelection):""}`;
    app.innerHTML=`<main class="quiz-page">${top()}<section class="question-card ${animate?"step-enter":""}">${h}</section><footer>© 2026 ${esc(CONFIG.brand)}</footer></main>`;bind(s);window.scrollTo({top:0});trackStepView()}
  function next(){trackStepComplete();if(state.current===steps.length-1){sessionStorage.setItem("carnifit_completed","1");pixelOnce("quiz_completed","QuizCompleted",{},true);renderOffer();return}state.current++;persist();renderStep()}
  function bind(s){document.querySelector("#back")?.addEventListener("click",()=>{state.current=Math.max(0,state.current-1);persist();renderStep()});document.querySelectorAll("[data-option]").forEach(b=>b.addEventListener("click",()=>{if(s.id==="gender")pixelOnce("quiz_started","QuizStarted",{},true);const picked=s.options[Number(b.dataset.option)].label;if(s.type==="multi"){const saved=new Set(state.answers[s.id]||[]),exclusive=/ninguna|no tomo ninguno/i.test(picked);if(exclusive){saved.clear();saved.add(picked)}else{[...saved].filter(x=>/ninguna|no tomo ninguno/i.test(x)).forEach(x=>saved.delete(x));saved.has(picked)?saved.delete(picked):(!s.max||saved.size<s.max)&&saved.add(picked)}state.answers[s.id]=[...saved];persist();renderStep()}else{state.answers[s.id]=picked;persist();next()}}));const range=document.querySelector("#range");if(range){const stage=document.querySelector("#rulerStage"),syncRuler=()=>{document.querySelector("#rangeValue").textContent=range.value;document.querySelector("#rulerTape")?.style.setProperty("--ruler-offset",`${(Number(range.value)-s.min)*-15}px`);stage?.setAttribute("aria-valuenow",range.value)};range.addEventListener("input",syncRuler);if(stage){let dragging=false,startX=0,startValue=Number(range.value);const finish=()=>{dragging=false;stage.classList.remove("dragging")};stage.addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;startValue=Number(range.value);stage.classList.add("dragging");stage.setPointerCapture?.(e.pointerId);e.preventDefault()});stage.addEventListener("pointermove",e=>{if(!dragging)return;range.value=Math.max(s.min,Math.min(s.max,Math.round(startValue-(e.clientX-startX)/15)));syncRuler();e.preventDefault()});stage.addEventListener("pointerup",finish);stage.addEventListener("pointercancel",finish);stage.addEventListener("lostpointercapture",finish);stage.addEventListener("keydown",e=>{const amount=e.key==="ArrowRight"||e.key==="ArrowUp"?1:e.key==="ArrowLeft"||e.key==="ArrowDown"?-1:e.key==="PageUp"?10:e.key==="PageDown"?-10:0;if(!amount)return;e.preventDefault();range.value=Math.max(s.min,Math.min(s.max,Number(range.value)+amount));syncRuler()})}document.querySelector("#continue").addEventListener("click",()=>{state.answers[s.id]=Number(range.value);persist();next()})}const field=document.querySelector("#field");if(field){const btn=document.querySelector("#continue"),valid=()=>s.inputType==="email"?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()):field.value.trim().length>=2,sync=()=>btn.disabled=!valid();field.addEventListener("input",sync);sync();btn.addEventListener("click",()=>{if(!valid())return;state.answers[s.id]=field.value.trim();persist();next()})}if(["info","result","loading","multi"].includes(s.type))document.querySelector("#continue")?.addEventListener("click",next);if(s.type==="loading")startStepLoading()}
  function checkout(){const u=new URL(CONFIG.checkoutUrl);Object.entries(tracking).forEach(([k,v])=>v&&u.searchParams.set(k,v));return u.toString()}
  function personalizedPriorities(){
    const a=state.answers,candidates=[],add=(score,pain,solution)=>candidates.push({score,pain,solution});
    const target=Number(a.goalWeight),current=Number(a.weight);
    const goal=target?{pain:`Tu objetivo: ${target} kg`,solution:`Indicaste que quieres llegar a ${target} kg${current?` desde ${current} kg`:""}. Tu plan de 4 semanas organiza acciones prácticas para ayudarte a avanzar en esa dirección.`}:{pain:"Tu peso objetivo",solution:"Tu plan de 4 semanas organiza acciones prácticas para ayudarte a avanzar hacia el peso que quieres alcanzar."};
    if(a.weightHistory)add(95,"Dificultad para mantener el peso",`Tu respuesta fue: “${a.weightHistory}”. La propuesta incluye una estrategia de continuidad para que la rutina resulte más sostenible después de las primeras semanas.`);
    if(a.timeAway)add(/Más de 3|Nunca/.test(a.timeAway)?90:/1 a 3/.test(a.timeAway)?78:55,"Tiempo lejos de tu peso objetivo",`Indicaste: “${a.timeAway}”. El plan divide el proceso en pasos más pequeños para ayudarte a recuperar la constancia.`);
    if(a.hungerTime)add(72,"Hambre a lo largo del día",`Sueles tener más hambre en este momento: “${a.hungerTime}”. Las comidas se organizarán para darte más estructura precisamente en ese horario.`);
    if(a.eatingHabits)add(66,"Tu rutina alimentaria actual",`Describiste tus hábitos así: “${a.eatingHabits}”. El plan incluye opciones prácticas acordes con esa rutina para que sea más fácil seguirlo.`);
    if(a.sleep&&/Menos de 5|5 a 6|irregular/.test(a.sleep))add(/Menos de 5|irregular/.test(a.sleep)?88:76,"Descanso por debajo de lo ideal",`Indicaste que duermes “${a.sleep}”. El plan incorpora una meta diaria de descanso para ayudarte a organizar mejor tu rutina.`);
    if(a.water&&/1 vaso|2 a 3|4 a 5/.test(a.water))add(/1 vaso/.test(a.water)?87:/2 a 3/.test(a.water)?79:68,"Consumo de agua reducido",`Indicaste que bebes “${a.water}” al día. El plan incorpora una meta progresiva de hidratación fácil de seguir.`);
    const activity=a.dailyActivity||a.weeklyActivity;
    if(activity&&/sin moverme|Poco o ningún|ligera/i.test(activity))add(/sin moverme|Poco o ningún/i.test(activity)?84:70,"Poca actividad en tu rutina",`Describiste tu actividad así: “${activity}”. El plan propone metas sencillas y compatibles con tu nivel actual.`);
    const allergies=(Array.isArray(a.allergies)?a.allergies:[]).filter(x=>!/^Ninguna$/i.test(x));
    if(allergies.length)add(92,"Restricciones alimentarias indicadas",`Seleccionaste: ${allergies.join(", ")}. Las sugerencias se filtrarán para respetar esas restricciones alimentarias.`);
    if(a.currentSize&&a.desiredSize&&a.currentSize!==a.desiredSize)add(62,"Tu objetivo de talla",`Quieres pasar de la talla ${a.currentSize} a la ${a.desiredSize}. Esta meta permanecerá visible para que puedas seguir tu evolución.`);
    const extraGoal=Array.isArray(a.secondaryGoal)?a.secondaryGoal[0]:a.secondaryGoal;
    if(extraGoal&&extraGoal!=="Todavía no lo he pensado")add(58,"Un objetivo más allá del peso",`También quieres: “${extraGoal}”. El plan tiene en cuenta este objetivo al organizar tus metas diarias.`);
    return [goal,...candidates.sort((x,y)=>y.score-x.score).slice(0,5)];
  }
  const FAQ_ITEMS=[
    {question:"¿Qué incluirán mis comidas?",answer:["Tu plan incluirá lo necesario para avanzar hacia tu objetivo sin tener que contar calorías todo el tiempo.","Las comidas priorizan proteínas y grasas para ofrecerte saciedad y una rutina más sencilla de seguir."]},
    {question:"¿Qué diferencia al Plan Carnívoro 40+ de otros planes?",answer:["Las recetas se seleccionan según tus preferencias y tus objetivos.","También tenemos en cuenta tu rutina y tus hábitos antes de organizar la versión final de tu plan."]},
    {question:"¿Cuándo puedo esperar cambios visibles?",answer:["Cada persona responde de manera diferente. Algunas personas perciben cambios en las primeras semanas, mientras que otras necesitan más tiempo.","La constancia, el descanso, la actividad y el punto de partida influyen en el progreso."]},
    {question:"¿Es difícil seguir este plan de comidas?",answer:["La propuesta está organizada para que resulte sencilla y práctica.","Dentro del plan encontrarás recetas detalladas, listas de compras e indicaciones para preparar cada comida."]},
    {question:"¿Sentiré hambre con el Plan Carnívoro 40+?",answer:["Las comidas se organizan para que resulten completas y satisfactorias. La cantidad y la frecuencia se adaptan a las respuestas que diste en el cuestionario."]},
    {question:"¿Necesito hacer ejercicio con el Plan Carnívoro 40+?",answer:["La actividad física puede complementar tu proceso, pero el plan parte de tu nivel actual. Si decides empezar a entrenar o tienes alguna condición de salud, busca orientación profesional adecuada."]}
  ];
  const faq=()=>FAQ_ITEMS.map(item=>`<details><summary>${esc(item.question)}</summary>${item.answer.map(paragraph=>`<p>${esc(paragraph)}</p>`).join("")}</details>`).join("");
  const conditionIndicator=()=>`<div class="condition" aria-label="Comparación entre tu situación actual y tu potencial de constancia"><div class="condition-metric condition-current"><span>Tu situación actual</span><strong>25%</strong><div class="condition-bar" role="progressbar" aria-label="Situación actual: 25 %" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"><b class="condition-fill" style="--condition-progress:25%"></b></div></div><i class="condition-arrow" aria-hidden="true">→</i><div class="condition-metric condition-potential"><span>Tu potencial de constancia</span><strong>90%</strong><div class="condition-bar" role="progressbar" aria-label="Potencial de constancia: 90 %" aria-valuemin="0" aria-valuemax="100" aria-valuenow="90"><b class="condition-fill" style="--condition-progress:90%"></b></div></div></div>`;
  const timer=()=>`<div class="offer-timer" role="timer" aria-label="Tiempo de esta sesión"><span class="timer-label">Tiempo para completar esta sesión</span><div class="timer-digits"><span><strong data-timer-minutes>${String(CONFIG.offerMinutes).padStart(2,"0")}</strong><small>min</small></span><b>:</b><span><strong data-timer-seconds>00</strong><small>seg</small></span></div></div>`;
  const currentQuote=()=>priceService?.current()||{currency:"USD",amount:GLOBAL_CONFIG.BASE_PRICE_USD,formatted:`US$ ${GLOBAL_CONFIG.BASE_PRICE_USD.toFixed(2)}`,localized:false};
  function syncPriceElements(){const quote=currentQuote();document.querySelectorAll("[data-price]").forEach(node=>node.textContent=quote.formatted);document.querySelectorAll("[data-price-note]").forEach(node=>node.textContent=quote.localized?"Precio estimado en tu moneda. El total final se confirma en el checkout.":"Precio internacional. El total final se confirma en el checkout.")}
  priceService?.subscribe(syncPriceElements);
  const buyBox=()=>{const quote=currentQuote();return `<div class="buy-box"><div class="price-kicker">ACCESO COMPLETO AL PLAN</div><div class="price-row"><div><span>Pago único</span><strong data-price>${esc(quote.formatted)}</strong><small>en un solo pago</small></div><b>10 % de descuento</b></div><a class="buy-button" href="${esc(checkout())}">QUIERO MI PLAN DE ALIMENTACIÓN</a><p class="price-local-note" data-price-note>${quote.localized?"Precio estimado en tu moneda. El total final se confirma en el checkout.":"Precio internacional. El total final se confirma en el checkout."}</p><p class="secure-purchase">🔒 Compra segura. Acceso tras confirmar el pago</p></div>`};
  let offerTimerId;
  function startOfferTimer(){
    const key="carnifit_offer_deadline";
    let deadline=Number(sessionStorage.getItem(key));
    if(!deadline||deadline<=Date.now()){deadline=Date.now()+CONFIG.offerMinutes*60*1000;sessionStorage.setItem(key,String(deadline))}
    clearInterval(offerTimerId);
    const update=()=>{const left=Math.max(0,deadline-Date.now()),minutes=Math.floor(left/60000),seconds=Math.floor(left%60000/1000);document.querySelectorAll("[data-timer-minutes]").forEach(x=>x.textContent=String(minutes).padStart(2,"0"));document.querySelectorAll("[data-timer-seconds]").forEach(x=>x.textContent=String(seconds).padStart(2,"0"));if(left===0)clearInterval(offerTimerId)};
    update();offerTimerId=setInterval(update,1000);
  }
  function renderOffer(){
    const name=esc((state.answers.name||"").split(" ")[0]);
    const priorities=personalizedPriorities();
    app.innerHTML=`<main class="offer-page">
      <section class="offer-hero"><div class="offer-container offer-narrow">${logo()}${assetPath("offerEvolution")?`<div class="offer-progress-image">${asset("offerEvolution","Comparación visual entre la situación actual y el objetivo")}</div>`:""}${conditionIndicator()}${timer()}<h1>¡${name?`${name}, tu`:"Tu"} plan carnívoro personalizado está listo!</h1><p class="hero-copy">Hemos organizado tus respuestas en una propuesta práctica que puedes consultar desde tu teléfono.</p>${buyBox()}</div></section>
      <section class="personalized-solutions-section"><div class="offer-container offer-narrow"><h3 class="included-title">Tu plan se centra en estas prioridades:</h3><p class="personalized-intro">Hemos seleccionado lo más importante a partir de las respuestas que acabas de compartir.</p><ul class="inclusion-list personalized-list">${priorities.map(x=>`<li><span>✓</span><div><small>TU PRIORIDAD</small><strong>${esc(x.pain)}</strong><p>${esc(x.solution)}</p></div></li>`).join("")}</ul>${timer()}${buyBox()}</div></section>
      <section class="social-proof-section"><div class="offer-container offer-narrow"><p class="eyebrow">UNA EXPERIENCIA PARA CONOCER</p><h2>Conoce la experiencia de quienes ya empezaron</h2><div class="social-proof-stack"><div class="social-proof-photo">${asset("socialProofPhoto","Transformación compartida por un cliente")}</div><div class="social-proof-comment">${commentImage(assetPath("socialProofComment"),"Comentario sobre la experiencia con el Plan Carnívoro 40+")}</div></div><p class="social-proof-note">Los resultados pueden variar de una persona a otra.</p>${timer()}${buyBox()}</div></section>
      <section class="customer-comments-section"><div class="offer-container"><p class="eyebrow">COMENTARIOS DE CLIENTES</p><h2>Más experiencias compartidas</h2><p class="customer-comments-intro">Lee otros comentarios de personas que probaron el Plan Carnívoro 40+.</p><div class="offer-comments">${testimonials(OFFER_COMMENT_NUMBERS.length,1,OFFER_COMMENT_NUMBERS)}</div><p class="social-proof-note">Experiencias individuales. Los resultados pueden variar de una persona a otra.</p></div></section>
      <section class="faq-section"><div class="offer-container offer-narrow"><h2>¿Tienes alguna pregunta?</h2><p class="centered">Resolvemos las dudas más frecuentes</p><div class="faq">${faq()}</div></div></section>
      <section><div class="offer-container offer-narrow guarantee"><div class="guarantee-image">${asset("guarantee","Sello de garantía de 30 días")}</div><div class="guarantee-copy"><h2>Garantía de devolución</h2><p>Prueba el material con la tranquilidad de nuestra garantía.</p><p>Si no cumple tus expectativas durante los primeros 30 días después de la compra, te devolveremos el importe completo, sin hacer preguntas.</p><p>Solo tienes que escribir a nuestro equipo de soporte: <a href="mailto:carnivora40@gmail.com">carnivora40@gmail.com</a></p></div></div></section>
      <section class="last-call"><div class="offer-container offer-narrow"><p class="eyebrow">TU PLAN YA ESTÁ LISTO</p>${timer()}${buyBox()}</div></section>
      <footer>© 2026 ${esc(CONFIG.brand)}. Contenido educativo. Los resultados pueden variar. <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener">Datos de cambio por ExchangeRate-API</a>.</footer>
    </main>`;
    syncPriceElements();
    priceService?.init().then(quote=>pixelOnce("offer_viewed","ViewContent",{content_name:"Plan Carnívoro 40+",content_type:"product",currency:quote.currency,value:quote.amount}));
    document.querySelectorAll(".buy-button").forEach(button=>button.addEventListener("click",()=>{const quote=currentQuote();pixel("InitiateCheckout",{content_name:"Plan Carnívoro 40+",currency:quote.currency,value:quote.amount})}));
    window.scrollTo({top:0});startOfferTimer();
  }
  if(location.hash==="#oferta"||sessionStorage.getItem("carnifit_completed")==="1")renderOffer();else renderStep();
})();
