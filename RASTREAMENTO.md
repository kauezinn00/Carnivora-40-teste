# Seguimiento del embudo

Se conservan el Meta Pixel `1253168553664712`, el cargador existente de UTMify y los parámetros `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid` y `src`.

## Eventos

- `PageView`: apertura de la página.
- `QuizStarted`: primera selección de género.
- `QuizStep01Viewed` a `QuizStep35Viewed`: visualización de cada etapa.
- `QuizStep01Completed` a `QuizStep35Completed`: avance de cada etapa.
- `QuizCompleted`: finalización del cuestionario.
- `ViewContent`: visualización de la oferta, con el valor y la moneda mostrados.
- `InitiateCheckout`: clic en un botón de compra, con el valor y la moneda mostrados.

Los eventos de etapa solo incluyen la versión del embudo, el número de etapa, el total de etapas y el tiempo transcurrido. Cuando `utm_content` contiene un identificador numérico de anuncio, también se envía como `ad_id`. No se envían nombres, respuestas, género, peso, altura ni condiciones de salud en estos eventos.

Después de publicar, utiliza “Probar eventos” en el Administrador de eventos de Meta y recorre ambos caminos del cuestionario. Confirma también que UTMify recibe la visita y que el checkout conserva todos los parámetros.
