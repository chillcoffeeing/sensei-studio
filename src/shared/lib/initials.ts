/**
 * Iniciales de un avatar: primera letra de la primera y de la última palabra con letras
 * ("Toni Fernández Leal" → "TL", Figma 174:212). Con una sola palabra, una letra ("Elliot" → "E").
 * La usan AvatarInitials/ReviewCard (shared/ui) y el masonry de testimonios.
 */
export function initials(name: string): string {
  const words = name
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}]/gu, ''))
    .filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0]!.charAt(0);
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : '';
  return (first + last).toLocaleUpperCase('es');
}
