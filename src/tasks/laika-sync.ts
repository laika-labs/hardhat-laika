import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import open from "open";

import { endpointUrls } from "../config";

/**
 * It takes a contract's ABI and sends it to the backend, which returns a public URL. Then generates a
 * new URL to interact with smart contracts through Laika
 * @param {HardhatRuntimeEnvironment} hre - HardhatRuntimeEnvironment
 * @param {string} contract - The name of the contract you want to sync.
 */
const laikaSync = async (hre: HardhatRuntimeEnvironment, contract: string) => {
  const { abi } = await hre.artifacts.readArtifact(contract);
  console.log(`Syncing the ABI of ${contract} contract...`);

  const { default: fetch } = await import("node-fetch");
  const response = await fetch(
    `${endpointUrls.services}/abi-storages`,
    {
      method: "POST",
      body: JSON.stringify({ abi }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const publicUrl = await response.text();
  const endpoint = `${endpointUrls.interface}/evm/collections/import/${
    publicUrl.split("/")[4].split(".")[0]
  }`;

  console.log(`Check out your request at ${endpoint}`);
  open(endpoint);
};

task("laika-sync", "Sync your ABIs with Laika")
  .addParam("contract", "Contract name to sync")
  .setAction(async (taskArgs, hre) => {
    await laikaSync(hre, taskArgs.contract);
  });

export default laikaSync;
