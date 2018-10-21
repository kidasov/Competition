import fetch from 'node-fetch';
import querystring from 'querystring';

export class TtwRatingPoint {
  constructor(playerId, date, rating) {
    this.playerId = playerId;
    this.date = date;
    this.rating = rating;
  }
}

export async function getTtwPlayerPoints(ttwId) {
  const response = await fetch('http://r.ttw.ru/wp-admin/admin-ajax.php', {
    method: 'POST',
    body: querystring.stringify({
      action: 'get_player_points',
      id: ttwId,
    }),
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  });
  const text = await response.text();
  return text.split(';').map(point => {
    const [year, month, day, rating] = point.split(',');
    const date = new Date(+year, +month, +day);
    return new TtwRatingPoint(ttwId, date, +rating);
  });
}

export async function getTtwCurrentRating(ttwId) {
  const points = await getTtwPlayerPoints(ttwId);
  return points.length !== 0 ? points[points.length - 1].rating : null;
}
