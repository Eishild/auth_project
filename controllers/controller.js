import User from "../Models/User.js"
import argon2 from "argon2"

export const home = (req, res) => {
  res.render("home")
}
export const login = (req, res) => {
  const error_message = req.flash("error")

  res.render("login", { errors: error_message })
}
export const register = (req, res) => {
  const error_message = req.flash("error")
  res.render("register", { errors: error_message })
}

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, password_confirm } = req.body
  try {
    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      password_confirm.trim() === ""
    ) {
      req.flash("error", "Les champs doivent être tous rempli")
      res.redirect(`/register`)
      return
    }

    if (
      firstName.length < 3 ||
      firstName.length >= 20 ||
      lastName.length < 3 ||
      lastName.length >= 20
    ) {
      req.flash(
        "error",
        "first name et last name doivent faire entre 3 et 20 charactères"
      )
      res.redirect(`/register`)
      return
    }

    if (
      password.length < 8 ||
      password.length >= 20 ||
      password_confirm.length < 8 ||
      password_confirm.length >= 20
    ) {
      req.flash("error", "Password doit faire entre 3 et 20 charactères")
      res.redirect(`/register`)
      return
    }
    if (password !== password_confirm) {
      req.flash("error", "Password ne correspont pas à confim password")
      res.redirect(`/register`)
      return
    }

    const findUser = await User.findOne({ email: email })
    const hashPassword = await argon2.hash(req.body.password, {
      hash: process.env.SALT,
      type: argon2.argon2i,
    })

    if (!findUser) {
      const newUser = new User({
        ...req.body,
        password: hashPassword,
      })
      newUser.save()

      res.status(200).redirect("/login")
    } else {
      req.flash("error", "L'utilisateur existe déjà")
      res.status(400).redirect("/register")
    }
  } catch (error) {
    res.redirect("/register")
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (email.trim() === "" || password.trim() === "") {
    req.flash("error", "Les champs doivent être tous rempli")
    res.redirect(`/login`)
    return
  }

  try {
    const findUser = await User.findOne({ email: email })
    console.log(findUser)
    if (findUser) {
      const verifyPassword = await argon2.verify(findUser.password, password, {
        hash: process.env.SALT,
      })
      if (verifyPassword) {
        req.session.auth = true
        res.status(200).redirect("/posts")
      } else {
        req.flash("error", "email ou password incorrect")
        res.redirect("/login")
      }
    } else {
      req.flash("error", "L'utilisateur n'existe pas")
      res.redirect("/login")
    }
  } catch (error) {
    res.status(400).json(error)
  }
}

export const posts = (req, res) => {
  const auth = req.session.auth

  res.render("posts", { auth })
}

export const logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/")
  })
}
