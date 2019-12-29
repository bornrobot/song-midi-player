var redis = require('redis');
var client = redis.createClient(36379, "127.0.0.1");

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = class Recorder {

  constructor() {
    console.log("Init recorder");
  }

  startRecording(songId) {

    console.log("Start recorder " + songId);

    //Add message to queue to start recording...
    client.publish("notification", "{\"Action\":\"StartRecording\", \"songId\":" + songId + "}", function(){
      console.log("sent recorder start");
    });
  }

  stopRecording(songId) {

    console.log("Stop recorder " + songId);

    client.publish("notification", "{\"Action\":\"StopRecording\", \"songId\":" + songId + "}", function(){
      console.log("sent recorder stop");
    });

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

    var songLibraryUrl = "https://library.bornrobot.com";

    var songJson  = JSON.stringify(songGen.song);

    //fd.append("bandName", songGen.song.BandName);
    fd.append("json", songJson);
    fd.append("wav", blob, "filename.wav");
    xhr.open("POST", songLibraryUrl + "/add",true);
    xhr.send(fd);

  }
}
