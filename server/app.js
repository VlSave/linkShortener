import path from 'path';
import bodyParser from 'body-parser';
import Express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import md5 from 'md5';
import getIndexPage from './partials/getIndexPage';
import getLoginSignUpPage from './partials/getLoginSignUpPage';
import someError from './partials/errors';
import encrypt from './partials/encrypt';
import User from './partials/entities/User';
import Guest from './partials/entities/Guest';


const app = Express();
const port = 5000;
const DBConnection = mongoose.createConnection('mongodb://localhost:27017/base', { useNewUrlParser: true });

const linksScheme = new mongoose.Schema({
  _id: String,
  fullUrl: String,
  createDate: Date
});
const usersScheme = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createDate: Date
});

const Links = DBConnection.model('Link', linksScheme);
const Users = DBConnection.model('Users', usersScheme);


app.use('/assets', Express.static(path.join(__dirname, '/assets')));
app.get('/favicon.ico', (req, res) => res.status(204))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
}));

// authentication
app.use((req, res, next) => {
  console.log(req.session, req.session.nickname);
  if (req.session && req.session.nickname) {
    const { nickname } = req.session;
    Users.findOne({ login: nickname }).exec()
      .then((user) => {
        if (user) {
          res.locals.currentUser = new User(user.login, user.password);
        }
        next();
      });
  } else {
    res.locals.currentUser = new Guest();
    next();
  }
});

app.get('/', (req, response) => {
  response.status(200).send(getIndexPage(response.locals.currentUser));
});

app.get('/user/:type', (req, response) => {
  if (req.params.type === 'new' || req.params.type === 'login') {
    response.status(200).send(getLoginSignUpPage(`/user/${req.params.type}`));
  } else {
    response.sendStatus(404);
  }
});

app.post('/user/new', (req, response, next) => {
  Users.findOne({ login: req.body.nickname }).exec()
    .then((user) => {
      if (user) {
        response.status(422).send(getLoginSignUpPage('/user/new', 'This nickname is already taken!'));
      } else {
        Users.create({ login: req.body.nickname, password: encrypt(req.body.password), createDate: new Date() })
          .then((user) => {
            response.redirect('/');
          });
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/user/login', (req, response, next) => {
  Users.findOne({ login: req.body.nickname }).exec()
    .then((user) => {
      if (user && user.password === encrypt(req.body.password)) {
        req.session.nickname = user.login;
        response.redirect('/');
      } else {
        response.status(422).send(getLoginSignUpPage('/user/login', 'Invalid nickname or password'));
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.get('/:hash', (req, response, next) => {
  Links.findById(req.params.hash, 'fullUrl').exec()
    .then((link) => {
      response.redirect(link.fullUrl);
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/create-link', (req, response, next) => {
  const hostName = req.headers.host;
  const newUrl = req.body.url;
  const hash = md5(newUrl);

  Links.findOneAndUpdate({ _id: hash }, { fullUrl: newUrl, createDate: new Date() }, { upsert: true, setDefaultsOnInsert: true }).exec()
    .then((link) => {
      response.status(200).send(JSON.stringify(`${hostName}/${hash}`));
    })
    .catch((err) => {
      next(err);
    });
});

app.use((err, req, res, next) => {
  res.send(err);
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
