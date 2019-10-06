const ws = require('ws');
const tibber = require('../dist/index');

// Test tokens
const token = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;
const homeId = `c70dcbe5-4485-4821-933d-a8a86452737b`;
// const homeId = [`c70dcbe5-4485-4821-933d-a8a86452737b`, `c70dcbe5-4485-4821-933d-a8a86452737b`];

const connector = new tibber({token, homeId, onData: (data, id) => { console.log(id, data) }, ws});
connector.start();