console.log('Starting File Manager');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const FileController = require('./api/controllers/FileController');

const args = {
    path: __dirname + '/files',
    port: 5000
};

for (let i = 0; i < process.argv.length; i++) {
    const item = process.argv[i];
    switch (item) {
        case "-PATH":
            args.path = process.argv[++i];
            break;
        case "-PORT":
            args.port = process.argv[++i];
            break;
        default:
    }
}

const app = express();
const port = process.env.FILE_MANAGER_PORT || args.port;
const path = process.env.FILE_MANAGER_PATH || args.path;

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.urlencoded({extended: false, limit: '100mb'}));
app.use(bodyParser.json({type: 'application/*+json', limit: '100mb'}));
app.use(bodyParser.text({type: 'text/html', limit: '100mb'}));

new FileController(app, {path});

app.use(express.static(__dirname + '/ui/build'));

app.listen(port, () => {
    console.log(`Listening at ${port}`)
});

module.exports = {};
