if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express()
const bycrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('express-flash'); // To help the user with flash messages
const session = require('express-session'); // To store the user's session
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)//Finding User based on email

const users = []

app.use(express.json())

app.set('view engine', 'ejs' )
app.use(express.urlencoded({ extended: false }))
app.use (flash());
app.use(session({     // session secret
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false 
})),

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name})
  res.send
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local',
 { // Logging in and redirecting to home page and if failure redirect to login page
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
 
}));
// const user = ({
//   name: req.body.name,
//   email: req.body.email,
//   password: hashedPassword
// })
// const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
// res.json({accessToken: accessToken}))) //Will show a message if login fails from the passport-config js file,to be precise from the try catch block of  the function named "initialize"


app.get('/register', checkNotAuthenticated,(req, res) => {
  res.render('register.ejs')
})

app.post ('/register',checkNotAuthenticated, async (req, res) => {
try {
  const hashedPassword = await bycrypt.hashSync(req.body.password, 10)
 
  users .push({
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })
  res.redirect('/login')
  res.json(users)

  
} catch  {
res.redirect('/register')  
}
console.log(users)

  
})



app.delete('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})


function checkAuthenticated(req, res, next) { //Authentication Check
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});  

//With passport we don't need to use the usual midleware for login