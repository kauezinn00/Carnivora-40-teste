# Integração de pagamento — pendente

Esta entrega prepara os pontos de conexão. Ela não simula compra aprovada.

## Ponto por página

Cada HTML possui:
- #platform-upsell: contêiner para o widget oficial.
- #accept-offer: botão padrão de compra.
- #decline-offer: link de recusa.
- integracao/NOME-DA-PAGINA.js: arquivo exclusivo para a integração.
- Comentário ao final do HTML para scripts oficiais que precisem de tags <script>.

Não cole tags HTML dentro de um arquivo .js. Se a plataforma entregar um snippet com tags, insira-o no HTML.
Para o primeiro upsell, o HTML de entrada index.html também precisa receber o snippet quando ele não estiver no arquivo compartilhado.

## Se a plataforma fornecer seus próprios botões

Insira exatamente o widget oficial no contêiner #platform-upsell.
Chame window.CarnivoraUpsell.usePlatformButton() para esconder o botão padrão e evitar dois botões concorrentes.
Confira se o botão de recusa também precisa ser substituído pela ação oficial. Algumas plataformas exigem registrar a recusa no pedido.

## Se a plataforma fornecer um SDK

O adaptador pode usar:

```js
window.CarnivoraUpsell.registerAccept(async function (context) {
  // Chamar o SDK oficial com o produto cadastrado e o contexto legítimo do pedido.
  // Aguardar a resposta real de pagamento.
  // Somente após aprovação confirmada pela plataforma:
  // window.location.assign(context.nextUrl);
});
```

O comentário acima não é uma integração pronta. Nenhum SDK, ID ou resposta de pagamento foi inventado.
Não use o retorno da função, clique no botão ou chegada a uma página como prova de compra.
A função registrada controla pagamento, erro, cancelamento e redirecionamento. O código comum não avança automaticamente.

context oferece:
- offerId: identificador local da página; não é ID de produto da plataforma.
- nextUrl: próxima página após aprovação.
- declineUrl: caminho de recusa.

A API também expõe window.CarnivoraUpsell.accessUrl, endereço da página local de acesso.

## Sessão, preços e cobrança

- Confirme o valor e a moeda no cadastro de cada produto. O preço visual não determina a cobrança.
- Nunca exponha chave secreta no HTML/JS.
- Use os mecanismos oficiais de sessão e idempotência. O bloqueio temporário do botão não substitui proteção de cobrança duplicada no servidor.
- Cookies, assinatura do pedido e parâmetros específicos de sessão dependem da plataforma e serão integrados quando o script chegar.
- UTMs, fbclid e src são preservados entre as páginas; outros parâmetros não são copiados automaticamente.
- Não envie tokens de pedido para links externos arbitrários.
- O link final de acesso precisa ser preenchido em assets/config.js e validado.
- Não dispare Purchase por clique. Quando houver rastreamento, use confirmação real e deduplicação compatível com a plataforma.
- Esta versão não contém scripts externos.

## Teste obrigatório após integrar

1. Compra principal aprovada abre o upsell 1.
2. Aceite com pagamento aprovado segue para o próximo upsell.
3. Pagamento recusado, pendente ou erro não vira compra aprovada.
4. Recusa abre o downsell correspondente; a recusa do downsell segue para o próximo upsell.
5. Os três caminhos finais levam ao acesso correto.
6. Cliques repetidos, voltar e atualizar não duplicam cobrança.
7. Valores reais correspondem aos preços mostrados.
8. A entrega libera apenas os produtos efetivamente pagos.
9. UTMs e sessão exigida pela plataforma continuam válidas.
10. Conferir no celular, incluindo o widget externo, que ainda não está neste pacote.

