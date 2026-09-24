# Validación de entrega

Fecha: 24 de septiembre de 2026.

- 35 etapas recorridas en el camino de mujer y en el camino de hombre.
- Avance, regreso, selección simple, selección múltiple, nombre, altura, peso y peso objetivo conservados.
- Página de oferta abierta al completar ambos recorridos.
- Revisión visual en 360 px, 390 px, 768 px y escritorio: sin desbordamiento horizontal ni texto cortado.
- Todas las imágenes cargaron después de recorrer la página; no hay enlaces de imágenes al dominio de referencia.
- 22 imágenes con texto fueron adaptadas al español; las otras imágenes permanecieron intactas.
- Los cuatro bloques de precio de la oferta usan una sola cotización.
- México, Colombia, Perú, Chile, Argentina y España fueron simulados con su moneda correspondiente.
- Caché y fallback `US$ 9.97` comprobados.
- Meta Pixel, UTMify, eventos y parámetros UTM/fbclid conservados.
- `npm test` y `npm run build` finalizados sin errores.

El checkout existente se conserva en `config.js`. Cuando esté disponible el checkout internacional, sustituye `CHECKOUT_URL` y utiliza `CHECKOUT_PRICE_ENDPOINT` como punto de integración para mantener el importe mostrado y el cobrado completamente sincronizados.
