export function slugify(text: string): string {
  return text
    .normalize("NFD") // Split accented characters into letter + diacritic
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (č -> c, š -> s, ž -> z)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and") // Replace & with 'and' or strip
    .replace(/[^a-z0-9\s-]/g, "") // Remove remaining invalid characters
    .replace(/\s+/g, "-") // Collapse whitespace into dashes
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-+|-+$/g, ""); // Trim dashes from edges
}

export function resolveUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  const slugSet = new Set(existingSlugs.map((s) => s.toLowerCase()));

  if (!slugSet.has(baseSlug.toLowerCase())) {
    return baseSlug;
  }

  let counter = 2;
  while (slugSet.has(`${baseSlug}-${counter}`.toLowerCase())) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}
