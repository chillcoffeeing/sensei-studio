// Imagen de TeamCard: el ancho de la card es --team-card-w
// (clamp lineal 260 → 344 entre 375 y 1440). Recorte en el servidor al aspecto de la card
// (344 × 423): las fotos de origen son apaisadas y con object-cover haría falta bajar imágenes
// mucho más anchas. Respaldo JPG a 2×.
export const teamCardImage = {
  sizes: '(min-width: 1440px) 344px, calc(7.8873vw + 230.4225px)',
  widths: [260, 344, 520, 688],
  width: 688,
  height: 846,
} as const;
