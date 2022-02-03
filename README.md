# hardhat-laika
This plugin integrates [Laika](https://getlaika.app) with Hardhat.

## What

hardhat-laika helps you sync your compile contract with Laika. So you can make a request without having to write a single line of code.

## Installation

```bash
npm install hardhat-laika
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-laika");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-laika";
```

## Required plugins

This plugin does not require other plugins.

## Tasks

This plugin adds the _laika-sync_ task to Hardhat:
```shell
npx hardhat laika-sync --contract <contract address>
```

## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding a laikaSync function to it.

```ts
hre.laikaSync(hre, contractAddress)
```

## Configuration

This plugin does not require configuration.

## Usage

There are no additional steps you need to take for this plugin to work.