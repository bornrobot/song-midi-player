const http = require('http');

module.exports = {
 startRecording,
 stopRecording
};

function startRecording(song, uuid) {
  
  song.uuid = uuid;

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

  console.log("Request recording start");

  let req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

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

  console.log(`Request recording stop ${uuid}`);

  let payload = JSON.stringify({uuid: uuid});

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/stopRecording',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  let req = http.request(options, (res) => {

    console.log(`statusCode: ${res.statusCode}`);

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
