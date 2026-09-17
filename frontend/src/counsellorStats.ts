interface Stats {
  rating: number;
  reviews: number;
  years: number;
}

const STATS_BY_EMAIL: Record<string, Stats> = {
  "amara.owusu@example.com": { rating: 4.9, reviews: 132, years: 12 },
  "kwame.boateng@example.com": { rating: 4.8, reviews: 98, years: 9 },
  "naledi.khumalo@example.com": { rating: 4.9, reviews: 145, years: 7 },
  "tunde.afolabi@example.com": { rating: 4.7, reviews: 76, years: 10 },
  "grace.mensah@example.com": { rating: 4.9, reviews: 210, years: 18 },
};

const FALLBACK: Stats = { rating: 4.8, reviews: 24, years: 5 };

export function statsFor(email: string | undefined | null): Stats {
  if (!email) return FALLBACK;
  return STATS_BY_EMAIL[email] ?? FALLBACK;
}
