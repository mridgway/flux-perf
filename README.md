# React Perf Comparison

Compares action->dispatcher->store flow between Alt, Flux, Flummox, and 
Fluxible in both "isomorphic" and singleton modes. Flux's "isomorphic" mode is
just resetting the store each time it's called. 

Check out the travis builds for results: [![Build Status](https://travis-ci.org/mridgway/flux-perf.svg?branch=master)](https://travis-ci.org/mridgway/flux-perf)

Note: I'm not an expert in all of these flux implementations so the accuracy is 
not guaranteed. PRs welcome. I will not be maintaining this or adding new flux
implementations.

## Install

```js
npm install
```

## Run 

```js
npm test
```
