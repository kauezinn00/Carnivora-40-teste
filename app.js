(() => {
  "use strict";
  const CONFIG={checkoutUrl:"https://pay.wiapy.com/KX2LK3vXNU",brand:"Carnívora 40+",price:"R$ 29,90",offerMinutes:10,pixelId:"1253168553664712",utmifyScript:"https://cdn.utmify.com.br/scripts/utms/latest.js"};
  /* Preencha os caminhos abaixo com os arquivos autorizados enviados pelo cliente. */
  const ASSETS={
    logo:"/assets/logo-carnivora-40.webp",
    genderWoman:"/assets/options/etapa_01_genero_mulher.webp",
    genderMan:"/assets/options/etapa_01_genero_homem.webp",
    age18:{Mulher:"/assets/options/etapa_02_idade_mulher_18_a_26_anos.webp",Homem:"/assets/options/etapa_02_idade_homem_18_a_26_anos.webp"},
    age27:{Mulher:"/assets/options/etapa_02_idade_mulher_27_a_38_anos.webp",Homem:"/assets/options/etapa_02_idade_homem_27_a_38_anos.webp"},
    age39:{Mulher:"/assets/options/etapa_02_idade_mulher_39_a_50_anos.webp",Homem:"/assets/options/etapa_02_idade_homem_39_a_50_anos.webp"},
    age50:{Mulher:"/assets/options/etapa_02_idade_mulher_50_mais.webp",Homem:"/assets/options/etapa_02_idade_homem_50_mais.webp"},
    goalAppearance:{Mulher:"/assets/options/etapa_03_objetivo_mulher_ficar_mais_bonita_e_me_sentir_bem.webp",Homem:"/assets/options/etapa_03_objetivo_homem_ficar_mais_bonito_e_me_sentir_bem.webp"},
    goalHealth:{Mulher:"/assets/options/etapa_03_objetivo_mulher_melhorar_minha_saude.webp",Homem:"/assets/options/etapa_03_objetivo_homem_melhorar_minha_saude.webp"},
    goalBoth:{Mulher:"/assets/options/etapa_03_objetivo_mulher_ambos.webp",Homem:"/assets/options/etapa_03_objetivo_homem_ambos.webp"},
    comments:[1,2,3,4,5,6,7,8,9,10,11,12].map(i=>`/assets/comments/comentario_${i}.webp`),
    macroInfo:"assets/dieta-carnivora-80-20.jpeg",difference:"assets/dieta-carnivora-diferente.jpeg",goal:"/assets/meta-peso.webp",foodInfo:"/assets/mais-de-100-receitas.jpeg",mealPlan:"/assets/plano-refeicoes.webp",faceChange:{Mulher:"/assets/inchaco-rosto-mulher.webp",Homem:"/assets/inchaco-rosto-homem.webp"},offerEvolution:{Mulher:"/assets/resultado-agora-meta-mulher.webp",Homem:"/assets/resultado-agora-meta-homem.webp"},visibleChange:{Mulher:"/assets/antes-depois-mulher.webp",Homem:"/assets/antes-depois-homem.webp"},socialProofPhoto:{Mulher:"/assets/social-proof-photo-mulher.jpeg",Homem:"/assets/social-proof-photo-homem.webp"},socialProofComment:{Mulher:"/assets/social-proof-comment-mulher.jpeg",Homem:"/assets/social-proof-comment-homem.jpeg"},guarantee:"/assets/garantia-30-dias.webp"
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
  // Altere a versão se a ordem ou a quantidade de etapas mudar.
  const FUNNEL_VERSION="35_steps_v1";
  let activeTrackedStep=-1,stepEnteredAt=0;
  function stepEventData(){
    const data={funnel_version:FUNNEL_VERSION,step_number:state.current+1,steps_total:steps.length};
    // Aceita somente um ID numérico de anúncio; nunca envia respostas ou nomes.
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
    // Se o Pixel ficou disponível depois da renderização, enfileira a entrada primeiro.
    trackStepView();
    pixelOnce(`${FUNNEL_VERSION}_step_${number}_completed`,`QuizStep${number}Completed`,data,true);
  }
  const c=(label,image="",emoji="")=>({label,image,emoji});
  const steps=[
    {id:"gender",type:"imageGrid",title:"Responda as perguntas e receba o seu plano carnívoro em dois minutos",subtitle:"Selecione seu gênero:",options:[c("Mulher","genderWoman"),c("Homem","genderMan")]},
    {id:"age",type:"imageGrid",title:"Qual é a sua faixa etária?",options:[c("18 a 26 anos","age18"),c("27 a 38 anos","age27"),c("39 a 50 anos","age39"),c("Mais de 50 anos","age50")]},
    {id:"primaryGoal",type:"choice",iconOptions:true,title:"Qual é o seu principal objetivo com essa alimentação?",options:[c("Melhorar minha aparência","goalAppearance"),c("Cuidar melhor da saúde","goalHealth"),c("Os dois objetivos","goalBoth"),c("Outro objetivo")]},
    {id:"previousExperience",type:"choice",title:"Você já experimentou uma alimentação carnívora?",options:[c("Sim, já experimentei"),c("Já ouvi falar"),c("Ainda não experimentei"),c("Tentei, mas não consegui manter")]},
    {id:"macroInfo",type:"info",image:"macroInfo",imageOnly:true,title:"A dieta carnívora é composta por 80% gordura, 20% proteína e baixo teor de carboidratos",body:""},
    {id:"hungerTime",type:"choice",title:"Em qual período você costuma sentir mais fome?",options:[c("Manhã"),c("Tarde"),c("Noite"),c("Não existe um horário certo")]},
    {id:"favoriteMeal",type:"choice",title:"Qual refeição do dia você mais gosta?",options:[c("Café da manhã","","☕"),c("Almoço","","🍽️"),c("Jantar","","🌙"),c("Lanches","","🥪"),c("Não tenho uma refeição favorita","","🤷")]},
    {id:"weightHistory",type:"choice",title:"Você já perdeu peso e depois teve dificuldade para manter?",options:[c("Sim"),c("Isso acontece com frequência"),c("Já passei pelo efeito sanfona"),c("Manter o peso é mais difícil do que emagrecer")]},
    {id:"difference",type:"info",image:"difference",imageOnly:true,title:"A dieta carnívora é diferente",body:""},
    {id:"height",type:"range",title:"Qual é a sua altura?",min:140,max:220,value:180,unit:"cm",altUnit:"pol"},
    {id:"weight",type:"range",title:"Qual é o seu peso atual?",min:40,max:250,value:70,unit:"kg",altUnit:"lb"},
    {id:"goalWeight",type:"range",title:"Qual peso você deseja alcançar?",min:40,max:250,value:65,unit:"kg",altUnit:"lb"},
    {id:"goalRegistered",type:"info",image:"goal",title:"Você definiu uma meta clara e possível de acompanhar",body:"Agora vamos considerar sua rotina e suas preferências."},
    {id:"name",type:"input",title:"Sua jornada está prestes a começar",secondaryTitle:"Como podemos chamar você?",label:"Nome",placeholder:"Digite seu nome...",inputType:"text"},
    {id:"preview",type:"result",title:"Com base em suas respostas:",body:"Você chegará ao seu objetivo em 4 semanas.",testimonials:true,testimonialStart:1},
    {id:"weeklyActivity",type:"choice",title:"Como você descreve sua atividade física semanal?",options:[c("Pouco ou nenhum exercício"),c("Levemente ativo: 1 a 2 treinos"),c("Moderadamente ativo: 3 a 5 treinos"),c("Muito ativo: 6 a 7 dias"),c("Extremamente ativo ou trabalho físico pesado")]},
    {id:"timeAway",type:"choice",title:"Há quanto tempo você está distante do peso desejado?",options:[c("Menos de 1 ano"),c("De 1 a 3 anos"),c("Mais de 3 anos"),c("Nunca estive no peso que desejo")]},
    {id:"currentSize",type:"choice",compactGrid:true,title:"Qual tamanho de roupa você costuma usar?",options:[c("XXXL+","","👕"),c("XXXL","","👕"),c("XXG","","👕"),c("GG","","👕"),c("G","","👕"),c("M","","👕"),c("P ou menor","","👕")]},
    {id:"desiredSize",type:"choice",compactGrid:true,title:"Qual tamanho de roupa você gostaria de usar?",options:[c("XXXL+","","✨"),c("XXXL","","✨"),c("XXG","","✨"),c("GG","","✨"),c("G","","✨"),c("M","","✨"),c("P ou menor","","✨")]},
    {id:"partialCalculation",type:"loading",title:"Calculando seu plano alimentar",body:"Organizando suas respostas...",testimonials:true,testimonialStart:3},
    {id:"eatingHabits",type:"choice",title:"Como você descreve seus hábitos alimentares?",options:[c("Como quase sempre as mesmas coisas"),c("Faço variações usando os mesmos alimentos"),c("Revezo alguns pratos favoritos"),c("Como de tudo um pouco"),c("Não tenho certeza")]},
    {id:"foodInfo",type:"info",image:"foodInfo",title:"Mais de 100 receitas deliciosas",body:"As sugestões serão organizadas conforme suas preferências e experiência na cozinha."},
    {id:"ingredients",type:"multi",max:5,title:"Escolha até cinco ingredientes favoritos",options:[c("Carne bovina","","🥩"),c("Carne suína","","🥓"),c("Frango","","🍗"),c("Peixe","","🐟"),c("Ovos","","🥚"),c("Manteiga","","🧈"),c("Sal","","🧂"),c("Queijos curados","","🧀"),c("Vísceras","","🍖"),c("Nenhuma das opções","","🚫")]},
    {id:"protein",type:"multi",max:3,title:"Quais proteínas você prefere?",options:[c("Ovos","","🥚"),c("Laticínios","","🧀"),c("Frango","","🍗"),c("Carne bovina","","🥩"),c("Carne suína","","🥓"),c("Peru","","🍗"),c("Peixe","","🐟"),c("Cordeiro","","🍖"),c("Proteína vegetal","","🌱"),c("Nenhuma das alternativas","","🚫")]},
    {id:"allergies",type:"multi",title:"Você possui alguma alergia ou intolerância alimentar?",options:[c("Nenhuma","","✅"),c("Lactose","","🥛"),c("Oleaginosas","","🥜"),c("Frutos do mar","","🦐"),c("Proteína do leite","","🥛"),c("Proteína do ovo","","🥚"),c("Mel","","🍯"),c("Cítricos","","🍊"),c("Outra","","⚠️")]},
    {id:"mealPlan",type:"info",image:"mealPlan",title:"Seu plano de refeições está sendo organizado",body:"As receitas serão combinadas com os alimentos e preferências selecionados."},
    {id:"sleep",type:"choice",title:"Quantas horas você costuma dormir por noite?",options:[c("Mais de 8 horas"),c("7 a 8 horas"),c("5 a 6 horas"),c("Menos de 5 horas ou sono irregular")]},
    {id:"water",type:"choice",title:"Quantos copos de água você costuma beber por dia?",options:[c("1 copo ou menos"),c("2 a 3 copos"),c("4 a 5 copos"),c("6 a 7 copos"),c("8 copos ou mais")]},
    {id:"dailyActivity",type:"choice",title:"Como é o seu cotidiano?",options:[c("Bem parado, quase não caminho"),c("Equilibrado, com alguma caminhada"),c("Bem ativo, com esforço físico frequente"),c("Varia entre dias parados e ativos")]},
    {id:"medications",type:"multi",title:"Você utiliza algum destes medicamentos ou suplementos?",options:[c("Antibióticos"),c("Medicamentos para ansiedade"),c("Hormônios"),c("Vitaminas"),c("Outro"),c("Não utilizo")]},
    {id:"conditions",type:"multi",title:"Você possui alguma destas condições de saúde?",options:[c("Diabetes"),c("Refluxo"),c("Apneia do sono"),c("Pressão alta"),c("Colesterol alto"),c("Problemas renais"),c("Em recuperação de cirurgia"),c("Nenhuma das alternativas")]},
    {id:"secondaryGoal",type:"multi",title:"Além do peso, o que mais você deseja melhorar?",options:[c("Conseguir correr 5 km"),c("Sentir-me melhor diante do espelho"),c("Ter mais saúde e energia"),c("Dormir melhor"),c("Preparar-me para um evento"),c("Sentir-me bem com meu corpo"),c("Ter uma vida mais ativa"),c("Ainda não pensei nisso")]},
    {id:"faceChange",type:"info",image:"faceChange",imageOnly:true,title:"O emagrecimento não fica visível só no corpo",body:""},
    {id:"motivation",type:"result",title:"Com motivação e persistência, você pode alcançar seu objetivo até mais rápido do que imagina!",body:"Você chegará ao seu objetivo em 4 semanas.",testimonials:true,testimonialStart:5},
    {id:"building",type:"loading",title:"Criando seu plano personalizado",body:"Preparando uma sequência com base nas respostas fornecidas...",testimonials:true,testimonialStart:7}
  ];
  sessionStorage.setItem("carnifit_step","0");
  sessionStorage.setItem("carnifit_answers","{}");
  sessionStorage.setItem("carnifit_completed","0");
  const state={current:0,answers:{}},app=document.querySelector("#app");
  const esc=(v="")=>String(v).replace(/[&<>'"]/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"})[x]);
  const persist=()=>{sessionStorage.setItem("carnifit_step",String(state.current));sessionStorage.setItem("carnifit_answers",JSON.stringify(state.answers))};
  function assetPath(slot){const value=ASSETS[slot];return typeof value==="string"?value:value?.[state.answers.gender]||""}
  const asset=(slot,label="Imagem")=>assetPath(slot)?`<img class="step-image" src="${esc(assetPath(slot))}" alt="${esc(label)}" decoding="async">`:`<div class="asset-slot" data-asset-slot="${esc(slot)}"><span>${esc(label)}</span></div>`;
  const logo=()=>ASSETS.logo?`<div class="brand-lockup"><img class="brand-image" src="${esc(ASSETS.logo)}" alt="${esc(CONFIG.brand)}" width="768" height="512" decoding="async"></div>`:`<div class="brand-word">${esc(CONFIG.brand)}</div>`;
  const top=()=>`<div class="top-area"><button class="back-button" id="back" aria-label="Voltar" ${state.current===0?"hidden":""}>←</button><div class="brand-area">${logo()}</div><div class="progress-track"><span style="width:${state.current/(steps.length-1)*100}%"></span></div></div>`;
  const option=(x,i,selected,image,icon)=>`<button class="answer ${selected?"selected":""} ${image?"image-answer":""} ${icon&&x.image?"icon-answer":""} ${x.emoji?"emoji-answer":""}" data-option="${i}" aria-pressed="${selected}">${image?`<div class="answer-image">${asset(x.image,"")}</div>`:icon&&x.image?`<span class="mini-picture">${asset(x.image,"")}</span>`:x.emoji?`<span class="answer-emoji" aria-hidden="true">${esc(x.emoji)}</span>`:""}<span class="answer-label">${esc(x.label)}</span><span class="answer-check">✓</span></button>`;
  // Recorte visual até a borda de cada card. Os pixels, nomes e textos originais são preservados.
  // Cada entrada contém: largura original, altura original, x, y, largura e altura do recorte.
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
  // 1–8 pertencem ao quiz; 9 e 10 já são as histórias dos destaques feminino/masculino.
  const OFFER_COMMENT_NUMBERS=[11,12];
  function commentImage(path,label){
    if(!path)return `<div class="asset-slot"><span>${esc(label)}</span></div>`;
    const crop=COMMENT_CROPS[path.split("/").pop()];
    if(!crop)return `<img src="${esc(path)}" alt="${esc(label)}" loading="lazy" decoding="async">`;
    const [originalWidth,originalHeight,x,y,width,height]=crop;
    const style=`aspect-ratio:${width}/${height};--comment-width:${originalWidth/width*100}%;--comment-height:${originalHeight/height*100}%;--comment-left:${-x/width*100}%;--comment-top:${-y/height*100}%`;
    return `<span class="comment-crop" style="${style}"><img src="${esc(path)}" alt="${esc(label)}" width="${originalWidth}" height="${originalHeight}" loading="lazy" decoding="async"></span>`;
  }
  const testimonials=(amount=2,start=1,selection=[])=>`<section class="testimonial-area"><h2>O que as pessoas dizem:</h2><div class="testimonial-grid">${Array.from({length:amount},(_,i)=>{const number=selection[i]??(start+i),path=ASSETS.comments[number-1];return `<article class="testimonial-slot" data-comment-number="${number}">${commentImage(path,`Comentário ${number} sobre a experiência com o plano Carnívora 40+`)}</article>`}).join("")}</div></section>`;
  function ruler(s,v){let ticks="";for(let n=s.min;n<=s.max;n++){const major=n%10===0,medium=!major&&n%5===0;ticks+=`<span class="ruler-tick ${major?"major":medium?"medium":"minor"}"><i></i>${major?`<b>${n}</b>`:""}</span>`}return `<div class="unit-toggle"><button class="active" type="button">${s.unit}</button><button type="button">${s.altUnit}</button></div><div class="ruler-wrap"><div class="range-bubble"><strong id="rangeValue">${v}</strong>${s.unit}</div><div class="ruler-stage" id="rulerStage" tabindex="0" role="slider" aria-label="${esc(s.title)}" aria-valuemin="${s.min}" aria-valuemax="${s.max}" aria-valuenow="${v}"><div class="ruler-tape" id="rulerTape" style="--ruler-offset:${(v-s.min)*-15}px" aria-hidden="true">${ticks}</div><div class="ruler-marker" aria-hidden="true"><span></span></div><input id="range" type="range" min="${s.min}" max="${s.max}" step="1" value="${v}" aria-hidden="true" tabindex="-1"></div><div class="drag-hint" aria-hidden="true"><span class="drag-arrow drag-arrow-left">←</span><strong>Arraste para os lados</strong><span class="drag-arrow drag-arrow-right">→</span></div></div>`}
  function goalComparison(){const current=Number(state.answers.weight),target=Number(state.answers.goalWeight);return `<div class="goal-comparison" aria-label="Comparação entre peso atual e peso desejado"><div><span>Peso atual</span><strong>${current?`${current} kg`:"—"}</strong></div><i>→</i><div class="goal-target"><span>Sua meta</span><strong>${target?`${target} kg`:"—"}</strong></div></div>`}
  const resultChart=()=>`<div class="result-promise"><span>Você chegará ao seu objetivo em</span><strong>4 semanas</strong></div><div class="result-chart"><svg viewBox="0 0 640 360" role="img" aria-label="Gráfico animado mostrando a evolução estimada até quatro semanas"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d63a31"/><stop offset=".52" stop-color="#f1b83d"/><stop offset="1" stop-color="#42b96b"/></linearGradient><linearGradient id="chartFill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#df6a62" stop-opacity=".72"/><stop offset=".52" stop-color="#f6d36e" stop-opacity=".68"/><stop offset="1" stop-color="#83d892" stop-opacity=".68"/></linearGradient></defs><g class="chart-grid"><line x1="70" y1="55" x2="570" y2="55"/><line x1="70" y1="116" x2="570" y2="116"/><line x1="70" y1="177" x2="570" y2="177"/><line x1="70" y1="238" x2="570" y2="238"/><line x1="70" y1="300" x2="570" y2="300"/><line x1="70" y1="55" x2="70" y2="300"/><line x1="320" y1="55" x2="320" y2="300"/><line x1="570" y1="55" x2="570" y2="300"/></g><g class="chart-labels"><text x="58" y="61">100</text><text x="58" y="122">75</text><text x="58" y="183">50</text><text x="58" y="244">25</text><text x="58" y="306">0</text><text class="chart-x" x="70" y="338">Hoje</text><text class="chart-x" x="320" y="338">2 semanas</text><text class="chart-x" x="570" y="338">4 semanas</text></g><path class="chart-area" d="M70 55 C180 88 245 133 320 177 C410 235 475 281 570 300 L570 300 L70 300 Z"/><path class="chart-line" d="M70 55 C180 88 245 133 320 177 C410 235 475 281 570 300"/><g class="chart-points"><circle class="chart-halo point-one" cx="70" cy="55" r="22"/><circle class="chart-dot point-one" cx="70" cy="55" r="10"/><circle class="chart-halo point-two" cx="320" cy="177" r="22"/><circle class="chart-dot point-two" cx="320" cy="177" r="11"/><circle class="chart-halo point-three" cx="570" cy="300" r="22"/><circle class="chart-dot point-three" cx="570" cy="300" r="10"/></g><g class="chart-you"><rect x="277" y="122" width="86" height="40" rx="10"/><text x="320" y="149">Você</text></g></svg></div>`;
  let stepLoadingId,stepLoadingAdvanceId;
  function startStepLoading(){const ring=document.querySelector("#loadingRing"),ringValue=document.querySelector("#loadingRingValue"),bar=document.querySelector("#loadingBar"),percent=document.querySelector("#loadingPercent"),status=document.querySelector("#loadingStatus");if(!ring||!ringValue||!bar||!percent||!status)return;const loadingStepId=steps[state.current].id,phases=["Analisando suas respostas...","Combinando suas preferências...","Montando seu plano personalizado...","Finalizando os últimos detalhes..."];const started=Date.now(),duration=3200;clearInterval(stepLoadingId);clearTimeout(stepLoadingAdvanceId);const update=()=>{const progress=Math.min(100,Math.round((Date.now()-started)/duration*100));ring.style.setProperty("--progress",progress);ring.setAttribute("aria-valuenow",String(progress));ringValue.textContent=`${progress}%`;bar.style.width=`${progress}%`;percent.textContent=`${progress}%`;status.textContent=phases[Math.min(phases.length-1,Math.floor(progress/26))];if(progress>=100){clearInterval(stepLoadingId);ring.classList.add("done");status.textContent="Plano personalizado concluído!";stepLoadingAdvanceId=setTimeout(()=>{if(steps[state.current]?.id===loadingStepId)next()},650)}};update();stepLoadingId=setInterval(update,40)}
  function renderStep(animate=true){animate=animate&&activeTrackedStep!==state.current;clearInterval(stepLoadingId);clearTimeout(stepLoadingAdvanceId);const s=steps[state.current];let h=`<h1>${esc(s.title)}</h1>${s.secondaryTitle?`<h2 class="secondary-title">${esc(s.secondaryTitle)}</h2>`:""}${s.subtitle?`<p class="lead">${esc(s.subtitle)}</p>`:""}`;
    if(["choice","multi","imageGrid"].includes(s.type)){const saved=new Set(Array.isArray(state.answers[s.id])?state.answers[s.id]:state.answers[s.id]?[state.answers[s.id]]:[]),image=s.type==="imageGrid";h+=`<div class="answers ${image?"image-grid":""} ${s.compactGrid?"compact-grid":""}">${s.options.map((x,i)=>option(x,i,saved.has(x.label),image,s.iconOptions)).join("")}</div>${s.type==="multi"?`<button class="continue-button" id="continue" ${saved.size?"":"disabled"}>Continuar</button>`:""}`}
    else if(s.type==="range")h+=ruler(s,state.answers[s.id]??s.value)+`<button class="continue-button" id="continue">Continuar</button>`;
    else if(s.type==="input")h+=`<label class="field-label" for="field">${esc(s.label)}</label><input class="field" id="field" type="${s.inputType}" value="${esc(state.answers[s.id]||"")}" placeholder="${esc(s.placeholder)}">${s.privacy?`<p class="privacy"><strong>Seus dados são protegidos.</strong><br>O e-mail será usado somente para informações relacionadas ao acesso.</p>`:""}<button class="continue-button" id="continue" disabled>Continuar</button>`;
    else if(s.type==="info")h=s.imageOnly?`<div class="info-image info-image-only">${asset(s.image,s.title)}</div><button class="continue-button" id="continue">Continuar</button>`:`${assetPath(s.image)?`<div class="info-image">${asset(s.image,s.title)}</div>`:""}<h1>${esc(s.title)}</h1><p class="info-copy">${esc(s.body)}</p>${s.id==="goalRegistered"?goalComparison():""}<button class="continue-button" id="continue">Continuar</button>`;
    else if(s.type==="result")h+=`${resultChart()}${testimonials(2,s.testimonialStart)}<button class="continue-button" id="continue">Continuar</button>`;
    else if(s.type==="loading")h=`<div class="loading-ring" id="loadingRing" style="--progress:0" role="progressbar" aria-label="Progresso da criação do plano" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="loadingRingValue">0%</span></div><h1>${esc(s.title)}</h1><div class="calculation"><div><span id="loadingBar" style="width:0%"></span></div><strong id="loadingPercent">0%</strong><p id="loadingStatus" aria-live="polite">${esc(s.body)}</p></div>${s.testimonials?testimonials(2,s.testimonialStart):""}`;
    app.innerHTML=`<main class="quiz-page">${top()}<section class="question-card ${animate?"step-enter":""}">${h}</section><footer>© 2026 ${esc(CONFIG.brand)}</footer></main>`;bind(s);window.scrollTo({top:0});trackStepView()}
  function next(){trackStepComplete();if(state.current===steps.length-1){sessionStorage.setItem("carnifit_completed","1");pixelOnce("quiz_completed","QuizCompleted",{},true);renderOffer();return}state.current++;persist();renderStep()}
  function bind(s){document.querySelector("#back")?.addEventListener("click",()=>{state.current=Math.max(0,state.current-1);persist();renderStep()});document.querySelectorAll("[data-option]").forEach(b=>b.addEventListener("click",()=>{if(s.id==="gender")pixelOnce("quiz_started","QuizStarted",{},true);const picked=s.options[Number(b.dataset.option)].label;if(s.type==="multi"){const saved=new Set(state.answers[s.id]||[]),exclusive=/nenhuma|não utilizo/i.test(picked);if(exclusive){saved.clear();saved.add(picked)}else{[...saved].filter(x=>/nenhuma|não utilizo/i.test(x)).forEach(x=>saved.delete(x));saved.has(picked)?saved.delete(picked):(!s.max||saved.size<s.max)&&saved.add(picked)}state.answers[s.id]=[...saved];persist();renderStep()}else{state.answers[s.id]=picked;persist();next()}}));const range=document.querySelector("#range");if(range){const stage=document.querySelector("#rulerStage"),syncRuler=()=>{document.querySelector("#rangeValue").textContent=range.value;document.querySelector("#rulerTape")?.style.setProperty("--ruler-offset",`${(Number(range.value)-s.min)*-15}px`);stage?.setAttribute("aria-valuenow",range.value)};range.addEventListener("input",syncRuler);if(stage){let dragging=false,startX=0,startValue=Number(range.value);const finish=()=>{dragging=false;stage.classList.remove("dragging")};stage.addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;startValue=Number(range.value);stage.classList.add("dragging");stage.setPointerCapture?.(e.pointerId);e.preventDefault()});stage.addEventListener("pointermove",e=>{if(!dragging)return;range.value=Math.max(s.min,Math.min(s.max,Math.round(startValue-(e.clientX-startX)/15)));syncRuler();e.preventDefault()});stage.addEventListener("pointerup",finish);stage.addEventListener("pointercancel",finish);stage.addEventListener("lostpointercapture",finish);stage.addEventListener("keydown",e=>{const amount=e.key==="ArrowRight"||e.key==="ArrowUp"?1:e.key==="ArrowLeft"||e.key==="ArrowDown"?-1:e.key==="PageUp"?10:e.key==="PageDown"?-10:0;if(!amount)return;e.preventDefault();range.value=Math.max(s.min,Math.min(s.max,Number(range.value)+amount));syncRuler()})}document.querySelector("#continue").addEventListener("click",()=>{state.answers[s.id]=Number(range.value);persist();next()})}const field=document.querySelector("#field");if(field){const btn=document.querySelector("#continue"),valid=()=>s.inputType==="email"?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()):field.value.trim().length>=2,sync=()=>btn.disabled=!valid();field.addEventListener("input",sync);sync();btn.addEventListener("click",()=>{if(!valid())return;state.answers[s.id]=field.value.trim();persist();next()})}if(["info","result","loading","multi"].includes(s.type))document.querySelector("#continue")?.addEventListener("click",next);if(s.type==="loading")startStepLoading()}
  function checkout(){const u=new URL(CONFIG.checkoutUrl);Object.entries(tracking).forEach(([k,v])=>v&&u.searchParams.set(k,v));return u.toString()}
  function personalizedPriorities(){
    const a=state.answers,candidates=[],add=(score,pain,solution)=>candidates.push({score,pain,solution});
    const target=Number(a.goalWeight),current=Number(a.weight);
    const goal=target?{pain:`Sua meta registrada: ${target} kg`,solution:`Você respondeu que quer chegar aos ${target} kg${current?` partindo de ${current} kg`:""}. Seu plano de 4 semanas foi organizado para ajudar você a avançar nessa direção.`}:{pain:"Sua meta de peso",solution:"Seu plano de 4 semanas organiza ações práticas para ajudar você a avançar em direção ao peso desejado."};
    if(a.weightHistory)add(95,"Dificuldade para manter o peso",`Você respondeu: “${a.weightHistory}”. A solução inclui uma estratégia de continuidade para tornar a rotina mais sustentável após as primeiras semanas.`);
    if(a.timeAway)add(/Mais de 3|Nunca/.test(a.timeAway)?90:/1 a 3/.test(a.timeAway)?78:55,"Tempo distante do peso desejado",`Você está ${a.timeAway.toLowerCase()} distante da sua meta. O plano divide o processo em passos menores para facilitar a retomada da constância.`);
    if(a.hungerTime)add(72,"Fome ao longo do dia",`Você sente mais fome no período da ${a.hungerTime.toLowerCase()}. As refeições serão organizadas para dar mais estrutura justamente nesse horário.`);
    if(a.eatingHabits)add(66,"Rotina alimentar atual",`Você contou que “${a.eatingHabits.toLowerCase()}”. O plano traz opções práticas alinhadas a esse comportamento para reduzir a dificuldade de seguir a rotina.`);
    if(a.sleep&&/Menos de 5|5 a 6|irregular/.test(a.sleep))add(/Menos de 5|irregular/.test(a.sleep)?88:76,"Sono abaixo do ideal",`Você dorme ${a.sleep.toLowerCase()}. O plano inclui uma meta diária de sono para ajudar a organizar melhor sua rotina.`);
    if(a.water&&/1 copo|2 a 3|4 a 5/.test(a.water))add(/1 copo/.test(a.water)?87:/2 a 3/.test(a.water)?79:68,"Baixo consumo de água",`Você bebe ${a.water.toLowerCase()} por dia. O plano inclui uma meta progressiva de hidratação fácil de acompanhar.`);
    const activity=a.dailyActivity||a.weeklyActivity;
    if(activity&&/parado|Pouco|nenhum|Levemente/.test(activity))add(/parado|Pouco|nenhum/.test(activity)?84:70,"Pouca atividade na rotina",`Você descreveu sua rotina como “${activity.toLowerCase()}”. O plano propõe metas simples e compatíveis com o seu nível atual.`);
    const allergies=(Array.isArray(a.allergies)?a.allergies:[]).filter(x=>!/^Nenhuma$/i.test(x));
    if(allergies.length)add(92,"Restrições alimentares informadas",`Você indicou ${allergies.join(", ").toLowerCase()}. As sugestões serão filtradas para respeitar essas restrições alimentares.`);
    if(a.currentSize&&a.desiredSize&&a.currentSize!==a.desiredSize)add(62,"Meta de tamanho de roupa",`Você quer sair do tamanho ${a.currentSize} e chegar ao ${a.desiredSize}. Essa meta ficará visível para facilitar o acompanhamento da evolução.`);
    const extraGoal=Array.isArray(a.secondaryGoal)?a.secondaryGoal[0]:a.secondaryGoal;
    if(extraGoal&&extraGoal!=="Ainda não pensei nisso")add(58,"Objetivo além do peso",`Você também quer ${extraGoal.toLowerCase()}. O plano considera esse objetivo na organização das metas da sua rotina.`);
    return [goal,...candidates.sort((x,y)=>y.score-x.score).slice(0,5)];
  }
  const FAQ_ITEMS=[
    {question:"O que terá nas minhas refeições ?",answer:["Sua dieta conterá tudo o que você precisa para alcançar e manter um corpo magro e em forma sem precisar monitorar calorias.","Ele será rico em proteínas e gorduras para fornecer ao seu corpo combustível a longo prazo e incentivá-lo a deixar de queimar açúcares para obter energia e começar a queimar gordura, derretendo os depósitos de gordura no seu corpo, fazendo com que você perca peso rapidamente."]},
    {question:"O que diferencia o plano Carnívora 40+ dos outros ?",answer:["Cada receita é cuidadosamente selecionada para você e verificada duas vezes por nossos nutricionistas para garantir que seu plano atenda às suas preferências e esteja alinhado com seus objetivos corporais.","Para torná-lo ainda mais eficaz, analisamos sua rotina e hábitos e levamos tudo isso em consideração, antes de criar a versão final do seu plano!"]},
    {question:"Em quanto tempo posso esperar ver resultados visíveis ?",answer:["Com Carnívora 40+, muitos de nossos usuários começam a ver resultados visíveis logo na primeira semana! Imagine subir na balança e ver esses números caírem ou notar como suas roupas vestem melhor em questão de dias.","Nosso plano alimentar é projetado para acelerar o seu metabolismo e a queima de gordura, para que você não precise esperar muito para vivenciar a transformação."]},
    {question:"Este plano de refeições é difícil de seguir ?",answer:["De jeito nenhum. Este plano foi preparado por nutricionistas e chefs profissionais para ser o mais simples de seguir possível.","Dentro do seu plano, você encontrará receitas detalhadas, listas de compras, informações calóricas e todas as dicas e truques para preparar refeições deliciosas e nutritivas que farão seu corpo perder quilos extras."]},
    {question:"Sentirei fome com o plano Carnívora 40+ ?",answer:["De jeito nenhum! As refeições com Carnívora 40+ são elaboradas para serem nutritivas e satisfatórias, mantendo você saciado por mais tempo. O alto teor de proteína e gordura das refeições ajuda a controlar a fome e reduzir os desejos, para que você continue no caminho certo sem se sentir privado."]},
    {question:"Preciso fazer exercícios com o plano Carnívora 40+ ?",answer:["Embora os exercícios possam melhorar seus resultados, eles não são necessários para obter sucesso com o Carnívora 40+. O plano alimentar por si só é eficaz para a perda de peso, mas adicionar atividade física pode ajudar a tonificar e acelerar seu progresso."]}
  ];
  const faq=()=>FAQ_ITEMS.map(item=>`<details><summary>${esc(item.question)}</summary>${item.answer.map(paragraph=>`<p>${esc(paragraph)}</p>`).join("")}</details>`).join("");
  const conditionIndicator=()=>`<div class="condition" aria-label="Comparação entre sua condição atual e seu potencial de consistência"><div class="condition-metric condition-current"><span>Sua condição atual</span><strong>25%</strong><div class="condition-bar" role="progressbar" aria-label="Condição atual: 25%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"><b class="condition-fill" style="--condition-progress:25%"></b></div></div><i class="condition-arrow" aria-hidden="true">→</i><div class="condition-metric condition-potential"><span>Seu potencial de consistência</span><strong>90%</strong><div class="condition-bar" role="progressbar" aria-label="Potencial de consistência: 90%" aria-valuemin="0" aria-valuemax="100" aria-valuenow="90"><b class="condition-fill" style="--condition-progress:90%"></b></div></div></div>`;
  const timer=()=>`<div class="offer-timer" role="timer" aria-label="Tempo desta sessão"><span class="timer-label">Tempo para concluir esta sessão</span><div class="timer-digits"><span><strong data-timer-minutes>${String(CONFIG.offerMinutes).padStart(2,"0")}</strong><small>min</small></span><b>:</b><span><strong data-timer-seconds>00</strong><small>seg</small></span></div></div>`;
  const buyBox=()=>`<div class="buy-box"><div class="price-kicker">ACESSO COMPLETO AO PLANO</div><div class="price-row"><div><span>Pagamento único</span><strong>${esc(CONFIG.price)}</strong><small>à vista</small></div><b>10% off</b></div><a class="buy-button" href="${esc(checkout())}">RECEBER O MEU PLANO ALIMENTAR</a><p class="secure-purchase">🔒 Compra segura e acesso após a confirmação do pagamento</p></div>`;
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
      <section class="offer-hero"><div class="offer-container offer-narrow">${logo()}${assetPath("offerEvolution")?`<div class="offer-progress-image">${asset("offerEvolution","Comparação visual entre a condição atual e a meta")}</div>`:""}${conditionIndicator()}${timer()}<h1>${name?`${name}, seu`:"Seu"} plano carnívoro personalizado está pronto!</h1><p class="hero-copy">Organizamos suas respostas em uma experiência prática para acompanhar pelo celular.</p>${buyBox()}</div></section>
      <section class="personalized-solutions-section"><div class="offer-container offer-narrow"><h3 class="included-title">O seu plano foi preparado para estas prioridades:</h3><p class="personalized-intro">Selecionamos os pontos mais importantes com base nas respostas que você acabou de fornecer.</p><ul class="inclusion-list personalized-list">${priorities.map(x=>`<li><span>✓</span><div><small>DOR IDENTIFICADA</small><strong>${esc(x.pain)}</strong><p>${esc(x.solution)}</p></div></li>`).join("")}</ul>${timer()}${buyBox()}</div></section>
      <section class="social-proof-section"><div class="offer-container offer-narrow"><p class="eyebrow">EXPERIÊNCIA EM DESTAQUE</p><h2>Veja a experiência de quem já começou</h2><div class="social-proof-stack"><div class="social-proof-photo">${asset("socialProofPhoto","Transformação compartilhada por cliente")}</div><div class="social-proof-comment">${commentImage(assetPath("socialProofComment"),"Comentário sobre a experiência com o plano Carnívora 40+")}</div></div><p class="social-proof-note">Resultados podem variar de pessoa para pessoa.</p>${timer()}${buyBox()}</div></section>
      <section class="customer-comments-section"><div class="offer-container"><p class="eyebrow">COMENTÁRIOS DE CLIENTES</p><h2>Mais experiências compartilhadas</h2><p class="customer-comments-intro">Veja outros comentários de pessoas que conheceram o plano Carnívora 40+.</p><div class="offer-comments">${testimonials(OFFER_COMMENT_NUMBERS.length,1,OFFER_COMMENT_NUMBERS)}</div><p class="social-proof-note">Depoimentos individuais. Resultados podem variar de pessoa para pessoa.</p></div></section>
      <section class="faq-section"><div class="offer-container offer-narrow"><h2>Ficou com alguma dúvida ?</h2><p class="centered">Veja as perguntas mais frequentes</p><div class="faq">${faq()}</div></div></section>
      <section><div class="offer-container offer-narrow guarantee"><div class="guarantee-image">${asset("guarantee","Selo de garantia de 30 dias")}</div><div class="guarantee-copy"><h2>Garantia de reembolso</h2><p>A compra deste material é totalmente sem risco para você.</p><p>Se ele não atender às suas expectativas nos primeiros 30 dias após a compra, nós reembolsaremos todo o valor que você pagou, sem fazer perguntas.</p><p>Basta enviar um e-mail para o suporte em <a href="mailto:carnivora40@gmail.com">carnivora40@gmail.com</a></p></div></div></section>
      <section class="last-call"><div class="offer-container offer-narrow"><p class="eyebrow">SEU PLANO JÁ ESTÁ PRONTO</p>${timer()}${buyBox()}</div></section>
      <footer>© 2026 ${esc(CONFIG.brand)}. Conteúdo educativo. Resultados variam.</footer>
    </main>`;
    pixelOnce("offer_viewed","ViewContent",{content_name:"Plano Carnívora 40+",content_type:"product",currency:"BRL",value:29.9});
    document.querySelectorAll(".buy-button").forEach(button=>button.addEventListener("click",()=>pixel("InitiateCheckout",{content_name:"Plano Carnívora 40+",currency:"BRL",value:29.9})));
    window.scrollTo({top:0});startOfferTimer();
  }
  if(location.hash==="#oferta"||sessionStorage.getItem("carnifit_completed")==="1")renderOffer();else renderStep();
})();
