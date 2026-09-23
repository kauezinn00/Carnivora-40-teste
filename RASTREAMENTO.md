# Acompanhamento das etapas do quiz

Esta versão acrescenta ao Meta Pixel `1253168553664712` dois eventos em cada uma das 35 etapas. A coleta começa quando esta versão for publicada e receber novas visitas. Os cliques anteriores não podem ser reconstruídos por este código.

## O que cada evento significa

| Evento | Momento do registro |
| --- | --- |
| `QuizStep01Viewed` até `QuizStep35Viewed` | Primeira entrada na respectiva etapa na sessão da aba. |
| `QuizStep01Completed` até `QuizStep35Completed` | Primeiro avanço na respectiva etapa na sessão da aba. |
| `QuizStarted` | Seleção na primeira etapa. |
| `QuizCompleted` | Avanço na última etapa, após a construção do plano. |
| `ViewContent` | Exibição da página de vendas. |
| `InitiateCheckout` | Clique em um botão de compra. |
| `PageView` | Carregamento do documento. |

`Viewed` significa que a etapa foi renderizada; não prova que a pessoa leu o conteúdo. `Completed` significa que ela avançou, inclusive em telas informativas. Em seleções múltiplas, escolher ou desmarcar opções não conclui a etapa: o evento só ocorre em Continuar. Voltar, atualizar a página ou escolher novamente não repete eventos já enfileirados na mesma sessão da aba. Uma nova sessão pode contar a mesma pessoa novamente.

Os eventos de etapa levam apenas `funnel_version`, `step_number`, `steps_total` e, no avanço, `elapsed_seconds`. O tempo é o decorrido desde a entrada naquela visita à etapa, incluindo tempo com a aba em segundo plano; não é uma medição de atenção. Quando `utm_content` contém um ID de anúncio com 5 a 30 dígitos, ele também é enviado como `ad_id`. Nome, respostas, gênero, peso, altura, condições de saúde e textos das perguntas não fazem parte desses parâmetros.

## Como localizar as perdas

Depois de publicar, abra o Pixel no Gerenciador de Eventos da Meta e use Testar eventos enquanto percorre o quiz. Procure, por exemplo, `QuizStep01Viewed`, `QuizStep01Completed`, `QuizStep02Viewed` e assim por diante. Confira o recebimento em produção antes de usar as contagens para tomar decisões. A execução local do código não confirma recebimento na Meta.

Para a análise, use o mesmo intervalo de datas, a mesma versão do funil e tráfego comparável. Compare a quantidade de `Viewed` com a de `Completed` da mesma etapa. A diferença é uma indicação de falta de avanço, que pode incluir visitantes ainda respondendo ou eventos que não chegaram.

Exemplo fictício: se a etapa 10 teve 100 entradas registradas e 60 avanços, há 40 entradas sem avanço registrado, ou 40%. Esse cálculo indica onde investigar; não confirma 40 abandonos definitivos. Aguarde as visitas terminarem antes de comparar o período.

Este acompanhamento é agregado. Ele não oferece um painel próprio nem mostra uma lista com a última etapa de cada visitante. Para reconstituir trajetórias individuais, será necessário integrar um serviço de análise de sessões ou uma coleta própria com armazenamento. Não enviamos um evento chamado Abandono ao trocar de aba ou fechar a página, pois isso não comprova desistência e pode nem ser entregue pelo navegador.

## Mapa das etapas — versão `35_steps_v1`

O número usa dois dígitos. Por exemplo: altura corresponde a `QuizStep10Viewed` e `QuizStep10Completed`.

| Número | Tela |
| --- | --- |
| 01 | Seleção de gênero |
| 02 | Faixa etária |
| 03 | Objetivo principal |
| 04 | Experiência anterior com a alimentação |
| 05 | Informação sobre composição da alimentação |
| 06 | Período de maior fome |
| 07 | Refeição favorita |
| 08 | Histórico de manutenção do peso |
| 09 | Informação sobre a alimentação carnívora |
| 10 | Altura |
| 11 | Peso atual |
| 12 | Peso desejado |
| 13 | Confirmação da meta |
| 14 | Nome |
| 15 | Resultado preliminar e comentários |
| 16 | Atividade física semanal |
| 17 | Tempo distante do peso desejado |
| 18 | Tamanho atual de roupa |
| 19 | Tamanho desejado de roupa |
| 20 | Cálculo intermediário |
| 21 | Hábitos alimentares |
| 22 | Mais de 100 receitas |
| 23 | Ingredientes favoritos |
| 24 | Proteínas preferidas |
| 25 | Alergias ou intolerâncias |
| 26 | Organização do plano de refeições |
| 27 | Sono |
| 28 | Água |
| 29 | Atividade no cotidiano |
| 30 | Medicamentos ou suplementos |
| 31 | Condições de saúde |
| 32 | Objetivos adicionais |
| 33 | Imagem sobre mudanças no rosto |
| 34 | Motivação e comentários |
| 35 | Construção final do plano |

Este mapa é apenas documentação para o responsável pelo projeto. Os títulos acima não são enviados nos parâmetros dos eventos de etapa.

## Comparação entre criativos

Mantenha um identificador diferente para cada anúncio em `utm_content`; prefira o ID numérico do anúncio. Se os nove criativos usarem o mesmo identificador, esse parâmetro não permitirá diferenciá-los. O quiz preserva as UTMs recebidas e as acrescenta ao checkout. Não houve edição dos anúncios nesta entrega.

As contagens gerais do Pixel incluem tráfego que não veio dos anúncios. Elas não equivalem automaticamente a resultados atribuídos por criativo no Gerenciador de Anúncios. Essa atribuição e as colunas de eventos/conversões precisam ser verificadas na conta. O parâmetro `ad_id` não cria uma tabela por criativo por si só.

## Limites e manutenção

- Bloqueadores, recusas de rastreamento, falhas de conexão e restrições da plataforma podem impedir o recebimento. Enfileirar o evento não é uma confirmação de entrega.
- Os registros de etapa contam uma vez por sessão da aba. Os cliques no checkout podem ocorrer mais de uma vez. Nenhum deles comprova pagamento.
- O acesso direto a `#oferta` registra a oferta, sem simular a passagem pelas etapas anteriores.
- O quiz continua voltando à primeira tela ao recarregar, como solicitado. As marcações de eventos já registrados e as UTMs permanecem na sessão.
- A captura de e-mail permanece removida. A contagem atual é de 35 etapas, e não a numeração do roteiro inicial de 29 etapas.
- Se a sequência mudar, altere `FUNNEL_VERSION` em `app.js` e atualize este mapa para manter a comparação interpretável.
