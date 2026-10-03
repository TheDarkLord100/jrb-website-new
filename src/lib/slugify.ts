// Lowercase, ASCII, hyphen-separated -- e.g. "Soft Gripper v2" ->
// "soft-gripper-v2". Matches the [a-z0-9]+(-[a-z0-9]+)* shape the project
// form's slug input enforces.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}