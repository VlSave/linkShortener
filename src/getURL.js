import fs from 'fs';

export default (hash) => new Promise((resolve, reject) => {
  fs.readFile('base.json', (err, data) => {
    if (err) {
      reject(err);
    }

    try {
      const base = JSON.parse(data.toString());
      console.log(base[hash]);
      resolve(base[hash]);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
});
