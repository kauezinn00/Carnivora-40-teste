# Verificação da entrega

Data: 23/09/2026.

## Verificado
- Oito HTML: seis ofertas, entrada index.html e acesso.html.
- Referências locais de CSS, JavaScript e navegação existentes; nenhum recurso remoto.
- IDs únicos por página e configuração de viewport para celular.
- Sintaxe de todos os JavaScript e vercel.json válida.
- index.html consistente com upsell-1.html.
- Rotas dos seis upsells/downsells conferidas em teste de lógica com DOM simulado.
- UTMs permitidas preservadas; parâmetro arbitrário de token não propagado.
- Botão sem integração exibe aviso, não cobra e não avança.
- Chamada simultânea bloqueada durante a execução do adaptador.
- Erro do adaptador não é tratado como compra aprovada.
- Falha de sessionStorage não interrompe a inicialização.
- Link de acesso fica oculto até ser configurado; destino inválido é rejeitado.

## Ainda não verificado
- Renderização real em navegador nas diferentes larguras: o navegador deste ambiente bloqueou a abertura do servidor local (ERR_BLOCKED_BY_CLIENT).
- Pagamento e recusa na plataforma: scripts oficiais ainda não foram fornecidos.
- Entrega dos produtos e destino real de acesso.
- Hospedagem na Vercel: não foi realizada publicação.

HTML/CSS/JS estáticos: não há etapa de compilação.
Antes de direcionar compradores, conferir visualmente no celular e concluir os testes de integração descritos em INTEGRACAO.md.


## Revisão de 24/09/2026
Conferidos novamente os links e recursos locais, sintaxe JavaScript, IDs únicos, três módulos em cada upsell, igualdade da entrada com upsell-1 e preços R$17/R$27/R$37. Confirmado que downsells, acesso e lógica de integração não foram alterados. A validação visual em navegador continua pendente; o bloqueio registrado acima não foi contornado.
