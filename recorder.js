const http = require('http');

module.exports = {
 startRecording,
 stopRecording
};

function startRecording(song, uuid) {
  
  song.Uuid = uuid;

  let payload = JSON.stringify(song);

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/startRecording',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  console.log("Start recorder ");

  let req = http.request(options, (res) => {
    console.log('statusCode: ${res.statusCode}');

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(payload);
  req.end();
}

function stopRecording(uuid) {

  console.log("Stop recorder " + uuid);

  let uuidJson = "{\"uuid\":\"" + uuid + "\"}";

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/stopRecording',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': uuidJson.length
    }
  };

  let req = http.request(options, (res) => {
    console.log('statusCode: ${res.statusCode}');

    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(uuidJson);
  req.end();
}
