export const countRating = (reviews = []) => {
  const totalRating = reviews.reduce((acc, item) => {
    return (acc += item.rating);
  }, 0);
  return {
    rating: (totalRating / reviews.length).toFixed(2),
    totalReviews: reviews.length,
  };
};
