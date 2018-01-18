import firebase from 'firebase';
require('dotenv').config();

console.log(process);
console.log("=======================");
console.log(process.env);
console.log("=======================");
console.log("=======================");
console.log("=======================");

const config = {
  apiKey: 'AIzaSyD9KLHrf5f0NX0w53Gy8N3nI1gcOI8kMR8',
  authDomain: 'fir-test-3d3c1.firebaseapp.com',
  databaseURL: 'https://fir-test-3d3c1.firebaseio.com',
  projectId: 'fir-test-3d3c1',
  storageBucket: 'fir-test-3d3c1.appspot.com',
  messagingSenderId: '151985155238'
};

const fire = firebase.initializeApp(config);

export default fire;

export const database = fire.database();
