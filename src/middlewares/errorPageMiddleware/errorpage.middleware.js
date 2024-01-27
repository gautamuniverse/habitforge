export const errorPage = (req, res, next) => {
  res.status(404).render("404page", { errorMsg: null });
};
