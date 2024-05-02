# Tuneful!

[**Demo available here!**](https://johnsfarrell.github.io/tuneful-client/)

Demo client deployment repository [here](https://github.com/johnsfarrell/tuneful-client).

[![pages-build-deployment](https://github.com/johnsfarrell/tuneful-client/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/johnsfarrell/tuneful-client/actions/workflows/pages/pages-build-deployment)

## Overview

Tuneful is a music recommendation platform. Users are allowed to create an account with Google and login with Spotify, or continue in incognito (guest) mode. Spotify integration allows users to get baseline recommendations and modify existing playlists.

## Local Development

To run locally, clone the repository and follow the directions below:

```bash
cd client
npm install
npm run start
```

In another shell:

```bash
cd server
mvn package
./run
```

A full of list commands are below:

### Client Commands

| Command         | Action                     |
| --------------- | -------------------------- |
| `npm run start` | Start the server           |
| `npm run build` | Build a production version |
| `npm run test`  | Run the test suite         |

### Server Commands

| Command       | Action                     |
| ------------- | -------------------------- |
| `./run`       | Start the server           |
| `mvn package` | Build a production version |

<hr>

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/NvajV8nZ)
