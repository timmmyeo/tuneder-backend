const express = require("express");
const cors = require("cors");
const firebase = require("firebase");
// const firebaseConfig = require("./firebaseConfig");
const port = process.env.PORT || 4000

const app = express();

// Initialize Cloud Firestore through Firebase
firebase.initializeApp( {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID
});

var db = firebase.firestore();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("IC HELLO WORLD"));

app.post("/createuser", async (req, res) => {
  var docRef = db.collection("users").doc(req.body.id);
  await docRef.set({
    name: req.body.name,
    playlists: req.body.playlists,
    socials: req.body.socials,
    swipers: [],
    swiped: [],
    matches: [],
  });
});

app.post("/swiperight", async (req, res) => {
  var swiper = req.body.swiper;
  var swipee = req.body.swipee; 
  var docRef = db.collection("users").doc(swipee);
  docRef.update({
    swipers: firebase.firestore.FieldValue.arrayUnion(swiper)
  });
  docRef = db.collection("users").doc(swiper); 
  docRef.update({
    swiped: firebase.firestore.FieldValue.arrayUnion(swipee)
  });
  user = await docRef.get();
  if (user.data().swipers.includes(swipee)) {
    docRef.update({
      matches: firebase.firestore.FieldValue.arrayUnion(swipee)
    })
    docRef = db.collection("users").doc(swipee); 
    docRef.update({
      matches: firebase.firestore.FieldValue.arrayUnion(swiper)
    })
    res.send({
      match: false
    });
  }
  res.send({
    match: true,
    id: user.id,
    name: user.data().name
  });
});

app.post("/cards", async (req, res) => {
  var swiper = req.body.swiper;
  var cards = [];
  var docRef = db.collection("users");
  var users = await docRef.get();
  var user = await docRef.doc(swiper).get();
  users.forEach(doc => {
    if (swiper != doc.id) {
      console.log(doc.data());
      doc.data().playlists.filter(p => p && !user.data().swiped.includes(p)).forEach(p => cards.push({
        id: doc.id,
        playlist: p
      }));
    }
  });
  shuffle(cards);
  res.send(cards);
});

app.post("/compatability", async (req, res) => {
  var swiper = req.body.swiper;
  var swipee = req.body.swipee;
  var swiperPlaylists = await db.collection("users").doc(swiper).get();
  var swipeePlaylists = await db.collection("users").doc(swipee).get();
  var score = 0;
  swiperPlaylists.forEach(p1 => {
    var newscore = 0;
    swipeePlaylists.forEach(p2 => {
      
      score = max(score, newscore);
    })
  });
})

app.listen(port, () => console.log("Listening..."));

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}