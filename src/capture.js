const {PythonShell} = require('python-shell');
const path = require('path')

PythonShell.run(path.join(__dirname, 'capture.py'), null, function (err, results) {
    if (err) throw err;
    console.log('finished');
    console.log(results);
  });