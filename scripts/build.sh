#!/bin/bash
set -ev
yarn run lint || travis_terminate 1;
CI=false yarn run build || travis_terminate 1;
yarn run test || travis_terminate 1;