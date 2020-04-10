//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;	//stream from getUserMedia()
var rec; 	//Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

function startRecording() {

  console.log("Record...");

  /* https://addpipe.com/blog/audio-constraints-getusermedia/ */
  var constraints = { audio: true, video:false }

  /* https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

    audioContext = new AudioContext();

    gumStream = stream;
		
    input = audioContext.createMediaStreamSource(stream);

    rec = new Recorder(input,{numChannels:2})
    rec.record()

    console.log("Recording started");

    startPerformance();

  }).catch(function(err) {

	console.log("There was a problem");
	console.log(err);

  });
}

function stopRecordingAndSavePerformance() {

	console.log("stop");

	rec.stop();
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(createDownloadLink);

        //generate another song...
        generateSong();
}


function createDownloadLink(blob) {

  var xhr=new XMLHttpRequest();
  xhr.onload=function(e) {
      if(this.readyState === 4) {
          console.log("Server returned: ",e.target.responseText);
      }
  };

  var fd=new FormData();

//bandName

  var songLibraryUrl = document.querySelector('input[name="datastore"]:checked').value;
  //var songLibraryUrl = "https://library.bornrobot.com";

  var songJson  = JSON.stringify(songGen.song);

  fd.append("bandName", songGen.song.BandName);
  fd.append("json", songJson);
  fd.append("wav", blob, "filename.wav");
  xhr.open("POST", songLibraryUrl + "/add",true);
  xhr.send(fd);

}

