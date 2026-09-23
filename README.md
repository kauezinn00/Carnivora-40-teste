# Carnívora 40+ — quiz

Quiz mobile-first estático com 35 telas, preparado para publicação na Vercel.

A captura de e-mail foi removida. Depois que a última tela de carregamento chega a 100%, o botão leva diretamente para a página de vendas.

As 12 imagens de comentários autorizadas estão integradas em ordem nas quatro etapas de prova social e na página final da oferta.

A logo Carnívora 40+ e as 16 imagens das opções estão incluídas. As etapas de idade e objetivo escolhem as fotos conforme a resposta Mulher/Homem da primeira etapa, inclusive ao voltar e mudar essa resposta. A opção existente “Outro objetivo” foi preservada sem fotografia.

As imagens recebidas foram otimizadas em WebP, sem alterar seu conteúdo, para reduzir o carregamento. As opções ficam em `assets/options`, os comentários em `assets/comments` e a logo em `assets/logo-carnivora-40.webp`. O mapeamento está no objeto `ASSETS` em `app.js`.

A etapa “Mais de 100 receitas deliciosas” utiliza a imagem local `assets/mais-de-100-receitas.jpeg`. A barra de progresso do quiz possui acabamento totalmente arredondado.

A confirmação da meta utiliza `assets/meta-peso.webp` e mostra um cartão dinâmico com o peso atual e o peso desejado do lead. A etapa de organização do plano utiliza `assets/plano-refeicoes.webp`.

A etapa sobre inchaço no rosto mostra somente a arte correspondente ao gênero selecionado, seguida do botão para continuar.

Na página final, a comparação visual “Agora/Meta” correspondente ao gênero selecionado aparece imediatamente acima do indicador de porcentagens.

A lista principal da oferta mostra até seis prioridades personalizadas a partir das respostas do lead. A meta de peso aparece obrigatoriamente em primeiro lugar; as demais são selecionadas por relevância entre histórico de peso, tempo longe da meta, fome, hábitos alimentares, sono, água, atividade, restrições alimentares, tamanho de roupa e objetivo adicional.

Mais abaixo na oferta, a prova social de antes/depois também acompanha o gênero selecionado. A seção final de garantia utiliza o selo de 30 dias enviado.

As telas de cálculo animam o círculo, a barra e a porcentagem de 0% a 100% antes de liberar o avanço. As duas telas de resultado exibem um gráfico animado com estimativa fixa de quatro semanas.

O checkout já está conectado a `https://pay.wiapy.com/KX2LK3vXNU`.

O Meta Pixel `1253168553664712` está instalado globalmente com `PageView`, `QuizStarted`, `QuizCompleted`, `ViewContent` e `InitiateCheckout`. O script global da UTMify fornecido pelo cliente também está instalado e carrega `https://cdn.utmify.com.br/scripts/utms/latest.js`.

O Pixel também registra entrada e avanço nas 35 telas: `QuizStep01Viewed` / `QuizStep01Completed` até `QuizStep35Viewed` / `QuizStep35Completed`. Cada evento conta uma vez por sessão da aba, incluindo retornos, múltiplas seleções e recarregamentos. São contagens agregadas para analisar perdas por etapa, sem enviar nome, respostas, medidas ou informações de saúde. O mapa das etapas e as instruções de análise estão em [RASTREAMENTO.md](RASTREAMENTO.md).

## Configuração

Edite o objeto `CONFIG` no início de `app.js` para alterar checkout, preço, marca, duração do cronômetro (`offerMinutes`) e futuros códigos de rastreamento.

Os seletores de altura e peso possuem uma fita métrica móvel sob um marcador vermelho fixo no centro, além da orientação animada para arrastar. O cronômetro da oferta é compartilhado por todas as aparições da página e não reinicia ao atualizar a mesma sessão.

Todos os parâmetros UTM e `fbclid` recebidos na entrada são mantidos durante o quiz e anexados ao checkout.

## Publicação na Vercel

Para atualizar o repositório existente, envie os arquivos extraídos do ZIP, incluindo a pasta `assets`, para a mesma raiz onde já está `index.html`. Não envie apenas o arquivo ZIP e não apague o projeto na Vercel. Se você modificou preço, checkout ou rastreamento diretamente no GitHub desde a última entrega, preserve essas configurações ao substituir `app.js`.

O projeto não exige comando de build nem diretório de saída. Na importação do repositório, mantenha o framework como `Other` e deixe `Build Command` e `Output Directory` vazios.
