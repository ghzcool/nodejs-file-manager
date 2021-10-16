const FileService = require('../services/FileService');

module.exports = class FileController {

  constructor(app, { path }) {
    this.basePath = path;
    this.fileService = new FileService();
    app.get('/api/file/list', (req, res) => this.listGet(req, res));
    app.get('/api/file/get', (req, res) => this.contentGet(req, res));
    app.put('/api/file/put', (req, res) => this.contentPut(req, res));
    app.delete('/api/file/delete', (req, res) => this.delete(req, res));
    app.post('/api/file/mkdir', (req, res) => this.createDir(req, res));
    app.put('/api/file/rename', (req, res) => this.rename(req, res));
    app.post('/api/file/upload', (req, res) => this.upload(req, res));
    app.get('/api/file/extract', (req, res) => this.extract(req, res));

    console.log('FilesController registered');
  }

  getPath(path) {
    return this.basePath + (path || '') + (path !== '/' ? '/' : '')
  }

  listGet(req, res) {
    res.setHeader('Content-Type', 'application/json-patch+json');
    const { query } = req;
    const path = this.basePath + (query.path || '');

    this.fileService.list(path).then(response => res.send(response)).catch(error => {
      console.error(error);
      res.status(500).send(error);
    });
  }

  contentGet(req, res) {
    const { query } = req;
    const path = this.basePath + (query.path || '');
    this.fileService.pipe(path, res).then().catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }

  upload(req, res) {
    const { body, files } = req;
    const path = this.getPath(body.path);
    if (!files) {
      res.status(500).end();
    }
    this.fileService.upload(path, Object.keys(files).map(key => files[key])).then(() => res.end()).catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }

  contentPut(req, res) {
    const { body } = req;
    const path = this.getPath(body.path);

    this.fileService.put(path, body).then(() => res.end()).catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }

  delete(req, res) {
    const { body } = req;
    const paths = [...body.paths].map(path => this.getPath(path));

    Promise.all([...paths].map(path => this.fileService.deleteFolderRecursive(path))).then(() => res.end()).catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }

  extract(req, res) {
    const { query } = req;
    const path = this.getPath(query.path);

    this.fileService.extract(path).then(() => res.end()).catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }

  createDir(req, res) {
    const { body } = req;
    const path = this.getPath(body.path);
    const { name } = body;

    this.fileService.createDir(path, name).then(() => res.end()).catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }

  rename(req, res) {
    const { body } = req;
    const path = this.basePath + (body.path || '');
    const { name } = body;

    this.fileService.rename(path, name).then(() => res.end()).catch(error => {
      console.error(error);
      res.status(500).end();
    });
  }
};
