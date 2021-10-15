const fs = require("fs");
const mime = require('mime');
const unzipper = require('unzipper');

module.exports = class FileService {
    constructor() {

    }

    list(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, fs.constants.R_OK, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.readdir(path, {encoding: 'utf8', withFileTypes: true}, (err, files) => {
                    if (err || files === undefined) {
                        reject(err);
                        return;
                    }
                    resolve(files.map(item => ({name: item.name, type: item.isDirectory() ? 2 : 1})));
                });
            });
        });
    }

    get(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(data);
                });
            });
        });
    }

    pipe(path, res) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                const stats = fs.statSync(path);
                const readStream = fs.createReadStream(path);
                res.setHeader('Content-Type', mime.getType(path));
                res.setHeader('Content-Type', stats.size);
                readStream.pipe(res);
            });
        });
    }

    put(path, data) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.writeFile(path, data, {encoding: 'utf8', flag: 'w+'}, (err, data) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    upload(path, files) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                files.forEach(item => {
                    item.mv(path + item.name);
                });
                resolve();
            });
        });
    }

    extract(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                const tmp = path.split('.');
                if (tmp.length > 1) {
                    tmp.splice(tmp.length - 1, 1);
                }
                try {
                    fs.createReadStream(path).pipe(unzipper.Extract({path: tmp.join('.')}));
                } catch (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    delete(path) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.unlink(path, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    createDir(path, name) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.mkdir(path + name, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

    rename(path, oldName, newName) {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                fs.rename(path + oldName, path + newName, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        });
    }

};
