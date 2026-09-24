# PLAN CARNÍVORO 40+ — embudo internacional

Versión en español neutro internacional del embudo principal. Mantiene las 35 etapas, los dos recorridos de género, la personalización, el seguimiento y la página de oferta.

## Publicación en Vercel

Sube la carpeta completa o este proyecto descomprimido. La función `api/price.js` utiliza el país aproximado informado por Vercel y obtiene el tipo de cambio USD más reciente. Si la ubicación, la moneda o la cotización no están disponibles, el precio vuelve automáticamente a `US$ 9.97`.

El precio base, el checkout y las integraciones están centralizados en `config.js`:

- `BASE_PRICE_USD`: precio base internacional;
- `CHECKOUT_URL`: enlace único del checkout;
- `CHECKOUT_PRICE_ENDPOINT`: punto preparado para una futura sincronización exacta con el checkout;
- `META_PIXEL_ID` y `UTMIFY_SCRIPT`: valores del seguimiento existente.

La cotización se solicita una sola vez y se guarda temporalmente en `sessionStorage`. Todos los bloques de la oferta leen el mismo precio. El checkout actual se conserva; sustituye `CHECKOUT_URL` cuando esté listo el checkout internacional.

## Archivos principales

- `app.js`: preguntas, respuestas, personalización, navegación, oferta y eventos.
- `styles.css`: identidad visual y diseño adaptable.
- `config.js`: precio base, checkout, Pixel y UTMify.
- `pricing.js`: caché y actualización del precio en el navegador.
- `api/price.js`: país, moneda, cotización y fallback.
- `assets/`: fotografías, comentarios y piezas visuales adaptadas al español.

## Comprobaciones

Ejecuta `npm test` para validar sintaxis, estructura, las 35 etapas, archivos locales y precios de México, Colombia, Perú, Chile, Argentina y España. Para abrir una revisión local, ejecuta `npm run dev`.
