export default async function handler(req, res) {
  const apiKey = process.env.REVIEWS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    const searchUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
      + '?input=%2B15303910206&inputtype=phonenumber&fields=place_id%2Cname&key=' + apiKey;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if (searchData.status !== 'OK' || !searchData.candidates || !searchData.candidates[0]) {
      return res.status(200).json({ reviews: [], status: searchData.status, debug: 'phone search failed' });
    }
    const placeId = searchData.candidates[0].place_id;
    const detailUrl = 'https://maps.googleapis.com/maps/api/place/details/json'
      + '?place_id=' + placeId + '&fields=reviews%2Cname&key=' + apiKey;
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();
    if (detailData.status !== 'OK') {
      return res.status(200).json({ reviews: [], status: detailData.status, place_id: placeId });
    }
    const reviews = (detailData.result.reviews || []).map(function(rv) {
      return { author_name: rv.author_name, rating: rv.rating, text: rv.text };
    });
    res.setHeader('Cache-Control', 's-maxage=3600');
    return res.status(200).json({ reviews: reviews });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
