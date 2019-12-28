var JZZ = require('jzz');
const mysql = require('mysql');
let config = require('./config.js');
let Recorder = require('./recorder.js');

let recorder = new Recorder();

var midiOutput = JZZ().openMidiOut();

console.log(JZZ().info());

const db = mysql.createConnection(config);

console.log('Connected to database');

let query = "SELECT json FROM tblSongs";
query += " WHERE songId=387  AND wavUrl IS NULL";

var song;

db.query(query, (err, result) => {
  if (err) {
    throw err;
  }

  recorder.startRecording();

  song = JSON.parse(result[0].json);

  console.log("Play song.");

  startPerformance();
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
  //for(interval=0; interval < song.musicians[0].timeIntervals.length; interval++) {
  for(interval=0; interval < 5; interval++) {

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

  console.log("play ");

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
    //"all", /
    let midiNote = getNote(note.pitch);

    //Should really link the sustain to the tempo???

	  playNote(midiNote, note.channel, note.sustain * 250, 127);
/*
    output.playNote(
      midiNote,
      note.channel,
      {
        duration: note.sustain * 250,
        velocity: 127
      }
    );
    */
  }
}

async function playNote(midiNote, channel, duration, velocity) {
  ///var midi = await JZZ();
  var port = midiOutput; //await midi.openMidiOut();
  //await port.noteOn(0, 'C5', 127);
  await port.noteOn(0, midiNote, 127);
  await port.wait(duration);
  await port.noteOff(0, midiNote);
  //await port.close();
  console.log('done!');
}

function  getNote(pitch) {

    let note = (pitch) % 7;

    switch(note) {
      case 1:
        note += 1;
        break;

      case 2:
      case 3:
        note += 2;
        break;

      case 4:
        note += 3;
        break;

      case 5:
        note+= 4;
        break;

      case 6:
        note += 5;
        break;
    }

  const notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];

  return notes[note] + getOctave(pitch);
}

function getOctave(pitch) {
    let oct = 0
    if(pitch > 0 || pitch < 0) {
      oct = Math.floor(pitch / 7);
    }
    return oct +2;
  }
