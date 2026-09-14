# Validação da V2 — Carnívora 40+

Validações executadas antes de gerar o ZIP final:

- `app.js` validado com `node --check` sem erro de sintaxe.
- 34 etapas encontradas e conferidas na ordem documentada em `RASTREAMENTO.md`.
- Versão do funil confirmada como `34_steps_v2`.
- Quatro fases confirmadas: Perfil, Meta, Rotina e Plano.
- Ingredientes e proteínas confirmados em uma única etapa.
- Telas de fome, sono, água e atividade cotidiana confirmadas com layout visual.
- Recompensas confirmadas nas etapas 05, 09, 22, 25 e 32.
- Persistência da etapa atual e das respostas validada na mesma sessão.
- Troca de versão (`35_steps_v1` → `34_steps_v2`) validada para iniciar uma jornada limpa.
- Voltar e avançar novamente validado sem duplicar os eventos de etapa já enviados na mesma sessão.
- Eventos `QuizV2Step01Viewed/Completed` até `QuizV2Step34Viewed/Completed` validados.
- `QuizV2Started`, `QuizV2Completed`, `ViewContent` e `InitiateCheckout` validados.
- Nenhum evento `Purchase` foi adicionado pelo quiz.
- Parâmetros de evento de etapa limitados a dados operacionais (`funnel_version`, `step_number`, `steps_total`, `elapsed_seconds` e, quando aplicável, `ad_id`).
- UTMs, `fbclid` e `src` preservados e repassados ao checkout.
- Checkout mantido em `https://pay.wiapy.com/KX2LK3vXNU`.
- Conferência automatizada de layout executada nas 34 etapas em viewport mobile 390×844, sem overflow horizontal.
- Smoke test de desktop executado em 1366×900.
- 41 arquivos de imagem reais do projeto foram abertos e validados, sem assets corrompidos.

## O que ainda precisa ser conferido depois do deploy de teste

O recebimento real dos eventos pelo Meta Pixel só pode ser confirmado em produção/teste publicado. Depois de subir esta V2 em uma URL separada, use **Gerenciador de Eventos → Testar eventos** e percorra o quiz uma vez do início ao fim.

Antes de substituir o funil atual, confira também a URL de teste manualmente em um celular real, principalmente as etapas longas de múltipla escolha e o clique final para o checkout.
