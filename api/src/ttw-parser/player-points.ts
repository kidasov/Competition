import fetch from 'node-fetch';
import querystring from 'querystring';

export interface TtwRatingPoint {
  playerId: string;
  date: Date;
  rating: number;
}

export async function getTtwPlayerPoints(
  ttwId: string,
): Promise<TtwRatingPoint[]> {
  const response = await fetch('http://r.ttw.ru/wp-admin/admin-ajax.php', {
    method: 'POST',
    body: querystring.stringify({
      action: 'get_player_points',
      id: ttwId,
    }),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });
  const text = await response.text();
  if (text.length === 0) {
    throw new InvalidTtwId();
  }

  return text.split(';').map(point => {
    const [year, month, day, rating] = point.split(',');
    const date = new Date(+year, +month, +day);
    return { playerId: ttwId, date, rating: +rating };
  });
}

export async function getTtwCurrentRating(
  ttwId: string,
): Promise<number | null> {
  const points = await getTtwPlayerPoints(ttwId);
  return points.length !== 0 ? points[points.length - 1].rating : null;
}

export class InvalidTtwId extends Error {
  constructor() {
    super('Invalid ttw id');
  }
}
