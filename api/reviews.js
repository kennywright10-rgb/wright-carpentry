export default async function handler(req, res) {
  const apiKey = process.env.REVIEWS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  const cid = '3053071123531868928';
  const url = 'https://maps.googleapis.com/maps/api/place/details/json'
    + '?cid=' + cid + '&fields=reviews,name,rating&key=' + apiKey;
  try {
    const r = await fetch(url);
    const data = await r.json();
    if (data.status !== 'OK') return res.status(200).json({ reviews: [], status: data.status });
    const reviews = (data.result.reviews || []).map(function(rv) {
      return { author_name: rv.author_name, rating: rv.rating, text: rv.text };
    });
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json({ reviews: reviews });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
