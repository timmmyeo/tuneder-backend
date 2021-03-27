const express = require("express");
const cors = require("cors");
const firebase = require("firebase");
// const firebaseConfig = require("./firebaseConfig");
const port = process.env.PORT || 4000

const app = express();

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID
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
  user = await docRef.get();
  if (user.data().swipers.includes(swipee)) {
    docRef.update({
      matches: firebase.firestore.FieldValue.arrayUnion(swipee)
    })
    docRef = db.collection("users").doc(swipee); 
    docRef.update({
      matches: firebase.firestore.FieldValue.arrayUnion(swiper)
    })
  }
  res.send("yo");
});

app.post("/cards", async (req, res) => {
  var swiper = req.body.swiper;
  var cards = [];
  var docRef = await db.collection("users").get();
  docRef.forEach(doc => {
    if (swiper != doc.id) {
      console.log(doc.data());
      cards.push(doc.data().playlists);
    }
  });
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