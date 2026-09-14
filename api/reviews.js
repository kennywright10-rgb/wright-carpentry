export default async function handler(req, res) {
  const apiKey = process.env.REVIEWS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  const debug = {};
  try {
    const textRes = await fetch(
      'https://maps.googleapis.com/maps/api/place/textsearch/json?query=Wright+Carpentry+Pollock+Pines+CA&key=' + apiKey
    );
    const textData = await textRes.json();
    debug.textSearch = textData.status;
    debug.firstResult = textData.results && textData.results[0] ? textData.results[0].name : null;
    if (textData.status === 'OK' && textData.results && textData.results[0]) {
      const placeId = textData.results[0].place_id;
      debug.placeId = placeId;
      const detRes = await fetch(
        'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + placeId + '&fields=reviews%2Cname&key=' + apiKey
      );
      const detData = await detRes.json();
      debug.details = detData.status;
      if (detData.status === 'OK' && detData.result && detData.result.reviews) {
        const reviews = detData.result.reviews.map(function(rv) {
          return { author_name: rv.author_name, rating: rv.rating, text: rv.text };
        });
        res.setHeader('Cache-Control', 's-maxage=3600');
        return res.status(200).json({ reviews: reviews, name: detData.result.name });
      }
    }
    return res.status(200).json({ reviews: [], debug: debug });
  } catch (e) {
    return res.status(500).json({ error: e.message, debug: debug });
  }
}
