var JZZ = require('jzz');

var midiOut = JZZ().openMidiOut();
console.log(JZZ().info());

module.exports = {
  play
}

function resolveAfter(ms) {

  console.log("Wait " + ms);

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, ms);
  });
}

async function play(song) {

  console.log("Start performance...");
  console.log("musicians: " + song.musicians.length);
  console.log("notes: " + song.musicians[0].timeIntervals.length);

  //pause for the recorder to startup. TODO: Hopefully we can trim that later...
  await resolveAfter(3000);

  //foreach time interval... (assuming all musicians have the same number of intervals!)
  for(let interval=0; interval < song.musicians[0].timeIntervals.length; interval++) {

    //foreach musician...
    for(let i=0; i < song.musicians.length; i++) {
      if(interval < song.musicians[i].timeIntervals.length) { 
        playMidiNotes(song.musicians[i].timeIntervals[interval].notes);
      }
    }
    await resolveAfter((30 / song.Tempo) * 1000);
  }

  await resolveAfter(10000);
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
  let port = midiOut;

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
