// CLI for Noita Seed Tool (seed search only)
// Usage: Enter the criteria you need on the website, and click 'Copy Link'.
//        Then, paste the copied URL behind the following command:
//        node cli/cli.js "<url>"
//        Then, hit enter and the program will perform the search operation.
// Example:
//        node cli/cli.js "https://cr4xy.dev/noita/?seed=3&search=p-l1-pPERKS_LOTTERY%2Cp-l2-pSAVING_GRACE"
// Options:
//        -t
//            You can add -t to the command in order to use all your CPU cores.
//        -s <seed>
//            Override the starting seed.

const Worker = require('web-worker');

process.chdir(__dirname + require("path").sep + "noita-seed-tool");

let workers = [];
let seedSearchCounts = [];
let startSeed = 0;
let numCores = 1;
let args = process.argv.slice(2);

if (args.length > 1) {
    let idx;
    if ((idx = args.indexOf('-t')) !== -1) {
        numCores = require("os").cpus().length;
        args.splice(idx, 1);
    }
    if ((idx = args.indexOf('-s')) !== -1) {
        startSeed = args.splice(idx, 2)[1];
    }
}

let url;
try {
  url = new URL(args[0]);
} catch (e) {
  console.warn("Invalid URL specified, see usage in README");
  throw e;
}
if (url.searchParams.has('seed')) {
    if (startSeed === 0) startSeed = url.searchParams.get('seed');
}
let crit = url.searchParams.get('search');

for (let i = 0; i < numCores; i++) {
  let worker = new Worker('noita-seed-tool/worker.js');
  worker.addEventListener('message', e => {
    let [id, type, value] = e.data;
    if (type === 0) { // progress report
      seedSearchCounts[id] = value;
    } else if (type === 1) { // found seed
      console.log("Found seed: " + value);
      process.exit(0);
    } else if (type === 2) { // hit seed limit
      workers.splice(workers.indexOf(worker), 1);
      if (workers.length === 0) {
        console.log("Hit seed limit :(");
        process.exit(1);
      }
    }
  });
  workers[i] = worker;
}
console.log('Starting search for "' + crit + '" with ' + numCores + ' threads');
console.log('Starting seed: ' + startSeed);
for (let i = 0; i < numCores; i++) {
  workers[i].postMessage([startSeed, i, workers.length, crit]);
}

process.on('SIGINT', () =>  {
  console.log("Searched seeds: " + seedSearchCounts.reduce((a, v) => a + v, 0))
  process.exit();
});
setInterval(() => {
  console.log("Searched seeds: " + seedSearchCounts.reduce((a, v) => a + v, 0))
}, 1000);