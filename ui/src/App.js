import React from "react";
import FileManager from "react-file-manager-ui";

const apiPath = '/api';

const getList = (path) => {
  return new Promise(async resolve => {
    try {
      const response = await fetch(apiPath + '/file/list?path=' + path);
      const list = await response.json();
      resolve(list);
    } catch (error) {
      console.error(error);
    }
  });
};

const createDirectory = (path) => {
  return new Promise(async (resolve, reject) => {
    const name = prompt("Directory name", "New folder");
    if (name) {
      try {
        await fetch(apiPath + '/file/mkdir', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, name })
          }
        );
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    }
  });
};

const deletePaths = (paths) => {
  return new Promise(async (resolve, reject) => {
    if (window.confirm('Delete ?')) {
      try {
        await fetch(apiPath + '/file/delete', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paths })
          }
        );
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
    }
  });
};

const openFile = (path) => {
  window.open(apiPath + '/file/get?path=' + path);
};

const rename = (path) => {
  return new Promise(async (resolve, reject) => {
    const parts = path.split('/');
    const name = prompt("New name", parts[parts.length - 1]);
    try {
      await fetch(apiPath + '/file/rename', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, name })
        }
      );
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

const uploadFiles = (path, files) => {
  return new Promise(async (resolve, reject) => {
    console.log({ path, files });
    try {
      const formData = new FormData();
      [...files].forEach((file, index) => {
        formData.append('file' + index, file);
      });
      formData.append('path', path);
      await fetch(apiPath + '/file/upload', {
          method: 'post',
          body: formData
        }
      );
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

function App() {
  return (
    <div className="App">
      <FileManager getList={getList}
                   createDirectory={createDirectory}
                   deletePaths={deletePaths}
                   openFile={openFile}
                   uploadFiles={uploadFiles}
                   rename={rename}
                   features={['createDirectory', 'uploadFiles', 'deletePaths', 'rename']}/>
    </div>
  );
}

export default App;
