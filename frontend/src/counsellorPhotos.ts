const PHOTO_BY_EMAIL: Record<string, string> = {
  "amara.owusu@example.com": "/images/counsellor-amara.webp",
  "kwame.boateng@example.com": "/images/counsellor-kwame.webp",
  "naledi.khumalo@example.com": "/images/counsellor-naledi.webp",
  "tunde.afolabi@example.com": "/images/counsellor-tunde.webp",
  "grace.mensah@example.com": "/images/counsellor-grace.webp",
};

export function photoFor(email: string | undefined | null): string | null {
  if (!email) return null;
  return PHOTO_BY_EMAIL[email] ?? null;
}
