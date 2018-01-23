import firebase from 'firebase';
require('dotenv').config();

const config = {
  apiKey: process.env['REACT_APP_APIKEY'],
  authDomain: process.env['REACT_APP_AUTHDOMAIN'],
  databaseURL: process.env['REACT_APP_DATABASEURL'],
  projectId: process.env['REACT_APP_PROJECTID'],
  storageBucket: process.env['REACT_APP_STORAGEBUCKET'],
  messagingSenderId: process.env['REACT_APP_MESSAGINGSENDERID']
};

const fire = firebase.initializeApp(config);
const database = fire.database();

export { fire, database }
