export default async function handler(req, res) {
  const apiKey = process.env.REVIEWS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  const debug = {};
  try {
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName'
      },
      body: JSON.stringify({ textQuery: 'Wright Carpentry Pollock Pines CA', maxResultCount: 3 })
    });
    const searchData = await searchRes.json();
    debug.httpStatus = searchRes.status;
    debug.places = searchData.places ? searchData.places.map(function(p){ return p.displayName; }) : null;
    debug.error = searchData.error ? searchData.error.message : null;
    if (searchData.places && searchData.places.length > 0) {
      const placeId = searchData.places[0].id;
      debug.placeId = placeId;
      const detRes = await fetch('https://places.googleapis.com/v1/' + placeId, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'reviews,displayName'
        }
      });
      const detData = await detRes.json();
      debug.detStatus = detRes.status;
      debug.detError = detData.error ? detData.error.message : null;
      if (detData.reviews) {
        const reviews = detData.reviews.map(function(r) {
          return {
            author_name: r.authorAttribution ? r.authorAttribution.displayName : 'Anonymous',
            rating: r.rating,
            text: r.text ? r.text.text : ''
          };
        });
        res.setHeader('Cache-Control', 's-maxage=3600');
        return res.status(200).json({ reviews: reviews, source: 'places-v1' });
      }
    }
    return res.status(200).json({ reviews: [], debug: debug });
  } catch (e) {
    return res.status(500).json({ error: e.message, debug: debug });
  }
}
