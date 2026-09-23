# Carnívora 40+ — páginas de upsell e downsell

Pacote independente de páginas estáticas em HTML, CSS e JavaScript. Não altera o quiz existente.
Entrada: index.html (mesmo conteúdo de upsell-1.html).

## Estado da entrega

As seis páginas têm texto, layout responsivo e navegação de recusa implementados.
A cobrança NÃO está conectada. Clicar no botão de aceitar mostra um aviso e não cobra nem avança.
Não há Pixel, evento Purchase, rastreamento externo, cronômetro ou cadastro de dados pessoais.

Os nomes, formatos e conteúdos dos produtos são uma proposta comercial. Este ZIP contém as páginas de venda, NÃO as aulas, PDFs ou a área de membros. Antes de vender, produza e confira os materiais descritos, cadastre os produtos na plataforma e conecte a entrega.

## Ofertas e caminhos

| Página | Oferta | Preço | Após pagamento aprovado | Ao recusar |
|---|---|---:|---|---|
| upsell-1.html | Firmeza 40+ | R$17 | upsell-2.html | downsell-1.html |
| downsell-1.html | Firmeza Essencial | R$9,90 | upsell-2.html | upsell-2.html |
| upsell-2.html | Revisão de Rota | R$27 | upsell-3.html | downsell-2.html |
| downsell-2.html | Revisão Essencial | R$17 | upsell-3.html | upsell-3.html |
| upsell-3.html | Manutenção 40+ | R$47 | acesso.html | downsell-3.html |
| downsell-3.html | Manutenção Essencial | R$27 | acesso.html | acesso.html |

Os downsells têm menos conteúdo que as versões completas. Não são cobranças recorrentes.
A compra de um complemento é opcional. Sair ou recusar não é apresentado como cancelamento da compra principal.
O link "Pular todas as ofertas" leva diretamente a acesso.html.

## O que editar

- Textos e conteúdo: cada arquivo HTML.
- Cor, espaçamento, tipografia e responsividade: assets/styles.css.
- Preços e caminhos entre ofertas: assets/config.js. Mantenha também o preço estático no HTML consistente; o preço cobrado deve ser conferido na plataforma.
- Destino da área de membros: accessUrl em assets/config.js.
- Scripts oficiais: integracao/upsell-1.js até integracao/downsell-3.js, ou o ponto comentado no HTML se vierem com tags <script>.
- Navegação e preservação de UTMs: assets/funnel.js.
- Configuração de hospedagem: vercel.json.

index.html e upsell-1.html são cópias da entrada. Ao mudar texto ou inserir script diretamente no HTML da primeira oferta, atualize ambos. O arquivo integracao/upsell-1.js é compartilhado pelas duas entradas.

## Publicação posterior

1. Extraia este ZIP para uma pasta.
2. Mantenha index.html, assets/, integracao/ e os demais HTML na mesma raiz.
3. Publique essa pasta como um projeto estático na Vercel. Não precisa de npm, framework, instalação de dependências ou etapa de compilação.
4. Use uma publicação de teste antes de direcionar compradores.
5. Configure as URLs absolutas de cada oferta na plataforma, conforme o fluxo acima.
6. Após integrar, faça o teste de pagamento no ambiente de teste da plataforma, incluindo recusa, erro e recarregamento.

Não existe publicação ativa criada por este pacote. Um ZIP precisa ser extraído antes de enviar os arquivos pelo método de implantação escolhido.

## O que enviar para concluir a integração

Envie o nome da plataforma, os scripts oficiais de cada oferta, o mapeamento dos produtos/valores e o link de acesso.
Não envie senhas ou chaves privadas. Os scripts públicos de checkout serão instalados após verificar como a plataforma trata pagamento, recusa e sessão do pedido.

Veja INTEGRACAO.md para os detalhes técnicos.

