import http        from 'prequest';
import request     from 'request';
import ProgressBar from 'progress';
import tar         from 'tar';
import zlib        from 'zlib';
import tty         from 'tty';

const token      = process.env.COMPOSE_TOKEN;
const account    = process.env.ACCOUNT_SLUG;
const deployment = process.env.DEPLOYMENT_NAME;
const output     = process.env.OUTPUT_PATH;

/**
 * Hack to make Docker output look like a tty for progress bar
 */
Object.getOwnPropertyNames(tty.WriteStream.prototype).forEach(key => {
  process.stderr[key] = tty.WriteStream.prototype[key];
});
process.stderr.columns = 80;

function apiRequest(path) {
  return http(`https://api.compose.io/${path}`, {
    auth: {
      bearer: token
    },

    headers: {
      'Accept-Version': '2014-06'
    }
  });
}

function findLink(rel, links) {
  return links.find(link => link.rel === rel);
}

function download(url) {
  return new Promise((resolve, reject) => {
    var progress;

    var pipeline = request(url)
      .on('response', response => {
        progress = new ProgressBar('[:bar] :percent ETA: :etas', {
          total:      parseInt(response.headers['content-length'], 10),
          incomplete: ' '
        });
      })
      .on('data', chunk => progress.tick(chunk.length))
      .on('finish', resolve)
      .on('error', reject)
      .pipe(zlib.Unzip())
      .pipe(tar.Extract({
        path: output
      }));
  });
}

apiRequest(`deployments/${account}/${deployment}/backups`)
  .then(backups => findLink('temp-download', backups[0].links).href)
  .tap(url => console.log(`Downloading backup archive from ${url} and extracting to ${output}`))
  .then(download)
  .catch(console.error);
