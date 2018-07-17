import fs from 'fs';
import md5 from 'md5';

export default (fullURL) => new Promise((resolve, reject) => {
  fs.readFile('base.json', (err, data) => {
    if (err) {
      reject(err);
    }

    try {
      const base = JSON.parse(data.toString());
      const hostName = 'http://shrt.link/';
      const hash = md5(fullURL);

      base[hash] = fullURL;

      fs.writeFile('base.json', JSON.stringify(base), (e) => {
        if (e) {
          reject(e);
        }

        resolve(hostName + hash);
      });
    } catch (error) {
      reject(error);
    }
  });
});
