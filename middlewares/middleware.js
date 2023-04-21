export const verifyUser = (req, res, next) => {
  const isAuth = req?.session?.auth
  try {
    if (isAuth) {
      next()
    } else {
      res.redirect("/login")
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}
