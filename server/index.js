'use strict';

const express = require('express');
const dao = require('./DAO');
const userDao = require('./user-dao.js');
const hikeRouter = require('./hikeRouter');
const email = require('./Email');
const cors = require('cors');
const morgan = require('morgan'); // logging middleware
const { validationResult, body, param } = require('express-validator');
const PREFIX = '/api/v0';

//1 STEP PASSPORT-->Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
//5 STEP EXPRESS-SESSION-->Express-session related imports
const session = require('express-session');

const app = express();

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json());
// app.use('/api',userRouter);

//corsOptions
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use('/api', hikeRouter);
app.use('/email', email);

//2 STEP PASSPORT-->Passport: set up local strategy-->TODO in USER-DAO
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  //4 STEP PASSPORT-->getUser in the verify method-->vedi come implemento "getUser" nel "userDao"
  const user = await userDao.getUser(username, password)

  //4.4 STEP PASSPORT-->CALLBACK cb check if returned "user" is correct or not
  if (!user)
    return cb(null, false, 'Incorrect username and/or password.');
  return cb(null, user);
}));

//7 STEP EXPRESS-SESSION-->Express-session-->Session Personalization
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

/*
// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});
*/

//6 STEP EXPRESS-SESSION-->Express-session installed on Passport
app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
//3/6.1 STEP PASSPORT/EXPRESS-->Install in our application the local strategy of Passport and Express-Session-->app.use(...)
app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized because not logged in' });
}


//**************************************API***************/


/*************BACKEND API************/    //structure left for references
/*
//readRiddles------------------------------------------------
app.get(PREFIX + '/riddles', (req, res) => {
  dao.readRiddles().then(
    (value) => {
      res.json(value);
    }
  ).catch(
    (err) => {
      res.status(500).json({ error: err });
    }
  );
});

//addRiddle-----------------------------------------------------------------------
app.post(PREFIX + '/riddles/addRiddle', isLoggedIn, [
  //BODY PARAMS VALIDATION ADD
  body('question').not().isEmpty(),
  body('status_riddle').not().isEmpty()], async (req, res) => {

    //VALIDATOR & CHECK ERRORS ADD
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //TRY-CATCH ADD
    const riddle = { ...req.body, user_id: req.user.id };
    try {
      const value = await dao.addRiddle(riddle);
      res.end();
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

//updateRiddleStatus----------------------------------------------------
app.put(PREFIX + '/riddles/updateRiddleStatus/:id/:status', isLoggedIn, async (req, res) => {

  //TRY-CATCH ADD
  try {
    const value = await dao.updateRiddleStatus(req.params.id, req.params.status);
    res.end();
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//----------------------------------------------------//
*/


/**************** Users APIs ********************/

//login
app.post(PREFIX + '/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser() in LocalStratecy Verify Fn
      return res.json(req.user);
    });
  })(req, res, next);
});

// check whether the user is logged in or not
app.get(PREFIX + '/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/v0/session/current
app.delete(PREFIX + '/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).end();
  });
});

//***************************************** */ 

//SERVER RUNNING
app.listen(3001, () => { console.log('Server running on Port: 3001') });
