# Carnívora 40+ — Quiz V2 (34 etapas)

Versão de teste separada do funil atual. O projeto continua estático, mobile-first e pronto para publicação em um **novo projeto/repositório Vercel**, sem tocar na URL que já está rodando.

## O que mudou na V2

- Primeira tela preservada, com a chamada: **“Responda e receba seu plano carnívoro personalizado em apenas 2 minutos”**.
- Quiz reduzido de 35 para 34 telas.
- Ingredientes e proteínas unidos em uma única etapa.
- Barra de progresso simples mantida como único indicador global de avanço; os cards de fase foram removidos para não reforçar a sensação de quiz longo.
- Devolutivas e recompensas entre blocos do quiz, com badges/checks e textos personalizados.
- Respostas de seleção única avançam direto para a próxima etapa, sem pop-up repetitivo de confirmação.
- Fome, sono, água e atividade no cotidiano em escolhas visuais.
- Imagens das telas informativas e de recompensa exibidas em proporção integral, sem `crop`/altura fixa.
- Etapa atual e respostas preservadas ao atualizar a mesma sessão.
- Nova versão de rastreamento: `34_steps_v2`.
- Eventos `QuizV2Step01Viewed/Completed` até `QuizV2Step34Viewed/Completed`.
- `QuizV2Started` na primeira seleção e `QuizV2Completed` ao concluir a etapa 34.
- Nenhum evento `Purchase` foi adicionado.
- UTMs, `fbclid` e `src` continuam preservados e são enviados ao checkout.
- Página final, checkout, logo, comentários e demais assets do projeto original foram mantidos.

## Arquivos principais

- `index.html`: Pixel global, PageView e carregamento do app.
- `app.js`: etapas, persistência, eventos, personalização, navegação e página final.
- `styles.css`: estilos atuais + componentes visuais da V2.
- `assets/`: mesmos assets da versão atual funcionando.
- `RASTREAMENTO.md`: mapa oficial das 34 etapas e instruções de análise.
- `VALIDACAO-V2.md`: conferências executadas antes da entrega.

## Checkout

Mantido como no projeto-base:

`https://pay.wiapy.com/KX2LK3vXNU`

## Publicação segura

Recomendado: crie um **novo repositório** e um **novo projeto na Vercel** para esta V2. Não substitua o deploy atual antes de conferir a URL de teste no celular e no desktop.

O projeto não exige comando de build nem diretório de saída. Na Vercel, use framework **Other** e deixe `Build Command` e `Output Directory` vazios.
