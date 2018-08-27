import fs from 'fs';
import md5 from 'md5';

const fsp = fs.promises;

const getBase = () => fsp.readFile('base.json', 'utf-8')
  .then(data => JSON.parse(data));

export default fullURL => getBase()
  .then((obj) => {
    const base = obj;
    const hostName = 'http://shrt.link/';
    const hash = md5(fullURL);

    base[hash] = fullURL;
    return fsp.writeFile('base.json', JSON.stringify(base))
      .then(() => hostName + hash)
      .catch(err => err);
  })
  .catch((err) => {
    throw err;
  });
