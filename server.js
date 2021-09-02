if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const swaggerUi = require("swagger-ui-express");
const swaggerJSdoc = require("swagger-jsdoc");
const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
 require('./auth');

// Extended: https://swagger.io/specification/#infoObject
 const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Login/Register API",
			version: "1.0.0",
			description: "A simple Express Login/Register API",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
	},
	apis: ["server.js"],
};

const swaggerDocs = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
 

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))




app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/failed', (req, res) => res.send('Authentication failed'))
app.get('/success',  (req, res) => res.send('Authentication successful'))

app.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/auth/google/callback',
checkNotAuthenticated,
passport.authenticate('google', { 
  successRedirect:'/',
  failureRedirect: '/login' }),
function (req, res) {
  res.redirect('/')
});
//Routes
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in the User
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:          
 *     responses:
 *       200:
 *         description: Login of User successful
 *         content:
 *           application/json:
 *             
 *       500:
 *         description: Some server error
 */
//Routes
/**
 * @swagger
 * /login:
 *   get:
 *     summary: Checks the authentication
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:          
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             
 *       500:
 *         description: Some server error
 */

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

//Routes
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registers  the User
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:          
 *     responses:
 *       200:
 *         description: Registration of User successful
 *         content:
 *           application/json:
 *             
 *       500:
 *         description: Some server error
 */

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})
//Routes
/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: Logs out the User
 *     tags: [Logout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:          
 *     responses:
 *       200:
 *         description: User logged out
 *         content:
 *           application/json:
 *             
 *       500:
 *         description: Some server error
 */

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000')
})