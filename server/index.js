
'use strict';
const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {

      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = express();
const port = 3005;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use('/public', express.static('public'));


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}



// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'dkent83hd72gdb5nd8',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());







/*** APIs ***/





// GET /api/pages

app.get('/api/pages', (req, res) => {
  dao.listPages()
    .then(pages =>
      res.json(pages))
    .catch(() => res.status(500).end());
});



// GET /api/title

app.get('/api/title', (req, res) => {

  dao.getTitle()
    .then(title => res.json(title))
    .catch(() => res.status(500).end());
});



// GET /api/image

app.get('/api/image', (req, res) => {

  dao.getImage()
    .then(image => res.json(image))
    .catch(() => res.status(500).end());
});


//api for add page
// POST /api/page
app.post('/api/page', isLoggedIn, [
  check('title').isString(),
  check('authorId').isInt(),
  check('creationDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('blocks').isArray()

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }


  const page = {
    id: req.body.id,
    title: req.body.title,
    authorId: req.user.id,
    creationDate: req.body.creationDate ? req.body.creationDate : null,
    publishDate: req.body.publishDate ? req.body.publishDate : null,
    blocks: req.body.blocks
  };


  try {
    const newIndex = await dao.createPage(page);
    const stuff = await dao.addBlocks(page, newIndex)

  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the creation of page ${page.title}.` });
  }

});



// DELETE /api/pages/<id>
app.delete('/api/pages/:id', isLoggedIn, async (req, res) => {
  try {
    const numRowChanges = await dao.deletePage(req.params.id, req.user);
    // number of changed rows is sent to client as an indicator of success
    res.json(numRowChanges);
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the deletion of answer ${req.params.id}.` });
  }
});




// edit page by id for user
// PUT /api/page/<id>

app.put('/api/edit-page/:id', isLoggedIn, [

  check('title').isString(),
  check('authorId').isInt(),
  check('creationDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('blocks').isArray()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const page = {
    id: req.params.id,
    title: req.body.title,
    authorId: req.user.id,
    creationDate: req.body.creationDate ? req.body.creationDate : null,
    publishDate: req.body.publishDate ? req.body.publishDate : null,
    blocks: req.body.blocks
  };

  page.id = req.params.id;

  try {

    const numRowChanges = await dao.updatePage(page, req.user.id);
    res.json(numRowChanges);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of page ${req.params.id}.` });
  }

});



// edit page by id for admin
// PUT /api/admin/page/<id>

app.put('/api/admin/edit-page/:id', isLoggedIn, [
  check('title').isString(),
  check('authorId').isInt(),
  check('creationDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('blocks').isArray()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }


  const page = {
    id: req.params.id,
    title: req.body.title,
    authorId: req.body.authorId,
    creationDate: req.body.creationDate ? req.body.creationDate : null,
    publishDate: req.body.publishDate ? req.body.publishDate : null,
    blocks: req.body.blocks
  };

  page.id = req.params.id;

  try {

    if (req.user.admin) {

      const numRowChanges = await dao.updatePageByAdmin(page);
      res.json(numRowChanges);
    }
  } catch (err) {
    res.status(503).json({ error: `Database error during the update of page ${req.params.id}.` });
  }

});



app.put('/api/edit-title/', isLoggedIn, [

  check('title').isString()

], async (req, res) => {

  if (req.user.admin) {    // check admin

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const title = req.body;

    try {

      const newTitle = await dao.updateTitle(title);
      res.json(newTitle);

      //res.status(200).end();
    } catch (err) {
      res.status(503).json({ error: `Database error during the update of page ${req.params.id}.` });
    }
  }

});





/*** Users APIs ***/




// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});







// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});







// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});






// GET /api/users

app.get('/api/users', isLoggedIn, (req, res) => {

  if (req.user.admin) {
    userDao.getUsers()
      .then(users => { res.json(users) })
      .catch(() => res.status(500).end());
  }
});




/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-server listening at http://localhost:${port}`);
});

