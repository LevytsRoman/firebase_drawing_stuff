import firebase from 'firebase';
require('dotenv').config();

console.log(process);
console.log("=======================");
console.log(process.env);
console.log("=======================");
console.log("=======================");
console.log("=======================");

const config = {
  apiKey: process.env['REACT_APP_APIKEY'],
  authDomain: process.env['REACT_APP_AUTHDOMAIN'],
  databaseURL: process.env['REACT_APP_DATABASEURL'],
  projectId: process.env['REACT_APP_PROJECTID'],
  storageBucket: process.env['REACT_APP_STORAGEBUCKET'],
  messagingSenderId: process.env['REACT_APP_MESSAGINGSENDERID']
};

const fire = firebase.initializeApp(config);

export default fire;

export const database = fire.database();
