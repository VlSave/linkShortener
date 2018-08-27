import fs from 'fs';

const fsp = fs.promises;


export default hash => fsp.readFile('base.json', 'utf-8')
  .then((data) => {
    const base = JSON.parse(data);
    return base[hash];
  })
  .catch((err) => {
    throw err;
  });
