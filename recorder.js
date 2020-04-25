const http = require('http');

module.exports = {
 startRecording,
 stopRecording
};

function startRecording(song) {

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/startRecording',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': song.length
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

  req.write(song);
  req.end();
}

function stopRecording(song) {

  console.log("Stop recorder " + song.length);

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/stopRecording',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': song.length
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

  req.write(song);
  req.end();
}
