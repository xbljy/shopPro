const convertArrayToObject = (array) => {
  const object = {};
  array.forEach((el) => {
    object[el.id] = el;
  });
  return object;
};

export default {
  setAllReviews(state, reviews) {
    state.allReviews = convertArrayToObject(reviews);
  },
  setMyReviews(state, reviews) {
    state.myReviews = reviews;
  },
  addReview(state, review) {
    state.allReviews[review.id] = review;
    state.currentReviews[review.id] = review;
    state.myReviews[review.id] = review;
  },

  setReviewsForCurrentProduct(state, reviews) {
    state.currentReviews = convertArrayToObject(reviews);
  },
  setCurrentReview(state, review) {
    state.currentReview = review;
  },
  updateReview(state, newReview) {
    if (state.allReviews[newReview.id])
      state.allReviews[newReview.id] = newReview;
    if (state.myReviews[newReview.id])
      state.myReviews[newReview.id] = newReview;
    if (state.currentReviews[newReview.id])
      state.currentReviews[newReview.id] = newReview;
    if (state.currentReview.id == newReview.id) state.currentReview = newReview;
  },
  deleteReview(state, reviewId) {
    if (state.allReviews[reviewId]) delete state.allReviews[reviewId];
    if (state.myReviews[reviewId]) delete state.myReviews[reviewId];
    if (state.currentReviews[reviewId]) delete state.currentReviews[reviewId];
    if (state.currentReview.id == reviewId) state.currentReview = {};
  },
  deleteAllReview(state) {
    state.allReviews = {};
    state.myReviews = {};
    state.currentReview = {};
    state.currentReviews = {};
  },
};
