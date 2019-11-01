A node/browser wrapper for the Tibber Pulse websocket API.

* Breaking change in 2.0.0: Options is now an object.
* Breaking change in 3.0.0: onData now required, exported class renamed (capitalized).

Parameters: 

* token: Required, from the Tibber API
* homeId: Required, from the Tibber API. Either a string or an array of strings.
* onData: Required. On data received. Is called with two variables - (data, homeId)
* onError: Returns any errors from the subscription. Is called with two variables - (data, homeId)

Methods: 

* start: Initiates the subscription. Nothing happens until you invoke this.

Example:

```javascript
const tibber = require('tibber-pulse-connector');

// Test tokens
const token = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;
const homeId = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;

const connector = new tibber({token, homeId, onData: (data, homeId) => { console.log(data, homeId) }});
connector.start();
```

Multiple home IDs as an array of strings

```javascript
const tibber = require('tibber-pulse-connector');

// Test tokens
const token = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;
const homeIds = [`68e6938b-91a6-4199-a0d4-f24c22be87bb`, `68e6938b-91a6-4199-a0d4-f24c22be87bb`];

const connector = new tibber({token, homeId: homeIds, onData: (data, homeId) => { console.log(data, homeId) }});
connector.start();
```

Node, with custom WS implementation:

```javascript
const tibber = require('tibber-pulse-connector');
const ws = require('ws'); // Remember to add this dependency, doh

// Test tokens
const token = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;
const homeId = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;

const connector = new tibber({token, homeId, ws, onData: (data) => { console.log(data) }});
connector.start();
```


[![Build Status](https://travis-ci.com/kvasbo/tibber-pulse-connector.svg?branch=master)](https://travis-ci.com/kvasbo/tibber-pulse-connector)

[![DeepScan grade](https://deepscan.io/api/teams/5079/projects/6857/branches/60182/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5079&pid=6857&bid=60182)
