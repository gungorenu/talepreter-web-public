import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import environment from './config/environment.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressjwt from 'express-jwt';
import mongoose from 'mongoose';

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
// MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(environment.mongodb.uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.Promise = global.Promise;

// On connection error
mongoose.connection.on('error', (error) => {
  console.log('Database error: ', error);
});

// On successful connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database');
});

// addtional configuration when serving Angular SPA (static reource and Anugalr routing)
const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg', '.webmanifest', '.html', '.txt'];

// Import routes
// Use Api routes in the App
import apiRoutes from './api-routes.js';
app.use('/api', apiRoutes);

app.get('*', (req, res) => {
  if (allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`public/${req.url}`));
  } else {
    res.sendFile(path.resolve('public/index.html'));
  }
});

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(
  expressjwt
    .expressjwt({
      secret: environment.secret ?? 'dabidobi',
      algorithms: ['HS256'],
      getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
      },
    })
    .unless({
      path: [
        { url: '/api/user/authenticate', methods: ['POST'] },
        { url: '/index.html', methods: ['GET'] },
        { url: /\.js$/, methods: ['GET'] },
        { url: /\.css$/, methods: ['GET'] },
      ],
    }),
);

const HOST = '0.0.0.0';
const port = Number(process.env.EXPRESS_PORT) ?? 3000;
// start server
// Launch app to listen to specified port
app.listen(port, () => {
  console.log(`Talepreter-Web-Api Version: ${process.env.npm_package_version}`);
  console.log(`Running on http://${HOST}:${port}`);
});
