if (process.env.NODE_ENV != 'production') {

  require('dotenv').config();
}

const express = require('express');

const app = express();

const port = 3000;

const path = require('path');

const methodOverride = require('method-override');

const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');

const reviewRouter = require('./Routes/reviews');

const listingRouter = require('./Routes/listing');

const userRouter = require('./Routes/user');

const session = require('express-session');

const MongoStore = require('connect-mongo');

const moment = require('moment-timezone');

const flash = require('connect-flash');

const passport = require('passport');

const LocalStrategy = require('passport-local');

const User = require('./Models/user');

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const dbUrl = process.env.ATLASDB_URL;

app.use(express.static(path.join(__dirname, 'Public')));

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


async function main() {

  await mongoose.connect(dbUrl)
};

main().then(() => console.log('Connection Established')).catch(err => console.log(err.message));

app.listen(port, () => {

  console.log('Server Started');
});

const store = MongoStore.create({

  mongoUrl: dbUrl,

  crypto: {

    secret: process.env.SECRET
  },

  touchAfter: 24 * 3600
});

store.on('error', ()=> {

   console.log('Error in MONGO SESSION STORE!', err);
})

const sessionOptions = {

  store,

  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {

    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

    maxAge: 7 * 24 * 60 * 60 * 1000,

    httpOnly: true
  }
};


app.use(session(sessionOptions));

app.use(flash());


app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {

  res.locals.success = req.flash('success');

  res.locals.error = req.flash('error');

  res.locals.currUser = req.user;

  next();
});


app.use('/listings', listingRouter);

app.use('/listings/:id/reviews', reviewRouter);

app.use('/', userRouter);

app.all('*', (req, res, next) => {

  next(new ExpressError(404, "Page Not Found !"));

})

app.use((err, req, res, next) => {

  let { statusCode = 500, message = 'Something Went Wrong!' } = err;

  res.status(statusCode).render('error', { message })
});
