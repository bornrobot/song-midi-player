module.exports = class Recorder {

  constructor() {
	  console.log("init recorder");
  }

  startRecording() {

    console.log("Record...");

    console.log("Recording started");
  }

  stopRecordingAndSavePerformance() {

    console.log("stop");

//	rec.stop();
//	gumStream.getAudioTracks()[0].stop();
//	rec.exportWAV(createDownloadLink);
  }


  createDownloadLink(blob) {

    var xhr=new XMLHttpRequest();
    xhr.onload=function(e) {
      if(this.readyState === 4) {
          console.log("Server returned: ",e.target.responseText);
      }
    };

    var fd=new FormData();

    var songLibraryUrl = document.querySelector('input[name="datastore"]:checked').value;
    //var songLibraryUrl = "https://library.bornrobot.com";

    var songJson  = JSON.stringify(songGen.song);

    fd.append("bandName", songGen.song.BandName);
    fd.append("json", songJson);
    fd.append("wav", blob, "filename.wav");
    xhr.open("POST", songLibraryUrl + "/add",true);
    xhr.send(fd);

  }
}
