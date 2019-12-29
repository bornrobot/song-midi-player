const mysql = require('mysql');
let config = require('./config.js');
let Recorder = require('./recorder.js');
var midiPlayer = require('./midiplayer.js');

const db = mysql.createConnection(config);
console.log('Connected to database');

let recorder = new Recorder();

//Event msg recieved to play a midi song form the library...
//playing a song is:
//get the json
//start the recording
//play the midi
//stop the recording

//connect to message queue and get songs to play midi...
play(387);

async function play(songId) {

  fetchSong(songId, async function(song) {

    await recorder.startRecording(songId);

    await midiPlayer.play(song);

    recorder.stopRecording(songId);
  });
}

function fetchSong(songId, callback) { 

  console.log("Fetching song: " + songId);

  let query = "SELECT json FROM tblSongs WHERE songId=" + songId + ";";

  db.query(query, (err, result) => {
    if (err) {
      throw err;
    }
	
    if(result.length > 0) {
      callback(JSON.parse(result[0].json));
    }
    else {
      throw "no song?";
    }
  });
}

db.end();

