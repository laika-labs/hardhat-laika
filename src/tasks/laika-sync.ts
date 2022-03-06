import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task, types } from "hardhat/config";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";
import open from "open";

import { endpointUrls } from "../config";

/**
 * It takes a contract's ABI and sends it to the backend, which returns a public URL. Then generates a
 * new URL to interact with smart contracts through Laika
 * @param {HardhatRuntimeEnvironment} hre - HardhatRuntimeEnvironment
 * @param {string} contract - The name of the contract you want to sync.
 * @param {string} contractAddress - The Address of that specific contract.
 */
const laikaSync = async (
  hre: HardhatRuntimeEnvironment,
  contract: string,
  contractAddress: string
) => {
  if (!hre.config.laika.apiKey) {
    throw new NomicLabsHardhatPluginError(
      "hardhat-laika",
      "Missing apikey for this task"
    );
  }
  const { abi } = await hre.artifacts.readArtifact(contract);
  console.log(`Syncing the ABI of ${contract} contract...`);

  const { default: fetch } = await import("node-fetch");
  const response = await fetch(`${endpointUrls.services}/abi-storages`, {
    method: "POST",
    body: JSON.stringify({ abi, contractAddress }),
    headers: {
      "Content-Type": "application/json",
      apikey: hre.config.laika.apiKey,
    },
  });

  if (response.status !== 200) {
    throw new NomicLabsHardhatPluginError(
      "hardhat-laika",
      (await response.json()).message
    );
  }

  const publicUrl = await response.text();
  const endpoint = `${endpointUrls.interface}/evm/collections/import/${
    publicUrl.split("/")[4].split(".")[0]
  }`;

  console.log(`Check out your request at ${endpoint}`);
  open(endpoint);
};

task("laika-sync", "Sync your ABIs with Laika")
  .addParam("contract", "Contract name to sync")
  .addOptionalParam(
    "address",
    "Address of that specific contract",
    "",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const { contract, address: contractAddress } = taskArgs;
    await laikaSync(hre, contract, contractAddress);
  });

export default laikaSync;
