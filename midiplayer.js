var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

var midiOut = JZZ().openMidiOut();
console.log(JZZ().info());

module.exports = {
  playCustomJson,
  playMidiFile
}


const MIDI_C4 = 72;

function resolveAfter(ms) {

  console.log("Wait " + ms);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}

async function playCustomJson(song) {

  console.log("Play custom JSON...");

  console.log(song);

  console.log("musicians: " + song.musicians.length);
  console.log("notes: " + song.musicians[0].ticks.length);

  //pause for the recorder to startup. TODO: Hopefully we can trim that later...
  await resolveAfter(1000);

  //foreach time interval... (assuming all musicians have the same number of intervals!)
  for(let interval=0; interval < song.musicians[0].ticks.length; interval++) {

    //foreach musician...
    for(let i=0; i < song.musicians.length; i++) {
      
      console.log("musician index: " + i);
      console.log("time intervals: " + song.musicians[i].ticks.length)

      if(interval < song.musicians[i].ticks.length) { 
        playMidiNotes(song.musicians[i].ticks[interval].notes);
      }
    }
    await resolveAfter((30 / song.Tempo) * 1000);
  }

  await resolveAfter(5000);
}

async function playMidiFile(midiBase64Encoded) {

  console.log("Play MIDI file...");

  console.log(midiBase64Encoded);

  //TODO: midiOut.Play (midiBase64Encoded);

  let midi = JZZ.lib.fromBase64(midiBase64Encoded);

var smf = new JZZ.MIDI.SMF(midi);
var player = smf.player();
player.connect(midiOut);
player.play();
 
  await resolveAfter(5000);
}

function playMidiNotes(notes) {

    for(let i=0; i < notes.length; i++) {

	playMidiNote(notes[i]);
    }
}

function playMidiNote(note) {

  console.log("Play:");
  console.log(note);

  let delay = 0;

  if(note.sustain > 0) {

    if(midiOut == undefined) {
      console.log("No MIDI output?");
      return;
    }

    // Play a chord on channel 7
    //output.playNote(["C3", "D#3", "G3"], 7);
    // Play a note at full velocity on all channels) "all", 

    let midiNote = getNote(note.pitch);

    //TODO: Should really link the sustain to the tempo???

    playNote(midiNote, note.channel -1, note.sustain * 250, 127);

/*
    output.playNote(
      midiNote,
      note.channel, {
        duration: note.sustain * 250,
        velocity: 127
      }
    );
*/

  }
}

async function playNote(midiNote, channel, duration, velocity) {
  let port = midiOut;
  await port.noteOn(channel, midiNote, 127);
  await port.wait(duration);
  await port.noteOff(channel, midiNote);
  //await port.close();
  console.log('done!');
}

function  getOctave(pitch) {
  //return Math.floor(pitch / 12) -1;
  return Math.floor(pitch / 12);
}

function getNote(pitch) {
  const notes = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B" ];

  let coff = (pitch - MIDI_C4) % 12;
  if(coff < 0){
    coff = 12 + coff;
  }

  let octv = getOctave(pitch);
  let ret = notes[coff] + "" + octv;

  console.log("chromoff: " + coff + " oct: "+ octv + " md: " + ret + "\n");

  return notes[coff] + "" + octv;
}

