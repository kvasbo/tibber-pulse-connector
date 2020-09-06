const ws = require("ws");
const tibber = require("../dist/index");
let datas = 0;

// Test tokens
const token = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;
const homeId = [`c70dcbe5-4485-4821-933d-a8a86452737b`];

// Give up test after 30s.
setTimeout(() => process.exit(1), 30000);

async function gotData(id, data) {
    datas += 1;
    console.log(id, data);
    if (datas > 3) {
        console.log(await connector.getPowerPrices(homeId));
        console.log(await connector.getConsumption(homeId));
        process.exit(0);
    }
}

function gotError(id, err) {
    console.error(id, err);
    process.exit(1);
}

const connector = new tibber({
    token,
    homeId,
    onData: (data, id) => {
        gotData(id, data);
    },
    onError: (error, id) => {
        gotError(id, error);
    },
    ws,
});
connector.start();