var JZZ = require('jzz');
const mysql = require('mysql');
let config = require('./config.js');
let Recorder = require('./recorder.js');

let recorder = new Recorder();

var midiOutput = JZZ().openMidiOut();

const db = mysql.createConnection(config);

console.log('Connected to database');

let query = "SELECT json FROM tblSongs";
query += " WHERE songId=387  AND wavUrl IS NULL";

db.query(query, (err, result) => {
  if (err) {
    throw err;
  }

  console.log("START RECORDING");

  recorder.startRecording();

  //json = result[0];
  let song = JSON.parse(result[0]);

  console.log("Play song.");

  startPerformance();

  console.log("STOP RECORDING");
});

db.end();

function resolveAfter(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}

async function startPerformance() {

  //pause for the recorder to startup. TODO: Hopefully we can trim that later...
  await resolveAfter(5000);
   
  //foreach time interval... (assuming all musicians have the same number of intervals!)
  for(interval=0; interval < song.musicians[0].timeIntervals.length; interval++) {

    //foreach musician...
    for(let i=0; i < song.musicians.length; i++) {
      if(interval < song.musicians[i].timeIntervals.length) { 
        playMidiNotes(song.musicians[i].timeIntervals[interval].notes);
      }
    }

    await resolveAfter((30 / song.Tempo) * 1000);
  }

  console.log("No more notes");
  interval = -1;

  recorder.stopRecordingAndSavePerformance();

}

function playMidiNotes(notes) {

    for(let i=0; i < notes.length; i++) {

	playMidiNote(notes[i]);
    }
}

function playMidiNote(note) {

  console.log("play " + note.print());

  var delay = 0;

  if(note.sustain > 0) {

    //var output = WebMidi.outputs[midiDeviceIndex];
    var output = midiOutput;

    if(output == undefined) {
      console.log("No MIDI output?");
      return;
    }

    // Play a chord on channel 7
    //output.playNote(["C3", "D#3", "G3"], 7);

    // Play a note at full velocity on all channels)
    //"all", 

    let midiNote = note.getNote();

    //Should really link the sustain to the tempo???

    output.playNote(
      midiNote,
      note.channel,
      {
        duration: note.sustain * 250,
        velocity: 127
      }
    );
  }
}

async function playNote() {
  var midi = await JZZ();
  var port = await midi.openMidiOut();
  await port.noteOn(0, 'C5', 127);
  await port.wait(500);
  await port.noteOff(0, 'C5');
  await port.close();
  console.log('done!');
}
