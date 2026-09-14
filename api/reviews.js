export default async function handler(req, res) {
  const reviews = [
    {
      author_name: 'Kellie Morrison-Valdez',
      rating: 5,
      text: 'He redid some damaged stairs and was professional, detail oriented and reliable. He always checked in to make sure the project fit our needs. They are stunning and we get so many compliments on them!'
    },
    {
      author_name: 'Karen Silar',
      rating: 5,
      text: 'After hiring him for some deck repair we were so pleased with the work he did. He under promised and "over delivered" for sure! His communication was great and he was dependable! I would highly recommend you choose Wright Carpentry!'
    },
    {
      author_name: 'Monica Clark',
      rating: 5,
      text: 'Ian was prompt, professional, clean, well spoken, and courteous, and did an amazing job with my shelving in a sufficient amount of time. I would definitely recommend or use him again.'
    }
  ];
  res.setHeader('Cache-Control', 's-maxage=86400');
  return res.status(200).json({ reviews: reviews });
}
