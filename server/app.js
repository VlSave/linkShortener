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

const MongoStore = require('connect-mongo')(session);

const DBConnection = mongoose.createConnection('mongodb://localhost:27017/base', { useNewUrlParser: true });

const linksScheme = new mongoose.Schema({
  shortUrl: String,
  fullUrl: String,
  createDate: Date
});
const Links = DBConnection.model('Link', linksScheme);

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
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }],
  createDate: Date
});

const Users = DBConnection.model('Users', usersScheme);

const app = Express();
const port = 5000;


app.use('/assets', Express.static(path.join(__dirname, '/assets')));
app.get('/favicon.ico', (req, res) => res.status(204));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: DBConnection })
}));

// authentication
app.use((req, res, next) => {
  if (req.session && req.session.nickname) {
    const { nickname } = req.session;
    Users.findOne({ login: nickname }).exec()
      .then((user) => {
        if (user) {
          res.locals.currentUser = new User(user.login, user.password, user._id);
        }
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.locals.currentUser = new Guest();
    next();
  }
});

app.get('/', (req, res) => {

  res.send(getIndexPage());
});

app.get('/api/init_data', (req, response) => {
  if (response.locals.currentUser.isGuest()) {
    response.send({ userNickname: '' });
  } else {
    response.send({ userNickname: response.locals.currentUser.getName() });
  }
});

app.post('/user/new', (req, response, next) => {
  Users.findOne({ login: req.body.nickname }).exec()
    .then((user) => {
      if (user) {
        response.send({ success: false, name: 'login', msg: 'This nickname is already taken!' });
      } else {
        Users.create({ login: req.body.nickname, password: encrypt(req.body.password), createDate: new Date() })
          .then((user) => {
            response.send({ success: true });
          })
          .catch((err) => {
            next(err);
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
        response.send({ success: true });
      } else {
        response.send({ success: false, name: 'login', msg: 'Invalid nickname or password' });
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.delete('/user/login', (req, response) => {
  if (req.session) {
    req.session.destroy();
  }
  response.send({ success: true });
});

app.get('/user/profile', (req, response) => {
  response.locals.currentUser.isGuest() ? response.redirect('/') : response.send(getIndexPage());
});

app.get('/api/get_users-links', (req, response, next) => {
  Users.findOne({ login: response.locals.currentUser.getName() })
    .exec()
    .then((user) => {
      user.populate('links')
        .execPopulate()
        .then((item) => {
          const links = item.links.slice(-10).reduce((acc, curr) => [...acc, {
            id: curr._id,
            fullLink: curr.fullUrl,
            tinyLink: `${req.headers.host}/${curr.shortUrl}`
          }], []);
          response.send(links);
        });
    })
    .catch((err) => {
      next(err);
    });
});

app.post('/create-link', (req, response, next) => {
  const hostName = req.headers.host;
  const newUrl = req.body.url;
  const hash = md5(newUrl).substring(0, 6);

  Links.findOneAndUpdate({ shortUrl: hash }, { fullUrl: newUrl, createDate: new Date() }, { new: true, upsert: true, setDefaultsOnInsert: true }).exec()
    .then((link) => {
      if (!response.locals.currentUser.isGuest()) {
        Users.findOneAndUpdate({ _id: response.locals.currentUser.getID() }, { $push: { links: link._id } }).exec()
          .then((user) => {
            response.send({ newUrl: `${hostName}/${hash}` });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        response.send({ newUrl: `${hostName}/${hash}` });
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.get('/:hash', (req, response, next) => {
  Links.findOne({ shortUrl: req.params.hash }).exec()
    .then((link) => {
      response.redirect(link.fullUrl);
    })
    .catch((err) => {
      response.status(200).send(getIndexPage());
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
