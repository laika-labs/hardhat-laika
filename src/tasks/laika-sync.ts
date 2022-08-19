import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task, types } from "hardhat/config";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

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
  if (!contract) {
    throw new NomicLabsHardhatPluginError(
      "hardhat-laika",
      "Some parameters are missing"
    );
  }

  const contractNames = contract.split(",");
  const contractAddresses = contractAddress?.split(",");

  const endpoints = [];

  for (let i = 0; i < contractNames.length; i++) {
    try {
      const { abi } = await hre.artifacts.readArtifact(contractNames[i]);
      console.log(`Syncing the ABI of ${contractNames[i]} contract...`);

      const { default: fetch } = await import("node-fetch");
      const response = await fetch(`${endpointUrls.services}/abi-storages`, {
        method: "POST",
        body: JSON.stringify({
          abi,
          contractAddress: contractAddresses?.[i],
        }),
        headers: { "Content-Type": "application/json" },
      });
      const publicUrl = await response.text();

      endpoints.push(publicUrl.split("/")[4].split(".")[0]);
    } catch {
      console.log(`Fail to sync the ABI of ${contractNames[i]} contract`);
    }
  }

  if (endpoints.length !== 0) {
    console.log(
      `Check out your request at ${
        endpointUrls.interface
      }/evm/collections/import/${endpoints.join(",")}`
    );
    console.log(
      `Check out your request at ${
        endpointUrls.interface_pro
      }/evm/collections/import/${endpoints.join(",")}`
    );
  }
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
