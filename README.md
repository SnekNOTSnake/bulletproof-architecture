<h1 align="center">
	<a href="https://github.com/SnekNOTSnake">
		<img src="https://github.com/SnekNOTSnake/bulletproof-architecture/blob/main/assets/SNS.png?raw=true" alt="Markdownify" width="200">
	</a>
	<br>
  	Bulletproof Architecture
  </br>
</h1>

<h4 align="center">Full MERN-stack project sample</h4>

<p align="center">
  <a href="https://mongodb.com/">
    <img src="https://img.shields.io/badge/Database-MongoDB-informational?style=flat&logo=mongodb&logoColor=white&color=3282b8" alt="MongoDB">
  </a>
  <a href="https://expressjs.com/">
  <img src="https://img.shields.io/badge/Framework-Express-informational?style=flat&logo=express&logoColor=white&color=3282b8" alt="Express.js">
 </a>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/Library-React-informational?style=flat&logo=react&logoColor=white&color=3282b8" alt="React.js">
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Runtime-NodeJS-informational?style=flat&logo=node-dot-js&logoColor=white&color=3282b8" alt="Node.js">
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation-and-running">Installation and Running</a> •
  <a href="#building">Building</a> •
  <a href="#resources">Resources</a>
</p>

![home-screenshot](https://github.com/SnekNOTSnake/bulletproof-architecture/blob/main/assets/screenshot-1.jpg?raw=true)

## 🗡️ Features

Some of the worth-highlighted features:

- TypeScript
- Apollo (Server and Client)
- GraphQL Codegen
- GitHub and Google OAuth
- Modular Architecture

Some screenshots are placed inside [`assets`](https://github.com/SnekNOTSnake/bulletproof-architecture/blob/main/assets) directory.

## ⛷️ Installation and Running

Before installing this project, make sure you're using the newer version of Node (v12 or something, I'm not really sure). After that you can install it simply by executing `yarn` command.

The following command runs the client in development mode:

```bash
yarn client
```

This one is for running the server in development mode:

```bash
yarn server
```

## ⛰️ Building

If you want to just skip all of the tests, you can run `yarn build` directly. Or you can use the following command:

```bash
yarn patch && yarn generate && yarn test && yarn build
```

It would patch the installed dependencies, generate the latest GraphQL schema, run tests, only then it generate the production build.

After that, you can run the following command to run the server:

```bash
NODE_ENV=production yarn workspace @bulletproof/server node dist/server.js
```

> **Note about testing**<br>
> First time you run test, it will download the latest MongoDB binary to node_modules. If you have an average internet speed, there would be mocha timeout errors while downloading. You can ignore the errors, and then try running test again after the download is completed.

## 📜️ Resources

Repositories on GitHub that helped me build this project:

- [React State Management](https://github.com/sanderdebr/react-usereducer-context-tutorial)
- [JWT Refresh Token](https://github.com/Console45/jwt-refresh-token-implementation)
- [GraphQL Architecture](https://github.com/tonyfromundefined/boiler)
- [REST Architecture](https://github.com/SnekNOTSnake/Natours)
- [Node.js Express Architecture](https://github.com/santiq/bulletproof-nodejs/)
- [Monorepo Architecture](https://github.com/wixplosives/sample-monorepo)
- [Passport OAuth](https://github.com/mohamedsamara/mern-ecommerce)
- [OAuth Popup](https://dev.to/dinkydani21how-we-use-a-popup-for-google-and-outlook-oauth-oci)
- [GraphQL Upload](https://github.com/jaydenseric/apollo-upload-examples)
