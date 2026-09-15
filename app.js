(() => {
  "use strict";

  const CONFIG={checkoutUrl:"https://pay.wiapy.com/KX2LK3vXNU",brand:"Carnívora 40+",price:"R$ 29,90",offerMinutes:10,pixelId:"1253168553664712",utmifyScript:"https://cdn.utmify.com.br/scripts/utms/latest.js"};

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
    comments:Array.from({length:12},(_,i)=>`/assets/comments/comentario_${i+1}.webp`),
    macroInfo:"/assets/dieta-carnivora-80-20.jpeg",
    difference:"/assets/dieta-carnivora-diferente.jpeg",
    goal:"/assets/meta-peso.webp",
    foodInfo:"/assets/mais-de-100-receitas.jpeg",
    mealPlan:"/assets/plano-refeicoes.webp",
    faceChange:{Mulher:"/assets/inchaco-rosto-mulher.webp",Homem:"/assets/inchaco-rosto-homem.webp"},
    offerEvolution:{Mulher:"/assets/resultado-agora-meta-mulher.webp",Homem:"/assets/resultado-agora-meta-homem.webp"},
    visibleChange:{Mulher:"/assets/antes-depois-mulher.webp",Homem:"/assets/antes-depois-homem.webp"},
    guarantee:"/assets/garantia-30-dias.webp"
  };

  const FUNNEL_VERSION="34_steps_v2";
  const STORAGE_VERSION_KEY="carnifit_funnel_version";
  const KEYS=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","src"];
  const params=new URLSearchParams(location.search);
  let tracking={};
  try{tracking=JSON.parse(sessionStorage.getItem("carnifit_tracking")||"{}")}catch{}
  KEYS.forEach(k=>{if(params.get(k))tracking[k]=params.get(k)});
  try{sessionStorage.setItem("carnifit_tracking",JSON.stringify(tracking))}catch{}

  const queuedPixelEvents=new Set();
  const pixel=(event,data={},custom=false)=>{
    try{
      if(typeof window.fbq!=="function")return false;
      window.fbq(custom?"trackCustom":"track",event,data);
      return true;
    }catch{return false}
  };
  const pixelOnce=(key,event,data={},custom=false)=>{
    const storageKey=`carnifit_pixel_${key}`;
    if(queuedPixelEvents.has(storageKey))return;
    try{if(sessionStorage.getItem(storageKey))return}catch{}
    if(!pixel(event,data,custom))return;
    queuedPixelEvents.add(storageKey);
    try{sessionStorage.setItem(storageKey,"1")}catch{}
  };

  const c=(label,image="",emoji="")=>({label,image,emoji});
  const steps=[
    {id:"gender",type:"imageGrid",title:"Responda e receba seu plano carnívoro personalizado em apenas 2 minutos",subtitle:"Selecione seu gênero:",options:[c("Mulher","genderWoman"),c("Homem","genderMan")]},
    {id:"age",type:"imageGrid",title:"Qual é a sua idade hoje?",options:[c("Tenho entre 18 e 26 anos","age18"),c("Tenho entre 27 e 38 anos","age27"),c("Tenho entre 39 e 50 anos","age39"),c("Tenho mais de 50 anos","age50")]},
    {id:"primaryGoal",type:"choice",iconOptions:true,title:"O que mais fez você buscar a alimentação carnívora agora?",options:[c("Quero emagrecer e voltar a me sentir bem no espelho","goalAppearance"),c("Quero cuidar melhor da minha saúde","goalHealth"),c("Quero emagrecer e cuidar da saúde","goalBoth"),c("Tenho outro motivo")]},
    {id:"previousExperience",type:"choice",title:"Qual destas frases descreve melhor sua experiência com a alimentação carnívora?",options:[c("Já fiz e sei como funciona"),c("Conheço por cima, mas nunca fiz"),c("É a primeira vez que estou conhecendo"),c("Já tentei, mas não consegui manter")]},
    {id:"profileFeedback",type:"reward",reward:"profile",title:"Seu perfil já começou a tomar forma"},
    {id:"hungerTime",type:"choice",visual:true,title:"Em qual momento do dia a fome costuma apertar mais?",options:[c("Logo de manhã","","🌅"),c("No meio da tarde","","☀️"),c("À noite","","🌙"),c("Muda bastante de um dia para o outro","","🔄")]},
    {id:"favoriteMeal",type:"choice",title:"Qual refeição você mais gosta e faria questão de manter prazerosa?",options:[c("Café da manhã","","☕"),c("Almoço","","🍽️"),c("Jantar","","🌙"),c("Lanches","","🥪"),c("Não tenho uma preferida","","🤷")]},
    {id:"weightHistory",type:"choice",title:"Quando você consegue perder peso, o que costuma acontecer depois?",options:[c("Consigo manter por bastante tempo"),c("Perco, mas acabo recuperando uma parte"),c("Meu peso vive subindo e descendo"),c("Ainda não consegui chegar ao peso que desejo")]},
    {id:"profileReward",type:"reward",reward:"profileComplete",image:"difference",title:"Primeira fase concluída"},
    {id:"height",type:"range",title:"Qual é a sua altura?",lead:"Arraste a fita até o valor mais próximo.",min:140,max:220,value:180,unit:"cm",altUnit:"pol"},
    {id:"weight",type:"range",title:"Quanto você pesa hoje, aproximadamente?",lead:"Arraste a fita até o valor mais próximo.",min:40,max:250,value:70,unit:"kg",altUnit:"lb"},
    {id:"goalWeight",type:"range",title:"Qual peso você gostaria de alcançar?",lead:"Escolha uma meta que faça sentido para você neste momento.",min:40,max:250,value:65,unit:"kg",altUnit:"lb"},
    {id:"goalRegistered",type:"info",image:"goal",title:"Você definiu uma meta clara e possível de acompanhar",body:"Agora vamos considerar sua rotina e suas preferências."},
    {id:"name",type:"input",title:"Vamos deixar seu resultado com a sua cara",secondaryTitle:"Como você prefere ser chamado(a)?",label:"Nome",placeholder:"Digite seu primeiro nome",inputType:"text"},
    {id:"preview",type:"result",title:"Com base nas suas respostas:",body:"Você chegará ao seu objetivo em 4 semanas.",testimonials:true,testimonialStart:1,personalizedTitle:true},
    {id:"weeklyActivity",type:"choice",title:"Pensando em uma semana normal, quanto você costuma se movimentar?",options:[c("Quase não faço exercícios"),c("Faço 1 ou 2 treinos por semana"),c("Faço de 3 a 5 treinos por semana"),c("Treino quase todos os dias"),c("Tenho uma rotina de trabalho bem puxada fisicamente")]},
    {id:"timeAway",type:"choice",title:"Há quanto tempo você sente que está longe do peso em que gostaria de estar?",options:[c("Há menos de 1 ano"),c("Entre 1 e 3 anos"),c("Há mais de 3 anos"),c("Nunca cheguei ao peso que realmente desejo")]},
    {id:"currentSize",type:"choice",compactGrid:true,title:"Hoje, qual tamanho costuma ficar mais confortável em você?",options:[c("XXXL ou maior","","👕"),c("XXXL","","👕"),c("XXG","","👕"),c("GG","","👕"),c("G","","👕"),c("M","","👕"),c("P ou menor","","👕")]},
    {id:"desiredSize",type:"choice",compactGrid:true,title:"Qual tamanho você gostaria de voltar a usar ou passar a usar?",options:[c("XXXL ou maior","","✨"),c("XXXL","","✨"),c("XXG","","✨"),c("GG","","✨"),c("G","","✨"),c("M","","✨"),c("P ou menor","","✨")]},
    {id:"partialCalculation",type:"loading",title:"Calculando seu plano alimentar",body:"Organizando suas respostas...",testimonials:true,testimonialStart:3},
    {id:"eatingHabits",type:"choice",title:"Qual destas frases mais parece com a sua alimentação hoje?",options:[c("Acabo comendo quase sempre as mesmas coisas"),c("Uso os mesmos alimentos, mas tento variar o preparo"),c("Vou revezando alguns pratos de que já gosto"),c("Como de tudo e gosto de bastante variedade"),c("Minha alimentação muda muito; não sei definir")]},
    {id:"preferencesReward",type:"reward",reward:"preferences",image:"foodInfo",title:"Mais de 100 receitas deliciosas"},
    {id:"foodPreferences",type:"multi",max:5,title:"Quais destes alimentos e proteínas você realmente gostaria de encontrar no seu plano?",lead:"Escolha até 5.",options:[c("Carne bovina","","🥩"),c("Carne suína","","🥓"),c("Frango","","🍗"),c("Peixes","","🐟"),c("Ovos","","🥚"),c("Queijos e outros laticínios","","🧀"),c("Manteiga","","🧈"),c("Cordeiro","","🍖"),c("Miúdos, como fígado e coração","","🍖"),c("Peru","","🍗"),c("Quero manter alguma opção vegetal","","🌱"),c("Nenhum destes","","🚫")]},
    {id:"allergies",type:"multi",title:"Tem algum alimento que seu corpo não aceita bem ou que você precisa evitar?",lead:"Você pode marcar mais de uma opção.",options:[c("Não tenho restrições","","✅"),c("Lactose","","🥛"),c("Castanhas e outras oleaginosas","","🥜"),c("Frutos do mar","","🦐"),c("Proteína do leite","","🥛"),c("Ovos ou proteína do ovo","","🥚"),c("Mel","","🍯"),c("Frutas cítricas","","🍊"),c("Outra restrição","","⚠️"),c("Prefiro não responder","","🔒")]},
    {id:"combinationsReward",type:"reward",reward:"combinations",image:"mealPlan",title:"Seu plano de refeições está sendo organizado"},
    {id:"sleep",type:"choice",visual:true,visualStyle:"level",title:"Em uma noite comum, quantas horas você consegue dormir?",options:[c("Mais de 8 horas","","4"),c("Entre 7 e 8 horas","","3"),c("Entre 5 e 6 horas","","2"),c("Menos de 5 horas ou meu sono é bem irregular","","1")]},
    {id:"water",type:"choice",visual:true,visualStyle:"water",title:"Em um dia comum, quanta água você costuma beber?",options:[c("Quase não lembro de beber água — 1 copo ou menos","","💧"),c("De 2 a 3 copos","","💧💧"),c("De 4 a 5 copos","","💧💧💧"),c("De 6 a 7 copos","","💧💧💧💧"),c("8 copos ou mais","","💧💧💧💧💧")]},
    {id:"dailyActivity",type:"choice",visual:true,title:"Fora dos exercícios, como costuma ser o seu dia?",options:[c("Passo boa parte do dia sentado(a) e quase não caminho","","🪑"),c("Caminho um pouco e alterno entre ficar sentado(a) e em pé","","🚶"),c("Fico em movimento ou faço esforço físico boa parte do dia","","🏃"),c("Depende muito: tenho dias parados e dias bem corridos","","🔄")]},
    {id:"medications",type:"multi",title:"Hoje você usa algum destes medicamentos ou suplementos?",lead:"Marque todas as opções que se aplicam.",options:[c("Antibiótico"),c("Medicamento para ansiedade"),c("Hormônios"),c("Vitaminas ou suplementos"),c("Outro"),c("Não uso nenhum destes"),c("Prefiro não responder")]},
    {id:"conditions",type:"multi",title:"Algum profissional de saúde já informou que você tem uma destas condições?",lead:"Marque todas as opções que se aplicam.",note:"Suas respostas ajudam apenas a organizar a experiência e não substituem orientação profissional.",options:[c("Diabetes"),c("Refluxo"),c("Apneia do sono"),c("Pressão alta"),c("Colesterol alto"),c("Problemas renais"),c("Estou me recuperando de uma cirurgia"),c("Nenhuma destas"),c("Prefiro não responder")]},
    {id:"secondaryGoal",type:"multi",title:"Além do peso, o que faria você sentir que esse plano valeu a pena?",lead:"Você pode escolher mais de uma opção.",options:[c("Ter fôlego para correr ou caminhar mais"),c("Voltar a gostar do que vejo no espelho"),c("Ter mais disposição no dia a dia"),c("Dormir melhor"),c("Sentir-me preparado(a) para um evento"),c("Sentir-me mais confortável no meu corpo"),c("Criar uma rotina mais ativa"),c("Ainda não pensei nisso")]},
    {id:"bodyReward",type:"reward",reward:"body",image:"faceChange",title:"Análise corporal concluída"},
    {id:"motivation",type:"result",title:"Com motivação e persistência, você pode alcançar seu objetivo até mais rápido do que imagina!",body:"Você chegará ao seu objetivo em 4 semanas.",testimonials:true,testimonialStart:5},
    {id:"building",type:"loading",title:"Criando seu plano personalizado",body:"Preparando uma sequência com base nas respostas fornecidas...",testimonials:true,testimonialStart:7}
  ];

  let versionChanged=false;
  try{
    const previousVersion=sessionStorage.getItem(STORAGE_VERSION_KEY);
    versionChanged=previousVersion!==FUNNEL_VERSION;
    if(versionChanged){
      sessionStorage.setItem(STORAGE_VERSION_KEY,FUNNEL_VERSION);
      sessionStorage.setItem("carnifit_step","0");
      sessionStorage.setItem("carnifit_answers","{}");
      sessionStorage.setItem("carnifit_completed","0");
    }
  }catch{}

  let initialAnswers={};
  let initialStep=0;
  try{initialAnswers=JSON.parse(sessionStorage.getItem("carnifit_answers")||"{}")}catch{}
  try{initialStep=Number(sessionStorage.getItem("carnifit_step")||0)}catch{}
  if(!Number.isInteger(initialStep)||initialStep<0||initialStep>=steps.length)initialStep=0;
  const state={current:initialStep,answers:initialAnswers&&typeof initialAnswers==="object"?initialAnswers:{}};
  const app=document.querySelector("#app");
  const esc=(v="")=>String(v).replace(/[&<>'"]/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#039;",'"':"&quot;"})[x]);
  const persist=()=>{try{sessionStorage.setItem("carnifit_step",String(state.current));sessionStorage.setItem("carnifit_answers",JSON.stringify(state.answers))}catch{}};

  let activeTrackedStep=-1,stepEnteredAt=0;
  function stepEventData(){
    const data={funnel_version:FUNNEL_VERSION,step_number:state.current+1,steps_total:steps.length};
    if(/^\d{5,30}$/.test(tracking.utm_content||""))data.ad_id=tracking.utm_content;
    return data;
  }
  function trackStepView(){
    if(activeTrackedStep!==state.current){activeTrackedStep=state.current;stepEnteredAt=Date.now()}
    const number=String(state.current+1).padStart(2,"0");
    pixelOnce(`${FUNNEL_VERSION}_step_${number}_viewed`,`QuizV2Step${number}Viewed`,stepEventData(),true);
  }
  function trackStepComplete(){
    const number=String(state.current+1).padStart(2,"0"),data=stepEventData();
    if(activeTrackedStep===state.current)data.elapsed_seconds=Math.max(0,Math.round((Date.now()-stepEnteredAt)/100)/10);
    trackStepView();
    pixelOnce(`${FUNNEL_VERSION}_step_${number}_completed`,`QuizV2Step${number}Completed`,data,true);
  }

  function assetPath(slot){const value=ASSETS[slot];return typeof value==="string"?value:value?.[state.answers.gender]||""}
  const asset=(slot,label="Imagem")=>assetPath(slot)?`<img class="step-image" src="${esc(assetPath(slot))}" alt="${esc(label)}" decoding="async">`:`<div class="asset-slot" data-asset-slot="${esc(slot)}"><span>${esc(label)}</span></div>`;
  const logo=()=>ASSETS.logo?`<div class="brand-lockup"><img class="brand-image" src="${esc(ASSETS.logo)}" alt="${esc(CONFIG.brand)}" width="768" height="512" decoding="async"></div>`:`<div class="brand-word">${esc(CONFIG.brand)}</div>`;

  const top=()=>`<div class="top-area"><button class="back-button" id="back" aria-label="Voltar" ${state.current===0?"hidden":""}>←</button><div class="brand-area">${logo()}</div><div class="progress-track" aria-label="Progresso do quiz"><span style="width:${(state.current+1)/steps.length*100}%"></span></div></div>`;

  const option=(x,i,selected,image,icon,visual=false,visualStyle="")=>`<button class="answer ${selected?"selected":""} ${image?"image-answer":""} ${icon&&x.image?"icon-answer":""} ${x.emoji?"emoji-answer":""} ${visual?"visual-answer":""} ${visualStyle==="level"?"visual-level":""} ${visualStyle==="water"?"visual-water":""}" data-option="${i}" aria-pressed="${selected}">${image?`<div class="answer-image">${asset(x.image,"")}</div>`:icon&&x.image?`<span class="mini-picture">${asset(x.image,"")}</span>`:x.emoji?`<span class="answer-emoji" aria-hidden="true">${esc(x.emoji)}</span>`:""}<span class="answer-label">${esc(x.label)}</span><span class="answer-check">✓</span></button>`;
  const testimonials=(amount=2,start=1,selection=[])=>`<section class="testimonial-area"><h2>O que as pessoas dizem:</h2><div class="testimonial-grid">${Array.from({length:amount},(_,i)=>{const number=selection[i]??(start+i),path=ASSETS.comments[number-1];return `<article class="testimonial-slot"><img src="${esc(path)}" alt="Comentário ${number} sobre a experiência com o plano Carnívora 40+" width="720" height="480" loading="lazy" decoding="async"></article>`}).join("")}</div></section>`;

  function ruler(s,v){let ticks="";for(let n=s.min;n<=s.max;n++){const major=n%10===0,medium=!major&&n%5===0;ticks+=`<span class="ruler-tick ${major?"major":medium?"medium":"minor"}"><i></i>${major?`<b>${n}</b>`:""}</span>`}return `<div class="unit-toggle"><button class="active" type="button">${s.unit}</button><button type="button">${s.altUnit}</button></div><div class="ruler-wrap"><div class="range-bubble"><strong id="rangeValue">${v}</strong>${s.unit}</div><div class="ruler-stage" id="rulerStage" tabindex="0" role="slider" aria-label="${esc(s.title)}" aria-valuemin="${s.min}" aria-valuemax="${s.max}" aria-valuenow="${v}"><div class="ruler-tape" id="rulerTape" style="--ruler-offset:${(v-s.min)*-15}px" aria-hidden="true">${ticks}</div><div class="ruler-marker" aria-hidden="true"><span></span></div><input id="range" type="range" min="${s.min}" max="${s.max}" step="1" value="${v}" aria-hidden="true" tabindex="-1"></div><div class="drag-hint" aria-hidden="true"><span class="drag-arrow drag-arrow-left">←</span><strong>Arraste para os lados</strong><span class="drag-arrow drag-arrow-right">→</span></div></div>`}
  function goalComparison(){const current=Number(state.answers.weight),target=Number(state.answers.goalWeight);return `<div class="goal-comparison" aria-label="Comparação entre peso atual e peso desejado"><div><span>Peso atual</span><strong>${current?`${current} kg`:"—"}</strong></div><i>→</i><div class="goal-target"><span>Sua meta</span><strong>${target?`${target} kg`:"—"}</strong></div></div>`}
  const resultChart=()=>`<div class="result-promise"><span>Você chegará ao seu objetivo em</span><strong>4 semanas</strong></div><div class="result-chart"><svg viewBox="0 0 640 360" role="img" aria-label="Gráfico animado mostrando a evolução estimada até quatro semanas"><defs><linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d63a31"/><stop offset=".52" stop-color="#f1b83d"/><stop offset="1" stop-color="#42b96b"/></linearGradient><linearGradient id="chartFill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#df6a62" stop-opacity=".72"/><stop offset=".52" stop-color="#f6d36e" stop-opacity=".68"/><stop offset="1" stop-color="#83d892" stop-opacity=".68"/></linearGradient></defs><g class="chart-grid"><line x1="70" y1="55" x2="570" y2="55"/><line x1="70" y1="116" x2="570" y2="116"/><line x1="70" y1="177" x2="570" y2="177"/><line x1="70" y1="238" x2="570" y2="238"/><line x1="70" y1="300" x2="570" y2="300"/><line x1="70" y1="55" x2="70" y2="300"/><line x1="320" y1="55" x2="320" y2="300"/><line x1="570" y1="55" x2="570" y2="300"/></g><g class="chart-labels"><text x="58" y="61">100</text><text x="58" y="122">75</text><text x="58" y="183">50</text><text x="58" y="244">25</text><text x="58" y="306">0</text><text class="chart-x" x="70" y="338">Hoje</text><text class="chart-x" x="320" y="338">2 semanas</text><text class="chart-x" x="570" y="338">4 semanas</text></g><path class="chart-area" d="M70 55 C180 88 245 133 320 177 C410 235 475 281 570 300 L570 300 L70 300 Z"/><path class="chart-line" d="M70 55 C180 88 245 133 320 177 C410 235 475 281 570 300"/><g class="chart-points"><circle class="chart-halo point-one" cx="70" cy="55" r="22"/><circle class="chart-dot point-one" cx="70" cy="55" r="10"/><circle class="chart-halo point-two" cx="320" cy="177" r="22"/><circle class="chart-dot point-two" cx="320" cy="177" r="11"/><circle class="chart-halo point-three" cx="570" cy="300" r="22"/><circle class="chart-dot point-three" cx="570" cy="300" r="10"/></g><g class="chart-you"><rect x="277" y="122" width="86" height="40" rx="10"/><text x="320" y="149">Você</text></g></svg></div>`;

  function profileFeedback(){
    const a=state.answers;
    const items=[];
    if(a.primaryGoal)items.push(`Seu foco principal: ${a.primaryGoal}`);
    if(a.previousExperience)items.push(`Sua experiência: ${a.previousExperience}`);
    if(a.age)items.push(`Faixa informada: ${a.age}`);
    return `<div class="reward-badge"><span>✓</span> PERFIL IDENTIFICADO</div><h1>Seu perfil já começou a tomar forma</h1><p class="info-copy reward-copy">As próximas perguntas vão ajustar a meta e a rotina ao que você acabou de responder.</p><ul class="reward-list">${items.slice(0,3).map(x=>`<li><span>✓</span>${esc(x)}</li>`).join("")}</ul><button class="continue-button" id="continue">Continuar</button>`;
  }
  function rewardHtml(s){
    if(s.reward==="profile")return profileFeedback();
    if(s.reward==="profileComplete")return `<div class="reward-badge"><span>✓</span> FASE PERFIL CONCLUÍDA</div><div class="info-image reward-image">${asset(s.image,"Perfil concluído")}</div><h1>A primeira parte está pronta</h1><p class="info-copy reward-copy">Agora vamos registrar sua meta para deixar o plano mais específico para você.</p><button class="continue-button" id="continue">Continuar</button>`;
    if(s.reward==="preferences")return `<div class="reward-badge"><span>✓</span> PREFERÊNCIAS LIBERADAS</div><div class="info-image reward-image">${asset(s.image,s.title)}</div><h1>${esc(s.title)}</h1><p class="info-copy reward-copy">Agora vamos filtrar essas possibilidades pelos alimentos que você realmente gosta.</p><button class="continue-button" id="continue">Continuar</button>`;
    if(s.reward==="combinations"){
      const foods=Array.isArray(state.answers.foodPreferences)?state.answers.foodPreferences:[];
      const restrictions=(Array.isArray(state.answers.allergies)?state.answers.allergies:[]).filter(x=>!/Não tenho restrições|Prefiro não responder/i.test(x));
      const lines=[foods.length?`${foods.length} preferência${foods.length>1?"s":""} alimentar${foods.length>1?"es":""} registrada${foods.length>1?"s":""}`:"Preferências alimentares registradas",restrictions.length?`${restrictions.length} restrição${restrictions.length>1?"ões":""} considerada${restrictions.length>1?"s":""}`:"Nenhuma restrição alimentar informada"];
      return `<div class="reward-badge"><span>✓</span> COMBINAÇÕES ENCONTRADAS</div><div class="info-image reward-image">${asset(s.image,s.title)}</div><h1>${esc(s.title)}</h1><ul class="reward-list">${lines.map(x=>`<li><span>✓</span>${esc(x)}</li>`).join("")}</ul><button class="continue-button" id="continue">Continuar</button>`;
    }
    if(s.reward==="body")return `<div class="reward-badge"><span>✓</span> ANÁLISE CONCLUÍDA</div><div class="info-image info-image-only reward-image">${asset(s.image,"Análise corporal concluída")}</div><h1>Seus dados principais já foram analisados</h1><p class="info-copy reward-copy">Meta, rotina e preferências estão prontas. Falta só confirmar sua motivação antes de montar o plano final.</p><button class="continue-button" id="continue">Continuar</button>`;
    return `<h1>${esc(s.title)}</h1><button class="continue-button" id="continue">Continuar</button>`;
  }

  let stepLoadingId,stepLoadingAdvanceId;
  function startStepLoading(){const ring=document.querySelector("#loadingRing"),ringValue=document.querySelector("#loadingRingValue"),bar=document.querySelector("#loadingBar"),percent=document.querySelector("#loadingPercent"),status=document.querySelector("#loadingStatus");if(!ring||!ringValue||!bar||!percent||!status)return;const loadingStepId=steps[state.current].id,phases=["Analisando suas respostas...","Combinando suas preferências...","Montando seu plano personalizado...","Finalizando os últimos detalhes..."];const started=Date.now(),duration=3200;clearInterval(stepLoadingId);clearTimeout(stepLoadingAdvanceId);const update=()=>{const progress=Math.min(100,Math.round((Date.now()-started)/duration*100));ring.style.setProperty("--progress",progress);ring.setAttribute("aria-valuenow",String(progress));ringValue.textContent=`${progress}%`;bar.style.width=`${progress}%`;percent.textContent=`${progress}%`;status.textContent=phases[Math.min(phases.length-1,Math.floor(progress/26))];if(progress>=100){clearInterval(stepLoadingId);ring.classList.add("done");status.textContent="Plano personalizado concluído!";stepLoadingAdvanceId=setTimeout(()=>{if(steps[state.current]?.id===loadingStepId)next()},650)}};update();stepLoadingId=setInterval(update,40)}

  function renderStep(animate=true){
    animate=animate&&activeTrackedStep!==state.current;
    clearInterval(stepLoadingId);clearTimeout(stepLoadingAdvanceId);
    const s=steps[state.current];
    const dynamicTitle=s.personalizedTitle&&state.answers.name?`${String(state.answers.name).split(" ")[0]}, com base nas suas respostas:`:s.title;
    let h=`<h1>${esc(dynamicTitle)}</h1>${s.secondaryTitle?`<h2 class="secondary-title">${esc(s.secondaryTitle)}</h2>`:""}${s.subtitle?`<p class="lead">${esc(s.subtitle)}</p>`:""}${s.lead?`<p class="lead">${esc(s.lead)}</p>`:""}`;
    if(["choice","multi","imageGrid"].includes(s.type)){
      const saved=new Set(Array.isArray(state.answers[s.id])?state.answers[s.id]:state.answers[s.id]?[state.answers[s.id]]:[]),image=s.type==="imageGrid";
      h+=`<div class="answers ${image?"image-grid":""} ${s.compactGrid?"compact-grid":""} ${s.visual?"visual-grid":""} ${s.visualStyle==="water"?"visual-grid-water":""}">${s.options.map((x,i)=>option(x,i,saved.has(x.label),image,s.iconOptions,s.visual,s.visualStyle)).join("")}</div>${s.note?`<p class="privacy">${esc(s.note)}</p>`:""}${s.type==="multi"?`<button class="continue-button" id="continue" ${saved.size?"":"disabled"}>Continuar</button>`:""}`;
    }else if(s.type==="range")h+=ruler(s,state.answers[s.id]??s.value)+`<button class="continue-button" id="continue">Continuar</button>`;
    else if(s.type==="input")h+=`<label class="field-label" for="field">${esc(s.label)}</label><input class="field" id="field" type="${s.inputType}" value="${esc(state.answers[s.id]||"")}" placeholder="${esc(s.placeholder)}"><button class="continue-button" id="continue" disabled>Continuar</button>`;
    else if(s.type==="info")h=s.imageOnly?`<div class="info-image info-image-only">${asset(s.image,s.title)}</div><button class="continue-button" id="continue">Continuar</button>`:`${assetPath(s.image)?`<div class="info-image">${asset(s.image,s.title)}</div>`:""}<h1>${esc(s.title)}</h1><p class="info-copy">${esc(s.body)}</p>${s.id==="goalRegistered"?goalComparison():""}<button class="continue-button" id="continue">Continuar</button>`;
    else if(s.type==="reward")h=rewardHtml(s);
    else if(s.type==="result")h+=`${resultChart()}${testimonials(2,s.testimonialStart)}<button class="continue-button" id="continue">Continuar</button>`;
    else if(s.type==="loading")h=`<div class="loading-ring" id="loadingRing" style="--progress:0" role="progressbar" aria-label="Progresso da criação do plano" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="loadingRingValue">0%</span></div><h1>${esc(s.title)}</h1><div class="calculation"><div><span id="loadingBar" style="width:0%"></span></div><strong id="loadingPercent">0%</strong><p id="loadingStatus" aria-live="polite">${esc(s.body)}</p></div>${s.testimonials?testimonials(2,s.testimonialStart):""}`;
    app.innerHTML=`<main class="quiz-page">${top()}<section class="question-card ${animate?"step-enter":""}">${h}</section><footer>© 2026 ${esc(CONFIG.brand)}</footer></main>`;
    bind(s);window.scrollTo({top:0});trackStepView();
  }

  function next(){
    trackStepComplete();
    if(state.current===steps.length-1){
      try{sessionStorage.setItem("carnifit_completed","1")}catch{}
      pixelOnce(`${FUNNEL_VERSION}_quiz_completed`,"QuizV2Completed",{},true);
      renderOffer();return;
    }
    state.current++;persist();renderStep();
  }

  const isExclusiveAnswer=value=>/nenhum|nenhuma|não uso|não utilizo|prefiro não responder/i.test(value);
  function syncMultiUI(s){
    const saved=new Set(state.answers[s.id]||[]);
    document.querySelectorAll("[data-option]").forEach(b=>{const picked=s.options[Number(b.dataset.option)].label,selected=saved.has(picked);b.classList.toggle("selected",selected);b.setAttribute("aria-pressed",String(selected))});
    const btn=document.querySelector("#continue");if(btn)btn.disabled=saved.size===0;
  }
  function bind(s){
    document.querySelector("#back")?.addEventListener("click",()=>{state.current=Math.max(0,state.current-1);persist();renderStep()});
    document.querySelectorAll("[data-option]").forEach(b=>b.addEventListener("click",()=>{
      const picked=s.options[Number(b.dataset.option)].label;
      if(s.type==="multi"){
        const saved=new Set(state.answers[s.id]||[]),exclusive=isExclusiveAnswer(picked);
        if(exclusive){saved.clear();saved.add(picked)}
        else{[...saved].filter(isExclusiveAnswer).forEach(x=>saved.delete(x));saved.has(picked)?saved.delete(picked):(!s.max||saved.size<s.max)&&saved.add(picked)}
        state.answers[s.id]=[...saved];persist();b.classList.add("just-selected");setTimeout(()=>b.classList.remove("just-selected"),360);syncMultiUI(s);return;
      }
      if(s.id==="gender")pixelOnce(`${FUNNEL_VERSION}_quiz_started`,"QuizV2Started",{},true);
      state.answers[s.id]=picked;persist();
      b.classList.add("selected","just-selected");b.setAttribute("aria-pressed","true");
      next();
    }));

    const range=document.querySelector("#range");
    if(range){
      const stage=document.querySelector("#rulerStage"),syncRuler=()=>{document.querySelector("#rangeValue").textContent=range.value;document.querySelector("#rulerTape")?.style.setProperty("--ruler-offset",`${(Number(range.value)-s.min)*-15}px`);stage?.setAttribute("aria-valuenow",range.value);state.answers[s.id]=Number(range.value);persist()};
      range.addEventListener("input",syncRuler);
      if(stage){let dragging=false,startX=0,startValue=Number(range.value);const finish=()=>{dragging=false;stage.classList.remove("dragging")};stage.addEventListener("pointerdown",e=>{dragging=true;startX=e.clientX;startValue=Number(range.value);stage.classList.add("dragging");stage.setPointerCapture?.(e.pointerId);e.preventDefault()});stage.addEventListener("pointermove",e=>{if(!dragging)return;range.value=Math.max(s.min,Math.min(s.max,Math.round(startValue-(e.clientX-startX)/15)));syncRuler();e.preventDefault()});stage.addEventListener("pointerup",finish);stage.addEventListener("pointercancel",finish);stage.addEventListener("lostpointercapture",finish);stage.addEventListener("keydown",e=>{const amount=e.key==="ArrowRight"||e.key==="ArrowUp"?1:e.key==="ArrowLeft"||e.key==="ArrowDown"?-1:e.key==="PageUp"?10:e.key==="PageDown"?-10:0;if(!amount)return;e.preventDefault();range.value=Math.max(s.min,Math.min(s.max,Number(range.value)+amount));syncRuler()})}
      document.querySelector("#continue")?.addEventListener("click",()=>{state.answers[s.id]=Number(range.value);persist();next()});
    }

    const field=document.querySelector("#field");
    if(field){const btn=document.querySelector("#continue"),valid=()=>field.value.trim().length>=2,sync=()=>{state.answers[s.id]=field.value.trim();persist();btn.disabled=!valid()};field.addEventListener("input",sync);sync();btn.addEventListener("click",()=>{if(valid())next()})}
    if(["info","result","reward","multi"].includes(s.type))document.querySelector("#continue")?.addEventListener("click",next);
    if(s.type==="loading")startStepLoading();
  }

  function checkout(){const u=new URL(CONFIG.checkoutUrl);Object.entries(tracking).forEach(([k,v])=>v&&u.searchParams.set(k,v));return u.toString()}
  function personalizedPriorities(){
    const a=state.answers,candidates=[],add=(score,pain,solution)=>candidates.push({score,pain,solution});
    const target=Number(a.goalWeight),current=Number(a.weight);
    const goal=target?{pain:`Sua meta registrada: ${target} kg`,solution:`Você respondeu que quer chegar aos ${target} kg${current?` partindo de ${current} kg`:""}. Seu plano de 4 semanas foi organizado para ajudar você a avançar nessa direção.`}:{pain:"Sua meta de peso",solution:"Seu plano de 4 semanas organiza ações práticas para ajudar você a avançar em direção ao peso desejado."};
    if(a.weightHistory&&/recuperando|subindo e descendo|não consegui/i.test(a.weightHistory))add(95,"Dificuldade para manter o peso",`Você respondeu: “${a.weightHistory}”. A solução inclui uma estratégia de continuidade para tornar a rotina mais sustentável após as primeiras semanas.`);
    if(a.timeAway)add(/mais de 3|Nunca/.test(a.timeAway)?90:/1 e 3/.test(a.timeAway)?78:55,"Tempo distante do peso desejado",`Você respondeu que está ${a.timeAway.toLowerCase()}. O plano divide o processo em passos menores para facilitar a retomada da constância.`);
    if(a.hungerTime)add(72,"Fome ao longo do dia",`Você contou que a fome costuma apertar ${a.hungerTime.toLowerCase()}. As refeições serão organizadas para dar mais estrutura nesse momento do dia.`);
    if(a.eatingHabits)add(66,"Rotina alimentar atual",`Você contou que “${a.eatingHabits.toLowerCase()}”. O plano traz opções práticas alinhadas a esse comportamento para reduzir a dificuldade de seguir a rotina.`);
    if(a.sleep&&/Menos de 5|Entre 5 e 6|irregular/.test(a.sleep))add(/Menos de 5|irregular/.test(a.sleep)?88:76,"Sono abaixo do ideal",`Você informou: ${a.sleep.toLowerCase()}. O plano inclui uma meta diária de sono para ajudar a organizar melhor sua rotina.`);
    if(a.water&&/1 copo|2 a 3|4 a 5/.test(a.water))add(/1 copo/.test(a.water)?87:/2 a 3/.test(a.water)?79:68,"Baixo consumo de água",`Você informou que costuma beber ${a.water.toLowerCase()}. O plano inclui uma meta progressiva de hidratação fácil de acompanhar.`);
    const activity=a.dailyActivity||a.weeklyActivity;
    if(activity&&/sentado|Quase não|1 ou 2/.test(activity))add(/sentado|Quase não/.test(activity)?84:70,"Pouca atividade na rotina",`Você descreveu sua rotina como “${activity.toLowerCase()}”. O plano propõe metas simples e compatíveis com o seu nível atual.`);
    const allergies=(Array.isArray(a.allergies)?a.allergies:[]).filter(x=>!/Não tenho restrições|Prefiro não responder/i.test(x));
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
    const student=state.answers.gender==="Homem"?"aluno":"aluna";
    app.innerHTML=`<main class="offer-page">
      <section class="offer-hero"><div class="offer-container offer-narrow">${logo()}${assetPath("offerEvolution")?`<div class="offer-progress-image">${asset("offerEvolution","Comparação visual entre a condição atual e a meta")}</div>`:""}${conditionIndicator()}${timer()}<h1>${name?`${name}, seu`:"Seu"} plano carnívoro personalizado está pronto!</h1><p class="hero-copy">Organizamos suas respostas em uma experiência prática para acompanhar pelo celular.</p>${buyBox()}</div></section>
      <section><div class="offer-container offer-narrow"><h3 class="included-title">O seu plano foi preparado para estas prioridades:</h3><p class="personalized-intro">Selecionamos os pontos mais importantes com base nas respostas que você acabou de fornecer.</p><ul class="inclusion-list personalized-list">${priorities.map(x=>`<li><span>✓</span><div><small>DOR IDENTIFICADA</small><strong>${esc(x.pain)}</strong><p>${esc(x.solution)}</p></div></li>`).join("")}</ul>${timer()}${buyBox()}</div></section>
      <section class="visual-section"><div class="offer-container offer-narrow"><p class="eyebrow">VEJA O RESULTADO</p><h2>Veja o resultado ${student==="aluno"?"do aluno":"da aluna"} do Carnívora 40+</h2><div class="wide-image">${asset("visibleChange",`Resultado ${student} do Carnívora 40+`)}</div></div></section>
      <section><div class="offer-container offer-narrow"><p class="eyebrow">HISTÓRIAS REAIS</p><h2>Veja a experiência de quem já começou</h2>${testimonials(4,9,[9,10,11,7])}${timer()}${buyBox()}</div></section>
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
