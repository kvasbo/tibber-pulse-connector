A wrapper for the Tibber Pulse websocket API. Not finished, but should work.

Browser only, as Node lacks a ws and fetch implementations. A node version will come!

Example:

```javascript
const tibber = require('tibber-pulse-connector');

// Test tokens
const TOKEN = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;
const HOMEID = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;

const connector = new tibber(TOKEN, HOMEID, (data) => { console.log(data) });
connector.start();
```

[![Build Status](https://travis-ci.com/kvasbo/tibber-pulse-connector.svg?branch=master)](https://travis-ci.com/kvasbo/tibber-pulse-connector)